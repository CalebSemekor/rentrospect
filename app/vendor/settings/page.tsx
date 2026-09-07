import { currentUser } from '@clerk/nextjs/server'
import SettingsHeader from '@/components/settings/SettingsHeader'
import SettingsCard from '@/components/settings/SettingsCard'
import SettingsGroup from '@/components/settings/SettingsGroup'
import { settingsGroupOrder, vendorSettingsItems } from '@/constants/settings'

const SettingsPage = async () => {
    const user = await currentUser()

    const name = user?.fullName || 'Guest'
    const email = user?.primaryEmailAddress?.emailAddress || ''
    const avatar = user?.imageUrl || '/images/Avatar.png'
    const verified = user?.primaryEmailAddress?.verification?.status === 'verified'

    return (
        <main className='flex flex-col pb-16'>
            <SettingsHeader name={name} email={email} avatar={avatar} verified={verified} />

            {/* Desktop grid */}
            <div className='hidden md:grid grid-cols-3 gap-4'>
                {vendorSettingsItems.map((item) => (
                    <SettingsCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        href={item.href}
                    />
                ))}
            </div>

            {/* Mobile grouped list */}
            <div className='flex md:hidden flex-col gap-5'>
                {settingsGroupOrder.map((group) => (
                    <SettingsGroup
                        key={group}
                        label={group}
                        items={vendorSettingsItems.filter((item) => item.group === group)}
                    />
                ))}
            </div>
        </main>
    )
}

export default SettingsPage
