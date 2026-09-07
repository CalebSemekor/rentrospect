export type SettingsGroupLabel = 'Profile & Account' | 'Help & Support' | 'Legal' | 'Billing' | 'General'

export interface SettingsItem {
    id: string
    title: string
    description: string
    icon: string
    href: string
    group: SettingsGroupLabel
}

export const settingsGroupOrder: SettingsGroupLabel[] = [
    'Profile & Account',
    'Help & Support',
    'Legal',
    'Billing',
    'General',
]

const genericDescription = 'Provide personal details and how we can reach you'

export const settingsItems: SettingsItem[] = [
    {
        id: 'account',
        title: 'Account',
        description: genericDescription,
        icon: '/svgs/settings/account.svg',
        href: '/renter/settings/account',
        group: 'Profile & Account',
    },
    {
        id: 'notifications',
        title: 'Notifications',
        description: genericDescription,
        icon: '/svgs/bell.svg',
        href: '/renter/settings/notifications',
        group: 'Profile & Account',
    },
    {
        id: 'faqs',
        title: 'FAQs',
        description: genericDescription,
        icon: '/svgs/settings/faq.svg',
        href: '/renter/settings/faqs',
        group: 'Help & Support',
    },
    {
        id: 'contact-support',
        title: 'Contact Support',
        description: genericDescription,
        icon: '/svgs/settings/headset.svg',
        href: '/renter/settings/contact-support',
        group: 'Help & Support',
    },
    {
        id: 'terms',
        title: 'Terms & Conditions',
        description: genericDescription,
        icon: '/svgs/settings/document.svg',
        href: '/renter/settings/terms',
        group: 'Legal',
    },
    {
        id: 'privacy',
        title: 'Privacy Policy',
        description: genericDescription,
        icon: '/svgs/settings/shield.svg',
        href: '/renter/settings/privacy',
        group: 'Legal',
    },
    {
        id: 'payment',
        title: 'Payment',
        description: 'Review payments, payouts, coupons, and gift cards',
        icon: '/svgs/settings/card.svg',
        href: '/renter/settings/payment',
        group: 'Billing',
    },
    {
        id: 'manage-plan',
        title: 'Manage Plan',
        description: genericDescription,
        icon: '/svgs/settings/briefcase.svg',
        href: '/renter/settings/manage-plan',
        group: 'Billing',
    },
    {
        id: 'upgrade-plan',
        title: 'Upgrade Plan',
        description: genericDescription,
        icon: '/svgs/settings/arrow-up-circle.svg',
        href: '/renter/settings/upgrade-plan',
        group: 'Billing',
    },
    {
        id: 'about-us',
        title: 'About Us',
        description: genericDescription,
        icon: '/svgs/settings/info.svg',
        href: '/renter/settings/about-us',
        group: 'General',
    },
]
export const vendorSettingsItems: SettingsItem[] = [
    {
        id: 'account',
        title: 'Account',
        description: genericDescription,
        icon: '/svgs/settings/account.svg',
        href: '/vendor/settings/account',
        group: 'Profile & Account',
    },
    {
        id: 'notifications',
        title: 'Notifications',
        description: genericDescription,
        icon: '/svgs/bell.svg',
        href: '/vendor/settings/notifications',
        group: 'Profile & Account',
    },
    {
        id: 'faqs',
        title: 'FAQs',
        description: genericDescription,
        icon: '/svgs/settings/faq.svg',
        href: '/vendor/settings/faqs',
        group: 'Help & Support',
    },
    {
        id: 'contact-support',
        title: 'Contact Support',
        description: genericDescription,
        icon: '/svgs/settings/headset.svg',
        href: '/vendor/settings/contact-support',
        group: 'Help & Support',
    },
    {
        id: 'terms',
        title: 'Terms & Conditions',
        description: genericDescription,
        icon: '/svgs/settings/document.svg',
        href: '/vendor/settings/terms',
        group: 'Legal',
    },
    {
        id: 'privacy',
        title: 'Privacy Policy',
        description: genericDescription,
        icon: '/svgs/settings/shield.svg',
        href: '/vendor/settings/privacy',
        group: 'Legal',
    },
    {
        id: 'payment',
        title: 'Payment',
        description: 'Review payments, payouts, coupons, and gift cards',
        icon: '/svgs/settings/card.svg',
        href: '/vendor/settings/payment',
        group: 'Billing',
    },
    {
        id: 'manage-plan',
        title: 'Manage Plan',
        description: genericDescription,
        icon: '/svgs/settings/briefcase.svg',
        href: '/vendor/settings/manage-plan',
        group: 'Billing',
    },
    {
        id: 'upgrade-plan',
        title: 'Upgrade Plan',
        description: genericDescription,
        icon: '/svgs/settings/arrow-up-circle.svg',
        href: '/vendor/settings/upgrade-plan',
        group: 'Billing',
    },
    {
        id: 'about-us',
        title: 'About Us',
        description: genericDescription,
        icon: '/svgs/settings/info.svg',
        href: '/vendor/settings/about-us',
        group: 'General',
    },
]
