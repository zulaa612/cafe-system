import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/app/db";
import { users, orders } from "@/app/db/schema";
import { wireRequest } from "@/lib/wire";

type PaymentIntent = {
  id: string;
  status: string;
};

type CheckoutSession = {
  url: string;
};

export async function POST(request: Request) {
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
      return NextResponse.json(
        { error: "Complete onboarding first" },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => null);
    const orderId = body?.orderId;

    if (typeof orderId !== "string" || !/^[0-9a-f-]{36}$/i.test(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (
      order.status !== "pending" ||
      order.paymentStatus === "paid" ||
      order.paymentStatus === "refunded"
    ) {
      return NextResponse.json(
        { error: "Order cannot be paid" },
        { status: 409 },
      );
    }

    const appUrl = process.env.APP_URL;
    if (!appUrl) throw new Error("APP_URL missing");

    let intentId = order.wireIntentId;

    if (!intentId) {
      const intent = await wireRequest<PaymentIntent>("/payment_intents", {
        method: "POST",
        idempotencyKey: `order-${order.id}-intent`,
        body: {
          amount: order.totalAmount,
          currency: "MNT",
          description: `Coffee order ${order.id}`,
          metadata: { order_id: order.id },
        },
      });

      intentId = intent.id;

      const [saved] = await db
        .update(orders)
        .set({
          wireIntentId: intentId,
          paymentStatus: "pending",
        })
        .where(
          and(
            eq(orders.id, order.id),
            eq(orders.userId, user.id),
            eq(orders.paymentStatus, "unpaid"),
          ),
        )
        .returning({ id: orders.id });

      if (!saved) {
        return NextResponse.json(
          { error: "Payment already initiated. Retry." },
          { status: 409 },
        );
      }
    }

    const checkout = await wireRequest<CheckoutSession>("/checkout/sessions", {
      method: "POST",
      idempotencyKey: `order-${order.id}-checkout`,
      body: {
        payment_intent: intentId,
        success_url: `${appUrl}/orders`,
        cancel_url: `${appUrl}/cart`,
      },
    });

    if (!checkout.url.startsWith("https://pay.wire.mn/")) {
      throw new Error("Invalid checkout URL");
    }

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("CHECKOUT FAILED:", error);

    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
