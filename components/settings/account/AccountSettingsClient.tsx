'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { AccountDetails, SecuritySettings } from '@/types/account'
import AccountSidebar from './AccountSidebar'
import BasicInfoSection from './BasicInfoSection'
import PasswordSection from './PasswordSection'
import SecuritySection from './SecuritySection'
import DeleteAccountSection from './DeleteAccountSection'

interface AccountSettingsClientProps {
    initialAccount: AccountDetails | null
    initialSecurity: SecuritySettings | null
}

const AccountSettingsClient: React.FC<AccountSettingsClientProps> = ({ initialAccount, initialSecurity }) => {
    const [activeSection, setActiveSection] = useState('basic-information')

    const scrollToSection = (id: string) => {
        setActiveSection(id)
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <main className='flex flex-col pb-16'>
            <Link href='/renter/settings' className='flex items-center gap-2 mb-8 w-fit'>
                <Image width={8} height={13} alt='back' src='/svgs/chevron_left.svg' />
                <p className='montserrat-font text-base font-semibold text-black'>Account Settings</p>
            </Link>

            <div className='flex flex-col md:flex-row gap-8'>
                <AccountSidebar active={activeSection} onSelect={scrollToSection} />

                <div className='flex flex-col gap-4 w-full'>
                    <BasicInfoSection initialAccount={initialAccount} />
                    <PasswordSection />
                    <SecuritySection initialSecurity={initialSecurity} />
                    <DeleteAccountSection />
                </div>
            </div>
        </main>
    )
}

export default AccountSettingsClient
