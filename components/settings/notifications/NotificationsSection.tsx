'use client'

import { useAuth } from '@clerk/nextjs'
import { useState } from 'react'
import ToggleSwitch from '@/components/ToggleSwitch'
import { updateNotificationSettings } from '@/services/backend'
import type { NotificationSettings } from '@/types/notifications'
import SettingsSectionCard from '../SettingsSectionCard'

interface NotificationsSectionProps {
    initialSettings: NotificationSettings | null
}

const defaultSettings: NotificationSettings = {
    emailNotifications: true,
    inAppNotifications: true,
    pushNotifications: true,
    bookingUpdates: true,
    messages: true,
    assetReactions: true,
    payout: true,
}

const toggleRows: { key: keyof NotificationSettings; title: string; description: string }[] = [
    { key: 'emailNotifications', title: 'Email Notifications', description: 'Receive promotional emails and special offers' },
    { key: 'inAppNotifications', title: 'In-App Notifications', description: 'Allow in-app notifications' },
    { key: 'pushNotifications', title: 'Push Notifications', description: 'Allow browser push notifications' },
    { key: 'bookingUpdates', title: 'Booking Updates', description: 'Alert me on any new Booking Requests' },
    { key: 'messages', title: 'Messages', description: 'Alert me on any new messages.' },
    { key: 'assetReactions', title: 'Asset Reactions', description: 'Alert me when my asset gets a reaction' },
    { key: 'payout', title: 'Payout', description: 'Alert me on payout sent' },
]

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ initialSettings }) => {
    const { getToken } = useAuth()
    const original = initialSettings ?? defaultSettings

    const [settings, setSettings] = useState(original)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

    const isDirty = JSON.stringify(settings) !== JSON.stringify(original)

    const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
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
        const success = await updateNotificationSettings(token, settings)
        setSaving(false)
        setStatus(success ? 'saved' : 'error')
    }

    return (
        <SettingsSectionCard label='Notifications'>
            <div className='flex flex-col gap-3'>
                {toggleRows.map((row) => (
                    <div key={row.key} className='flex items-center justify-between gap-4 bg-nearWhiteBg rounded-2xl px-5 py-4'>
                        <div className='flex flex-col gap-1'>
                            <p className='dmSans-font text-sm font-semibold text-black'>{row.title}</p>
                            <p className='dmSans-font text-xs text-smallGreyText'>{row.description}</p>
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
                    className='dmSans-font text-sm font-medium px-5 py-2.5 rounded-full text-otherSmallText border border-[#EAECF0] disabled:opacity-40 cursor-pointer'
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

export default NotificationsSection
