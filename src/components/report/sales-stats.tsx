import type { Report } from "@/app/admin/reports/types";
import { formatMoney } from "@/app/admin/reports/types";

export default function SalesStats({
    report,
}: {
    report: Report;
}) {
    const stats = [
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
    ];

    return (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    );
}