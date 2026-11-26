"use client";

import { useState } from "react";

export default function PayNowButton({
    orderId,
}: {
    orderId: string;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handlePay() {
        if (loading) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("api/payments/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ orderId })
            })

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error ?? "Payment failed");
            }
            const url = new URL(data.url);

            if (url.protocol !== "https:" ||
                url.hostname !== "pay.wire.mn"
            ) {
                throw new Error("Invalid payment URL");
            }

            window.location.assign(url.href)
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Payment failed"
            );

            setLoading(false)
        }
    }

    return (
        <div className="mt-4">
            <button
                onClick={handlePay}
                disabled={loading}
                className="rounded-xl bg-[#6d4936] px-5 py-3 text-[#fffff] disabled:opacity-50"
            >
                {loading ? "Opening..." : "Pay Now"}
            </button>

            {error && (
                <p role="alert" className="mt-2 text-sm text-shadow-red-600">{error}</p>
            )}
        </div>
    );
}