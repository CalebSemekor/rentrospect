// QrScanSuccessDialog.tsx
// Shown after client/initiatePayment succeeds — replaces OrderReceiptDialog
// in the /confirmPayment/{uuid} flow. Fixed 5-step order tracker (Discovery,
// Booking, Payment, Consultation, Delivery); the first four are always shown
// complete here since reaching this screen means payment (step 3) went
// through and a consultation mode was already selected at booking time —
// only Delivery is still pending.
//
// Props:
//   open       – controls visibility
//   renterName – e.g. "scylla_kwofie", shown in the confirmation line
//   onBack     – called when the ‹ chevron is pressed
//   onClose    – called when ✕ is pressed
//   onContinue – called when the Continue button is pressed

"use client";

import React from "react";

interface QrScanSuccessDialogProps {
  open: boolean;
  renterName: string;
  onBack?: () => void;
  onClose: () => void;
  onContinue: () => void;
}

const STEPS = ["Discovery", "Booking", "Payment", "Consultation", "Delivery"];
const COMPLETED_STEPS = 4; // steps 1-4 done; step 5 (Delivery) still pending

const CheckIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path
      d="M4.5 11.5L9 16L17.5 6"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const QrScanSuccessDialog: React.FC<QrScanSuccessDialogProps> = ({
  open,
  renterName,
  onBack,
  onClose,
  onContinue,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="relative flex w-full max-w-sm flex-col gap-8 rounded-3xl bg-white px-6 pb-8 pt-6 shadow-2xl">

        {/* Header: back / title / close */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 transition-colors"
          >
            ‹
          </button>
          <span className="text-sm font-semibold text-gray-900 dmSans-font">QR Code</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center dmSans-font">You&apos;re almost there!</h2>

          {/* Success card */}
          <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-[#EAECF0] bg-gray-50 px-5 py-5">
            <p className="text-sm font-semibold text-teal-600 dmSans-font">QR scan successful!</p>
            <p className="text-xs text-gray-500 text-center dmSans-font">
              Order for {renterName} has been confirmed.
            </p>
            <button
              type="button"
              onClick={onContinue}
              className="h-11 w-full rounded-2xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 transition-colors dmSans-font"
            >
              Continue
            </button>
          </div>

          {/* Step tracker */}
          <div className="flex w-full items-start justify-between px-1">
            {STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isComplete = stepNumber <= COMPLETED_STEPS;

              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 shrink-0",
                        isComplete ? "bg-teal-500 border-teal-500" : "bg-white border-[#EAECF0]",
                      ].join(" ")}
                    >
                      {isComplete ? (
                        <CheckIcon />
                      ) : (
                        <span className="text-xs font-semibold text-gray-400 dmSans-font">
                          {String(stepNumber).padStart(2, "0")}
                        </span>
                      )}
                    </div>
                    <span
                      className={[
                        "text-[11px] font-medium dmSans-font whitespace-nowrap",
                        isComplete ? "text-teal-600" : "text-gray-400",
                      ].join(" ")}
                    >
                      {step}
                    </span>
                  </div>

                  {stepNumber < STEPS.length && (
                    <div
                      className={[
                        "h-0.5 flex-1 mt-4.5 mx-1",
                        stepNumber < COMPLETED_STEPS ? "bg-teal-500" : "bg-[#EAECF0]",
                      ].join(" ")}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrScanSuccessDialog;
