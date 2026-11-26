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
                    className="relative z-10 w-full rounded-2xl border backdrop-blur-md md:p-10 border-white/40 bg-[#] p-5 shadow-2xl"
                >
                    <p className="text-sm text-white">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-white">
                        {stat.value}
                    </p>
                </div>
            ))}
        </section>
    );
}