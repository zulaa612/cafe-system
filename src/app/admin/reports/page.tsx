"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";

type Report = {
    totalRevenue: number;
    paidOrders: number;
    awaitingPayment: number;
    averageOrder: number;
};

export default function SalesReportPage() {
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function fetchReport() {
            try {
                const res = await fetch("/api/admin/reports", {
                    cache: "no-store",
                    signal: controller.signal,
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error ?? "Failed to load report");
                }

                if (!controller.signal.aborted) {
                    setReport(data);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error ? err.message : "Unknown error",
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void fetchReport();

        return () => controller.abort();
    }, []);

    async function refreshReport() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/reports", {
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error ?? "Failed to load report");
            }

            setReport(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unknown error",
            );
        } finally {
            setLoading(false);
        }
    }

    const formatMoney = (value: number) =>
        `${value.toLocaleString("mn-MN")}₮`;

    const stats = report
        ? [
            {
                label: "Total Revenue",
                value: formatMoney(report.totalRevenue),
            },
            {
                label: "Paid Orders",
                value: String(report.paidOrders),
            },
            {
                label: "Average Order",
                value: formatMoney(report.averageOrder),
            },
            {
                label: "Awaiting Payment",
                value: String(report.awaitingPayment),
            },
        ]
        : [];

    return (
        <main className="min-h-screen bg-[#faf7f2] p-6 text-[#3b2922] md:p-10">
            <CoffeeBackground />
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-[#6d4936]">
                            PINECONE COFFEE HOUSE / ADMIN
                        </p>

                        <h1 className="mt-2 text-3xl font-bold">
                            Sales Overview
                        </h1>
                    </div>

                    <UserButton />
                </header>

                <div className="flex items-center justify-between gap-4">
                    <nav className="flex gap-5 text-sm">
                        <Link href="/admin/products">Products</Link>
                        <Link href="/admin/orders">Orders</Link>
                    </nav>

                    <button
                        onClick={() => void refreshReport()}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 disabled:opacity-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {loading && <p>Loading report...</p>}

                {error && (
                    <p role="alert" className="text-red-600">
                        {error}
                    </p>
                )}

                {!loading && !error && report && (
                    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-[#eee5dc] bg-white p-6 shadow-sm"
                            >
                                <p className="text-sm text-gray-500">
                                    {stat.label}
                                </p>

                                <h2 className="mt-3 text-2xl font-bold">
                                    {stat.value}
                                </h2>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}