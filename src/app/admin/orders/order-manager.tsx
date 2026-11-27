"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";
import { useOrders } from "./hooks/use-orders";
import OrderCard from "@/components/order/order-card";
import OrderStats from "@/components/order/order-stats";
import type { OrderStatus } from "./types/order";

type Filter = "all" | OrderStatus;

const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Preparing", value: "preparing" },
    { label: "Ready", value: "ready" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

export default function OrdersManager() {
    const {
        orders,
        loading,
        busyId,
        error,
        loadOrders,
        updateStatus,
    } = useOrders();

    const [filter, setFilter] = useState<Filter>("all");

    const filteredOrders = orders.filter(
        (order) => filter === "all" || order.status === filter
    );

    return (
        <main className="relative min-h-screen px-5 py-10 text-[#fffff]">
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-[#ffffff]">
                            PINECONE COFFEE HOUSE / ADMIN
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-[#ffffff]">
                            Orders
                        </h1>
                        <p className="mt-2 text-sm text-white">
                            Manage customer orders
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/products"
                            className="text-sm font-medium text-white"
                        >
                            Products
                        </Link>
                        <Link
                            href="/admin/reports"
                            className="text-sm font-medium text-white ">
                            Reports
                        </Link>

                        <UserButton />
                    </div>
                </header>

                <OrderStats orders={orders} />

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {filters.map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setFilter(item.value)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === item.value
                                    ? "bg-[#6d4936] text-white"
                                    : "border border-[#e9ded4] bg-white text-[#6d4936]"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => void loadOrders()}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl border border-[#e9ded4] bg-white px-4 py-2 text-sm disabled:opacity-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-xl bg-red-50 p-4 text-sm text-red-600"
                    >
                        {error}
                    </p>
                )}

                {loading ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-64 animate-pulse rounded-2xl bg-gray-200"
                            />
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="rounded-2xl bg-white p-12 text-center">
                        <p className="text-4xl">☕</p>
                        <h2 className="mt-4 text-xl font-semibold">
                            No orders found
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Customer orders will appear here.
                        </p>
                    </div>
                ) : (
                    <section className="grid items-start gap-5 md:grid-cols-2">
                        {filteredOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                busy={busyId === order.id}
                                onUpdate={updateStatus}
                            />
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}