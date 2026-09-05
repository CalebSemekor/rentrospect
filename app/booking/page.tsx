"use client";

import LoadingDialog from "./loading";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import BookingInputField from "@/components/BookingInputField";
import { RentalAssetCard } from "@/components/RentalAssetCard";
import { DiscountCodeInput } from "@/components/DiscountCodeInput";
import PaymentSuccessDialog from "@/components/PaymentSuccessDialog";
import { makeEscrowDeposit, verifySession } from "@/services/backend";
import { PaymentMethodTile, PaymentMethodType } from "@/components/PaymentMethodTile";
import { computeDays, computeLineTotal, computeSecurityDeposit } from "@/utils/pricing";

// ── Example SVG icons ────────────────────────────────────────────────────────

const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const DurationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

// ── Payment methods (not yet backed by a real "saved cards" endpoint) ───────

const PAYMENT_METHODS: { id: string; maskedNumber: string; methodType: PaymentMethodType }[] = [
  { id: "visa-8304", maskedNumber: "8304", methodType: "card" },
  { id: "momo-8304", maskedNumber: "8304", methodType: "momo" },
];

// Two separate platform-side fees, both a % of the subtotal: Aza's own
// payment-processing cut (see `payments.aza_session_id` in the schema) and
// Rentrospect's own service fee. NOTE: this no longer matches the single
// "~4% Renter Service Fee" line item quoted in the Payment Terms page
// (Section 3.2) — that copy should be updated to reflect the 1.5% + 1% split
// once it's final.
const AZA_FEE_RATE = 0.015;
const RENTROSPECT_FEE_RATE = 0.01;
const DISCOUNT_RATE = 0.1;

const pricingUnitAbbrev = (unit: string) =>
  unit === "week" ? "wk" : unit === "semester" ? "sem" : unit === "month" ? "mth" : unit;

// "25-02-2025, 13:22:18" — matches PaymentSuccessDialog's documented format.
const formatPaymentTime = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// Not surfaced as a choice anywhere in this flow yet — every booking made
// here is a straight rental, not a consultation.
const CONSULTATION_MODE = 1;

// ── Page ─────────────────────────────────────────────────────────────────────

