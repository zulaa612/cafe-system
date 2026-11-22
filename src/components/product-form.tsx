"use client";

import type { FormEvent } from "react";
import type { ProductFormData } from "@/types/product";
type Props = {
    form: ProductFormData;
    setForm: (form: ProductFormData) => void;
    editing: boolean;
    saving: boolean;
    onClose: () => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function ProductForm({
    form,
    setForm,
    editing,
    saving,
    onClose,
    onSubmit,
}: Props) {
    const inputClass =
        "w-full rounded-xl border bg-white px-4 py-3 outline-none";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-label={editing ? "Edit Product" : "Add Product"}
                className="my-auto w-full max-w-lg rounded-2xl bg-[#faf7f2] p-6"
            >
                <h2 className="mb-5 text-2xl font-bold">
                    {editing ? "Edit Product" : "Add Product"}
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        required
                        maxLength={150}
                        placeholder="Product name"
                        className={inputClass}
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    <select
                        className={inputClass}
                        value={form.category}
                        onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                        }
                    >
                        {["Coffee", "Non-Coffee", "Matcha", "Tea", "Bakery", "Dessert"].map(
                            (category) => (
                                <option key={category}>{category}</option>
                            )
                        )}
                    </select>

                    <input
                        required
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Price (₮)"
                        className={inputClass}
                        value={form.price}
                        onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                        }
                    />

                    <input
                        type="url"
                        placeholder="Image URL (https://...)"
                        className={inputClass}
                        value={form.imageUrl}
                        onChange={(e) =>
                            setForm({ ...form, imageUrl: e.target.value })
                        }
                    />

                    <textarea
                        rows={3}
                        placeholder="Description"
                        className={inputClass}
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-xl border px-5 py-3"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-[#6d4936] px-5 py-3 text-white disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}