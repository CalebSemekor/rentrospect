import Image from 'next/image'
import type { VendorProfile } from '@/types/profile'
import Link from 'next/link'

interface ProfileHeaderProps {
    profile: VendorProfile
}

const formatJoined = (iso: string) => {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
    return (
        <div className='flex flex-col mb-6'>
            {/* Cover + avatar — avatar is absolutely anchored to this wrapper so it
                always overlaps the cover's bottom edge, regardless of surrounding
                flex context. */}
            <div className='relative'>
                <div className='relative w-full h-40 md:h-64 rounded-2xl overflow-hidden bg-arrowBackground'>
                    <Image
                        fill
                        alt='cover photo'
                        src={profile.coverPhoto}
                        className='object-cover'
                    />
                    <div className='absolute top-3 right-3 flex gap-2'>
                        <button
                            type='button'
                            aria-label='share profile'
                            className='flex items-center justify-center size-9 rounded-full bg-white/80 backdrop-blur-sm cursor-pointer'
                        >
                            <Image width={16} height={16} alt='share' src='/svgs/profile/share.svg' />
                        </button>
                        <Link
                            href='/vendor/settings'
                            type='button'
                            aria-label='edit profile'
                            className='flex items-center justify-center size-9 rounded-full bg-white/80 backdrop-blur-sm cursor-pointer'
                        >
                            <Image width={16} height={16} alt='edit' src='/svgs/profile/edit.svg' />
                        </Link>
                    </div>
                </div>

                <Image
                    width={88}
                    height={88}
                    alt={profile.name}
                    src={profile.businessLogo}
                    className='absolute left-4 -bottom-9 md:-bottom-11 size-18 md:size-22 rounded-full object-cover bg-white'
                />
            </div>

            {/* Identity */}
            <div className='flex flex-col px-1 pt-12 md:pt-14'>
                <div className='flex items-center gap-1.5'>
                    <h1 className='montserrat-font text-xl md:text-2xl font-bold text-black'>{profile.name}</h1>
                    {profile.verified && (
                        <Image width={16} height={20} alt='verified' src='/svgs/verification_badge.svg' className='size-4' />
                    )}
                </div>
                <p className='dmSans-font text-sm text-smallGreyText mb-3'>@{profile.handle}</p>

                <p className='dmSans-font text-sm md:text-base text-otherSmallText leading-relaxed max-w-2xl mb-4 line-clamp-2 md:line-clamp-none'>
                    {profile.bio}
                </p>

                {/* Tags row */}
                <div className='flex flex-wrap items-center gap-x-5 gap-y-2 mb-3'>
                    {profile.tags && profile.tags.map((tag) => (
                        <div key={tag} className='flex items-center gap-1.5'>
                            <Image width={14} height={14} alt='tag' src='/svgs/profile/tag.svg' />
                            <p className='dmSans-font text-xs md:text-sm text-otherSmallText capitalize'>{tag}</p>
                        </div>
                    ))}
                    {profile.website && (
                        <a
                            href={`https://${profile.website.replace(/^https?:\/\//, '')}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-1.5'
                        >
                            <Image width={14} height={14} alt='website' src='/svgs/profile/link.svg' />
                            <p className='dmSans-font text-xs md:text-sm text-otherSmallText'>{profile.website}</p>
                        </a>
                    )}
                    <div className='flex items-center gap-1.5'>
                        <Image width={14} height={14} alt='joined' src='/svgs/auth/calender.svg' />
                        <p className='dmSans-font text-xs md:text-sm text-otherSmallText'>Joined {formatJoined(profile.dateJoined)}</p>
                    </div>
                </div>

                {/* Stat row */}
                <div className='flex flex-wrap items-center gap-x-5 gap-y-2 mb-5'>
                    <div className='flex items-center gap-1'>
                        <Image width={16} height={16} alt='rating' src='/svgs/rating-star.svg' />
                        <p className='dmSans-font text-xs md:text-sm text-otherSmallText'>
                            {profile.rating} ({profile.numReviews} Reviews)
                        </p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Image width={14} height={14} alt='location' src='/svgs/map-point.svg' />
                        <p className='dmSans-font text-xs md:text-sm text-otherSmallText'>{profile.location}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Image width={14} height={14} alt='hours' src='/svgs/hourglass.svg' />
                        <p className='dmSans-font text-xs md:text-sm text-otherSmallText'>{profile.operatingHoursSummary}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Image width={14} height={14} alt='successful rentals' src='/svgs/profile/package.svg' />
                        <p className='dmSans-font text-xs md:text-sm text-otherSmallText'>{profile.successfulRentals} Successful Rentals</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader
