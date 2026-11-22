import { NextResponse } from "next/server";
import { desc, eq, inArray } from "drizzle-orm";

import { db } from "@/app/db";
import { orders, orderItems, users } from "@/app/db/schema";
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
      .select({
        id: orders.id,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        customerName: users.name,
        customerPhone: users.phone,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(100);

    if (data.length === 0) {
      return NextResponse.json([]);
    }

    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productName: orderItems.productName,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        subtotal: orderItems.subtotal,
      })
      .from(orderItems)
      .where(
        inArray(
          orderItems.orderId,
          data.map((order) => order.id),
        ),
      );

    const result = data.map((order) => ({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),

      customer: {
        name: order.customerName,
        phone: order.customerPhone,
      },

      items: items
        .filter((item) => item.orderId === order.id)
        .map(({ orderId, ...item }) => item),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET admin orders:", error);

    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 },
    );
  }
}
