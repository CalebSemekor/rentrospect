'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import LegalSidebar from './LegalSidebar'

interface LegalDocLayoutProps {
    title: string
    docTitle: string
    sections: { id: string; label: string }[]
    copyright: string
    children: React.ReactNode
}

const LegalDocLayout: React.FC<LegalDocLayoutProps> = ({ title, docTitle, sections, copyright, children }) => {
    const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '')

    const scrollToSection = (id: string) => {
        setActiveSection(id)
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <main className='flex flex-col pb-16'>
            <Link href='/renter/settings' className='flex items-center gap-2 mb-8 w-fit'>
                <Image width={8} height={13} alt='back' src='/svgs/chevron_left.svg' />
                <p className='montserrat-font text-base font-semibold text-black'>{title}</p>
            </Link>

            <div className='flex flex-col md:flex-row gap-10'>
                <LegalSidebar sections={sections} active={activeSection} onSelect={scrollToSection} />

                <div className='flex flex-col w-full max-w-3xl'>
                    <h1 className='montserrat-font text-lg font-bold uppercase text-black mb-6'>{docTitle}</h1>
                    {children}
                </div>
            </div>

            <footer className='flex items-center justify-between gap-4 mt-12 pt-6 border-t border-[#E6E7E8]'>
                <p className='dmSans-font text-xs text-smallGreyText'>{copyright}</p>
                <div className='flex items-center gap-3'>
                    <a href='#' aria-label='facebook' className='flex items-center justify-center size-8 rounded-full bg-arrowBackground'>
                        <Image width={12} height={12} alt='' src='/svgs/settings/facebook.svg' />
                    </a>
                    <a href='#' aria-label='linkedin' className='flex items-center justify-center size-8 rounded-full bg-arrowBackground'>
                        <Image width={12} height={12} alt='' src='/svgs/settings/linkedin.svg' />
                    </a>
                    <a href='#' aria-label='twitter' className='flex items-center justify-center size-8 rounded-full bg-arrowBackground'>
                        <Image width={12} height={12} alt='' src='/svgs/settings/twitter.svg' />
                    </a>
                </div>
            </footer>
        </main>
    )
}

export default LegalDocLayout
