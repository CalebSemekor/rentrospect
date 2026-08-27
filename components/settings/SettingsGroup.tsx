import type { SettingsItem } from '@/constants/settings'
import SettingsListRow from './SettingsListRow'

interface SettingsGroupProps {
    label: string
    items: SettingsItem[]
}

const SettingsGroup: React.FC<SettingsGroupProps> = ({ label, items }) => {
    if (items.length === 0) return null

    return (
        <div className='flex flex-col'>
            <p className='dmSans-font text-xs font-semibold uppercase tracking-wide text-smallGreyText mb-2 px-1'>
                {label}
            </p>
            <div className='flex flex-col bg-white rounded-2xl px-4 divide-y divide-[#F1F5F9]'>
                {items.map((item) => (
                    <SettingsListRow key={item.id} title={item.title} icon={item.icon} href={item.href} />
                ))}
            </div>
        </div>
    )
}

export default SettingsGroup
