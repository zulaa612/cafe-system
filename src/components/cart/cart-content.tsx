
"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useCart } from "@/components/cart/cart-provider";
import CartItemCard from "@/components/cart/cart-item-card";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";

type Props = {
    placing: boolean;
    error: string;
    onCheckout: () => void;
};

export default function CartContent({
    placing,
    error,
    onCheckout,
}: Props) {
    const { items, total, ready } = useCart();

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] p-5">
            <CoffeeBackground />

            <div className="relative mx-auto w-full max-w-5xl">
                <header className="flex flex-col items-center justify-between">
                    <Link
                        href="/menu"
                        className="text-sm uppercase tracking-[0.5em] text-amber-200/80"
                    >
                        ← Back to Menu
                    </Link>

                    <h1 className="mt-3 bg-linear-to-bl from-white to-[#eed70a] bg-clip-text text-6xl font-bold text-transparent">
                        Your Cart
                    </h1>

                    <div className="mt-5 flex items-center gap-3 text-amber-200">
                        My Account
                        <UserButton appearance={{
                            elements: { avatarBox: "h-20 w-20" },
                        }} />
                    </div>
                </header>

                {!ready ? (
                    <p className="mt-10 text-center text-white">Loading...</p>
                ) : items.length === 0 ? (
                    <div className="mt-10 rounded-2xl bg-white p-12 text-center">
                        <p className="text-5xl">🛒</p>
                        <h2 className="mt-4 text-xl font-semibold">
                            Your cart is empty
                        </h2>
                        <Link href="/menu" className="text-[#6d4936]">
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

                        <aside className="h-fit rounded-2xl bg-white p-6">
                            <h2 className="text-xl font-bold">Order Summary</h2>

                            <div className="mt-6 flex justify-between">
                                <span>Subtotal</span>
                                <span>{total.toLocaleString("mn-MN")}₮</span>
                            </div>

                            <div className="mt-4 flex justify-between">
                                <span>Discount</span>
                                <span>0₮</span>
                            </div>

                            <hr className="my-5" />

                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span>{total.toLocaleString("mn-MN")}₮</span>
                            </div>

                            <button
                                onClick={onCheckout}
                                disabled={placing}
                                className="mt-6 w-full rounded-xl bg-[#6d4936] py-4 font-semibold text-white disabled:opacity-50"
                            >
                                {placing ? "Placing..." : "Place Order"}
                            </button>

                            {error && (
                                <p role="alert" className="mt-4 text-sm text-red-600">
                                    {error}
                                </p>
                            )}
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}
