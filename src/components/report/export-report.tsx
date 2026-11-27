"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import type { Report } from "@/app/admin/reports/types";

type Props = {
    report: Report | null;
};

export default function ExportReport({ report }: Props) {
    const [downloading, setDownloading] = useState(false);

    function downloadCSV() {
        if (!report || downloading) return;

        setDownloading(true);

        try {
            const rows = [
                ["Pinecone Coffee House", "Sales Report"],
                ["Period", report.period],
                [],
                ["Metric", "Value"],
                ["Total Revenue (MNT)", report.totalRevenue],
                ["Paid Orders", report.paidOrders],
                ["Average Order (MNT)", report.averageOrder],
                ["Awaiting Payment", report.awaitingPayment],
                [],
                ["Revenue Trend", ""],
                ["Date / Time", "Revenue (MNT)"],
                ...report.trend.map((item) => [
                    item.label,
                    item.revenue,
                ]),
            ];

            const csv = rows
                .map((row) =>
                    row
                        .map((value) => {
                            const text = String(value ?? "");
                            return `"${text.replace(/"/g, '""')}"`;
                        })
                        .join(","),
                )
                .join("\r\n");

            const blob = new Blob(["\uFEFF", csv], {
                type: "text/csv;charset=utf-8;",
            });

            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");

            anchor.href = url;
            anchor.download = `sales-report-${report.period}.csv`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();

            URL.revokeObjectURL(url);
        } finally {
            setDownloading(false);
        }
    }

    return (
        <button
            onClick={downloadCSV}
            disabled={!report || downloading}
            className="flex items-center gap-2 rounded-xl bg-[#6d4936] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
            <Download size={16} />
            {downloading ? "Exporting..." : "Export CSV"}
        </button>
    );
}