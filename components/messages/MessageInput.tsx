'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

interface MessageInputProps {
    onSend: (text: string) => void
    onSendAttachment: (file: File) => void
    sendingAttachment?: boolean
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, onSendAttachment, sendingAttachment }) => {
    const [value, setValue] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSend = () => {
        const trimmed = value.trim()
        if (!trimmed) return
        onSend(trimmed)
        setValue('')
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') handleSend()
    }

    const handlePickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) onSendAttachment(file)
        event.target.value = ''
    }

    return (
        <div className='flex items-center gap-2 bg-white rounded-2xl px-3 py-2 shrink-0'>
            <button type='button' aria-label='emoji' className='flex items-center justify-center size-9 shrink-0 cursor-pointer'>
                <Image width={20} height={20} alt='' src='/svgs/messages/emoji.svg' />
            </button>
            <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Type here...'
                className='w-full dmSans-font text-sm outline-none placeholder:text-smallGreyText'
            />
            <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                disabled={sendingAttachment}
                aria-label='attach file'
                className='flex items-center justify-center size-9 shrink-0 cursor-pointer disabled:opacity-40'
            >
                <Image width={20} height={20} alt='' src='/svgs/messages/attach.svg' />
            </button>
            <input ref={fileInputRef} type='file' onChange={handlePickFile} className='hidden' />
            <button
                type='button'
                onClick={handleSend}
                disabled={!value.trim()}
                aria-label='send message'
                className='flex items-center justify-center size-9 rounded-full bg-activatedButton shrink-0 disabled:opacity-40 cursor-pointer'
            >
                <Image width={16} height={16} alt='' src='/svgs/profile/send.svg' className='invert' />
            </button>
        </div>
    )
}

export default MessageInput
