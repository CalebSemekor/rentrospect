import Image from 'next/image'
import type { ChatContact } from '@/types/messages'
import { formatListTimestamp } from '@/utils/formatMessageTime'

interface ChatListItemProps {
    contact: ChatContact
    active: boolean
    onSelect: (id: string) => void
}

const ChatListItem: React.FC<ChatListItemProps> = ({ contact, active, onSelect }) => {
    return (
        <button
            type='button'
            onClick={() => onSelect(contact.id)}
            className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-2xl cursor-pointer transition-colors ${
                active ? 'bg-white' : 'hover:bg-white/60'
            }`}
        >
            <Image
                width={44}
                height={44}
                alt={contact.name}
                src={contact.avatar}
                className='size-11 rounded-full object-cover shrink-0'
            />
            <div className='flex flex-col min-w-0 flex-1'>
                <div className='flex items-center justify-between gap-2'>
                    <p className='dmSans-font text-sm font-semibold text-black truncate'>{contact.name}</p>
                    <span className='dmSans-font text-[.6875rem] text-smallGreyText shrink-0'>
                        {formatListTimestamp(contact.lastMessageAt)}
                    </span>
                </div>
                <div className='flex items-center justify-between gap-2'>
                    <p className='dmSans-font text-xs text-smallGreyText truncate'>{contact.lastMessage}</p>
                    {contact.unreadCount > 0 && (
                        <span className='flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-activatedButton text-white text-[.625rem] font-semibold shrink-0'>
                            {contact.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    )
}

export default ChatListItem
