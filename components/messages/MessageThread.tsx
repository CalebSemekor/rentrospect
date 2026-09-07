import Image from 'next/image'
import type { ChatContact, ChatMessage } from '@/types/messages'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import MeetupQrDialog from './MeetupQrDialog'

const QrIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M3 3h5v5H3V3zm1 1v3h3V4H4zm-1 8h5v5H3v-5zm1 1v3h3v-3H4zm8-9h5v5h-5V3zm1 1v3h3V4h-3zM12 12h2v2h-2v-2zm3 0h2v2h-2v-2zm-3 3h2v2h-2v-2zm3 0h2v2h-2v-2z" />
    </svg>
)

interface MessageThreadProps {
    contact: ChatContact
    messages: ChatMessage[]
    loading?: boolean
    onSend: (text: string) => void
    onSendAttachment: (file: File) => void
    sendingAttachment?: boolean
    onToggleSave: (message: ChatMessage) => void
    onViewProfile: () => void
    onBack?: () => void
    canGenerateMeetupCode?: boolean
    generatingMeetupCode?: boolean
    meetupQrUrl?: string | null
    meetupError?: string | null
    showMeetupDialog?: boolean
    onGenerateMeetupCode?: () => void
    onCloseMeetupDialog?: () => void
}

const MessageThread: React.FC<MessageThreadProps> = ({
    contact,
    messages,
    loading,
    onSend,
    onSendAttachment,
    sendingAttachment,
    onToggleSave,
    onViewProfile,
    onBack,
    canGenerateMeetupCode,
    generatingMeetupCode,
    meetupQrUrl,
    meetupError,
    showMeetupDialog,
    onGenerateMeetupCode,
    onCloseMeetupDialog,
}) => {
    return (
        <div className='flex flex-col h-full min-h-0 bg-arrowBackground/40 rounded-2xl overflow-hidden'>
            <div className='flex items-center gap-3 bg-white px-4 py-3 shrink-0'>
                {onBack && (
                    <button type='button' onClick={onBack} aria-label='back' className='flex items-center justify-center cursor-pointer'>
                        <Image width={8} height={13} alt='' src='/svgs/chevron_left.svg' />
                    </button>
                )}

                <button type='button' onClick={onViewProfile} className='flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer text-left'>
                    <Image width={40} height={40} alt={contact.name} src={contact.avatar} className='size-10 rounded-full object-cover shrink-0' />
                    <div className='flex flex-col min-w-0'>
                        <p className='dmSans-font text-sm font-semibold text-black truncate'>{contact.name}</p>
                        <p className='dmSans-font text-xs text-smallGreyText truncate'>{contact.phoneNumber}</p>
                    </div>
                </button>

                <div className='hidden md:flex items-center gap-2 shrink-0'>
                    <button type='button' aria-label='video call' className='flex items-center justify-center size-9 rounded-lg bg-arrowBackground cursor-pointer'>
                        <Image width={18} height={16} alt='' src='/svgs/auth/video.svg' />
                    </button>
                    <button type='button' aria-label='call' className='flex items-center justify-center size-9 rounded-lg bg-arrowBackground cursor-pointer'>
                        <Image width={18} height={18} alt='' src='/svgs/messages/call.svg' />
                    </button>
                    <button
                        type='button'
                        onClick={onViewProfile}
                        className='dmSans-font text-xs font-semibold bg-activatedButton text-white rounded-full px-4 py-2 cursor-pointer'
                    >
                        View profile
                    </button>
                </div>

                <button type='button' aria-label='more' className='flex items-center justify-center size-9 shrink-0 cursor-pointer'>
                    <Image width={16} height={16} alt='' src='/svgs/profile/kebab.svg' />
                </button>
            </div>

            <div className='relative flex-1 min-h-0'>
                <div className='flex flex-col gap-4 h-full overflow-y-auto px-4 py-4'>
                    {loading ? (
                        <p className='dmSans-font text-sm text-smallGreyText text-center py-10'>Loading messages...</p>
                    ) : messages.length === 0 ? (
                        <p className='dmSans-font text-sm text-smallGreyText text-center py-10'>
                            No messages yet — say hello to {contact.name.split(' ')[0]}.
                        </p>
                    ) : (
                        messages.map((message) => (
                            <MessageBubble key={message.id} message={message} onToggleSave={onToggleSave} />
                        ))
                    )}
                </div>

                {canGenerateMeetupCode && (
                    <button
                        type='button'
                        onClick={onGenerateMeetupCode}
                        disabled={generatingMeetupCode}
                        className='absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap rounded-full bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-teal-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed dmSans-font'
                    >
                        <QrIcon className='size-4' aria-hidden='true' />
                        {generatingMeetupCode ? 'Generating...' : 'Generate Meetup Code'}
                    </button>
                )}
            </div>

            <div className='px-4 pb-4'>
                <MessageInput onSend={onSend} onSendAttachment={onSendAttachment} sendingAttachment={sendingAttachment} />
            </div>

            <MeetupQrDialog
                open={Boolean(showMeetupDialog)}
                loading={Boolean(generatingMeetupCode)}
                qrCodeUrl={meetupQrUrl ?? null}
                errorMessage={meetupError}
                onClose={() => onCloseMeetupDialog?.()}
            />
        </div>
    )
}

export default MessageThread
