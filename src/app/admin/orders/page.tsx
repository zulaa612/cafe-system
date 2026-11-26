import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";
import { requireAdmin } from "@/lib/require-admin";
import OrdersManager from "./order-manager";

async function OrdersContent() {
    const access = await requireAdmin();

    if (!access.authorized) {
        if (access.status === 401) {
            redirect("/sign-in");
        }

        redirect("/menu");
    }

    return <OrdersManager />;
}

export default function AdminOrdersPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] flex items-center justify-center p-5">
            <CoffeeBackground />
            <Suspense
                fallback={
                    <div className="mx-auto max-w-6xl animate-pulse space-y-5">
                        <div className="h-10 w-48 rounded-xl bg-gray-200" />
                        <div className="h-32 rounded-2xl bg-gray-200" />
                        <div className="h-64 rounded-2xl bg-gray-200" />
                    </div>
                }
            >
                <OrdersContent />
            </Suspense>
        </main>
    );
}