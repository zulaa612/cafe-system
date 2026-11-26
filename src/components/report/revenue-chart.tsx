
import type { Report, TrendItem } from "@/app/admin/reports/types";
import { formatMoney } from "@/app/admin/reports/types";


function completeTrend(report: Report): TrendItem[] {
    const values = new Map(
        report.trend.map((item) => [item.label, item.revenue]),
    );

    if (report.period === "all") return report.trend;

    if (report.period === "today") {
        return Array.from({ length: 24 }, (_, hour) => {
            const label = String(hour).padStart(2, "0");

            return {
                label: `${label}:00`,
                revenue: values.get(label) ?? 0,
            };
        });
    }

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Ulaanbaatar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const get = (type: string) =>
        Number(parts.find((part) => part.type === type)?.value);

    const today = new Date(
        Date.UTC(get("year"), get("month") - 1, get("day")),
    );

    const count = report.period === "week" ? 7 : 30;

    return Array.from({ length: count }, (_, index) => {
        const date = new Date(today);
        date.setUTCDate(date.getUTCDate() - (count - 1 - index));

        const key = date.toISOString().slice(0, 10);

        return {
            label: key.slice(5),
            revenue: values.get(key) ?? 0,
        };
    });
}

export default function RevenueChart({
    report,
}: {
    report: Report;
}) {
    const points = completeTrend(report);
    const max = Math.max(1, ...points.map((p) => p.revenue));

    if (points.length === 0) {
        return (
            <p className="py-12 text-center text-gray-500">
                No sales data yet.
            </p>
        );
    }

    return (
        <section className="rounded-2xl border border-[#eee5dc] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Revenue Trend</h2>

            <p className="mt-1 text-sm text-gray-500">
                {report.period === "today"
                    ? "Hourly revenue"
                    : report.period === "all"
                        ? "Monthly revenue"
                        : "Daily revenue"}
            </p>

            <div className="mt-6 overflow-x-auto">
                <div className="flex h-56 min-w-max items-end gap-2 pt-5">
                    {points.map((point, index) => (
                        <div
                            key={`${point.label}-${index}`}
                            className="flex w-9 flex-col items-center gap-2"
                            title={`${point.label}: ${formatMoney(point.revenue)}`}
                        >
                            <div className="flex h-44 w-full items-end justify-center">
                                <div
                                    className="w-7 rounded-t-md bg-[#a36b4d]"
                                    style={{
                                        height:
                                            point.revenue === 0
                                                ? "3px"
                                                : `${Math.max(
                                                    3,
                                                    (point.revenue / max) * 100,
                                                )}%`,
                                    }}
                                />
                            </div>

                            <span className="h-4 text-[10px] text-gray-500">
                                {report.period === "month" && index % 4 !== 0
                                    ? ""
                                    : report.period === "today" && index % 3 !== 0
                                        ? ""
                                        : point.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}