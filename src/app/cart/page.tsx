
"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useCart } from "@/components/cart/cart-provider";
import CartItemCard from "@/components/cart/cart-item-card";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";

export default function CartPage() {
    const { items, total, clearCart, ready } = useCart();

    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState("");
    const [orderId, setOrderId] = useState<string | null>(null);

    async function handleCheckout() {
        if (!ready || items.length === 0 || placing) return;

        setPlacing(true);
        setError("");

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Order failed");
            }

            setOrderId(data.id);
            clearCart();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong"
            );
        } finally {
            setPlacing(false);
        }
    }

    if (orderId) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] p-6">
                <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-sm">
                    <div className="text-6xl">✅</div>

                    <h1 className="mt-5 text-3xl font-bold">
                        Order Placed!
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Your order has been received.
                    </p>

                    <p className="mt-4 break-all text-xs text-gray-400">
                        Order ID: {orderId}
                    </p>

                    <Link
                        href="/menu"
                        className="mt-8 inline-block rounded-xl bg-[#6d4936] px-6 py-3 text-white"
                    >
                        Back to Menu
                    </Link>
                    <Link
                        href="/orders"
                        className="rounded-xl bg-[#6d4936] px-6 py-3 text-white"
                    >
                        View My Orders
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] flex items-center justify-center p-5">
            <CoffeeBackground />
            <div className="relative mx-auto max-w-5xl">
                <header className="flex items-center justify-between flex-col">
                    <div>
                        <Link
                            href="/menu"
                            className="animate-fade-up delay-100 text-xs md:text-sm tracking-[0.5em] font-sans uppercase text-amber-200/80"
                        >
                            ← Back to Menu
                        </Link>

                        <h1 className="animate-fade-up delay-200 font-bold font-sans mt-3 text-6xl md:text-6xl leading-tight bg-linear-to-bl from-[#ffffff] to-[#eed70a] bg-clip-text text-transparent">
                            Your Cart
                        </h1>
                    </div>

                    <div className="flex mt-5 items-center justify-end gap-2"><p className="animate-fade-up delay-100 text-xs md:text-sm tracking-[0.3em] font-bold uppercase text-amber-200/80">My Account</p>
                        <UserButton appearance={{ elements: { avatarBox: "h-20 w-20" } }} />


                    </div>
                </header>

                {!ready ? (
                    <p className="mt-10 text-gray-500">Loading cart...</p>
                ) : items.length === 0 ? (
                    <div className="mt-10 rounded-2xl bg-white p-12 text-center">
                        <p className="text-5xl">🛒</p>
                        <h2 className="mt-4 text-xl font-semibold">
                            Your cart is empty
                        </h2>
                        <Link
                            href="/menu"
                            className="mt-5 inline-block text-[#6d4936] underline"
                        >
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-8 lg:grid-cols-3">
                        <section className="space-y-4 lg:col-span-2">
                            {items.map((item) => (
                                <CartItemCard key={item.id} item={item} />
                            ))}
                        </section>

                        <aside className="h-fit rounded-2xl border border-[#eee5dc] bg-white p-6">
                            <h2 className="text-xl font-bold">
                                Order Summary
                            </h2>

                            <div className="mt-6 flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>{total.toLocaleString("mn-MN")}₮</span>
                            </div>

                            <div className="mt-4 flex justify-between text-gray-500">
                                <span>Discount</span>
                                <span>0₮</span>
                            </div>

                            <div className="my-5 border-t" />

                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span>{total.toLocaleString("mn-MN")}₮</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={placing}
                                className="mt-6 w-full rounded-xl bg-[#6d4936] py-4 font-semibold text-white disabled:opacity-50"
                            >
                                {placing ? "Placing Order..." : "Place Order"}
                            </button>

                            {error && (
                                <p role="alert" className="mt-4 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <p className="mt-4 text-xs leading-5 text-gray-500">
                                Final prices are verified when you place your order.
                            </p>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}
