import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/app/db";
import { products } from "@/app/db/schema";

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
