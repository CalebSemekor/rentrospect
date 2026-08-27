interface SettingsSectionCardProps {
    id?: string
    label: string
    children: React.ReactNode
}

// `scroll-mt-24` keeps the section from landing flush under the sticky back
// header when a sidebar scrolls it into view.
const SettingsSectionCard: React.FC<SettingsSectionCardProps> = ({ id, label, children }) => {
    return (
        <section id={id} className='flex flex-col bg-white rounded-2xl p-6 scroll-mt-24'>
            <p className='dmSans-font text-xs font-semibold uppercase tracking-wide text-smallGreyText mb-5'>{label}</p>
            {children}
        </section>
    )
}

export default SettingsSectionCard
