'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import VendorInputField from '@/components/input/VendorInput'
import SettingsSectionCard from '../SettingsSectionCard'

// Password changes go straight through Clerk (the actual owner of
// credentials here) rather than our own backend — there is no dummy route
// standing in for this one.
const PasswordSection = () => {
    const { user } = useUser()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const isDirty = currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0

    const handleCancel = () => {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setError('')
        setSuccess(false)
    }

    const handleChangePassword = async () => {
        setError('')
        setSuccess(false)

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match')
            return
        }

        setSaving(true)
        try {
            await user?.updatePassword({ currentPassword, newPassword })
            setSuccess(true)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err) {
            const clerkError = err as { errors?: { message?: string; longMessage?: string }[] }
            setError(clerkError?.errors?.[0]?.longMessage || clerkError?.errors?.[0]?.message || 'Failed to change password')
        } finally {
            setSaving(false)
        }
    }

    return (
        <SettingsSectionCard id='password' label='Password'>
            <div className='flex flex-col gap-4'>
                <VendorInputField
                    type='password'
                    label='Current Password'
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    placeholder='Enter current password'
                />
                <VendorInputField
                    type='password'
                    label='New Password'
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder='Enter new password'
                />
                <VendorInputField
                    type='password'
                    label='Confirm New Password'
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder='Re-enter new password'
                />
            </div>

            <div className='flex items-center justify-end gap-3 mt-6'>
                {error && <p className='dmSans-font text-xs text-red-500 mr-auto'>{error}</p>}
                {success && <p className='dmSans-font text-xs text-green-600 mr-auto'>Password changed</p>}
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
                    onClick={handleChangePassword}
                    disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                    className='bg-activatedButton text-white dmSans-font text-sm font-semibold px-5 py-2.5 rounded-full disabled:opacity-40 cursor-pointer'
                >
                    {saving ? 'Changing...' : 'Change Password'}
                </button>
            </div>
        </SettingsSectionCard>
    )
}

export default PasswordSection
