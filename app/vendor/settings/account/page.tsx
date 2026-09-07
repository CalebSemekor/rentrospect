import { auth } from '@clerk/nextjs/server'
import AccountSettingsClient from '@/components/settings/account/AccountSettingsClient'
import { getAccountDetails, getSecuritySettings } from '@/services/backend'
import type { AccountDetails, SecuritySettings } from '@/types/account'

export default async function AccountSettingsPage() {
    const { getToken } = await auth()
    const token = await getToken()

    let account: AccountDetails | null = null
    let security: SecuritySettings | null = null

    if (token) {
        [account, security] = await Promise.all([
            getAccountDetails(token),
            getSecuritySettings(token),
        ])
    }

    return <AccountSettingsClient initialAccount={account} initialSecurity={security} />
}
