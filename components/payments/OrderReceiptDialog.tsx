// OrderReceiptDialog.tsx
// "Order Receipt Preview" modal — shown before the user funds a project.
//
// Props:
//   open                – controls visibility
//   orderId             – e.g. "ORD-00123"
//   orderStatus         – badge on the Order ID row, e.g. "Pending"
//   projectCost         – e.g. "GH¢ 75.00"
//   platformFee         – e.g. "GH¢ 3.00"
//   processingFee       – e.g. "GH¢ 1.50"
//   securityDeposit     – e.g. "GH¢ 50.00"; omitted entirely when not set
//   totalSum            – e.g. "GH¢ 79.50" — should already include securityDeposit
//   paymentStatus       – badge on the Payment Status row, e.g. "Processing"
//   onApplyDiscount     – called with the trimmed code string when Apply is pressed
//   onContinue          – called when the Continue button is pressed
//   onClose             – called when ✕ is pressed

"use client";

import React, { useState, useCallback, KeyboardEvent } from "react";

interface OrderReceiptDialogProps {
  open: boolean;
  orderId?: string;
  orderStatus?: string;
  projectCost?: string;
  platformFee?: string;
  processingFee?: string;
  securityDeposit?: string;
  totalSum?: string;
  paymentStatus?: string;
  continuing?: boolean;
  onApplyDiscount?: (code: string) => void;
  onContinue: () => void;
  onClose: () => void;
}

// ── Small reusable pieces ─────────────────────────────────────────────────────

const StatusBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="rounded-lg border border-[#EAECF0] bg-white px-3 py-1 text-xs font-medium text-gray-500 dmSans-font">
    {label}
  </span>
);

interface DetailRowProps {
  label: string;
  value?: React.ReactNode;
  badge?: string;
  dimLabel?: boolean;
  bold?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, badge, dimLabel, bold }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#EAECF0] last:border-b-0">
    <span className={[
      "text-sm dmSans-font",
      dimLabel ? "text-gray-400" : "text-gray-600",
      bold ? "font-semibold text-gray-900" : "",
    ].join(" ")}>
      {label}
    </span>
    {badge  && <StatusBadge label={badge} />}
    {!badge && (
      <span className={[
        "text-sm dmSans-font",
        bold ? "font-semibold text-gray-900" : "font-medium text-gray-900",
      ].join(" ")}>
        {value}
      </span>
    )}
  </div>
);

// ── Inline discount input (no label, no icon — matches the screenshot) ─────────

interface InlineDiscountInputProps {
  onApply: (code: string) => void;
}

const InlineDiscountInput: React.FC<InlineDiscountInputProps> = ({ onApply }) => {
  const [code, setCode] = useState("");

  const handleApply = useCallback(() => {
    if (code.trim()) onApply(code.trim());
  }, [code, onApply]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleApply();
  };

  return (
    <div className="flex h-11 items-center rounded-xl border border-[#EAECF0] bg-white px-3 focus-within:border-gray-300 transition-colors my-1">
      <input
        type="text"
        value={code}
        placeholder="Click to add Discount code"
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
        className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dmSans-font"
      />
      <button
        type="button"
        onClick={handleApply}
        disabled={!code.trim()}
        className={[
          "ml-2 shrink-0 rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors dmSans-font",
          code.trim()
            ? "bg-gray-900 text-white hover:bg-gray-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed",
        ].join(" ")}
      >
        Apply
      </button>
    </div>
  );
};

// ── Dialog ────────────────────────────────────────────────────────────────────

export const OrderReceiptDialog: React.FC<OrderReceiptDialogProps> = ({
  open,
  orderId,
  orderStatus   = "Pending",
  projectCost   = "GH¢ 75.00",
  platformFee   = "GH¢ 3.00",
  processingFee = "GH¢ 1.50",
  securityDeposit,
  totalSum      = "GH¢ 79.50",
  paymentStatus = "Processing",
  continuing    = false,
  onApplyDiscount,
  onContinue,
  onClose,
}) => {
  if (!open) return null;

  return (
    /* Backdrop — no onClick so user must use ✕ or Continue */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">

      {/* Card */}
      <div className="relative flex w-full max-w-sm flex-col gap-5 rounded-3xl bg-white px-6 pb-6 pt-6 shadow-2xl">

        {/* ✕ close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none"
        >
          ✕
        </button>

        {/* Heading */}
        <div className="flex flex-col gap-1 pr-8">
          <h2 className="text-xl font-bold text-gray-900 dmSans-font">Order Receipt Preview</h2>
          <p className="text-xs text-gray-400 dmSans-font">
            Review your order details before funding the project.
          </p>
        </div>

        {/* Payment details card */}
        <div className="rounded-2xl border border-[#EAECF0] bg-gray-50 px-4 py-1">

          {/* Section title */}
          <div className="flex items-center justify-center border-b border-[#EAECF0] py-3">
            <span className="text-sm font-semibold text-gray-700 dmSans-font">Payment Details</span>
          </div>

          {/* Order ID */}
          <DetailRow
            label="Order ID"
            value={orderId}
            badge={orderStatus}
          />

          {/* Cost rows */}
          <DetailRow label="Project Cost"              value={projectCost}   />
          <DetailRow label="Rentrospect Platform fee"  value={platformFee}   />
          <DetailRow label="Aza Processing fee"   value={processingFee} />
          {securityDeposit && <DetailRow label="Security Deposit" value={securityDeposit} />}

          {/* Discount code input */}
          <InlineDiscountInput onApply={onApplyDiscount ?? (() => {})} />

          {/* Divider before totals */}
          <div className="border-t border-[#EAECF0] mt-1" />

          {/* Totals */}
          <DetailRow label="Total Sum"      value={totalSum}      bold />
          <DetailRow label="Payment Status" badge={paymentStatus} />
        </div>

        {/* Continue */}
        <button
          type="button"
          onClick={onContinue}
          disabled={continuing}
          className="h-12 w-full rounded-2xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 transition-colors dmSans-font disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {continuing ? "Processing..." : "Continue"}
        </button>

        {/* Footer note */}
        <p className="text-center text-xs text-teal-600 leading-relaxed dmSans-font">
          Rentrospect holds funds in your reserved account until you accept the finished product
        </p>
      </div>
    </div>
  );
};

export default OrderReceiptDialog;
