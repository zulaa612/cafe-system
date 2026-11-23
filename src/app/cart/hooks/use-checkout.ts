"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";

export function useCheckout() {
  const { items, ready, clearCart } = useCart();

  const [placing, setPlacing] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  async function placeOrder() {
    if (!ready || !items.length || placing) return;

    setPlacing(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Order failed");
      }

      setOrderId(data.id);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      setPlacing(false);
    }
  }

  async function payOrder() {
    if (!orderId || paying) return;

    setPaying(true);
    setError("");

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Payment failed");
      }

      if (
        typeof data.url !== "string" ||
        !data.url.startsWith("https://pay.wire.mn/")
      ) {
        throw new Error("Invalid payment URL");
      }

      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPaying(false);
    }
  }

  return {
    placing,
    paying,
    error,
    orderId,
    placeOrder,
    payOrder,
  };
}
