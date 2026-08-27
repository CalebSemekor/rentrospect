import Link from 'next/link'
import Image from 'next/image'

interface SettingsListRowProps {
    title: string
    icon: string
    href: string
}

const SettingsListRow: React.FC<SettingsListRowProps> = ({ title, icon, href }) => {
    return (
        <Link href={href} className='flex items-center justify-between py-3.5'>
            <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center size-8 rounded-full bg-arrowBackground'>
                    <Image width={16} height={16} alt={title} src={icon} />
                </div>
                <p className='dmSans-font text-sm text-black'>{title}</p>
            </div>
            <Image width={7} height={12} alt='chevron' src='/svgs/chevron_right.svg' />
        </Link>
    )
}

export default SettingsListRow
