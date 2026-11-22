import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { desc, eq, inArray } from "drizzle-orm";

import { db } from "@/app/db";
import { users, products, orders, orderItems } from "@/app/db/schema";
import type { CartItem } from "@/lib/order/types";

type OrderItemDraft = Omit<typeof orderItems.$inferInsert, "orderId">;

async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  return user ?? null;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, user.id))
      .orderBy(desc(orders.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET orders:", error);

    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const items: unknown = body?.items;

    if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
      return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
    }

    const validItems: CartItem[] = [];

    for (const item of items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          item.productId,
        ) ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20
      ) {
        return NextResponse.json(
          { error: "Invalid cart item" },
          { status: 400 },
        );
      }

      validItems.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    const ids = validItems.map((item) => item.productId);

    if (new Set(ids).size !== ids.length) {
      return NextResponse.json(
        { error: "Duplicate product IDs" },
        { status: 400 },
      );
    }

    const availableProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, ids));

    const productMap = new Map(
      availableProducts.map((product) => [product.id, product]),
    );

    const lineItems: OrderItemDraft[] = [];

    for (const item of validItems) {
      const product = productMap.get(item.productId);

      if (
        !product ||
        !product.isAvailable ||
        !Number.isSafeInteger(product.price) ||
        product.price <= 0
      ) {
        return NextResponse.json(
          { error: "Product unavailable" },
          { status: 400 },
        );
      }

      const subtotal = product.price * item.quantity;

      if (!Number.isSafeInteger(subtotal)) {
        return NextResponse.json(
          { error: "Invalid order amount" },
          { status: 400 },
        );
      }

      lineItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      });
    }

    const totalAmount = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

    if (
      !Number.isSafeInteger(totalAmount) ||
      totalAmount <= 0 ||
      totalAmount > 2147483647
    ) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 },
      );
    }

    const order = await db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(orders)
        .values({
          userId: user.id,
          totalAmount,
          status: "pending",
        })
        .returning();

      await tx.insert(orderItems).values(
        lineItems.map((item) => ({
          orderId: newOrder.id,
          ...item,
        })),
      );

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST orders:", error);

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
