"use client"
import { Period, Report } from "./../reports/types";
import { useEffect, useState } from "react";

export function useSalesReport() {
  const [period, setPeriod] = useState<Period>("today");
  const [report, setReport] = useState<Report | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/admin/reports?period=${period}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load report");
        }

        return data as Report;
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setReport(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      });

    return () => controller.abort();
  }, [period, refreshKey]);

  return {
    period,
    setPeriod,
    report: report?.period === period ? report : null,
    error,
    refresh: () => {
      setReport(null);
      setError("");
      setRefreshKey((key) => key + 1);
    },
  };
}
