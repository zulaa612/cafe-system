"use client";

import Link from "next/link";

type Props = {
    orderId: string;
    paying: boolean;
    error: string;
    onPay: () => void;
};

export default function OrderSuccess({
    orderId,
    paying,
    error,
    onPay,
}: Props) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] p-6">
            <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center">
                <div className="text-6xl">✅</div>

                <h1 className="mt-5 text-3xl font-bold">
                    Order Placed!
                </h1>

                <p className="mt-3 text-gray-500">
                    Please complete your payment.
                </p>

                <p className="mt-4 break-all text-xs text-gray-400">
                    Order ID: {orderId}
                </p>

                <button
                    onClick={onPay}
                    disabled={paying}
                    className="mt-6 w-full rounded-xl bg-[#6d4936] py-3 font-semibold text-white disabled:opacity-50"
                >
                    {paying ? "Opening payment..." : "Pay with Wire.mn"}
                </button>

                {error && (
                    <p role="alert" className="mt-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <div className="mt-6 flex flex-col gap-3">
                    <Link href="/orders" className="text-[#6d4936]">
                        View My Orders
                    </Link>

                    <Link href="/menu" className="text-gray-500">
                        Back to Menu
                    </Link>
                </div>
            </div>
        </main>
    );
}