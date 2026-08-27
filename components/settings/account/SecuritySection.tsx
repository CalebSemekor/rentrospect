'use client'

import { useAuth } from '@clerk/nextjs'
import { useState } from 'react'
import ToggleSwitch from '@/components/ToggleSwitch'
import { updateSecuritySettings } from '@/services/backend'
import type { SecuritySettings } from '@/types/account'
import SettingsSectionCard from '../SettingsSectionCard'

interface SecuritySectionProps {
    initialSecurity: SecuritySettings | null
}

const defaultSecurity: SecuritySettings = {
    twoFactorEnabled: false,
    analyticsEnabled: true,
    personalizationEnabled: true,
    thirdPartySharingEnabled: false,
}

const toggleRows: { key: keyof SecuritySettings; title: string; description: string }[] = [
    { key: 'twoFactorEnabled', title: 'Enable 2FA', description: 'Add an extra layer of security to your account' },
    { key: 'analyticsEnabled', title: 'Analytics', description: 'Allows us to collect anonymous usage data to improve platform performance' },
    { key: 'personalizationEnabled', title: 'Personalization', description: 'Allows us to use your activity to personalize your experience' },
    { key: 'thirdPartySharingEnabled', title: 'Third-Party Sharing', description: 'Allows sharing of anonymized data with trusted partners' },
]

const SecuritySection: React.FC<SecuritySectionProps> = ({ initialSecurity }) => {
    const { getToken } = useAuth()
    const original = initialSecurity ?? defaultSecurity

    const [settings, setSettings] = useState(original)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

    const isDirty = JSON.stringify(settings) !== JSON.stringify(original)

    const handleToggle = (key: keyof SecuritySettings, value: boolean) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
        setStatus('idle')
    }

    const handleCancel = () => {
        setSettings(original)
        setStatus('idle')
    }

    const handleSave = async () => {
        const token = await getToken()
        if (!token) return

        setSaving(true)
        const success = await updateSecuritySettings(token, settings)
        setSaving(false)
        setStatus(success ? 'saved' : 'error')
    }

    return (
        <SettingsSectionCard id='security' label='Security'>
            <div className='flex flex-col divide-y divide-[#F1F5F9]'>
                {toggleRows.map((row) => (
                    <div key={row.key} className='flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0'>
                        <div className='flex flex-col gap-1'>
                            <p className='dmSans-font text-sm font-semibold text-black'>{row.title}</p>
                            <p className='dmSans-font text-xs text-smallGreyText max-w-sm'>{row.description}</p>
                        </div>
                        <ToggleSwitch on={settings[row.key]} onToggle={(value) => handleToggle(row.key, value)} />
                    </div>
                ))}
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

export default SecuritySection
