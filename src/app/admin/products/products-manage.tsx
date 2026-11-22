
"use client";

import { useCallback, useEffect, useState } from "react";

type Product = {
    id: string;
    name: string;
    description: string | null;
    category: string;
    price: number;
    imageUrl: string | null;
    isAvailable: boolean;
};

type ProductForm = {
    name: string;
    description: string;
    category: string;
    price: string;
    imageUrl: string;
};

const emptyForm: ProductForm = {
    name: "",
    description: "",
    category: "Coffee",
    price: "",
    imageUrl: "",
};

export default function ProductsManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<ProductForm>(emptyForm);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/products", {
                cache: "no-store",
            });

            if (!res.ok) throw new Error("Бүтээгдэхүүн авахад алдаа гарлаа");

            const data: Product[] = await res.json();
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Алдаа гарлаа");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadProducts();
    }, [loadProducts]);

    function openCreate() {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
        setShowForm(true);
    }

    function openEdit(product: Product) {
        setEditingId(product.id);
        setForm({
            name: product.name,
            description: product.description ?? "",
            category: product.category,
            price: String(product.price),
            imageUrl: product.imageUrl ?? "",
        });
        setError("");
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    }

    async function saveProduct(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (saving) return;

        const price = Number(form.price);

        if (!Number.isSafeInteger(price) || price <= 0) {
            setError("Үнэ эерэг бүхэл тоо байх ёстой.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const url = editingId
                ? `/api/admin/products/${editingId}`
                : "/api/admin/products";

            const res = await fetch(url, {
                method: editingId ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    description: form.description,
                    category: form.category,
                    price,
                    imageUrl: form.imageUrl,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error ?? "Хадгалахад алдаа гарлаа");
            }

            closeForm();
            await loadProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Алдаа гарлаа");
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

            if (!res.ok) throw new Error("Төлөв өөрчлөхөд алдаа гарлаа");

            await loadProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Алдаа гарлаа");
        } finally {
            setBusyId(null);
        }
    }

    const filteredProducts = products.filter((product) =>
        `${product.name} ${product.category}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const activeCount = products.filter((p) => p.isAvailable).length;

    const inputClass =
        "w-full rounded-xl border border-[#e7ded5] bg-white px-4 py-3 " +
        "outline-none focus:border-[#8a6348]";

    return (
        <main className="min-h-screen bg-[#faf7f2] px-5 py-10 text-[#3b2922]">
            <div className="mx-auto max-w-6xl">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-[#a17b60]">
                            PINECONE / ADMIN
                        </p>
                        <h1 className="mt-2 text-3xl font-bold">Products</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Manage your coffee menu
                        </p>
                    </div>

                    <button
                        onClick={openCreate}
                        className="rounded-xl bg-[#6d4936] px-5 py-3 font-medium text-white"
                    >
                        + Add Product
                    </button>
                </header>

                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    {[
                        { label: "Total products", value: products.length },
                        { label: "Available", value: activeCount },
                        {
                            label: "Unavailable",
                            value: products.length - activeCount,
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-[#eee5dc] bg-white p-5"
                        >
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className="mt-2 text-3xl font-bold">{item.value}</p>
                        </div>
                    ))}
                </section>

                <div className="mt-8">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className={inputClass}
                    />
                </div>

                {error && (
                    <p role="alert" className="mt-4 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="mt-10 text-center">Loading products...</p>
                ) : filteredProducts.length === 0 ? (
                    <p className="mt-10 text-center text-gray-500">
                        No products found.
                    </p>
                ) : (
                    <section className="mt-6 grid gap-4 md:grid-cols-2">
                        {filteredProducts.map((product) => (
                            <article
                                key={product.id}
                                className="flex gap-4 rounded-2xl border border-[#eee5dc] bg-white p-4"
                            >
                                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#eee5dc]">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-4xl">
                                            ☕
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-[#a17b60]">
                                        {product.category}
                                    </p>

                                    <h2 className="mt-1 truncate font-semibold">
                                        {product.name}
                                    </h2>

                                    <p className="mt-1 font-bold">
                                        {product.price.toLocaleString("mn-MN")}₮
                                    </p>

                                    <p
                                        className={`mt-1 text-xs ${product.isAvailable
                                                ? "text-green-700"
                                                : "text-gray-400"
                                            }`}
                                    >
                                        {product.isAvailable ? "Active" : "Inactive"}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                                        <button
                                            onClick={() => openEdit(product)}
                                            className="font-semibold text-[#6d4936]"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => toggleAvailability(product)}
                                            disabled={busyId === product.id}
                                            className="text-gray-600 disabled:opacity-50"
                                        >
                                            {busyId === product.id
                                                ? "Saving..."
                                                : product.isAvailable
                                                    ? "Deactivate"
                                                    : "Activate"}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                )}

                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label={editingId ? "Edit product" : "Add product"}
                            className="my-auto w-full max-w-lg rounded-2xl bg-[#faf7f2] p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">
                                    {editingId ? "Edit Product" : "Add Product"}
                                </h2>

                                <button
                                    onClick={closeForm}
                                    disabled={saving}
                                    aria-label="Close"
                                    className="text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={saveProduct} className="mt-6 space-y-4">
                                <label className="block">
                                    <span className="mb-1 block text-sm">Product Name</span>
                                    <input
                                        required
                                        maxLength={150}
                                        className={inputClass}
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-1 block text-sm">Category</span>
                                    <select
                                        className={inputClass}
                                        value={form.category}
                                        onChange={(e) =>
                                            setForm({ ...form, category: e.target.value })
                                        }
                                    >
                                        <option>Coffee</option>
                                        <option>Non-Coffee</option>
                                        <option>Matcha</option>
                                        <option>Tea</option>
                                        <option>Bakery</option>
                                        <option>Dessert</option>
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="mb-1 block text-sm">Price (₮)</span>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        step="1"
                                        className={inputClass}
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm({ ...form, price: e.target.value })
                                        }
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-1 block text-sm">Image URL</span>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/coffee.jpg"
                                        className={inputClass}
                                        value={form.imageUrl}
                                        onChange={(e) =>
                                            setForm({ ...form, imageUrl: e.target.value })
                                        }
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-1 block text-sm">Description</span>
                                    <textarea
                                        rows={3}
                                        className={inputClass}
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </label>

                                <div className="flex justify-end gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        disabled={saving}
                                        className="rounded-xl border px-5 py-3"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        disabled={saving}
                                        type="submit"
                                        className="rounded-xl bg-[#6d4936] px-5 py-3 text-white disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Save Product"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
