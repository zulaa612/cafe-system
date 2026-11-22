"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminOrder, OrderStatus } from "../types/order";

export function useOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      const contentType = res.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          `API returned HTML instead of JSON (HTTP ${res.status})`,
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          `${res.status}: ${data.error ?? "Failed to load orders"}`,
        );
      }

      setOrders(data);
    } catch (err) {
      console.error("Load orders error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => {
      if (active) void loadOrders();
    });

    return () => {
      active = false;
    };
  }, [loadOrders]);

  async function updateStatus(id: string, status: OrderStatus) {
    setBusyId(id);
    setError("");

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update status");
      }

      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBusyId(null);
    }
  }

  return {
    orders,
    loading,
    busyId,
    error,
    loadOrders,
    updateStatus,
  };
}
