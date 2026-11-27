import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import ProductsManager from "./products-manager";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";

async function AdminProductsContent() {
    const access = await requireAdmin();

    if (!access.authorized) {
        if (access.status === 401) {
            redirect("/sign-in");
        }

        redirect("/auth/redirect");
    }

    return <ProductsManager />;
}

export default function AdminProductsPage() {
    return (
        <Suspense fallback={<AdminLoading />}>
            <AdminProductsContent />
        </Suspense>
    );
}

function AdminLoading() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] flex items-center justify-center p-5">
            <CoffeeBackground />
            <div className="mx-auto max-w-6xl animate-pulse space-y-6">
                <div className="h-10 w-56 rounded-xl bg-gray-200" />
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-28 rounded-2xl bg-gray-200"
                        />
                    ))}
                </div>
                <div className="h-72 rounded-2xl bg-gray-200" />
            </div>
        </main>
    );
}