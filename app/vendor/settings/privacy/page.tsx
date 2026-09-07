import LegalDocLayout from '@/components/settings/legal/LegalDocLayout'
import { DocSection, DocParagraph, DocLead, DocList, DocListItem } from '@/components/settings/legal/DocElements'

const sections = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'information-we-collect', label: 'Information We Collect' },
    { id: 'how-we-use-your-data', label: 'How We Use Your Data' },
    { id: 'security-limitation-of-liability', label: 'Security & Limitation of Liability' },
    { id: 'information-sharing-server-storage', label: 'Information Sharing & Server Storage' },
    { id: 'protection-of-minors', label: 'Protection of Minors (Age 13-17)' },
    { id: 'your-rights', label: 'Your Rights (GDPR)' },
    { id: 'data-retention', label: 'Data Retention' },
    { id: 'contact-us', label: 'Contact Us' },
    { id: 'eu-uk-users', label: 'For Users in the European Union (GDPR) & UK' },
    { id: 'california-residents', label: 'Notice to California Residents (CCPA/CPRA)' },
]

export default function PrivacySettingsPage() {
    return (
        <LegalDocLayout
            title='Privacy Policy'
            docTitle='Privacy Policy'
            sections={sections}
            copyright='© 2020 Rentrospect. All Rights Reserved.'
        >
            <DocSection id='introduction' heading='1. Introduction'>
                <DocParagraph>
                    Rentrospect (&quot;We,&quot; &quot;Us,&quot; &quot;Our&quot;) is committed to protecting your
                    privacy. We value the trust you place in us when sharing your personal data.
                </DocParagraph>
                <DocParagraph>
                    This Privacy Policy explains how we collect, use, and protect your information when you use the
                    Rentrospect website and mobile application (the &quot;Site&quot;). We facilitate a
                    community-centered marketplace for renting physical assets and equipment for events (e.g.,
                    weddings, funerals, naming ceremonies). We are a Data Controller registered under the Data
                    Protection Act, 2012 (Act 843) of the Republic of Ghana.
                </DocParagraph>
                <DocParagraph>
                    By using Rentrospect, you consent to the data practices described in this policy. If you do not
                    agree, please do not use the Site.
                </DocParagraph>
            </DocSection>

            <DocSection id='information-we-collect' heading='2. Information We Collect'>
                <DocParagraph>
                    We collect different types of information to provide our services, facilitate physical handovers,
                    and ensure the safety of our marketplace.
                </DocParagraph>
                <DocParagraph><DocLead>2.1 Information You Provide</DocLead></DocParagraph>
                <DocList>
                    <DocListItem><DocLead>Identity & Verification Data:</DocLead>Full name, date of birth, gender, profile photo, National ID details (e.g., Ghana Card number), and biometric liveness checks (selfies) for Vendor verification.</DocListItem>
                    <DocListItem><DocLead>Business Data (Vendors):</DocLead>Business name, base of operations, operating hours, and optional business registration certificates.</DocListItem>
                    <DocListItem><DocLead>Contact Data:</DocLead>Phone number, email address, and physical location/delivery addresses.</DocListItem>
                    <DocListItem><DocLead>Payment Data:</DocLead>Mobile Money (MoMo) numbers, bank account details, and transaction history.</DocListItem>
                    <DocListItem><DocLead>Rental Data:</DocLead>Messages sent to other users, booking details, meetup scheduling information, and reviews.</DocListItem>
                    <DocListItem><DocLead>Additional Information:</DocLead>Any other information you choose to provide, or that we deem necessary to verify your identity, resolve disputes over damaged Assets, or ensure platform security.</DocListItem>
                </DocList>
                <DocParagraph><DocLead>2.2 Information We Collect Automatically</DocLead></DocParagraph>
                <DocList>
                    <DocListItem><DocLead>Device Data:</DocLead>IP address, browser type, device model, and operating system.</DocListItem>
                    <DocListItem><DocLead>Usage & Interaction Data:</DocLead>Time spent on the app, pages visited, search queries, and logs of QR code scans generated during physical meetups.</DocListItem>
                    <DocListItem><DocLead>Location Data:</DocLead>With your permission, we collect or approximate location data to facilitate &quot;Meetup&quot; scheduling and equipment delivery routing.</DocListItem>
                    <DocListItem><DocLead>Cookies:</DocLead>Small text files stored on your device to remember your login and preferences.</DocListItem>
                </DocList>
            </DocSection>

            <DocSection id='how-we-use-your-data' heading='3. How We Use Your Data'>
                <DocParagraph>We use your data for the following specific purposes:</DocParagraph>
                <DocList>
                    <DocListItem><DocLead>Service Delivery:</DocLead>To match Renters with Vendors for equipment rental, generate Meetup QR codes, and process escrow payments.</DocListItem>
                    <DocListItem><DocLead>Identity Verification (KYC):</DocLead>To query national databases (via secure third-party APIs) to confirm the legal identity of our Vendors, establishing community trust and preventing fraud.</DocListItem>
                    <DocListItem><DocLead>Payment Processing:</DocLead>To facilitate secure payments and withdrawals between a Renter and Vendor only after a Meetup or Booking is initiated.</DocListItem>
                    <DocListItem><DocLead>Safety & Logistics:</DocLead>To share necessary contact details and delivery locations between a Renter and Vendor only after a Meetup or Booking is initiated.</DocListItem>
                    <DocListItem><DocLead>Dispute Resolution:</DocLead>To utilize chat logs, QR scan timestamps, and booking details to mediate disputes regarding damaged equipment or late returns.</DocListItem>
                </DocList>
            </DocSection>

            <DocSection id='security-limitation-of-liability' heading='4. Security and Limitation of Liability'>
                <DocParagraph>
                    <DocLead>4.1 Our Commitment:</DocLead>
                    We take the security of your data seriously. We use industry-standard technical and organizational
                    measures to protect your personal information, including encryption (SSL) and secure servers.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>4.2 NO GUARANTEE OF SECURITY:</DocLead>
                    While we strive to use commercially acceptable means to protect your Personal Data, no method of
                    transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee
                    its absolute security.
                </DocParagraph>
                <DocParagraph><DocLead>4.3 LIMITATION OF LIABILITY FOR BREACHES:</DocLead>To the fullest extent permitted by applicable law (including Act 843):</DocParagraph>
                <DocList>
                    <DocListItem>Rentrospect shall not be liable for any unauthorized access, hacking, data loss, or data breach caused by third-party criminal acts or events beyond our reasonable control.</DocListItem>
                    <DocListItem>In the event of a security breach, Rentrospect&apos;s total liability to you for any damages shall be limited to the amount explicitly set forth in our Terms of Service.</DocListItem>
                </DocList>
            </DocSection>

            <DocSection id='information-sharing-server-storage' heading='5. Information Sharing and Server Storage'>
                <DocParagraph>
                    <DocLead>5.1 Centralized Server Storage:</DocLead>
                    We operate from the Republic of Ghana, but we may store and process your data on secure cloud
                    servers located outside your country of residence. By using Rentrospect, you explicitly consent to
                    the transfer of your data to these secure international servers.
                </DocParagraph>
                <DocParagraph><DocLead>5.2 Third-Party Sharing:</DocLead>We do not sell your personal data. We only share it in the following circumstances:</DocParagraph>
                <DocList>
                    <DocListItem><DocLead>With Other Users:</DocLead>When you schedule a Meetup or confirm a Booking, we share your first name and necessary logistical details with the other party. We do not reveal your exact home address publicly on your profile.</DocListItem>
                    <DocListItem><DocLead>Service Providers:</DocLead>We share data with trusted third parties who help us operate (e.g., Payment Processors, Identity Verification APIs). They are bound by strict confidentiality agreements.</DocListItem>
                    <DocListItem><DocLead>Legal Requirements:</DocLead>We may disclose your data if required by a court, government request, or to assist law enforcement in cases of equipment theft or fraud.</DocListItem>
                </DocList>
            </DocSection>

            <DocSection id='protection-of-minors' heading='6. Protection of Minors (Age 13-17)'>
                <DocParagraph>
                    Rentrospect involves binding financial contracts and the rental of high-value physical equipment.
                    The platform is strictly for users aged 18 and older. We do not knowingly collect data from minors.
                    If we discover a minor has created an account, we will delete their data and terminate the account
                    immediately.
                </DocParagraph>
            </DocSection>

            <DocSection id='your-rights' heading='7. Your Rights (Ghana Data Protection Act)'>
                <DocParagraph>Under Act 843, you have specific rights regarding your data:</DocParagraph>
                <DocList>
                    <DocListItem><DocLead>Right to Access:</DocLead>You can ask for a copy of the data we hold about you.</DocListItem>
                    <DocListItem><DocLead>Right to Correction:</DocLead>You can update inaccurate information in your profile settings.</DocListItem>
                    <DocListItem><DocLead>Right to Erasure:</DocLead>You can request that we delete your account and data, subject to our retention policies outlined below.</DocListItem>
                    <DocListItem><DocLead>Right to Object:</DocLead>You can unsubscribe from marketing communications at any time.</DocListItem>
                </DocList>
            </DocSection>

            <DocSection id='data-retention' heading='8. Data Retention'>
                <DocParagraph>
                    We apply a general rule of keeping personal information only for as long as is required to perform
                    the purpose for which it was collected. We will retain personal information for the following
                    extended purposes:
                </DocParagraph>
                <DocList>
                    <DocListItem><DocLead>Operational Relevance:</DocLead>To maintain an accurate record of your dealings with us in the event of any complaints, damage disputes, or challenges.</DocListItem>
                    <DocListItem><DocLead>Legal & Fraud Compliance:</DocLead>To comply with applicable laws (including GRA tax requirements), prevent fraud, resolve disputes, and enforce our Site terms.</DocListItem>
                    <DocListItem><DocLead>Evidence:</DocLead>If necessary, to preserve evidence within the statutes of limitation.</DocListItem>
                </DocList>
            </DocSection>

            <DocSection id='contact-us' heading='9. Contact Us'>
                <DocParagraph>
                    If you have questions about this Privacy Policy or a data privacy request, please contact our Data
                    Protection Officer (DPO):
                </DocParagraph>
                <DocList>
                    <DocListItem><DocLead>Email:</DocLead>privacy@rentrospect.com</DocListItem>
                    <DocListItem><DocLead>Address:</DocLead>[Insert Your Office Address], Accra, Ghana.</DocListItem>
                </DocList>
            </DocSection>

            <DocSection id='eu-uk-users' heading='10. For Users in the European Union (GDPR) & UK'>
                <DocParagraph>
                    <DocLead>Legal Basis:</DocLead>
                    We process data based on Contractual Necessity (to fulfill Bookings), Legitimate Interest
                    (security/fraud prevention), and Consent (for precise location data).
                </DocParagraph>
                <DocParagraph>
                    <DocLead>Data Transfer:</DocLead>
                    We transfer your data to Ghana and our international servers based on Article 49(1)(b) GDPR
                    (necessary for the performance of the contract).
                </DocParagraph>
            </DocSection>

            <DocSection id='california-residents' heading='11. Notice to California Residents (CCPA/CPRA)'>
                <DocList>
                    <DocListItem><DocLead>Do Not Sell My Info:</DocLead>We do not sell data for money. You have the right to opt-out of &quot;sharing&quot; data for cross-context behavioral advertising.</DocListItem>
                    <DocListItem><DocLead>Sensitive Data:</DocLead>You may limit the use of your precise geolocation and biometric data to only what is necessary for the service.</DocListItem>
                </DocList>
            </DocSection>
        </LegalDocLayout>
    )
}
