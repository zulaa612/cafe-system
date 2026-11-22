"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product, ProductFormData } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });

      if (!res.ok) throw new Error("Failed to load products");

      setProducts(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initLoad() {
      try {
        const res = await fetch("/api/admin/products", { cache: "no-store" });

        if (!res.ok) throw new Error("Failed to load products");

        const data = await res.json();
        if (active) {
          setProducts(data);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Error");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void initLoad();

    return () => {
      active = false;
    };
  }, []);

  async function saveProduct(form: ProductFormData, editingId: string | null) {
    const price = Number(form.price);

    if (!Number.isSafeInteger(price) || price <= 0) {
      setError("The price must be positive integer.");
      return false;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            price,
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save product");
      }

      await loadProducts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(product: Product) {
    setBusyId(product.id);
    setError("");

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isAvailable: !product.isAvailable,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusyId(null);
    }
  }

  return {
    products,
    loading,
    saving,
    busyId,
    error,
    loadProducts,
    saveProduct,
    toggleAvailability,
  };
}
