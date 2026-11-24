import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";

async function RedirectByRole() {
    const { userId } = await auth();

    if (!userId) redirect("/sign-in");

    const [user] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.clerkId, userId))
        .limit(1);

    if (!user) redirect("/onboarding");

    if (user.role === "admin") {
        redirect("/admin/products");
    }

    if (user.role === "customer") {
        redirect("/menu");
    }

    redirect("/menu");

    return null;
}

export default function AuthRedirectPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] flex items-center justify-center p-5">
            <CoffeeBackground />
            <Suspense fallback={<p className="relative p-10">Loading...</p>}>
                <RedirectByRole />
            </Suspense>
        </div>
    );
}