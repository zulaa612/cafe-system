import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/app/db";
import { products, users } from "@/app/db/schema";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import AddToCartButton from "./components/add-to-cart-button";

async function DashboardContent() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userId))
        .limit(1);

    if (!currentUser) {
        redirect("/onboarding");
    }

    const data = await db
        .select()
        .from(products)
        .where(eq(products.isAvailable, true))
        .orderBy(desc(products.createdAt));

    return (
        <div className="relative mx-auto max-w-7xl">
            <h1 className="animate-fade-up delay-100 text-xs md:text-sm tracking-[0.5em] font-sans uppercase text-amber-200/80">
                Our Coffee Menu
            </h1>
            <p className="animate-fade-up delay-200 font-bold font-sans mt-3 text-6xl md:text-6xl leading-tight bg-linear-to-bl from-[#ffffff] to-[#eed70a] bg-clip-text text-transparent">
                Find your favorite.
            </p>
            <div className="flex mt-5 items-center justify-end gap-2"><p className="animate-fade-up delay-100 text-xs md:text-sm tracking-[0.3em] font-bold uppercase text-amber-200/80">My Account</p>
                <UserButton appearance={{ elements: { avatarBox: "h-20 w-20" } }} />

                <Link
                    href="/cart"
                    className="rounded-xl border border-[#e5d7c9] text-amber-200/80 px-4 py-2 text-sm font-bold hover:border-amber-300"
                >
                    🛒 Cart
                </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {data.map((product) => (
                    <div
                        key={product.id}
                        className="overflow-hidden rounded-2xl bg-white shadow-sm"
                    >
                        {product.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-56 w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-56 items-center justify-center bg-[#e9dfd2]">
                                <span className="text-5xl">☕</span>
                            </div>
                        )}

                        <div className="p-5">
                            <p className="text-sm text-[#a77c56]">{product.category}</p>
                            <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                {product.description}
                            </p>

                            <div className="mt-5 flex items-center justify-between">
                                <span className="font-bold text-[#3b2922]">
                                    {product.price.toLocaleString("mn-MN")}₮
                                </span>

                                <AddToCartButton
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        imageUrl: product.imageUrl,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] flex items-center justify-center p-5">
            <CoffeeBackground />
            <Suspense
                fallback={
                    <div className="relative mx-auto max-w-7xl text-center text-amber-100/90">
                        <p className="text-sm tracking-[0.3em] uppercase">
                            Loading coffee menu...
                        </p>
                    </div>
                }
            >
                <DashboardContent />
            </Suspense>
        </main>
    );
}