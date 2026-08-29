import Image from 'next/image'
import type { ChatMessage } from '@/types/messages'
import { formatMessageTimestamp } from '@/utils/formatMessageTime'
import { formatBytes } from '@/utils/formatBytes'

interface MessageBubbleProps {
    message: ChatMessage
    onToggleSave: (message: ChatMessage) => void
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onToggleSave }) => {
    return (
        <div className={`flex flex-col gap-1 max-w-[80%] md:max-w-md ${message.fromMe ? 'items-end self-end' : 'items-start self-start'}`}>
            <div className='flex items-center gap-1.5 px-1'>
                <p className='dmSans-font text-[.6875rem] text-smallGreyText'>
                    {message.fromMe ? 'You' : message.author} &middot; {formatMessageTimestamp(message.sentAt)}
                    {message.fromMe && message.readAt && ' · Seen'}
                </p>
                <button
                    type='button'
                    onClick={() => onToggleSave(message)}
                    aria-label={message.isSaved ? 'unsave message' : 'save message'}
                    aria-pressed={Boolean(message.isSaved)}
                    className='flex items-center justify-center cursor-pointer'
                >
                    <Image
                        width={10}
                        height={10}
                        alt=''
                        src={message.isSaved ? '/svgs/rating-star.svg' : '/svgs/rating-star-.svg'}
                    />
                </button>
            </div>

            {message.attachment && (
                <a
                    href={message.attachment.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                        message.fromMe ? 'bg-activatedButton text-white' : 'bg-white text-black'
                    }`}
                >
                    <div className={`flex items-center justify-center size-9 rounded-lg shrink-0 ${message.fromMe ? 'bg-white/20' : 'bg-arrowBackground'}`}>
                        <Image width={16} height={16} alt='' src='/svgs/messages/attach.svg' className={message.fromMe ? 'invert' : ''} />
                    </div>
                    <div className='flex flex-col min-w-0'>
                        <p className='dmSans-font text-sm font-medium truncate'>{message.attachment.name}</p>
                        <p className={`dmSans-font text-xs ${message.fromMe ? 'text-white/70' : 'text-smallGreyText'}`}>
                            {formatBytes(message.attachment.sizeBytes)}
                        </p>
                    </div>
                </a>
            )}

            {message.text && (
                <div
                    className={`dmSans-font text-sm leading-relaxed rounded-2xl px-4 py-3 ${
                        message.fromMe
                            ? 'bg-activatedButton text-white rounded-tr-sm'
                            : 'bg-white text-black rounded-tl-sm'
                    }`}
                >
                    {message.text}
                </div>
            )}
        </div>
    )
}

export default MessageBubble
