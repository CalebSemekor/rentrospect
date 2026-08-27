'use client'

interface AccountSidebarProps {
    active: string
    onSelect: (id: string) => void
}

const sections = [
    { id: 'basic-information', label: 'Basic Information' },
    { id: 'password', label: 'Password' },
    { id: 'security', label: 'Security' },
    { id: 'account-deletion', label: 'Account Deletion' },
]

const AccountSidebar: React.FC<AccountSidebarProps> = ({ active, onSelect }) => {
    return (
        <aside className='hidden md:flex flex-col w-48 shrink-0 sticky top-24 self-start'>
            <p className='dmSans-font text-sm font-semibold text-black mb-3'>Account</p>
            <nav className='flex flex-col gap-1'>
                {sections.map((section) => (
                    <button
                        key={section.id}
                        type='button'
                        onClick={() => onSelect(section.id)}
                        className={`text-left dmSans-font text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                            active === section.id
                                ? 'bg-white text-black font-medium'
                                : 'text-smallGreyText hover:bg-white/60'
                        }`}
                    >
                        {section.label}
                    </button>
                ))}
            </nav>
        </aside>
    )
}

export default AccountSidebar
