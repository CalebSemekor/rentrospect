'use client'

import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'
import { useMemo, useState } from 'react'
import type { ChatContact, ChatMessage, CallLogEntry, ContactProfile, SavedMessage } from '@/types/messages'
import {
    getConversationMessages,
    getContactProfile,
    sendMessage,
    sendMessageAttachment,
    markConversationRead,
    toggleSavedMessage,
    getMeetupQrCode,
    getVendorDashboardTransactions,
    findTransactionIdForRenter,
} from '@/services/backend'
import ChatList from './ChatList'
import CallLogList from './CallLogList'
import MessageThread from './MessageThread'
import ContactProfilePanel from './ContactProfilePanel'

type MobilePane = 'list' | 'thread' | 'profile'
type MobileTab = 'chats' | 'calls'

interface MessagesClientProps {
    initialContacts: ChatContact[]
    initialCallLog: CallLogEntry[]
    initialSavedMessages: SavedMessage[]
    initialActiveContactId: string | null
    initialMessages: ChatMessage[]
    initialProfile: ContactProfile | null
    role: 'renter' | 'vendor' | null
}

const MessagesClient: React.FC<MessagesClientProps> = ({
    initialContacts,
    initialCallLog,
    initialSavedMessages,
    initialActiveContactId,
    initialMessages,
    initialProfile,
    role,
}) => {
    const { getToken } = useAuth()

    const [contacts, setContacts] = useState(initialContacts)
    const [activeContactId, setActiveContactId] = useState<string | null>(initialActiveContactId)
    const [messagesByContact, setMessagesByContact] = useState<Record<string, ChatMessage[]>>(
        initialActiveContactId ? { [initialActiveContactId]: initialMessages } : {}
    )
    const [profilesByContact, setProfilesByContact] = useState<Record<string, ContactProfile>>(
        initialActiveContactId && initialProfile ? { [initialActiveContactId]: initialProfile } : {}
    )
    const [loadingThread, setLoadingThread] = useState(false)
    const [sendingAttachment, setSendingAttachment] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [mobilePane, setMobilePane] = useState<MobilePane>('list')
    const [mobileTab, setMobileTab] = useState<MobileTab>('chats')
    const [searchQuery, setSearchQuery] = useState('')
    const [showMeetupDialog, setShowMeetupDialog] = useState(false)
    const [generatingMeetupCode, setGeneratingMeetupCode] = useState(false)
    const [meetupQrUrl, setMeetupQrUrl] = useState<string | null>(null)
    const [meetupError, setMeetupError] = useState<string | null>(null)

    const activeContact = useMemo<ChatContact | null>(
        () => contacts.find((contact) => contact.id === activeContactId) ?? null,
        [contacts, activeContactId]
    )

    const activeMessages = activeContactId ? messagesByContact[activeContactId] ?? [] : []
    const activeProfile = activeContactId ? profilesByContact[activeContactId] ?? null : null

    const handleSelectContact = async (id: string) => {
        setActiveContactId(id)
        setShowProfile(false)
        setMobilePane('thread')

        // Optimistically clear the unread badge — the real count is re-derived
        // from `read_at` server-side next time the list is fetched.
        setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, unreadCount: 0 } : contact)))

        const token = await getToken()
        if (!token) return

        markConversationRead(token, id)

        if (messagesByContact[id]) return

        setLoadingThread(true)
        const messages = await getConversationMessages(token, id)
        setMessagesByContact((prev) => ({ ...prev, [id]: messages }))
        setLoadingThread(false)
    }

    const handleViewProfile = async (mobile: boolean) => {
        if (mobile) setMobilePane('profile')
        else setShowProfile(true)

        if (!activeContactId || profilesByContact[activeContactId]) return

        const token = await getToken()
        if (!token) return
        const profile = await getContactProfile(token, activeContactId)
        if (profile) setProfilesByContact((prev) => ({ ...prev, [activeContactId]: profile }))
    }

    const handleSend = async (text: string) => {
        if (!activeContactId) return

        const optimistic: ChatMessage = {
            id: `local-${Date.now()}`,
            fromMe: true,
            author: 'You',
            text,
            sentAt: new Date().toISOString(),
        }
        setMessagesByContact((prev) => ({
            ...prev,
            [activeContactId]: [...(prev[activeContactId] ?? []), optimistic],
        }))

        const token = await getToken()
        if (token) sendMessage(token, activeContactId, text)
    }

    const handleSendAttachment = async (file: File) => {
        if (!activeContactId) return

        const optimistic: ChatMessage = {
            id: `local-${Date.now()}`,
            fromMe: true,
            author: 'You',
            attachment: { url: URL.createObjectURL(file), name: file.name, sizeBytes: file.size },
            sentAt: new Date().toISOString(),
        }
        setMessagesByContact((prev) => ({
            ...prev,
            [activeContactId]: [...(prev[activeContactId] ?? []), optimistic],
        }))

        setSendingAttachment(true)
        const token = await getToken()
        if (token) await sendMessageAttachment(token, activeContactId, file)
        setSendingAttachment(false)
    }

    const handleToggleSave = async (message: ChatMessage) => {
        if (!activeContactId) return

        const nextSaved = !message.isSaved
        setMessagesByContact((prev) => ({
            ...prev,
            [activeContactId]: (prev[activeContactId] ?? []).map((m) =>
                m.id === message.id ? { ...m, isSaved: nextSaved } : m
            ),
        }))

        const token = await getToken()
        if (!token) return

        const success = await toggleSavedMessage(token, message.id, nextSaved)
        if (!success) {
            // roll back on failure
            setMessagesByContact((prev) => ({
                ...prev,
                [activeContactId]: (prev[activeContactId] ?? []).map((m) =>
                    m.id === message.id ? { ...m, isSaved: message.isSaved } : m
                ),
            }))
        }
    }

    const handleGenerateMeetupCode = async () => {
        if (!activeContact) return

        setShowMeetupDialog(true)
        setGeneratingMeetupCode(true)
        setMeetupQrUrl(null)
        setMeetupError(null)

        const token = await getToken()
        if (!token) {
            setGeneratingMeetupCode(false)
            return
        }

        // No direct link yet between a chat contact and a transaction — found
        // by matching the renter's name against the vendor's own transaction
        // history (see findTransactionIdForRenter for the matching rule).
        const transactions = await getVendorDashboardTransactions(token)
        const transactionId = findTransactionIdForRenter(transactions, activeContact.name)

        if (!transactionId) {
            setMeetupError(`No active rental found with ${activeContact.name}.`)
            setGeneratingMeetupCode(false)
            return
        }

        const qrUrl = await getMeetupQrCode(token, transactionId)
        if (!qrUrl) setMeetupError("Couldn't generate a code. Try again.")

        setMeetupQrUrl(qrUrl)
        setGeneratingMeetupCode(false)
    }

    const handleCloseMeetupDialog = () => {
        setShowMeetupDialog(false)
        if (meetupQrUrl) URL.revokeObjectURL(meetupQrUrl)
        setMeetupQrUrl(null)
        setMeetupError(null)
    }

    // Mobile height leaves extra room at the bottom for NavBar's fixed
    // bottom pill (not present on desktop, where it's inline up top).
    return (
        <main className='flex flex-col h-[calc(100vh-13.5rem)] md:h-[calc(100vh-9rem)] pb-4'>
            {/* Desktop layout */}
            <div className='hidden md:flex gap-4 h-full min-h-0'>
                <div className='flex flex-col w-80 shrink-0 h-full min-h-0'>
                    <div className='flex items-center justify-between mb-4 shrink-0'>
                        <h1 className='montserrat-font text-lg font-bold text-black'>Chats</h1>
                        <button type='button' aria-label='new chat' className='flex items-center justify-center size-8 rounded-full bg-white cursor-pointer'>
                            <Image width={14} height={14} alt='' src='/svgs/settings/plus.svg' />
                        </button>
                    </div>
                    <ChatList
                        contacts={contacts}
                        activeId={activeContactId}
                        onSelect={handleSelectContact}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                </div>

                <div className='flex-1 h-full min-h-0'>
                    {activeContact ? (
                        <MessageThread
                            contact={activeContact}
                            messages={activeMessages}
                            loading={loadingThread}
                            onSend={handleSend}
                            onSendAttachment={handleSendAttachment}
                            sendingAttachment={sendingAttachment}
                            onToggleSave={handleToggleSave}
                            onViewProfile={() => handleViewProfile(false)}
                            canGenerateMeetupCode={role === 'vendor'}
                            generatingMeetupCode={generatingMeetupCode}
                            meetupQrUrl={meetupQrUrl}
                            meetupError={meetupError}
                            showMeetupDialog={showMeetupDialog}
                            onGenerateMeetupCode={handleGenerateMeetupCode}
                            onCloseMeetupDialog={handleCloseMeetupDialog}
                        />
                    ) : (
                        <div className='flex items-center justify-center h-full bg-arrowBackground/40 rounded-2xl'>
                            <p className='dmSans-font text-sm text-smallGreyText'>Select a chat to get started</p>
                        </div>
                    )}
                </div>

                {showProfile && activeProfile && (
                    <div className='w-80 shrink-0 h-full min-h-0'>
                        <ContactProfilePanel
                            profile={activeProfile}
                            savedMessages={initialSavedMessages}
                            onBack={() => setShowProfile(false)}
                        />
                    </div>
                )}
            </div>

            {/* Mobile layout */}
            <div className='flex md:hidden flex-col h-full min-h-0'>
                {mobilePane === 'list' && (
                    <div className='flex flex-col h-full min-h-0'>
                        <div className='flex items-center justify-between mb-4 shrink-0'>
                            <h1 className='montserrat-font text-lg font-bold text-black'>Messages</h1>
                            <button type='button' aria-label='new chat' className='flex items-center justify-center size-8 rounded-full bg-white cursor-pointer'>
                                <Image width={14} height={14} alt='' src='/svgs/settings/plus.svg' />
                            </button>
                        </div>

                        <div className='flex gap-2 bg-white rounded-full p-1 mb-4 w-fit shrink-0'>
                            <button
                                type='button'
                                onClick={() => setMobileTab('chats')}
                                className={`dmSans-font text-xs font-semibold px-4 py-2 rounded-full cursor-pointer ${
                                    mobileTab === 'chats' ? 'bg-activatedButton text-white' : 'text-smallGreyText'
                                }`}
                            >
                                Chats
                            </button>
                            <button
                                type='button'
                                onClick={() => setMobileTab('calls')}
                                className={`dmSans-font text-xs font-semibold px-4 py-2 rounded-full cursor-pointer ${
                                    mobileTab === 'calls' ? 'bg-activatedButton text-white' : 'text-smallGreyText'
                                }`}
                            >
                                Calls
                            </button>
                        </div>

                        {mobileTab === 'chats' ? (
                            <ChatList
                                contacts={contacts}
                                activeId={activeContactId}
                                onSelect={handleSelectContact}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                            />
                        ) : (
                            <CallLogList calls={initialCallLog} />
                        )}
                    </div>
                )}

                {mobilePane === 'thread' && activeContact && (
                    <MessageThread
                        contact={activeContact}
                        messages={activeMessages}
                        loading={loadingThread}
                        onSend={handleSend}
                        onSendAttachment={handleSendAttachment}
                        sendingAttachment={sendingAttachment}
                        onToggleSave={handleToggleSave}
                        onViewProfile={() => handleViewProfile(true)}
                        onBack={() => setMobilePane('list')}
                        canGenerateMeetupCode={role === 'vendor'}
                        generatingMeetupCode={generatingMeetupCode}
                        meetupQrUrl={meetupQrUrl}
                        meetupError={meetupError}
                        showMeetupDialog={showMeetupDialog}
                        onGenerateMeetupCode={handleGenerateMeetupCode}
                        onCloseMeetupDialog={handleCloseMeetupDialog}
                    />
                )}

                {mobilePane === 'profile' && activeProfile && (
                    <ContactProfilePanel
                        profile={activeProfile}
                        savedMessages={initialSavedMessages}
                        onBack={() => setMobilePane('thread')}
                    />
                )}
            </div>
        </main>
    )
}

export default MessagesClient
