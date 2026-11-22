"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./cart-provider";
import type { CartItem } from "@/lib/cart-type";

export default function CartItemCard({
    item,
}: {
    item: CartItem;
}) {
    const { increase, decrease, removeItem } = useCart();

    return (
        <div className="flex gap-4 rounded-2xl border border-[#eee5dc] bg-white p-4">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#eee5dc]">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-4xl">☕</span>
                )}
            </div>

            <div className="flex-1">
                <div className="flex justify-between gap-2">
                    <h3 className="font-semibold">{item.name}</h3>

                    <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="text-red-500"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                    {item.price.toLocaleString("mn-MN")}₮ each
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => decrease(item.id)}
                            aria-label={`Decrease ${item.name}`}
                            className="rounded-lg border p-2"
                        >
                            <Minus size={16} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                            onClick={() => increase(item.id)}
                            disabled={item.quantity >= 20}
                            aria-label={`Increase ${item.name}`}
                            className="rounded-lg border p-2 disabled:opacity-40"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <p className="font-bold">
                        {(item.price * item.quantity).toLocaleString("mn-MN")}₮
                    </p>
                </div>
            </div>
        </div>
    );
}