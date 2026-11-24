import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/app/db";
import { orders } from "@/app/db/schema";
import { wireRequest } from "@/lib/wire";

type WireEvent = {
  id: string;
  type: string;
  data: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
};

function verifySignature(raw: string, header: string) {
  const secret = process.env.WIRE_WEBHOOK_SECRET;
  if (!secret) return false;

  const timestamp = header.match(/(?:^|,)t=(\d+)/)?.[1];
  const signature = header.match(/(?:^|,)v1=([a-f0-9]+)/i)?.[1];

  if (!timestamp || !signature) return false;

  const time = Number(timestamp);
  if (!Number.isFinite(time) || Math.abs(Date.now() / 1000 - time) > 300) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${raw}`)
    .digest("hex");

  if (expected.length !== signature.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signature, "hex"),
  );
}

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    const signature = request.headers.get("WirePayment-Signature") ?? "";

    if (!verifySignature(raw, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(raw) as WireEvent;

    if (event.type === "endpoint.verification") {
      return NextResponse.json({ received: true });
    }

    if (event.type !== "payment_intent.succeeded") {
      return NextResponse.json({ received: true });
    }

    if (!event.data?.id) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const intent = await wireRequest<{
      id: string;
      status: string;
      amount: number;
      currency: string;
    }>(`/payment_intents/${event.data.id}`);

    if (intent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not confirmed" },
        { status: 409 },
      );
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.wireIntentId, intent.id))
      .limit(1);

    if (
      !order ||
      order.totalAmount !== intent.amount ||
      intent.currency !== "MNT"
    ) {
      console.error("Wire payment mismatch:", intent.id);
      return NextResponse.json({ error: "Payment mismatch" }, { status: 409 });
    }

    await db
      .update(orders)
      .set({
        paymentStatus: "paid",
        paidAt: new Date(),
      })
      .where(and(eq(orders.id, order.id), eq(orders.paymentStatus, "pending")));

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Wire webhook:", error);

    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
