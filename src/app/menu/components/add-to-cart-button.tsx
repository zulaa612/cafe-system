"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import type { CartProduct } from "@/lib/cart-type";

export default function AddToCartButton({
    product,
}: {
    product: CartProduct;
}) {
    const { addItem, items, ready } = useCart();

    const quantity =
        items.find((item) => item.id === product.id)?.quantity ?? 0;

    return (
        <button
            type="button"
            disabled={!ready || quantity >= 20}
            onClick={() => addItem(product)}
            className="flex items-center gap-2 rounded-xl bg-[#6d4936] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#543725] disabled:opacity-50"
        >
            <ShoppingCart size={16} />
            {quantity > 0 ? `Added (${quantity})` : "Add to Cart"}
        </button>
    );
}