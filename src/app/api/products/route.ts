import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { connection } from "next/server";

export async function GET() {
  await connection();
  
  try {
    const access = await requireAdmin();

    if (!access.authorized) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: access.status },
      );
    }

    const data = await db.select().from(products);

    return NextResponse.json(data);
  } catch (error) {
    console.error("ADMIN PRODUCTS GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 },
    );
  }
}
