'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { FaqItem } from '@/types/faqs'

interface FaqAccordionItemProps {
    item: FaqItem
}

const FaqAccordionItem: React.FC<FaqAccordionItemProps> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='bg-white rounded-2xl overflow-hidden'>
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className='flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left cursor-pointer'
            >
                <p className='dmSans-font text-sm font-medium text-black'>{item.question}</p>
                <Image
                    width={16}
                    height={16}
                    alt=''
                    src='/svgs/settings/plus.svg'
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className='overflow-hidden'>
                    <p className='dmSans-font text-sm text-smallGreyText leading-relaxed px-6 pb-4.5'>{item.answer}</p>
                </div>
            </div>
        </div>
    )
}

export default FaqAccordionItem
