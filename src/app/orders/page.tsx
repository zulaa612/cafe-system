"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import PayNowButton from "@/components/cart/pay-now-button";

type Order = {
    id: string;
    status: string;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    createdAt: string;
};

type PaymentStatus =
    | "unpaid"
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOrders() {
            try {
                const res = await fetch("/api/orders");
                if (!res.ok) throw new Error("Failed to load orders");

                setOrders(await res.json());
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Unknown error"
                );
            } finally {
                setLoading(false);
            }
        }

        void loadOrders();
    }, []);

    return (
        <main className="min-h-screen bg-[#faf7f2] p-8 text-[#3b2922]">
            <div className="mx-auto max-w-4xl">
                <header className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <UserButton />
                </header>

                <Link
                    href="/menu"
                    className="mt-4 inline-block text-sm text-[#6d4936]"
                >
                    ← Back to Menu
                </Link>

                {loading && <p className="mt-8">Loading...</p>}

                {error && (
                    <p role="alert" className="mt-8 text-red-600">
                        {error}
                    </p>
                )}

                {!loading && !error && orders.length === 0 && (
                    <p className="mt-8">No orders yet.</p>
                )}

                <div className="mt-8 space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-2xl bg-white p-6 shadow-sm"
                        >
                            <div className="flex justify-between gap-4">
                                <h2 className="font-semibold">
                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                </h2>
                                <span className="capitalize text-[#6d4936]">
                                    {order.status}
                                </span>
                            </div>

                            <p className="mt-3 text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleString(
                                    "mn-MN",
                                    { timeZone: "Asia/Ulaanbaatar" }
                                )}
                            </p>

                            <p className="mt-4 text-xl font-bold">
                                {order.totalAmount.toLocaleString("mn-MN")}₮
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <span
                                    className={`rounded-full px-3 py-1 text-sm ${order.paymentStatus === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-amber-100 text-amber-700"
                                        }`}
                                >
                                    {order.paymentStatus === "paid"
                                        ? "Paid"
                                        : order.paymentStatus === "pending"
                                            ? "Payment Pending"
                                            : order.paymentStatus}
                                </span>
                            </div>

                            {order.paymentStatus === "unpaid" &&
                                order.status === "pending" && (
                                    <PayNowButton orderId={order.id} />
                                )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}