'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import VendorInputField from '@/components/input/VendorInput'
import VendorTextAreaField from '@/components/input/VendorTextArea'

const socialLinks = [
    { alt: 'facebook', icon: '/svgs/settings/facebook.svg', href: '#' },
    { alt: 'twitter', icon: '/svgs/settings/twitter.svg', href: '#' },
    { alt: 'instagram', icon: '/svgs/settings/instagram.svg', href: '#' },
    { alt: 'linkedin', icon: '/svgs/settings/linkedin.svg', href: '#' },
]

export default function ContactSupportPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [company, setCompany] = useState('')
    const [message, setMessage] = useState('')
    const [sent, setSent] = useState(false)

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        // TODO: wire up to a real support-ticket endpoint once one exists
        setSent(true)
    }

    return (
        <main className='flex flex-col pb-16'>
            <Link href='/renter/settings' className='flex items-center gap-2 mb-8 w-fit'>
                <Image width={8} height={13} alt='back' src='/svgs/chevron_left.svg' />
                <p className='montserrat-font text-base font-semibold text-black'>Contact Support</p>
            </Link>

            <div className='flex flex-col items-center text-center mb-10 md:mb-14'>
                <h1 className='montserrat-font text-3xl md:text-5xl font-bold text-black mb-4'>Get in touch today</h1>
                <p className='dmSans-font text-sm md:text-base text-smallGreyText max-w-md'>
                    We&apos;re eager to connect and explore how our solutions can benefit your organization. Contact us today and let&apos;s start a conversation!
                </p>
            </div>

            <div className='flex flex-col md:flex-row gap-8 mb-12 md:mb-16'>
                <div className='relative w-full md:w-1/2 h-56 md:h-auto rounded-2xl overflow-hidden bg-arrowBackground shrink-0'>
                    <Image fill alt='support team' src='/images/profile/support.png' className='object-cover' />
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full md:w-1/2'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <VendorInputField label='Name' value={name} onChange={setName} placeholder='John Carter' />
                        <VendorInputField label='Email' value={email} onChange={setEmail} placeholder='example@email.com' />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <VendorInputField label='Phone' value={phone} onChange={setPhone} placeholder='(123) 456 - 789' />
                        <VendorInputField label='Company' value={company} onChange={setCompany} placeholder='Company' />
                    </div>
                    <VendorTextAreaField
                        rows={4}
                        value={message}
                        onChange={setMessage}
                        label='Leave us message'
                        placeholder='Please type your message here...'
                    />

                    <div className='flex items-center gap-4 mt-2'>
                        <button
                            type='submit'
                            className='bg-activatedButton text-white dmSans-font text-sm font-semibold rounded-full px-6 py-3 cursor-pointer disabled:opacity-60'
                            disabled={sent}
                        >
                            {sent ? 'Message sent' : 'Send message'}
                        </button>
                        <div className='flex items-center gap-2'>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.alt}
                                    href={social.href}
                                    aria-label={social.alt}
                                    className='flex items-center justify-center size-9 rounded-full bg-arrowBackground'
                                >
                                    <Image width={14} height={14} alt={social.alt} src={social.icon} />
                                </a>
                            ))}
                        </div>
                    </div>
                </form>
            </div>

            <div className='flex flex-col md:flex-row justify-between gap-8 bg-greenBookingBg rounded-3xl px-6 py-10 md:px-12 md:py-14'>
                <div className='flex flex-col'>
                    <p className='dmSans-font text-xs text-white/60 mb-3'>Contact Info</p>
                    <h2 className='montserrat-font text-2xl md:text-3xl font-bold text-white max-w-xs'>
                        We are always happy to assist you
                    </h2>
                </div>

                <div className='flex flex-col sm:flex-row gap-8'>
                    <div className='flex flex-col gap-1'>
                        <p className='dmSans-font text-xs text-white/60'>Email Address</p>
                        <div className='w-6 h-px bg-white/30 my-1' />
                        <p className='dmSans-font text-sm text-white font-medium'>help@info.com</p>
                        <p className='dmSans-font text-xs text-white/60 mt-2 leading-relaxed'>
                            Assistance hours:<br />Monday - Friday 6am to 8pm EST
                        </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='dmSans-font text-xs text-white/60'>Number</p>
                        <div className='w-6 h-px bg-white/30 my-1' />
                        <p className='dmSans-font text-sm text-white font-medium'>(233) 998-34256</p>
                        <p className='dmSans-font text-xs text-white/60 mt-2 leading-relaxed'>
                            Assistance hours:<br />Monday - Friday 6am to 8pm EST
                        </p>
                    </div>
                </div>

                <div className='flex md:flex-col items-center gap-3'>
                    {socialLinks.slice(0, 3).map((social) => (
                        <a
                            key={social.alt}
                            href={social.href}
                            aria-label={social.alt}
                            className='flex items-center justify-center size-9 rounded-full border border-white/30'
                        >
                            <Image width={14} height={14} alt={social.alt} src={social.icon} className='invert' />
                        </a>
                    ))}
                </div>
            </div>
        </main>
    )
}
