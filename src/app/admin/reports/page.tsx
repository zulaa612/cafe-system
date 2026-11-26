"use client";

import { useSalesReport } from "../hooks/use-sales-report";
import ReportHeader from "@/components/report-header";
import PeriodFilter from "@/components/period-filter";
import SalesStats from "@/components/sales-stats";
import RevenueChart from "@/components/revenue-chart";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";

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

                {error && <p className="text-red-600">{error}</p>}
                {!report && !error && <p>Loading report...</p>}

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