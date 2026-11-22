import { Suspense } from "react";
import { redirect } from "next/navigation";

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
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#faf7f2] p-10">
                    <div className="mx-auto max-w-6xl animate-pulse space-y-5">
                        <div className="h-10 w-48 rounded-xl bg-gray-200" />
                        <div className="h-32 rounded-2xl bg-gray-200" />
                        <div className="h-64 rounded-2xl bg-gray-200" />
                    </div>
                </div>
            }
        >
            <OrdersContent />
        </Suspense>
    );
}