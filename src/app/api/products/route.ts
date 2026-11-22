import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/app/db";
import { products, users } from "@/app/db/schema";

const createProductSchema = z.object({
  name: z.string().trim().min(1).max(150),
  category: z.string().trim().min(1).max(100),
  price: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  description: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((val) => (val ? val : null)),
  imageUrl: z
    .string()
    .trim()
    .regex(/^https:\/\/[^ ]+$/i)
    .or(z.literal(""))
    .nullable()
    .optional()
    .transform((val) => (val ? val : null)),
});

export async function GET() {
  try {
    const data = await db
      .select()
      .from(products)
      .where(eq(products.isAvailable, true))
      .orderBy(desc(products.createdAt));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch products." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [currentUser] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (currentUser?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid product information",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const [product] = await db.insert(products).values(parsed.data).returning();

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 },
    );
  }
}
