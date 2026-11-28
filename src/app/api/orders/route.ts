import { connection, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/app/db";
import { users, orders, products, orderItems } from "@/app/db/schema";

type CartItem = {
  productId: string;
  quantity: number;
};

export async function GET() {
  await connection();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await db
      .select({
        id: orders.id,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        customerName: users.name,
        customerPhone: users.phone,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(
        sql`
    ${orders.createdAt} >= (
      (date_trunc(
        'day',
        NOW() AT TIME ZONE 'Asia/Ulaanbaatar'
      )) AT TIME ZONE 'Asia/Ulaanbaatar'
    )
    AND
    ${orders.createdAt} < (
      (date_trunc(
        'day',
        NOW() AT TIME ZONE 'Asia/Ulaanbaatar'
      ) + INTERVAL '1 day') AT TIME ZONE 'Asia/Ulaanbaatar'
    )
  `,
      )
      .orderBy(desc(orders.createdAt))
      .limit(100);
      
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
  await connection();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    const items: unknown = body?.items;

    if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
      return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
    }

    const cart: CartItem[] = [];

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

      cart.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    const ids = cart.map((item) => item.productId);

    if (new Set(ids).size !== ids.length) {
      return NextResponse.json(
        { error: "Duplicate product IDs" },
        { status: 400 },
      );
    }

    const foundProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, ids));

    const productMap = new Map(
      foundProducts.map((product) => [product.id, product]),
    );

    const lineItems = cart.map((item) => {
      const product = productMap.get(item.productId);

      if (
        !product ||
        !product.isAvailable ||
        !Number.isSafeInteger(product.price) ||
        product.price <= 0
      ) {
        throw new Error("Product unavailable");
      }

      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: product.price * item.quantity,
      };
    });

    const totalAmount = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

    if (
      !Number.isSafeInteger(totalAmount) ||
      totalAmount <= 0 ||
      totalAmount > 2147483647 ||
      lineItems.some((item) => !Number.isSafeInteger(item.subtotal))
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
          status: "pending",
          paymentStatus: "unpaid",
          totalAmount,
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
