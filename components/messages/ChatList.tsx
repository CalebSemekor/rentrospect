'use client'

import Image from 'next/image'
import type { ChatContact } from '@/types/messages'
import ChatListItem from './ChatListItem'

interface ChatListProps {
    contacts: ChatContact[]
    activeId: string | null
    onSelect: (id: string) => void
    searchQuery: string
    onSearchChange: (value: string) => void
}

const ChatList: React.FC<ChatListProps> = ({ contacts, activeId, onSelect, searchQuery, onSearchChange }) => {
    const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )

    return (
        <div className='flex flex-col h-full min-h-0'>
            <div className='flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 mb-4 shrink-0'>
                <Image width={16} height={16} alt='' src='/svgs/search.svg' />
                <input
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder='Search here...'
                    className='w-full dmSans-font text-sm outline-none placeholder:text-smallGreyText'
                />
            </div>

            <div className='flex flex-col gap-1 overflow-y-auto min-h-0'>
                {filtered.length === 0 ? (
                    <p className='dmSans-font text-sm text-smallGreyText text-center py-10'>No chats found.</p>
                ) : (
                    filtered.map((contact) => (
                        <ChatListItem
                            key={contact.id}
                            contact={contact}
                            active={contact.id === activeId}
                            onSelect={onSelect}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default ChatList
