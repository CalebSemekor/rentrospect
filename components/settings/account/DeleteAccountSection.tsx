'use client'

import { useAuth } from '@clerk/nextjs'
import { useState } from 'react'
import { deactivateAccount } from '@/services/backend'
import SettingsSectionCard from '../SettingsSectionCard'

const DeleteAccountSection = () => {
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleDeactivate = async () => {
        const confirmed = window.confirm(
            'Deactivate your account? Your data will be permanently deleted in 3 months.'
        )
        if (!confirmed) return

        const token = await getToken()
        if (!token) return

        setLoading(true)
        setError('')
        const success = await deactivateAccount(token)
        setLoading(false)
        if (!success) setError("Couldn't deactivate your account — try again")
    }

    return (
        <SettingsSectionCard id='account-deletion' label='Delete Account'>
            <div className='flex items-center justify-between gap-4'>
                <div className='flex flex-col gap-1'>
                    <p className='dmSans-font text-sm font-semibold text-black'>Deactivate My Account</p>
                    <p className='dmSans-font text-xs text-smallGreyText'>Your data will be permanently deactivated in 3 months</p>
                    {error && <p className='dmSans-font text-xs text-red-500 mt-1'>{error}</p>}
                </div>
                <button
                    type='button'
                    onClick={handleDeactivate}
                    disabled={loading}
                    className='bg-red-500 text-white dmSans-font text-sm font-semibold px-5 py-2.5 rounded-full disabled:opacity-40 cursor-pointer shrink-0'
                >
                    {loading ? 'Deactivating...' : 'Deactivate'}
                </button>
            </div>
        </SettingsSectionCard>
    )
}

export default DeleteAccountSection
