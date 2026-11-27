"use client";

import { useSalesReport } from "../hooks/use-sales-report";
import ReportHeader from "@/components/report/report-header";
import PeriodFilter from "@/components/report/period-filter";
import SalesStats from "@/components/report/sales-stats";
import RevenueChart from "@/components/report/revenue-chart";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";
import ExportReport from "@/components/report/export-report";

export default function SalesReportPage() {
    const { period, setPeriod, report, error, refresh } =
        useSalesReport();

    return (
        <main className="min-h-screen p-6 text-[#3b2922] md:p-10">
            <CoffeeBackground />
            <div className="relative mx-auto max-w-6xl space-y-8">
                <ReportHeader />
                <PeriodFilter
                    period={period}
                    onChange={setPeriod}
                    onRefresh={refresh}
                />
                <div className="flex justify-end">
                    <ExportReport report={report} />
                </div>

                {error && <p className="text-red-600">{error}</p>}
                {report && !error && (
                    <>
                        <SalesStats report={report} />
                        <RevenueChart report={report} />
                    </>
                )}
            </div>
        </main>
    );
}