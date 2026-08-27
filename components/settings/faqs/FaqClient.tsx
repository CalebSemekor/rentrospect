'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { faqCategories } from '@/constants/faqs'
import FaqSidebar from './FaqSidebar'
import FaqAccordionItem from './FaqAccordionItem'

const allTopics = faqCategories.flatMap((category) => category.topics)
const defaultTopicId = allTopics.find((topic) => topic.id === 'creating-listings')?.id ?? allTopics[0].id

const FaqClient = () => {
    const [activeTopicId, setActiveTopicId] = useState(defaultTopicId)
    const [showMobileTopics, setShowMobileTopics] = useState(false)

    const activeTopic = useMemo(
        () => allTopics.find((topic) => topic.id === activeTopicId) ?? allTopics[0],
        [activeTopicId]
    )

    const handleSelectTopic = (topicId: string) => {
        setActiveTopicId(topicId)
        setShowMobileTopics(false)
    }

    return (
        <main className='flex flex-col pb-16'>
            <Link href='/renter/settings' className='flex items-center gap-2 mb-8 w-fit'>
                <Image width={8} height={13} alt='back' src='/svgs/chevron_left.svg' />
                <p className='montserrat-font text-base font-semibold text-black'>FAQs</p>
            </Link>

            {/* Mobile topics disclosure — the sidebar collapses in here since there's no room for it inline */}
            <button
                type='button'
                onClick={() => setShowMobileTopics(!showMobileTopics)}
                className='flex md:hidden items-center justify-between bg-white rounded-2xl px-5 py-4 mb-4 cursor-pointer'
            >
                <p className='dmSans-font text-sm font-semibold text-black'>Help Topics</p>
                <Image
                    width={14}
                    height={14}
                    alt=''
                    src='/svgs/chevron-down.svg'
                    className={`transition-transform duration-200 ${showMobileTopics ? 'rotate-180' : ''}`}
                />
            </button>
            {showMobileTopics && (
                <div className='flex md:hidden bg-white rounded-2xl p-3 mb-4'>
                    <FaqSidebar activeTopicId={activeTopicId} onSelectTopic={handleSelectTopic} />
                </div>
            )}

            <div className='flex flex-col md:flex-row gap-8'>
                <div className='hidden md:flex'>
                    <FaqSidebar activeTopicId={activeTopicId} onSelectTopic={handleSelectTopic} />
                </div>

                <div className='flex flex-col gap-3 w-full'>
                    <p className='dmSans-font text-xs font-semibold uppercase tracking-wide text-smallGreyText mb-1'>
                        Frequently Asked Questions
                    </p>
                    {activeTopic.items.map((item) => (
                        <FaqAccordionItem key={item.question} item={item} />
                    ))}
                </div>
            </div>

            <footer className='flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-6 border-t border-[#E6E7E8]'>
                <p className='dmSans-font text-xs text-smallGreyText'>© {new Date().getFullYear()} Rentrospect. All Rights Reserved.</p>
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

export default FaqClient
