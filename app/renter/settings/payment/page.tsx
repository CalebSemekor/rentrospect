import LegalDocLayout from '@/components/settings/legal/LegalDocLayout'
import { DocSection, DocParagraph, DocLead, DocList, DocListItem } from '@/components/settings/legal/DocElements'

const sections = [
    { id: 'agreement-definitions', label: 'Agreements & Definitions' },
    { id: 'payment-overview', label: 'Payment Overview & Localized Marketplace' },
    { id: 'platform-fees-commissions', label: 'Platform Fees & Commissions' },
    { id: 'payment-methods-renters', label: 'Payment Methods (Renters)' },
    { id: 'payouts-withdrawals-vendors', label: 'Payouts & Withdrawals (Vendors)' },
    { id: 'refunds-cancellations-disputes', label: 'Refunds, Cancellations & Disputes' },
    { id: 'chargebacks-payment-failures', label: 'Chargebacks & Payment Failures' },
    { id: 'taxes-compliance', label: 'Taxes & Compliance' },
    { id: 'miscellaneous', label: 'Miscellaneous' },
]

export default function PaymentSettingsPage() {
    return (
        <LegalDocLayout
            title='Payment Policy'
            docTitle='Payment Terms & Fee Schedule'
            sections={sections}
            copyright='© 2026 Rentrospect. All Rights Reserved.'
        >
            <DocSection id='agreement-definitions' heading='1. Agreement and Definitions'>
                <DocParagraph>
                    These Payment Terms (&quot;Payment Terms&quot;) govern all financial transactions on the
                    Rentrospect platform. These terms are fully incorporated into the Rentrospect Terms of Service. By
                    transacting on the Site, you agree to these rules.
                </DocParagraph>
                <DocList>
                    <DocListItem><DocLead>&quot;Rentrospect Wallet&quot;:</DocLead>The aggregate amount of funds available to a Vendor, consisting of cleared revenue from completed Bookings. This is a closed-loop digital record of value, not a bank account.</DocListItem>
                    <DocListItem><DocLead>&quot;Escrow Account&quot;:</DocLead>The secure holding account where Renter funds are locked during the active rental period.</DocListItem>
                </DocList>
            </DocSection>

            <DocSection id='payment-overview' heading='2. Payment Overview & Localized Marketplace'>
                <DocParagraph>
                    <DocLead>2.1 Local Currency Only:</DocLead>
                    All rental listings, delivery fees, and payouts are denominated in the local currency of the
                    Republic of Ghana (GHS).
                </DocParagraph>
                <DocParagraph>
                    <DocLead>2.2 The Escrow & QR Handover System:</DocLead>
                    To ensure transaction security for high-value physical assets without requiring upfront holding
                    rules:
                </DocParagraph>
                <DocList>
                    <DocListItem><DocLead>Inspection & Invoice:</DocLead>No funds are required to physically inspect an Asset. Payment is initiated after the Vendor scans the Renter&apos;s secure QR code and sends the final invoice.</DocListItem>
                    <DocListItem><DocLead>Funds Locked (Escrow):</DocLead>Once the Renter approves the invoice and pays via the app, that amount is locked securely in Rentrospect&apos;s Escrow Account.</DocListItem>
                    <DocListItem><DocLead>Clearance:</DocLead>Funds are transferred to the Vendor&apos;s Wallet only after the rental period concludes, and the Safety Clearance Period (Section 5.2) expires without dispute.</DocListItem>
                </DocList>
            </DocSection>

            <DocSection id='platform-fees-commissions' heading='3. Platform Fees & Commissions'>
                <DocParagraph>
                    Rentrospect charges fees to maintain the platform, verify rental businesses, provide the equipment
                    guarantee, and cover third-party processing costs.
                </DocParagraph>
                <DocParagraph><DocLead>3.1 Vendor Service Fee (Platform Fee):</DocLead>A standard commission fee (e.g., 10%) is deducted from the Vendor&apos;s total booking payout.</DocParagraph>
                <DocList>
                    <DocListItem><DocLead>Example:</DocLead>A Vendor completes a GHS 1,000 order. Rentrospect deducts 10% (GHS 100). The Vendor receives GHS 900 in their Rentrospect Wallet.</DocListItem>
                </DocList>
                <DocParagraph>
                    <DocLead>3.2 Renter Service Fee:</DocLead>
                    A small processing fee (e.g., 4%) is added to the total Booking amount at checkout to secure
                    payment gateway costs.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>3.3 Custom Fees & Adjustments:</DocLead>
                    Vendors have the authority to add custom Delivery Fees or Late Fees to the final invoice prior to
                    the Renter&apos;s payment. These additions are subject to the standard Vendor Commission.
                </DocParagraph>
            </DocSection>

            <DocSection id='payment-methods-renters' heading='4. Payment Methods (Renters)'>
                <DocParagraph>
                    <DocLead>4.1 Third-Party Payment Processors:</DocLead>
                    Rentrospect uses integrated third-party service providers (e.g., Paystack, Hubtel) to process
                    payments. Rentrospect is not liable for transaction failures or network downtimes caused by the
                    third-party provider or your mobile network operator.
                </DocParagraph>
                <DocParagraph><DocLead>4.2 Supported Payment Methods:</DocLead>You may fund your Bookings using valid local payment methods:</DocParagraph>
                <DocList>
                    <DocListItem>Mobile Money Wallets (MTN MoMo, Telecel Cash, AT Money).</DocListItem>
                    <DocListItem>Local Bank/Debit Cards.</DocListItem>
                </DocList>
                <DocParagraph>
                    <DocLead>Note:</DocLead>
                    We do not accept cash payments for Bookings. Paying a Vendor in cash circumvents platform
                    protections and violates our Terms of Service.
                </DocParagraph>
            </DocSection>

            <DocSection id='payouts-withdrawals-vendors' heading='5. Payouts & Withdrawals (Vendors)'>
                <DocParagraph><DocLead>5.1 Withdrawal Rules:</DocLead></DocParagraph>
                <DocList>
                    <DocListItem><DocLead>Source:</DocLead>Withdrawals are deducted from your Rentrospect Wallet.</DocListItem>
                    <DocListItem><DocLead>Destination:</DocLead>You may withdraw funds to a verified local bank account or mobile money registered in the exact name of the Vendor or business owner (as verified by your Ghana Card).</DocListItem>
                </DocList>
                <DocParagraph>
                    <DocLead>5.2 Safety Clearance Period:</DocLead>
                    Funds from completed Bookings are marked as &quot;Pending&quot; in the Vendor Wallet for a period of
                    48 hours after the scheduled return date of the Assets. This window allows the Vendor to report any
                    damages or late returns before funds are finalized.
                </DocParagraph>
            </DocSection>

            <DocSection id='refunds-cancellations-disputes' heading='6. Refunds, Cancellations & Disputes'>
                <DocParagraph>
                    <DocLead>6.1 Pre-Payment Cancellation:</DocLead>
                    Because no holding fees are charged, Renters or Vendors may cancel a scheduled Meetup at any time
                    without financial penalty.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>6.2 Post-Payment Cancellation:</DocLead>
                    If a Booking is cancelled after payment is locked in Escrow but before the event date, refunds are
                    processed according to the Vendor&apos;s specific Cancellation Policy displayed on their profile.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>6.3 Dispute Resolution:</DocLead>
                    If disputes arise regarding damaged equipment, late returns, or missing items, you agree to use the
                    Rentrospect Resolution Center. Rentrospect&apos;s decision regarding the release of escrowed funds,
                    partial refunds, or damage deductions is final and binding.
                </DocParagraph>
            </DocSection>

            <DocSection id='chargebacks-payment-failures' heading='7. Chargebacks & Payment Failures'>
                <DocParagraph>
                    <DocLead>7.1 Strict Ban on Chargebacks:</DocLead>
                    Filing a dispute directly with your bank or Mobile Money provider (a Chargeback) instead of using
                    Rentrospect Support is a material breach of these terms.
                </DocParagraph>
                <DocList>
                    <DocListItem><DocLead>Consequence:</DocLead>Your account will be permanently suspended, and we will contest the chargeback using the logged QR code scan and digital invoice as proof of service.</DocListItem>
                </DocList>
                <DocParagraph>
                    <DocLead>7.2 Payment Failures:</DocLead>
                    If a Renter&apos;s payment fails or is reversed by the bank after equipment has been handed over,
                    Rentrospect reserves the right to suspend the Renter&apos;s account and pursue collection of the
                    debt.
                </DocParagraph>
            </DocSection>

            <DocSection id='taxes-compliance' heading='8. Taxes & Compliance'>
                <DocParagraph>
                    <DocLead>8.1 User Responsibility:</DocLead>
                    Rentrospect is a marketplace facilitator. Vendors are entirely independent businesses and are
                    solely responsible for determining their applicable tax liability, reporting income to the Ghana
                    Revenue Authority (GRA), and paying applicable Income Tax or VAT.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>8.2 Platform Compliance:</DocLead>
                    Rentrospect complies with local financial regulations and retains the right to withhold taxes if
                    mandated by future government legislation.
                </DocParagraph>
            </DocSection>

            <DocSection id='miscellaneous' heading='9. Miscellaneous'>
                <DocParagraph>
                    <DocLead>9.1 Dormant Accounts:</DocLead>
                    If a Vendor Wallet holds a balance but the account remains entirely inactive for 12 months,
                    Rentrospect reserves the right to charge a monthly administrative fee to cover ledger maintenance
                    costs.
                </DocParagraph>
                <DocParagraph>
                    <DocLead>9.2 Policy Updates:</DocLead>
                    Rentrospect reserves the right to modify these Payment Terms or Fees at any time. Material changes
                    will be notified via email or a site banner. Continued use of the Site constitutes acceptance.
                </DocParagraph>
            </DocSection>
        </LegalDocLayout>
    )
}
