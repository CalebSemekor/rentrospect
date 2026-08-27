'use client'

import Image from 'next/image'
import { useState } from 'react'
import { faqCategories } from '@/constants/faqs'

interface FaqSidebarProps {
    activeTopicId: string
    onSelectTopic: (topicId: string) => void
}

const FaqSidebar: React.FC<FaqSidebarProps> = ({ activeTopicId, onSelectTopic }) => {
    const [openCategories, setOpenCategories] = useState<string[]>(faqCategories.map((category) => category.id))

    const toggleCategory = (id: string) => {
        setOpenCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
    }

    return (
        <div className='flex flex-col w-full md:w-56 shrink-0'>
            {faqCategories.map((category) => {
                const isOpen = openCategories.includes(category.id)
                return (
                    <div key={category.id} className='flex flex-col mb-1'>
                        <button
                            type='button'
                            onClick={() => toggleCategory(category.id)}
                            className='flex items-center justify-between px-3 py-2.5 cursor-pointer'
                        >
                            <p className='dmSans-font text-xs font-semibold uppercase tracking-wide text-smallGreyText'>
                                {category.label} ({category.topics.length})
                            </p>
                            <Image
                                width={12}
                                height={12}
                                alt=''
                                src='/svgs/chevron-down.svg'
                                className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
                            />
                        </button>
                        {isOpen && (
                            <div className='flex flex-col'>
                                {category.topics.map((topic) => (
                                    <button
                                        key={topic.id}
                                        type='button'
                                        onClick={() => onSelectTopic(topic.id)}
                                        className={`text-left dmSans-font text-sm px-3 py-2 rounded-lg mx-1 transition-colors cursor-pointer ${
                                            activeTopicId === topic.id
                                                ? 'bg-white text-black font-medium'
                                                : 'text-smallGreyText hover:bg-white/60'
                                        }`}
                                    >
                                        {topic.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default FaqSidebar
