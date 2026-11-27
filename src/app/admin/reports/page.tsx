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
        <main className="relative min-h-screen w-full overflow-x-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] px-4 py-6 text-[#3b2922] sm:px-6 md:p-10" >
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