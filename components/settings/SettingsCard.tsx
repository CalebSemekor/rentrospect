import Link from 'next/link'
import Image from 'next/image'

interface SettingsCardProps {
    title: string
    description: string
    icon: string
    href: string
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, icon, href }) => {
    return (
        <Link
            href={href}
            className='flex flex-col gap-4 bg-white rounded-2xl p-5 hover:shadow-sm transition-shadow'
        >
            <div className='flex items-center justify-center size-9 rounded-full bg-arrowBackground'>
                <Image width={18} height={18} alt={title} src={icon} />
            </div>
            <div className='flex flex-col gap-1'>
                <h3 className='dmSans-font text-sm font-semibold text-black'>{title}</h3>
                <p className='dmSans-font text-xs text-smallGreyText leading-relaxed'>{description}</p>
            </div>
        </Link>
    )
}

export default SettingsCard
