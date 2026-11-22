import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  try {
    const access = await requireAdmin();

    if (!access.authorized) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: access.status },
      );
    }

    const data = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();

    if (!access.authorized) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: access.status },
      );
    }

    const body = await request.json();

    const { name, category, price, description, imageUrl } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 150 ||
      typeof category !== "string" ||
      !category.trim() ||
      category.trim().length > 100 ||
      !Number.isSafeInteger(price) ||
      price <= 0 ||
      (description != null && typeof description !== "string") ||
      (imageUrl != null &&
        (typeof imageUrl !== "string" ||
          (imageUrl !== "" && !isHttpsUrl(imageUrl))))
    ) {
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 },
      );
    }

    const [product] = await db
      .insert(products)
      .values({
        name: name.trim(),
        category: category.trim(),
        price,
        description: description || null,
        imageUrl: imageUrl || null,
      })
      .returning();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}
