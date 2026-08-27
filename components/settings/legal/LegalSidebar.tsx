'use client'

interface LegalSidebarProps {
    sections: { id: string; label: string }[]
    active: string
    onSelect: (id: string) => void
}

const LegalSidebar: React.FC<LegalSidebarProps> = ({ sections, active, onSelect }) => {
    return (
        <aside className='hidden md:flex flex-col w-56 shrink-0 sticky top-24 self-start'>
            <p className='dmSans-font text-xs font-semibold uppercase tracking-wide text-smallGreyText mb-3'>On this page</p>
            <nav className='flex flex-col gap-3'>
                {sections.map((section) => (
                    <button
                        key={section.id}
                        type='button'
                        onClick={() => onSelect(section.id)}
                        className={`text-left dmSans-font text-sm cursor-pointer transition-colors ${
                            active === section.id ? 'text-activatedButton font-semibold' : 'text-smallGreyText hover:text-otherSmallText'
                        }`}
                    >
                        {section.label}
                    </button>
                ))}
            </nav>
        </aside>
    )
}

export default LegalSidebar
