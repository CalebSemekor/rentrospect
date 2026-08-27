import Image from 'next/image'

interface SettingsHeaderProps {
    name: string
    email: string
    avatar: string
    verified?: boolean
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ name, email, avatar, verified }) => {
    return (
        <div className='flex items-center gap-3 mb-6 md:mb-8'>
            <Image
                width={56}
                height={56}
                alt={name}
                src={avatar}
                className='size-14 rounded-full object-cover bg-arrowBackground'
            />
            <div className='flex flex-col'>
                <div className='flex items-center gap-1.5'>
                    <h1 className='montserrat-font text-lg font-bold text-black'>{name}</h1>
                    {verified && (
                        <Image width={14} height={18} alt='verified' src='/svgs/verification_badge.svg' className='size-3.5' />
                    )}
                </div>
                <p className='dmSans-font text-xs text-smallGreyText'>{email}</p>
            </div>
        </div>
    )
}

export default SettingsHeader