function CheckoutPageInner() {
  const searchParams = useSearchParams();
  const { getToken } = useAuth();

  // Everything the asset details page hands over via the URL when the renter
  // taps "Place order" there.
  const assetId = searchParams.get("assetId") ?? "";
  const name = searchParams.get("name") ?? "";
  const image = searchParams.get("image") ?? "/images/Avatar.png";
  const rate = Number(searchParams.get("rate") ?? 0);
  const pricingUnit = searchParams.get("pricingUnit") ?? "day";
  const quantity = Number(searchParams.get("quantity") ?? 1);
  // Per-unit deposit as listed on the asset — scaled below by the same
  // bulk-quantity tapering the rental rate uses, not multiplied straight
  // through by quantity.
  const baseSecurityDeposit = Number(searchParams.get("securityDeposit") ?? 0);
  const paramStartDate = searchParams.get("startDate") ?? "";
  const paramEndDate = searchParams.get("endDate") ?? "";

  const [isPaying, setIsPaying] = useState(false);
  const [startDate, setStartDate] = useState(paramStartDate);
  const [endDate, setEndDate] = useState(paramEndDate);
  const [paymentResult, setPaymentResult] = useState<null | {
    amount: string;
    refNumber: string;
    paymentTime: string;
    paymentMethod: string;
    senderName: string;
    totalAmount: string;
  }>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState("visa-8304");

  const hasOrder = Boolean(assetId);

  const days = useMemo(() => computeDays(startDate, endDate), [startDate, endDate]);

  // Day-priced assets use the degressive tiered rate; week/month/semester
  // pricing still uses a flat units × rate, since no tiering was specified
  // for those. The bulk-quantity discount applies on top of either — see
  // utils/pricing.ts, shared with the asset details page so both agree on
  // the same total.
  const lineTotal = useMemo(
    () => computeLineTotal(rate, quantity, pricingUnit, startDate, endDate),
    [rate, quantity, pricingUnit, startDate, endDate]
  );

  const securityDeposit = useMemo(
    () => computeSecurityDeposit(baseSecurityDeposit, quantity),
    [baseSecurityDeposit, quantity]
  );

  // Always expressed in days, regardless of the asset's own pricingUnit —
  // this is just "how long is the renter booking it for", shown back to
  // them next to Start/End Date.
  const durationLabel = useMemo(() => {
    if (!startDate || !endDate) return '';
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }, [startDate, endDate, days]);

  const orderItems = hasOrder
    ? [
        {
          id: assetId,
          src: image,
          title: name,
          price: `₵${lineTotal.toFixed(2)}`,
          quantity,
          rate: `₵${rate}/${pricingUnitAbbrev(pricingUnit)}`,
        },
      ]
    : [];

  const subtotal = lineTotal;
  const azaFee = subtotal * AZA_FEE_RATE;
  const rentrospectFee = subtotal * RENTROSPECT_FEE_RATE;
  const discountAmount = appliedCode ? subtotal * DISCOUNT_RATE : 0;
  // Held alongside the rental cost, not a % fee, so it isn't part of what
  // the Aza/Rentrospect fees or the discount are computed against.
  const total = Math.max(0, subtotal + azaFee + rentrospectFee - discountAmount + securityDeposit);

  const summaryRows: [string, string][] = [
    ["Subtotal", `₵${subtotal.toFixed(2)}`],
    ["Aza Fee (1.5%)", `₵${azaFee.toFixed(2)}`],
    ["Rentrospect Fee (1%)", `₵${rentrospectFee.toFixed(2)}`],
    ...(appliedCode ? ([["Discount (10%)", `-₵${discountAmount.toFixed(2)}`]] as [string, string][]) : []),
    ...(securityDeposit > 0 ? ([["Security Deposit", `₵${securityDeposit.toFixed(2)}`]] as [string, string][]) : []),
  ];

  const handlePay = async () => {
    if (!hasOrder || !startDate || !endDate) return;

    setIsPaying(true);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Not signed in");
      }

      // Trusted user id from the verified session, not anything the client
      // could tamper with — same rule the vendor upload flow follows.
      const session = await verifySession(token);

      const result = await makeEscrowDeposit(token, {
        userId: session.user_id,
        assetId,
        amount: Number(total.toFixed(2)),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        consultationMode: CONSULTATION_MODE,
        securityDeposit: Number(securityDeposit.toFixed(2)),
      });

      if (!result.success || !result.data) {
        throw new Error(result.error ?? "Payment initiation failed");
      }

      const { data } = result;
      const formattedAmount = `₵${Number(data.amount).toFixed(2)}`;

      setPaymentResult({
        amount: formattedAmount,
        refNumber: data.id,
        paymentTime: formatPaymentTime(data.createdAt),
        paymentMethod: "Mobile Money",
        senderName: data.name,
        totalAmount: formattedAmount,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      <LoadingDialog open={isPaying} message='Checking balances' />
      <PaymentSuccessDialog
        open={paymentResult !== null}
        amount={paymentResult?.amount ?? ""}
        refNumber={paymentResult?.refNumber ?? ""}
        paymentTime={paymentResult?.paymentTime ?? ""}
        paymentMethod={paymentResult?.paymentMethod ?? ""}
        senderName={paymentResult?.senderName ?? ""}
        totalAmount={paymentResult?.totalAmount ?? ""}
        onContinue={() => setPaymentResult(null)} // or router.push("/") etc.
      />
      <main className="flex flex-col md:flex-row min-h-screen">

        {/* Left dark panel */}
        <div className="w-full md:w-1/2 bg-greenBookingBg px-5 md:px-29 md:py-10">
          <h2 className="mb-6 text-[24px] font-semibold text-white montserrat-font">Your Order</h2>

          {hasOrder ? (
            orderItems.map((item) => (
              <RentalAssetCard key={item.id} {...item} />
            ))
          ) : (
            <p className="dmSans-font text-sm text-gray-400">
              No item selected — head back to a listing and tap &quot;Place order&quot;.
            </p>
          )}

          <DiscountCodeInput
            label="Discount Code"
            SvgIcon={TagIcon}
            value={discountCode}
            onChange={setDiscountCode}
            onApply={(code) => setAppliedCode(code)}
          />

          {appliedCode && (
            <p className="mt-2 text-xs text-emerald-400 dmSans-font">
              ✓ Code &quot;{appliedCode}&quot; applied
            </p>
          )}

          <hr className="my-1 border-t border-white/8" />

          <div className="mt-7 flex flex-col gap-2.5 text-sm mb-3">
            {summaryRows.map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-400 dmSans-font">{k}</span>
                <span className="text-gray-200 dmSans-font">{v}</span>
              </div>
            ))}
            <hr className="my-1 border-t border-white/8" />
            <div className="flex justify-between text-base font-semibold text-white dmSans-font">
              <span>Total</span>
              <span>₵{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right light panel */}
        <div className="flex flex-1 px-12 py-10 bg-white justify-center items-center">
          <div className="flex w-full max-w-120 flex-col gap-9">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 dmSans-font">Payment method</span>
                <button type="button" className="text-sm text-gray-400 hover:text-gray-700 transition-colors dmSans-font">
                  + Change
                </button>
              </div>
              <div className="flex gap-3">
                {PAYMENT_METHODS.map((pm) => (
                  <PaymentMethodTile
                    key={pm.id}
                    maskedNumber={pm.maskedNumber}
                    methodType={pm.methodType}
                    editLabel="Edit"
                    selected={selectedPaymentId === pm.id}
                    onSelect={() => setSelectedPaymentId(pm.id)}
                  />
                ))}
              </div>
            </div>

            <BookingInputField
              type='text'
              label="Duration"
              value={durationLabel}
              SvgIcon={DurationIcon}
              onChange={() => {}}
              placeholder='Pick start & end dates'
              readOnly
            />
            <div className='flex gap-3'>
              <BookingInputField
                type='date'
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
              />
              <BookingInputField
                type='date'
                value={endDate}
                label='End Date'
                onChange={setEndDate}
              />

            </div>


            <button
              type="button"
              onClick={handlePay}
              disabled={!hasOrder || !startDate || !endDate || isPaying}
              className='mt-2 h-12 w-full rounded-2xl bg-gray-900 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dmSans-font cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Pay ₵{total.toFixed(2)}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPageInner />
    </Suspense>
  );
}
