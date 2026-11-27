"use client";

import {
    CheckCircle2,
    ChefHat,
    PackageCheck,
    XCircle,
} from "lucide-react";

import type {
    AdminOrder,
    OrderStatus,
    PaymentStatus,
} from "@/app/admin/orders/types/order";

import {
    nextStatus,
    statusLabels,
} from "@/app/admin/orders/types/order";

type Props = {
    order: AdminOrder;
    busy: boolean;
    onUpdate: (id: string, status: OrderStatus) => void;
};

const statusColors: Record<OrderStatus, string> = {
    pending: "bg-amber-100 text-amber-700",
    preparing: "bg-blue-100 text-blue-700",
    ready: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const paymentColors: Record<PaymentStatus, string> = {
    unpaid: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
};

const paymentLabels: Record<PaymentStatus, string> = {
    unpaid: "Unpaid",
    pending: "Payment Pending",
    paid: "Paid",
    failed: "Payment Failed",
    refunded: "Refunded",
};

const actionLabels: Partial<Record<OrderStatus, string>> = {
    pending: "Start Preparing",
    preparing: "Mark as Ready",
    ready: "Complete Order",
};

export default function OrderCard({
    order,
    busy,
    onUpdate,
}: Props) {
    const next = nextStatus[order.status];
    const isPaid = order.paymentStatus === "paid";

    return (
        <article className="relative z-10 w-full rounded-2xl border backdrop-blur-md md:p-10 border-white/40 p-5 shadow-2xl">
            <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="font-bold text-white">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                    </h2>

                    <p className="mt-1 text-sm text-white">
                        {order.customer.name} · {order.customer.phone}
                    </p>

                    <p className="mt-1 text-xs text-white">
                        {new Date(order.createdAt).toLocaleString("mn-MN", {
                            timeZone: "Asia/Ulaanbaatar",
                        })}
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
                        className="flex justify-between gap-3 text-sm text-white"
                    >
                        <span>
                            {item.productName} × {item.quantity}
                        </span>

                        <span className="font-medium text-white">
                            {item.subtotal.toLocaleString("mn-MN")}₮
                        </span>
                    </div>
                ))}
            </div>

            <div className="my-5 border-t border-[#eee5dc]" />

            <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Total</span>

                <span className="text-xl font-bold">
                    {order.totalAmount.toLocaleString("mn-MN")}₮
                </span>
            </div>

            <div className="mt-5 space-y-3 rounded-xl bg-[#faf7f2] p-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-600">
                        Order Status
                    </span>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]
                            }`}
                    >
                        {statusLabels[order.status]}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-600">
                        Payment Status
                    </span>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentColors[order.paymentStatus]
                            }`}
                    >
                        {paymentLabels[order.paymentStatus]}
                    </span>
                </div>
            </div>

            {/* Захиалгын үйлдлүүд */}
            <div className="mt-5 flex flex-wrap gap-3">
                {next && (
                    <button
                        disabled={busy || !isPaid}
                        onClick={() => onUpdate(order.id, next)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6d4936] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {order.status === "pending" ? (
                            <ChefHat size={17} />
                        ) : order.status === "preparing" ? (
                            <PackageCheck size={17} />
                        ) : (
                            <CheckCircle2 size={17} />
                        )}

                        {busy
                            ? "Updating..."
                            : actionLabels[order.status]}
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

            {!isPaid && next && (
                <p className="mt-3 text-xs text-amber-700">
                    Payment must be confirmed before preparing this order.
                </p>
            )}
        </article>
    );
}