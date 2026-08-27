import type { FaqCategory } from '@/types/faqs'

// Static reference copy — not user-specific, so no backend fetch. Only
// "Creating Listings" has been given real copy so far; the rest are
// reasonable placeholders to swap out once real answers are written.
export const faqCategories: FaqCategory[] = [
    {
        id: 'getting-started',
        label: 'Getting Started',
        topics: [
            {
                id: 'account-setup',
                label: 'Account Setup',
                items: [
                    { question: 'How do I create a Rentrospect account?', answer: 'Sign up with your email or phone number, verify your identity, and choose whether you\'re renting or vendoring items.' },
                    { question: 'Can I switch between a renter and vendor account?', answer: 'Yes — you can apply to become a vendor from your profile at any time without losing your renter history.' },
                    { question: 'Is Rentrospect free to join?', answer: 'Creating an account is free. Vendors only pay a small service fee once a rental is completed.' },
                ],
            },
            {
                id: 'using-rentrospect',
                label: 'Using Rentrospect',
                items: [
                    { question: 'How do I search for items to rent?', answer: 'Use the search bar or browse by category from the home page to find items available near you.' },
                    { question: 'Can I save items for later?', answer: 'Tap the heart icon on any listing to add it to your favorites for quick access later.' },
                ],
            },
            {
                id: 'eligibility',
                label: 'Eligibility',
                items: [
                    { question: 'Who can rent on Rentrospect?', answer: 'Anyone 18 or older with a verified account can rent items on the platform.' },
                    { question: 'Do I need ID verification to rent?', answer: 'Some high-value items require ID verification before booking — you\'ll be prompted if it\'s needed.' },
                ],
            },
        ],
    },
    {
        id: 'bookings',
        label: 'Bookings',
        topics: [
            {
                id: 'creating-listings',
                label: 'Creating Listings',
                items: [
                    { question: 'What is a listing on Rentrospect?', answer: 'A listing is an item you make available for other people to rent, including its photos, price, and availability.' },
                    { question: 'Who can create a listing?', answer: 'Any verified vendor account can create listings from the Upload section of their dashboard.' },
                    { question: 'How many items can I list in my catalog?', answer: 'There\'s no limit — you can list as many items as you have available to rent.' },
                    { question: 'What should I include in my item description?', answer: 'Include condition, dimensions, what\'s included, and any usage instructions so renters know exactly what to expect.' },
                    { question: 'How do I price my rental items?', answer: 'Set a rate per hour, day, week, or month based on what similar items in your area typically charge.' },
                    { question: 'Can I edit my listing after publishing?', answer: 'Yes, you can update pricing, photos, and details at any time from your asset management page.' },
                    { question: 'Can I pause or hide a listing temporarily?', answer: 'Yes — toggle a listing to "paused" and it will stop appearing in search results until you reactivate it.' },
                    { question: 'What categories should I choose for my items?', answer: 'Pick the category that best matches your item so renters searching that category can find it.' },
                    { question: 'Do I need professional photos to create a listing?', answer: 'No, but clear, well-lit photos taken from multiple angles significantly improve your booking rate.' },
                    { question: 'How does the booking process work for my items?', answer: 'A renter requests dates, you confirm availability, and payment is held in escrow until the rental period ends.' },
                    { question: 'What happens when a Renter messages me before booking?', answer: 'You\'ll get a notification and can reply directly in-app to answer questions before they confirm a booking.' },
                    { question: 'Can I delete a listing?', answer: 'Yes, you can permanently remove a listing from your catalog at any time, as long as it has no active bookings.' },
                ],
            },
            {
                id: 'booking-orders',
                label: 'Booking Orders',
                items: [
                    { question: 'How do I view my booking orders?', answer: 'Go to Rentals from your dashboard to see all upcoming, active, and past bookings.' },
                    { question: 'Can I cancel a booking after confirming it?', answer: 'Yes, but cancellation fees may apply depending on how close it is to the rental start date.' },
                ],
            },
            {
                id: 'order-tracking',
                label: 'Order Tracking',
                items: [
                    { question: 'How do I track the status of my order?', answer: 'Each booking shows a live status — requested, confirmed, in progress, or completed — on your Rentals page.' },
                    { question: 'Will I get notified about order updates?', answer: 'Yes, you\'ll receive an in-app and email notification whenever your order status changes.' },
                ],
            },
            {
                id: 'cancellations-disputes',
                label: 'Cancellations & Disputes',
                items: [
                    { question: 'What if the item isn\'t as described?', answer: 'Open a dispute from the order page within 24 hours of pickup and our team will step in to help.' },
                    { question: 'How are refunds handled for cancellations?', answer: 'Refunds are processed back to your original payment method within 5-7 business days.' },
                ],
            },
        ],
    },
    {
        id: 'payments-wallet',
        label: 'Payments & Wallet',
        topics: [
            {
                id: 'wallet-balances',
                label: 'Wallet Balances',
                items: [
                    { question: 'What is my available balance?', answer: 'Your available balance is money you can withdraw now, separate from funds still held in escrow for active rentals.' },
                    { question: 'Why is some of my balance in escrow?', answer: 'Payments are held in escrow until the rental period completes to protect both renters and vendors.' },
                ],
            },
            {
                id: 'payments',
                label: 'Payments',
                items: [
                    { question: 'What payment methods are accepted?', answer: 'We accept major debit/credit cards and mobile money, depending on your region.' },
                    { question: 'When am I charged for a booking?', answer: 'You\'re charged when the vendor confirms your booking request, not when you first submit it.' },
                ],
            },
            {
                id: 'withdrawals',
                label: 'Withdrawals',
                items: [
                    { question: 'How do I withdraw my earnings?', answer: 'Go to your Wallet and tap Withdraw to transfer your available balance to your linked bank account or mobile money.' },
                    { question: 'How long do withdrawals take?', answer: 'Withdrawals are typically processed within 1-3 business days.' },
                ],
            },
        ],
    },
    {
        id: 'messaging-communication',
        label: 'Messaging & Communication',
        topics: [
            {
                id: 'enquiries',
                label: 'Enquiries',
                items: [
                    { question: 'How do I ask a vendor a question before booking?', answer: 'Tap Message on any listing to start a conversation with the vendor before you commit to a booking.' },
                ],
            },
            {
                id: 'chat',
                label: 'Chat',
                items: [
                    { question: 'Where do I find my conversations?', answer: 'All your conversations are available under the Messages tab in the main navigation.' },
                    { question: 'Can I share photos in chat?', answer: 'Yes, you can attach photos to any message, which is useful for confirming item condition.' },
                ],
            },
            {
                id: 'professional-contact',
                label: 'Professional Contact',
                items: [
                    { question: 'Can I call a vendor directly?', answer: 'If a vendor has enabled in-app calls, you\'ll see a call icon on their profile.' },
                ],
            },
        ],
    },
    {
        id: 'reviews-ratings',
        label: 'Reviews & Ratings',
        topics: [
            {
                id: 'leaving-reviews',
                label: 'Leaving Reviews',
                items: [
                    { question: 'When can I leave a review?', answer: 'You can leave a review once a rental period has ended and the item has been returned.' },
                ],
            },
            {
                id: 'viewing-reviews',
                label: 'Viewing Reviews',
                items: [
                    { question: 'Where can I see reviews for an item?', answer: 'Reviews appear on the vendor\'s profile page under the Reviews tab for each of their assets.' },
                ],
            },
            {
                id: 'ratings-system',
                label: 'Ratings System',
                items: [
                    { question: 'How is a vendor\'s overall rating calculated?', answer: 'It\'s the average of all star ratings left across their published reviews.' },
                ],
            },
            {
                id: 'disputes-reporting-reviews',
                label: 'Disputes or Reporting Reviews',
                items: [
                    { question: 'Can I report an unfair review?', answer: 'Yes, use the report option on any review and our team will review it against our content guidelines.' },
                ],
            },
        ],
    },
    {
        id: 'referrals-rewards',
        label: 'Referrals & Rewards',
        topics: [
            {
                id: 'inviting-friends',
                label: 'Inviting Friends',
                items: [
                    { question: 'How do I invite friends to Rentrospect?', answer: 'Share your referral link from the Rewards section — it\'s unique to your account.' },
                ],
            },
            {
                id: 'earning',
                label: 'Earning',
                items: [
                    { question: 'What do I earn for a successful referral?', answer: 'You and your friend each receive wallet credit once they complete their first booking.' },
                ],
            },
            {
                id: 'limits-policies',
                label: 'Limits & Policies',
                items: [
                    { question: 'Is there a limit to how many friends I can refer?', answer: 'No, there\'s no cap — you earn credit for every friend who completes a first booking.' },
                ],
            },
        ],
    },
    {
        id: 'account-security',
        label: 'Account & Security',
        topics: [
            {
                id: 'account-settings',
                label: 'Account Settings',
                items: [
                    { question: 'Where do I update my personal details?', answer: 'Go to Settings → Account to update your name, email, delivery location, and phone number.' },
                ],
            },
            {
                id: 'security',
                label: 'Security',
                items: [
                    { question: 'How do I change my password?', answer: 'Go to Settings → Account → Password and enter your current and new password.' },
                    { question: 'Can I enable two-factor authentication?', answer: 'Yes, toggle Enable 2FA under Settings → Account → Security.' },
                ],
            },
            {
                id: 'privacy',
                label: 'Privacy',
                items: [
                    { question: 'Who can see my profile information?', answer: 'Only your public profile details are visible to others — private information like payment details is never shared.' },
                ],
            },
        ],
    },
]
