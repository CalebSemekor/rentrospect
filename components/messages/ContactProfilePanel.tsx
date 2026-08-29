import Image from 'next/image'
import type { ContactProfile, SavedMessage } from '@/types/messages'

interface ContactProfilePanelProps {
    profile: ContactProfile
    savedMessages: SavedMessage[]
    onBack?: () => void
}

const formatJoined = (iso: string) => {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const ContactProfilePanel: React.FC<ContactProfilePanelProps> = ({ profile, savedMessages, onBack }) => {
    return (
        <div className='flex flex-col h-full min-h-0 overflow-y-auto bg-white rounded-2xl'>
            {onBack && (
                <button type='button' onClick={onBack} className='flex items-center gap-2 px-4 pt-4 w-fit cursor-pointer'>
                    <Image width={8} height={13} alt='' src='/svgs/chevron_left.svg' />
                    <p className='dmSans-font text-sm font-semibold text-black'>Profile</p>
                </button>
            )}

            <div className='relative mx-4 mt-4'>
                <div className='relative w-full h-28 rounded-2xl overflow-hidden bg-arrowBackground'>
                    {profile.coverPhoto && <Image fill alt='' src={profile.coverPhoto} className='object-cover' />}
                </div>
                <Image
                    width={72}
                    height={72}
                    alt={profile.name}
                    src={profile.avatar}
                    className='absolute left-4 -bottom-8 size-18 rounded-full border-4 border-white object-cover bg-white'
                />
            </div>

            <div className='flex flex-col px-4 pt-10 pb-4'>
                <div className='flex items-center gap-1.5'>
                    <h2 className='montserrat-font text-base font-bold text-black'>{profile.name}</h2>
                    {profile.verified && (
                        <Image width={14} height={18} alt='verified' src='/svgs/verification_badge.svg' className='size-3.5' />
                    )}
                </div>
                <p className='dmSans-font text-xs text-smallGreyText mb-3'>@{profile.handle}</p>
                {profile.bio && <p className='dmSans-font text-sm text-otherSmallText mb-4'>{profile.bio}</p>}

                <div className='flex flex-col gap-2 mb-6'>
                    {profile.location && (
                        <div className='flex items-center gap-2'>
                            <Image width={14} height={14} alt='' src='/svgs/map-point.svg' />
                            <p className='dmSans-font text-xs text-otherSmallText'>{profile.location}</p>
                        </div>
                    )}
                    {profile.email && (
                        <div className='flex items-center gap-2'>
                            <Image width={14} height={14} alt='' src='/svgs/messages/mail.svg' />
                            <p className='dmSans-font text-xs text-otherSmallText'>{profile.email}</p>
                        </div>
                    )}
                    {profile.phoneNumber && (
                        <div className='flex items-center gap-2'>
                            <Image width={14} height={14} alt='' src='/svgs/auth/phone.svg' />
                            <p className='dmSans-font text-xs text-otherSmallText'>{profile.phoneNumber}</p>
                        </div>
                    )}
                    <div className='flex items-center gap-2'>
                        <Image width={14} height={14} alt='' src='/svgs/auth/calender.svg' />
                        <p className='dmSans-font text-xs text-otherSmallText'>Joined {formatJoined(profile.joinedAt)}</p>
                    </div>
                </div>

                <p className='dmSans-font text-xs font-semibold uppercase tracking-wide text-smallGreyText mb-3'>Saved messages</p>
                <div className='flex flex-col gap-3'>
                    {savedMessages.length === 0 ? (
                        <p className='dmSans-font text-xs text-smallGreyText'>No saved messages yet.</p>
                    ) : (
                        savedMessages.map((message) => (
                            <div key={message.id} className='flex flex-col gap-2 bg-nearWhiteBg rounded-xl p-3'>
                                <div className='flex items-center gap-2'>
                                    <Image width={24} height={24} alt={message.author} src={message.authorAvatar} className='size-6 rounded-full object-cover' />
                                    <p className='dmSans-font text-xs font-semibold text-black flex-1'>{message.author}</p>
                                    <Image width={12} height={12} alt='saved' src='/svgs/rating-star.svg' />
                                </div>
                                <p className='dmSans-font text-[.6875rem] text-smallGreyText line-clamp-2'>{message.preview}</p>
                                <button type='button' className='dmSans-font text-[.6875rem] font-semibold text-black w-fit cursor-pointer'>
                                    Show more
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContactProfilePanel
