import type { AdminOrder } from "@/app/admin/orders/types/order";

export default function OrderStats({
    orders,
}: {
    orders: AdminOrder[];
}) {
    const stats = [
        { label: "Total Orders", value: orders.length },
        {
            label: "Pending",
            value: orders.filter((o) => o.status === "pending").length,
        },
        {
            label: "Preparing",
            value: orders.filter((o) => o.status === "preparing").length,
        },
        {
            label: "Ready",
            value: orders.filter((o) => o.status === "ready").length,
        },
    ];

    return (
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-2xl border border-[#eee5dc] bg-white p-5"
                >
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold">
                        {stat.value}
                    </p>
                </div>
            ))}
        </section>
    );
}