import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import Image from 'next/image'
import NotificationsSection from '@/components/settings/notifications/NotificationsSection'
import { getNotificationSettings } from '@/services/backend'
import type { NotificationSettings } from '@/types/notifications'

export default async function NotificationsSettingsPage() {
    const { getToken } = await auth()
    const token = await getToken()

    let settings: NotificationSettings | null = null
    if (token) {
        settings = await getNotificationSettings(token)
    }

    return (
        <main className='flex flex-col pb-16'>
            <Link href='/renter/settings' className='flex items-center gap-2 mb-8 w-fit'>
                <Image width={8} height={13} alt='back' src='/svgs/chevron_left.svg' />
                <p className='montserrat-font text-base font-semibold text-black'>Notifications</p>
            </Link>

            <NotificationsSection initialSettings={settings} />
        </main>
    )
}
