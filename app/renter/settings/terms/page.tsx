import LegalDocLayout from '@/components/settings/legal/LegalDocLayout'
import { DocSection, DocParagraph, DocLead, DocList, DocListItem } from '@/components/settings/legal/DocElements'

const sections = [
    { id: 'welcome-acceptance', label: 'Welcome & Acceptance' },
    { id: 'key-definitions', label: 'Key Definitions' },
    { id: 'eligibility-account-registration', label: 'Eligibility and Account Registration' },
    { id: 'liability-limitation', label: "Rentrospect's Role: Limitation of Liability" },
    { id: 'rental-process-handover', label: 'Rental Process & Handover' },
    { id: 'bookings-payments-cancellations', label: 'Bookings, Payments and Cancellations' },
    { id: 'damages-loss-late-returns', label: 'Damages, Loss, and Late Returns' },
    { id: 'prohibited-uses', label: 'Prohibited Uses' },
    { id: 'reviews-reputation', label: 'Reviews & Reputation' },
    { id: 'disputes-between-users', label: 'Disputes Between Users' },
    { id: 'warranty-disclaimer', label: 'Warranty Disclaimer' },
    { id: 'limitation-of-liability', label: 'Limitation of Liability' },
    { id: 'indemnification', label: 'Indemnification' },
    { id: 'governing-law', label: 'Governing Law, Arbitration & Class Action Waiver' },
    { id: 'modifications', label: 'Modifications' },
]

