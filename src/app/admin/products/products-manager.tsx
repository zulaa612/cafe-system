"use client";

import { useState, type FormEvent } from "react";
import { useProducts } from "@/hooks/use-products";
import ProductCard from "@/components/product/product-card";
import ProductForm from "@/components/report/product-form";
import ProductStats from "@/components/product/product-stats";
import { emptyForm, type Product, type ProductFormData } from "@/types/product";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function ProductsManager() {
    const {
        products,
        loading,
        saving,
        busyId,
        error,
        saveProduct,
        toggleAvailability,
    } = useProducts();

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<ProductFormData>(emptyForm);

    const filtered = products.filter((p) =>
        `${p.name} ${p.category}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    function openCreate() {
        setEditingId(null);
        setForm({ ...emptyForm });
        setShowForm(true);
    }

    function openEdit(product: Product) {
        setEditingId(product.id);
        setForm({
            name: product.name,
            category: product.category,
            description: product.description ?? "",
            price: String(product.price),
            imageUrl: product.imageUrl ?? "",
        });
        setShowForm(true);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const success = await saveProduct(form, editingId);

        if (success) setShowForm(false);
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] flex items-center justify-center p-5">
            <CoffeeBackground />
            <div className=" relative mx-auto max-w-6xl space-y-8">
                <header className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Products</h1>
                    <button
                        onClick={openCreate}
                        className="rounded-xl bg-[#6d4936] px-5 py-3 text-white hover:bg-[#351200]"
                    >
                        + Add Product
                    </button>
                    <Link
                        href="/admin/orders"
                        className="rounded-xl bg-[#351200] px-4 py-3 text-sm font-medium text-white hover:bg-[#6d4936]"
                    >
                        Orders
                    </Link>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "h-11 w-11",
                            },
                        }}
                    />
                </header>

                <ProductStats products={products} />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className=" w-full rounded-2xl border backdrop-blur-md md:p-10 border-white/40 p-3 shadow-2xl text-white"
                />

                {error && (
                    <p role="alert" className="text-red-600">{error}</p>
                )}

                {loading ? (
                    <p>Loading...</p>
                ) : filtered.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    <section className="grid gap-4 md:grid-cols-2">
                        {filtered.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                busy={busyId === product.id}
                                onEdit={openEdit}
                                onToggle={toggleAvailability}
                            />
                        ))}
                    </section>
                )}

                {showForm && (
                    <ProductForm
                        form={form}
                        setForm={setForm}
                        editing={editingId !== null}
                        saving={saving}
                        onClose={() => setShowForm(false)}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </main>
    );
}