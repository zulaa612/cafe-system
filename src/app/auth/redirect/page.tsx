import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";

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

    redirect("/onboarding");

    return null;
}

export default function AuthRedirectPage() {
    return (
        <Suspense fallback={<p className="p-10">Loading...</p>}>
            <RedirectByRole />
        </Suspense>
    );
}