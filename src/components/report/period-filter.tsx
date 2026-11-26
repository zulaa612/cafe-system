"use client";

import { RefreshCw } from "lucide-react";
import type { Period } from "@/app/admin/reports/types";

const filters: { label: string; value: Period }[] = [
    { label: "Today", value: "today" },
    { label: "7 Days", value: "week" },
    { label: "30 Days", value: "month" },
    { label: "All Time", value: "all" },
];

type Props = {
    period: Period;
    onChange: (period: Period) => void;
    onRefresh: () => void;
};

export default function PeriodFilter({
    period,
    onChange,
    onRefresh,
}: Props) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
                {filters.map((item) => (
                    <button
                        key={item.value}
                        onClick={() => onChange(item.value)}
                        className={`rounded-full px-4 py-2 text-sm font-medium ${period === item.value
                            ? "bg-[#6d4936] text-white"
                            : "border bg-white text-[#6d4936]"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <button
                onClick={onRefresh}
                className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm"
            >
                <RefreshCw size={16} />
                Refresh
            </button>
        </div>
    );
}