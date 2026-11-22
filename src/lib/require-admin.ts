import "server-only";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return { authorized: false, status: 401 } as const;
  }

  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (user?.role !== "admin") {
    return { authorized: false, status: 403 } as const;
  }

  return { authorized: true, status: 200 } as const;
}
