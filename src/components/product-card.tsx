import type { Product } from "@/types/product";

type Props = {
    product: Product;
    busy: boolean;
    onEdit: (product: Product) => void;
    onToggle: (product: Product) => void;
};

export default function ProductCard({
    product,
    busy,
    onEdit,
    onToggle,
}: Props) {
    return (
        <article className="flex gap-4 rounded-2xl border bg-white p-4">
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
                <p className="text-xs text-[#a17b60]">{product.category}</p>
                <h2 className="mt-1 truncate font-semibold">{product.name}</h2>
                <p className="mt-1 font-bold">
                    {product.price.toLocaleString("mn-MN")}₮
                </p>

                <p className="mt-1 text-xs">
                    {product.isAvailable ? "Active" : "Inactive"}
                </p>

                <div className="mt-3 flex gap-3 text-sm">
                    <button
                        onClick={() => onEdit(product)}
                        className="font-semibold text-[#6d4936]"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => onToggle(product)}
                        disabled={busy}
                        className="text-gray-600 disabled:opacity-50"
                    >
                        {busy
                            ? "Saving..."
                            : product.isAvailable
                                ? "Deactivate"
                                : "Activate"}
                    </button>
                </div>
            </div>
        </article>
    );
}