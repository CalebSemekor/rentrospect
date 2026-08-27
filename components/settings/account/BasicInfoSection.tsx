'use client'

import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'
import { useRef, useState } from 'react'
import VendorInputField from '@/components/input/VendorInput'
import { updateAccountDetails } from '@/services/backend'
import type { AccountDetails } from '@/types/account'
import SettingsSectionCard from '../SettingsSectionCard'

interface BasicInfoSectionProps {
    initialAccount: AccountDetails | null
}

const emptyAccount: AccountDetails = {
    fullName: '',
    email: '',
    deliveryLocation: '',
    phoneNumber: '',
    profilePic: '/images/Avatar.png',
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ initialAccount }) => {
    const { getToken } = useAuth()
    const original = initialAccount ?? emptyAccount

    const [fullName, setFullName] = useState(original.fullName)
    const [email, setEmail] = useState(original.email)
    const [deliveryLocation, setDeliveryLocation] = useState(original.deliveryLocation)
    const [phoneNumber, setPhoneNumber] = useState(original.phoneNumber)
    const [profilePicPreview, setProfilePicPreview] = useState(original.profilePic)
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

    const fileInputRef = useRef<HTMLInputElement>(null)

    const isDirty =
        fullName !== original.fullName ||
        email !== original.email ||
        deliveryLocation !== original.deliveryLocation ||
        phoneNumber !== original.phoneNumber ||
        profilePicFile !== null

    const handleCancel = () => {
        setFullName(original.fullName)
        setEmail(original.email)
        setDeliveryLocation(original.deliveryLocation)
        setPhoneNumber(original.phoneNumber)
        setProfilePicPreview(original.profilePic)
        setProfilePicFile(null)
        setStatus('idle')
    }

    const handlePickImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        setProfilePicFile(file)
        setProfilePicPreview(URL.createObjectURL(file))
    }

    const handleSave = async () => {
        const token = await getToken()
        if (!token) return

        setSaving(true)
        setStatus('idle')

        const success = await updateAccountDetails(
            token,
            { fullName, email, deliveryLocation, phoneNumber, profilePic: original.profilePic },
            profilePicFile
        )

        setSaving(false)
        setStatus(success ? 'saved' : 'error')
        if (success) setProfilePicFile(null)
    }

    return (
        <SettingsSectionCard id='basic-information' label='Basic Information'>
            <div className='flex justify-center mb-6'>
                <div className='relative'>
                    <Image
                        width={80}
                        height={80}
                        alt='profile picture'
                        src={profilePicPreview}
                        className='size-20 rounded-full object-cover bg-arrowBackground'
                    />
                    <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        aria-label='change profile picture'
                        className='absolute bottom-0 right-0 flex items-center justify-center size-7 rounded-full bg-activatedButton cursor-pointer'
                    >
                        <Image width={14} height={14} alt='' src='/svgs/settings/camera.svg' />
                    </button>
                    <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        onChange={handlePickImage}
                        className='hidden'
                    />
                </div>
            </div>

            <div className='flex flex-col gap-4'>
                <VendorInputField label='Full Name' value={fullName} onChange={setFullName} placeholder='Jensen Sedem' />
                <VendorInputField label='Email Address' type='email' value={email} onChange={setEmail} placeholder='jensedem@gmail.com' />
                <VendorInputField
                    label='Delivery Location'
                    value={deliveryLocation}
                    onChange={setDeliveryLocation}
                    placeholder='233 Highland Ave'
                    icon='/svgs/map-point.svg'
                />
                <VendorInputField label='Phone Number' type='tel' value={phoneNumber} onChange={setPhoneNumber} placeholder='(233) 456-7789' />
            </div>

            <div className='flex items-center justify-end gap-3 mt-6'>
                {status === 'saved' && <p className='dmSans-font text-xs text-green-600 mr-auto'>Saved</p>}
                {status === 'error' && <p className='dmSans-font text-xs text-red-500 mr-auto'>Couldn&apos;t save — try again</p>}
                <button
                    type='button'
                    onClick={handleCancel}
                    disabled={!isDirty || saving}
                    className='dmSans-font text-sm font-medium px-5 py-2.5 rounded-full text-otherSmallText disabled:opacity-40 cursor-pointer'
                >
                    Cancel
                </button>
                <button
                    type='button'
                    onClick={handleSave}
                    disabled={!isDirty || saving}
                    className='bg-activatedButton text-white dmSans-font text-sm font-semibold px-5 py-2.5 rounded-full disabled:opacity-40 cursor-pointer'
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </SettingsSectionCard>
    )
}

export default BasicInfoSection
