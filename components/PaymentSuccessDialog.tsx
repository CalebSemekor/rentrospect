// PaymentSuccessDialog.tsx
// A modal dialog shown after a successful payment.
// Blocks all interaction behind it until "Continue" is pressed.
//
// Props:
//   open          – controls visibility
//   amount        – large amount string, e.g. "GHC 87.98"
//   refNumber     – e.g. "000085752257"
//   paymentTime   – e.g. "25-02-2025, 13:22:18"
//   paymentMethod – e.g. "Bank Transfer"
//   senderName    – e.g. "Scylla Kwofie"
//   totalAmount   – e.g. "GHC 436.50"
//   paymentUrl    – Aza checkout link; when set, shows a "Complete Payment"
//                    button that opens it in a new tab
//   onContinue    – called when the Continue button is pressed

import React from "react";

interface PaymentSuccessDialogProps {
  open: boolean;
  amount: string;
  refNumber: string;
  paymentTime: string;
  paymentMethod: string;
  senderName: string;
  totalAmount: string;
  paymentUrl?: string;
  onContinue: () => void;
}

const CheckIcon: React.FC = () => (
  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600">
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4.5 11.5L9 16L17.5 6"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const ShareIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-400 dmSans-font">{label}</span>
    <span className="text-sm font-medium text-gray-900 text-right dmSans-font">{value}</span>
  </div>
);

export const PaymentSuccessDialog: React.FC<PaymentSuccessDialogProps> = ({
  open,
  amount,
  refNumber,
  paymentTime,
  paymentMethod,
  senderName,
  totalAmount,
  paymentUrl,
  onContinue,
}) => {
  if (!open) return null;

  return (
    /* Backdrop — no onClick so the user cannot dismiss by clicking outside */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      {/* Dialog card */}
      <div className="relative flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl bg-white px-6 pb-6 pt-8 shadow-2xl">

        {/* Share / close icon — top-left */}
        <button
          type="button"
          aria-label="Share receipt"
          className="absolute left-5 top-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ShareIcon />
        </button>

        {/* Close — top-right (calls onContinue so parent can decide what to do) */}
        <button
          type="button"
          aria-label="Close"
          onClick={onContinue}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
        >
          ✕
        </button>

        {/* Success icon */}
        <CheckIcon />

        {/* Heading */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-base font-semibold text-teal-600 dmSans-font">Payment Success!</p>
          <p className="text-3xl font-bold text-gray-900 dmSans-font">{amount}</p>
        </div>

        {/* Payment details card */}
        <div className="w-full rounded-2xl bg-gray-50 px-4 py-1">
          <p className="py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-100 dmSans-font">
            Payment Details
          </p>

          <DetailRow label="Ref Number"     value={refNumber} />
          <DetailRow label="Payment Time"   value={paymentTime} />
          <DetailRow label="Payment Method" value={paymentMethod} />
          <DetailRow label="Sender Name"    value={senderName} />
          <DetailRow label="Amount"         value={totalAmount} />
          <DetailRow
            label="Payment Status"
            value={
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-600 dmSans-font">
                Success
              </span>
            }
          />
        </div>

        {/* Complete Payment — opens the Aza-hosted checkout in a new tab */}
        {paymentUrl && (
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-teal-600 text-sm font-semibold text-white hover:bg-teal-700 transition-colors dmSans-font"
          >
            Complete Payment
          </a>
        )}

        {/* Continue button */}
        <button
          type="button"
          onClick={onContinue}
          className={
            paymentUrl
              ? "h-12 w-full rounded-2xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors dmSans-font"
              : "h-12 w-full rounded-2xl bg-teal-600 text-sm font-semibold text-white hover:bg-teal-700 transition-colors dmSans-font"
          }
        >
          Continue
        </button>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 leading-relaxed dmSans-font">
          Rentrospect holds funds in your reserved account until you accept the finished product
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessDialog;
