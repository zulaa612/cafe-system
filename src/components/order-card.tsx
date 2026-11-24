"use client";

import {
    CheckCircle2,
    ChefHat,
    PackageCheck,
    XCircle,
} from "lucide-react";

import type { AdminOrder, OrderStatus } from "@/app/admin/orders/types/order";

import { nextStatus, statusLabels } from "@/app/admin/orders/types/order";

type Props = {
    order: AdminOrder;
    busy: boolean;
    onUpdate: (id: string, status: OrderStatus) => void;
};

const actionLabels: Partial<Record<OrderStatus, string>> = {
    pending: "Start Preparing",
    preparing: "Mark as Ready",
    completed: "Completed",
    ready: "Complete Order",
};

export default function OrderCard({
    order,
    busy,
    onUpdate,
}: Props) {
    const next = nextStatus[order.status];

    const statusColors: Record<OrderStatus, string> = {
        pending: "bg-amber-100 text-amber-700",
        preparing: "bg-blue-100 text-blue-700",
        ready: "bg-green-100 text-green-700",
        completed: "bg-yellow-100 text-red-700",
        cancelled: "bg-red-100 text-red-700",
    };

    return (
        <article className="rounded-2xl border border-[#eee5dc] bg-white p-5">
            <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="font-bold">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {order.customer.name} · {order.customer.phone}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleString(
                            "mn-MN",
                            { timeZone: "Asia/Ulaanbaatar" }
                        )}
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]
                        }`}
                >
                    {statusLabels[order.status]}
                </span>
            </header>

            <div className="my-5 border-t border-[#eee5dc]" />

            <div className="space-y-3">
                {order.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between gap-3 text-sm"
                    >
                        <span>
                            {item.productName} × {item.quantity}
                        </span>
                        <span className="font-medium">
                            {item.subtotal.toLocaleString("mn-MN")}₮
                        </span>
                    </div>
                ))}
            </div>

            <div className="my-5 border-t border-[#eee5dc]" />

            <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">
                    {order.totalAmount.toLocaleString("mn-MN")}₮
                </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                {next && (
                    <button
                        disabled={busy}
                        onClick={() => onUpdate(order.id, next)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6d4936] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {order.status === "pending" ? (
                            <ChefHat size={17} />
                        ) : order.status === "preparing" ? (
                            <PackageCheck size={17} />
                        ) : (
                            <CheckCircle2 size={17} />
                        )}

                        {busy ? "Updating..." : actionLabels[order.status]}
                    </button>
                )}

                {order.status === "pending" && (
                    <button
                        disabled={busy}
                        onClick={() => {
                            if (window.confirm("Cancel this order?")) {
                                onUpdate(order.id, "cancelled");
                            }
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 disabled:opacity-50"
                    >
                        <XCircle size={17} />
                        Cancel
                    </button>
                )}
            </div>
        </article>
    );
}