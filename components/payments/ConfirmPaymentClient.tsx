"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { VerifyPayment } from "@/types/payment";
import { initiatePayment } from "@/services/backend";
import OrderReceiptDialog from "@/components/payments/OrderReceiptDialog";
import QrScanSuccessDialog from "@/components/payments/QrScanSuccessDialog";

const formatCurrency = (amount: number | string | null | undefined): string => {
    const num = Number(amount);
    return `GH¢ ${Number.isFinite(num) ? num.toFixed(2) : "0.00"}`;
};

export default function ConfirmPaymentClient({
    uuid,
    transactionData,
}: {
    uuid: string;
    transactionData: VerifyPayment;
}) {
    const { getToken } = useAuth();
    const [confirmed, setConfirmed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Held alongside the project cost, not a fee, so it isn't part of what
    // Aza's/Rentrospect's cuts are computed against — added straight onto
    // the net amount for what the renter actually owes.
    const totalWithDeposit = Number(transactionData.netAmount) + Number(transactionData.securityDeposit);

    const handleContinue = async () => {
        setSubmitting(true);

        try {
            const token = await getToken();
            if (!token) {
                throw new Error("Not signed in");
            }

            const result = await initiatePayment(token, uuid);
            if (!result.success) {
                throw new Error(result.error ?? "Failed to initiate payment");
            }

            setConfirmed(true);
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDone = () => {
        window.history.back();
    };

    if (confirmed) {
        return (
            <QrScanSuccessDialog
                open={true}
                renterName={transactionData.renter}
                onBack={handleDone}
                onClose={handleDone}
                onContinue={handleDone}
            />
        );
    }

    return (
        <OrderReceiptDialog
            open={true}
            orderStatus="Pending"
            paymentStatus="Pending"
            continuing={submitting}
            orderId={transactionData.transactionId}
            projectCost={formatCurrency(transactionData.amount)}
            totalSum={formatCurrency(totalWithDeposit)}
            processingFee={formatCurrency(transactionData.azaFee)}
            platformFee={formatCurrency(transactionData.rentrospectFee)}
            securityDeposit={formatCurrency(transactionData.securityDeposit)}
            onApplyDiscount={(code) => console.log("Discount code:", code)}
            onContinue={handleContinue}
            onClose={() => {
                window.history.back();
            }}
        />
    );
}
