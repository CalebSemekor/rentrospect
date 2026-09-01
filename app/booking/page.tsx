"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BookingInputField from "@/components/BookingInputField";
import { RentalAssetCard } from "@/components/RentalAssetCard";
import { DiscountCodeInput } from "@/components/DiscountCodeInput";
import { PaymentMethodTile, PaymentMethodType } from "@/components/PaymentMethodTile";
import LoadingDialog from "./loading";
import PaymentSuccessDialog from "@/components/PaymentSuccessDialog";

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

// Raw day count between two date strings, floored at 1.
const computeDays = (start: string, end: string): number => {
  if (!start || !end) return 1;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 1;

  return Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86400000));
};

// Number of `pricingUnit`s covered by [start, end] — e.g. 3 days, 2 weeks.
// Only used for week/month/semester pricing; day-priced assets use the
// degressive `dailyRateMultiplier` below instead of a flat day count.
const computeUnits = (start: string, end: string, unit: string): number => {
  const days = computeDays(start, end);

  switch (unit) {
    case "week":
      return Math.max(1, Math.ceil(days / 7));
    case "month":
      return Math.max(1, Math.ceil(days / 30));
    case "semester":
      return 1;
    default:
      return days;
  }
};

// Degressive daily-rate pricing, expressed as % of one day's rate per day of
// the booking: day 1 at 100%, day 2 at 70%, day 3 at 50%, days 4-7 at ~35%
// each, days 8+ at ~20% each. The last two tiers were given as ranges
// (30-40%, 15-25%) — using the midpoint of each. Anything past day 30
// continues at the day-30 rate rather than dropping off a cliff.
const DAILY_RATE_TIERS: { throughDay: number; percentOfDailyRate: number }[] = [
  { throughDay: 1, percentOfDailyRate: 1.0 },
  { throughDay: 2, percentOfDailyRate: 0.7 },
  { throughDay: 3, percentOfDailyRate: 0.5 },
  { throughDay: 7, percentOfDailyRate: 0.35 },
  { throughDay: Infinity, percentOfDailyRate: 0.2 },
];

const dailyRateMultiplier = (days: number): number => {
  if (days <= 0) return 0;

  let multiplier = 0;
  let remainingDays = days;
  let coveredThroughDay = 0;

  for (const tier of DAILY_RATE_TIERS) {
    if (remainingDays <= 0) break;
    const daysInTier = Math.min(remainingDays, tier.throughDay - coveredThroughDay);
    multiplier += daysInTier * tier.percentOfDailyRate;
    remainingDays -= daysInTier;
    coveredThroughDay = tier.throughDay;
  }

  return multiplier;
};

// Bulk-quantity discount: unlike the daily tiers above, this isn't
// cumulative — the whole order gets whichever bracket its quantity falls
// into, applied as a % of the per-unit rate. ("20+" in the source table
// reads as "21+" here so the 11-20 bracket isn't double-covered.)
const QUANTITY_RATE_TIERS: { minQty: number; maxQty: number; percentOfRate: number }[] = [
  { minQty: 1, maxQty: 1, percentOfRate: 1.0 },
  { minQty: 2, maxQty: 2, percentOfRate: 0.95 },
  { minQty: 3, maxQty: 5, percentOfRate: 0.9 },
  { minQty: 6, maxQty: 10, percentOfRate: 0.8 },
  { minQty: 11, maxQty: 20, percentOfRate: 0.7 },
  { minQty: 21, maxQty: Infinity, percentOfRate: 0.6 },
];

const quantityRateMultiplier = (quantity: number): number => {
  const tier = QUANTITY_RATE_TIERS.find((t) => quantity >= t.minQty && quantity <= t.maxQty);
  return tier ? tier.percentOfRate : 1.0;
};

// ── Page ─────────────────────────────────────────────────────────────────────

function CheckoutPageInner() {
  const searchParams = useSearchParams();

  // Everything the asset details page hands over via the URL when the renter
  // taps "Place order" there.
  const assetId = searchParams.get("assetId") ?? "";
  const name = searchParams.get("name") ?? "";
  const image = searchParams.get("image") ?? "/images/Avatar.png";
  const rate = Number(searchParams.get("rate") ?? 0);
  const pricingUnit = searchParams.get("pricingUnit") ?? "day";
  const quantity = Number(searchParams.get("quantity") ?? 1);
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
  // for those. The bulk-quantity discount applies on top of either.
  const lineTotal = useMemo(() => {
    const effectiveRate = rate * quantityRateMultiplier(quantity);
    if (pricingUnit === "day") {
      return effectiveRate * quantity * dailyRateMultiplier(days);
    }
    const units = computeUnits(startDate, endDate, pricingUnit);
    return effectiveRate * quantity * units;
  }, [rate, quantity, pricingUnit, days, startDate, endDate]);

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
  const total = Math.max(0, subtotal + azaFee + rentrospectFee - discountAmount);

  const summaryRows: [string, string][] = [
    ["Subtotal", `₵${subtotal.toFixed(2)}`],
    ["Aza Fee (1.5%)", `₵${azaFee.toFixed(2)}`],
    ["Rentrospect Fee (1%)", `₵${rentrospectFee.toFixed(2)}`],
    ...(appliedCode ? ([["Discount (10%)", `-₵${discountAmount.toFixed(2)}`]] as [string, string][]) : []),
  ];

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const processPayment = async () => {
    await delay(4000);

    return {
      amount: `₵${total.toFixed(2)}`,
      refNumber: "930345",
      paymentTime: "12:03AM",
      paymentMethod: "MOMO",
      senderName: "Priscilla",
      totalAmount: `₵${total.toFixed(2)}`,
    };
  };

  const handlePay = async () => {
    setIsPaying(true);

    try {
      const result = await processPayment();

      setPaymentResult(result);
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
              disabled={!hasOrder}
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
