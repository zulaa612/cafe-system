import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { requireAdmin } from "@/lib/require-admin";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Context) {
  try {
    const access = await requireAdmin();

    if (!access.authorized) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: access.status },
      );
    }

    const { id } = await params;

    if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const updates: {
      name?: string;
      category?: string;
      price?: number;
      description?: string | null;
      imageUrl?: string | null;
      isAvailable?: boolean;
    } = {};

    if ("name" in body) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim() ||
        body.name.trim().length > 150
      ) {
        return NextResponse.json({ error: "Invalid name" }, { status: 400 });
      }
      updates.name = body.name.trim();
    }

    if ("category" in body) {
      if (
        typeof body.category !== "string" ||
        !body.category.trim() ||
        body.category.trim().length > 100
      ) {
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 },
        );
      }
      updates.category = body.category.trim();
    }

    if ("price" in body) {
      if (!Number.isSafeInteger(body.price) || body.price <= 0) {
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      }
      updates.price = body.price;
    }

    if ("description" in body) {
      if (body.description !== null && typeof body.description !== "string") {
        return NextResponse.json(
          { error: "Invalid description" },
          { status: 400 },
        );
      }
      updates.description = body.description?.trim() || null;
    }

    if ("imageUrl" in body) {
      if (
        body.imageUrl !== null &&
        (typeof body.imageUrl !== "string" ||
          (body.imageUrl !== "" && !isHttpsUrl(body.imageUrl)))
      ) {
        return NextResponse.json(
          { error: "Invalid image URL" },
          { status: 400 },
        );
      }
      updates.imageUrl = body.imageUrl || null;
    }

    if ("isAvailable" in body) {
      if (typeof body.isAvailable !== "boolean") {
        return NextResponse.json(
          { error: "Invalid availability" },
          { status: 400 },
        );
      }
      updates.isAvailable = body.isAvailable;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No changes provided" },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