export default function TermsSettingsPage() {
    return (
        <LegalDocLayout
            title='Terms of Service'
            docTitle='Terms of Service'
            sections={sections}
            copyright='© 2019 Rentrospect. All Rights Reserved.'
        >
            <DocSection id='welcome-acceptance' heading='1. Welcome and Acceptance'>
                <DocParagraph>
                    Welcome to Rentrospect. The following Terms of Service (&quot;Terms&quot;) constitute a binding legal
                    agreement between you (&quot;User,&quot; &quot;Renter,&quot; &quot;Vendor,&quot; or &quot;You&quot;) and
                    Rentrospect (&quot;We,&quot; &quot;Us,&quot; &quot;Our,&quot; or the &quot;Company&quot;), governing your
                    access to and use of the Rentrospect website, mobile application, and related services
                    (collectively, the &quot;Site&quot;).
                </DocParagraph>
                <DocParagraph>
                    PLEASE READ THESE TERMS CAREFULLY. By registering for an account, accessing, or using the Site, you
                    acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not
                    agree, you must not access or use the Site.
                </DocParagraph>
            </DocSection>

            <DocSection id='key-definitions' heading='2. Key Definitions'>
                <DocList>
                    <DocListItem><DocLead>Renter:</DocLead>A registered user who utilizes the platform to hire physical assets and equipment for events.</DocListItem>
                    <DocListItem><DocLead>Vendor:</DocLead>A registered business or individual who lists, offers, and rents out physical assets to Renters.</DocListItem>
                    <DocListItem><DocLead>Assets/Equipment:</DocLead>The physical items listed for rent by Vendors on the platform (e.g., marquees, plastic chairs, PA systems, lighting).</DocListItem>
                    <DocListItem><DocLead>Booking:</DocLead>The formal agreement between a Renter and a Vendor, initiated via the platform, for the rental of specified Assets for a specific duration.</DocListItem>
                    <DocListItem><DocLead>Rentrospect Wallet:</DocLead>The digital ledger representing the Vendor&apos;s cleared revenue from completed Bookings, available for withdrawal.</DocListItem>
                </DocList>
            </DocSection>

            <DocSection id='eligibility-account-registration' heading='3. Eligibility and Account Registration'>
                <DocParagraph>
                    <DocLead>3.1 General Eligibility.</DocLead>
                    The Site is available only to users who can form legally binding contracts under applicable law. By
                    using the Site, you represent and warrant that you are at least 18 years of age.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>3.2 Vendor Verification (KYC).</DocLead>
                    To operate as a Vendor, you must pass Rentrospect&apos;s verification process. This may require
                    submitting government-issued identification (e.g., Ghana Card), business registration documents,
                    and physical bases of operations. Rentrospect reserves the right to suspend or revoke Vendor
                    privileges if verification fails or is found to be fraudulent.
                </DocParagraph>
            </DocSection>

            <DocSection id='liability-limitation' heading="4. Rentrospect's Role: Limitation of Liability">
                <DocParagraph>
                    <DocLead>4.1 Marketplace Venue Only.</DocLead>
                    Rentrospect is strictly a marketplace venue that facilitates connections and transactions between
                    Renters and Vendors. Vendors are independent entities and not employees, partners, or agents of
                    Rentrospect. Rentrospect does not guarantee the quality, safety, or exact condition of the Assets
                    listed.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>4.2 In-Person Interactions.</DocLead>
                    Rentrospect facilitates physical rentals requiring in-person meetups or deliveries. You acknowledge
                    that Rentrospect does not background-check all users. Any in-person meeting or equipment handover is
                    conducted at your sole risk. Rentrospect expressly disclaims liability for any physical injury,
                    property damage, or theft.
                </DocParagraph>
            </DocSection>

            <DocSection id='rental-process-handover' heading='5. Rental Process & Handover'>
                <DocParagraph>
                    <DocLead>5.1 Pre-Payment Inspections (Meetups).</DocLead>
                    Rentrospect encourages Renters to inspect Assets prior to finalizing payment. If a &quot;Meetup&quot;
                    is scheduled via the app, the Renter will receive a secure QR Code.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>5.2 The Digital Handshake.</DocLead>
                    The Vendor must scan the Renter&apos;s QR Code at the physical meetup to verify the interaction. This
                    scan officially locks in the final Invoice and transitions the Booking to the payment stage.
                </DocParagraph>
            </DocSection>

            <DocSection id='bookings-payments-cancellations' heading='6. Bookings, Payments, and Cancellations'>
                <DocParagraph>
                    <DocLead>6.1 Escrow Payments.</DocLead>
                    Upon successful inspection or agreement, Renters must complete payment through the Rentrospect app.
                    Rentrospect holds these funds securely (acting as an escrow agent) until the rental period is
                    completed and the Assets are safely returned.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>6.2 Non-Circumvention Restriction.</DocLead>
                    You may not offer or accept cash payments or direct mobile money transfers outside of the
                    Rentrospect platform to bypass platform fees.
                </DocParagraph>
                <DocList>
                    <DocListItem><DocLead>Penalty:</DocLead>A violation is a material breach. The violating User&apos;s account will be permanently banned, and they lose all platform protections and guarantees.</DocListItem>
                </DocList>
                <DocParagraph>
                    <DocLead>6.3 Taxes:</DocLead>
                    Vendors are solely responsible for determining, collecting, and remitting any applicable taxes
                    (e.g., Value Added Tax) to the Ghana Revenue Authority (GRA).
                </DocParagraph>
            </DocSection>

            <DocSection id='damages-loss-late-returns' heading='7. Damages, Loss, and Late Returns'>
                <DocParagraph>
                    <DocLead>7.1 Renter Responsibility.</DocLead>
                    The Renter assumes full financial responsibility for the Vendor&apos;s Assets from the moment of
                    handover until the Assets are returned. Assets must be returned in the same condition they were
                    received, normal wear and tear excepted.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>7.2 Fees for Damages or Loss.</DocLead>
                    If a Vendor reports that an Asset has been damaged, destroyed, or lost while in the Renter&apos;s
                    possession, Rentrospect will initiate a dispute resolution process. If the Renter is found
                    responsible, the Renter agrees that Rentrospect may charge their saved payment method, or demand
                    immediate payment, for the repair or fair market replacement value of the Asset.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>7.3 Late Return Fees:</DocLead>
                    Bookings have strict return times. If a Renter fails to return the Assets by the agreed-upon time,
                    the Vendor reserves the right to charge late fees according to the daily rental rate for each day
                    the Asset is delayed, which Rentrospect will facilitate collecting from the Renter.
                </DocParagraph>
            </DocSection>

            <DocSection id='prohibited-uses' heading='8. Prohibited Uses'>
                <DocParagraph>Users may not use the platform to:</DocParagraph>
                <DocList>
                    <DocListItem>Rent out illegal, illicit, or hazardous equipment.</DocListItem>
                    <DocListItem>Misrepresent the condition, brand, or safety of an Asset.</DocListItem>
                    <DocListItem>Post adult-oriented content, hate speech, or discriminatory material.</DocListItem>
                </DocList>
            </DocSection>

            <DocSection id='reviews-reputation' heading='9. Reviews and Reputation'>
                <DocParagraph>
                    <DocLead>9.1 Truthful Feedback:</DocLead>
                    Reviews must be objective and based on actual rental experiences.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>9.2 Prohibited Review Manipulation:</DocLead>
                    Threatening a Vendor with a negative review to secure free days/discounts (Feedback Extortion), or
                    creating fake accounts to boost your own business ratings (Feedback Shilling), is strictly
                    prohibited and will result in account suspension.
                </DocParagraph>
            </DocSection>

            <DocSection id='disputes-between-users' heading='10. Disputes Between Users'>
                <DocParagraph>
                    <DocLead>10.1 Amicable Resolution:</DocLead>
                    In the event of a dispute (e.g., condition of returned chairs, late deliveries), Renters and Vendors
                    agree to first attempt to resolve the issue via the Rentrospect Resolution Center.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>10.2 Rentrospect&apos;s Role in Disputes:</DocLead>
                    If users cannot resolve a dispute regarding an Asset Booking, Rentrospect Customer Support will act
                    as a neutral mediator. You agree that Rentrospect&apos;s decision regarding the release of escrowed
                    funds, partial refunds, or damage assessments is final and binding on the platform.
                </DocParagraph>
            </DocSection>

            <DocSection id='warranty-disclaimer' heading='11. Warranty Disclaimer'>
                <DocParagraph>
                    THE SITE AND SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS.
                    RENTROSPECT EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
                    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE REGARDING ANY ASSETS
                    RENTED THROUGH THE PLATFORM.
                </DocParagraph>
            </DocSection>

            <DocSection id='limitation-of-liability' heading='12. Limitation of Liability'>
                <DocParagraph>
                    TO THE FULLEST EXTENT PERMITTED BY LAW, RENTROSPECT SHALL NOT BE LIABLE FOR ANY INDIRECT, PUNITIVE,
                    INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES. RENTROSPECT&apos;S TOTAL CUMULATIVE LIABILITY TO YOU
                    SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU TO RENTROSPECT IN THE SIX (6) MONTHS PRECEDING THE
                    CLAIM.
                </DocParagraph>
            </DocSection>

            <DocSection id='indemnification' heading='13. Indemnification'>
                <DocParagraph>
                    You agree to defend, indemnify, and hold harmless Rentrospect, its officers, and employees from any
                    claims, liabilities, and expenses arising from: (i) your use of the Site; (ii) your violation of
                    these Terms; or (iii) any physical injury, property damage, or loss of life caused by the setup, or
                    transportation of Assets booked through the platform.
                </DocParagraph>
            </DocSection>

            <DocSection id='governing-law' heading='14. Governing Law, Arbitration, and Class Action Waiver'>
                <DocParagraph>
                    <DocLead>14.1 Governing Law.</DocLead>
                    These Terms shall be governed by the laws of the Republic of Ghana, without regard to conflict of
                    law principles.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>14.2 Binding Arbitration.</DocLead>
                    Any dispute arising out of or in connection with these Terms shall be settled by binding
                    arbitration in Accra, Ghana, in accordance with the Alternative Dispute Resolution Act, 2010 (Act
                    798). The arbitration shall be conducted in English. Judgment on the award rendered by the
                    arbitrator may be entered in any court having jurisdiction.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>14.3 Class Action Waiver.</DocLead>
                    YOU AND RENTROSPECT AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS
                    INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE
                    PROCEEDING.
                </DocParagraph>
            </DocSection>

            <DocSection id='modifications' heading='15. Modifications'>
                <DocParagraph>
                    Rentrospect reserves the right to modify these Terms at any time. We will provide notice of
                    material changes. Your continued use of the Site following the posting of changes constitutes your
                    acceptance of the amended Terms.
                </DocParagraph>
            </DocSection>
        </LegalDocLayout>
    )
}
