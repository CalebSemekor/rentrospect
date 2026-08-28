export interface CoreValue {
    id: string
    title: string
    image: string
    description: string
}

export const coreValues: CoreValue[] = [
    {
        id: 'trust-first',
        title: 'Trust First',
        image: '/images/about/trust.png',
        description: 'We believe that trust is the foundation of any successful partnership. We prioritize transparency and open communication in all our interactions.',
    },
    {
        id: 'community-rooted',
        title: 'Community-Rooted',
        image: '/images/about/community.png',
        description: 'We are deeply invested in the communities we serve. We actively seek opportunities to give back and support local initiatives that create positive change.',
    },
    {
        id: 'zero-friction',
        title: 'Zero Friction',
        image: '/images/about/friction.png',
        description: 'We strive to eliminate obstacles and streamline processes. We are dedicated to providing seamless experiences that empower our partners to thrive without unnecessary complications.',
    },
]

export interface AboutFeature {
    id: string
    title: string
    description: string
    image: string
    imagePosition: 'left' | 'right'
}

export const aboutFeatures: AboutFeature[] = [
    {
        id: 'community-hub',
        title: 'Community-Centered Rental Hub',
        description: 'Built entirely around your event’s success. From elegant marquees to bulk seating, every listing is designed to connect you with reliable local vendors for weddings, funerals, and community gatherings—stress-free and without upfront holding fees.',
        image: '/svgs/about/community.svg',
        imagePosition: 'right',
    },
    {
        id: 'vendor-analytics',
        title: 'Smart Vendor Analytics',
        description: 'Insights that help your rental business scale. Track your profile views, asset popularity, booking completion rates, and average response times. These analytics help you understand seasonal demand, optimize your inventory pricing, and build community trust through measurable performance.',
        image: '/svgs/about/vendor_analytics.svg',
        imagePosition: 'left',
    },
    {
        id: 'visual-catalog',
        title: 'Visual Catalog & Event Showcase',
        description: 'Your equipment deserves the spotlight. Build a stunning digital storefront that grows with your business. Upload high-quality photos of your inventory and showcase your best event setups—giving clients absolute confidence in your quality before they even request a meetup.',
        image: '/svgs/about/catalog.svg',
        imagePosition: 'right',
    },
    {
        id: 'verified-vendors',
        title: 'Verified Vendor Network',
        description: 'A dedicated space for trusted local businesses. Every vendor profile is strictly validated using official IDs (like the Ghana Card), creating a secure ecosystem where clients know they are renting from reliable, established professionals for their most important days.',
        image: '/svgs/about/verified.svg',
        imagePosition: 'left',
    },
]
