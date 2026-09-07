import { VerifyPayment } from "@/types/payment";
import ConfirmPaymentClient from "@/components/payments/ConfirmPaymentClient";

async function getTransaction(uuid: string): Promise<VerifyPayment | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_MASTER}client/verifyPayment/${uuid}`, {
            method: 'GET',
            cache: 'no-store', // fetch fresh data on every request; use next: { revalidate: N } instead if you want caching
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch transaction: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function ConfirmPaymentPage({
    params,
}: {
    params: Promise<{ uuid: string }>;
}) {
    const { uuid } = await params;
    const transactionData = await getTransaction(uuid);

    if (!transactionData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 dmSans-font mb-4">Failed to load transaction details</p>
                    <p className="text-gray-500 dmSans-font">Transaction ID: {uuid}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ConfirmPaymentClient uuid={uuid} transactionData={transactionData} />
        </div>
    );
}