import { auth } from '@clerk/nextjs/server'
import MessagesClient from '@/components/messages/MessagesClient'
import {
    getChatList,
    getCallLog,
    getSavedMessages,
    getConversationMessages,
    getContactProfile,
} from '@/services/backend'
import type { ChatContact, CallLogEntry, SavedMessage, ChatMessage, ContactProfile } from '@/types/messages'

export default async function MessagesPage() {
    const { getToken } = await auth()
    const token = await getToken()

    let contacts: ChatContact[] = []
    let callLog: CallLogEntry[] = []
    let savedMessages: SavedMessage[] = []
    let initialMessages: ChatMessage[] = []
    let initialProfile: ContactProfile | null = null

    if (token) {
        [contacts, callLog, savedMessages] = await Promise.all([
            getChatList(token),
            getCallLog(token),
            getSavedMessages(token),
        ])

        if (contacts[0]) {
            [initialMessages, initialProfile] = await Promise.all([
                getConversationMessages(token, contacts[0].id),
                getContactProfile(token, contacts[0].id),
            ])
        }
    }

    return (
        <MessagesClient
            initialContacts={contacts}
            initialCallLog={callLog}
            initialSavedMessages={savedMessages}
            initialActiveContactId={contacts[0]?.id ?? null}
            initialMessages={initialMessages}
            initialProfile={initialProfile}
        />
    )
}
