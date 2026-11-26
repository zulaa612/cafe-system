import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/app/db";
import { orders } from "@/app/db/schema";
import { wireRequest } from "@/lib/wire";

type WireEvent = {
  id: string;
  type: string;
  data?: {
    id: string;
  };
};

function verifySignature(raw: string, header: string) {
  const secret = process.env.WIRE_WEBHOOK_SECRET;

  if (!secret) return "missing_secret";
  if (!header) return "missing_header";

  const parts = Object.fromEntries(
    header.split(",").map((part) => {
      const index = part.indexOf("=");
      return [part.slice(0, index).trim(), part.slice(index + 1).trim()];
    }),
  );

  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) return "invalid_header";

  if (!/^\d+$/.test(timestamp) || !/^[a-f0-9]{64}$/i.test(signature)) {
    return "invalid_format";
  }

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));

  if (age > 300) return "expired_timestamp";

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${raw}`)
    .digest();

  const received = Buffer.from(signature, "hex");

  if (!crypto.timingSafeEqual(expected, received)) {
    return "signature_mismatch";
  }

  return "valid";
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Wire webhook endpoint is reachable",
  });
}

export async function POST(request: Request) {
  try {
    const raw = await request.text();

    const signature = request.headers.get("WirePayment-Signature") ?? "";

    console.log("WIRE WEBHOOK RECEIVED", {
      hasSignature: Boolean(signature),
      hasSecret: Boolean(process.env.WIRE_WEBHOOK_SECRET),
    });

    const result = verifySignature(raw, signature);

    if (result !== "valid") {
      console.error("WIRE SIGNATURE FAILED:", result);

      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(raw) as WireEvent;

    console.log("WIRE EVENT:", event.type);

    if (event.type === "endpoint.verification") {
      console.log("WIRE ENDPOINT VERIFIED");

      return NextResponse.json({ received: true }, { status: 200 });
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
      console.error("WIRE PAYMENT MISMATCH");

      return NextResponse.json({ error: "Payment mismatch" }, { status: 409 });
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json({
        received: true,
        alreadyPaid: true,
      });
    }

    const updated = await db
      .update(orders)
      .set({
        paymentStatus: "paid",
        paidAt: new Date(),
      })
      .where(
        and(
          eq(orders.id, order.id),
          eq(orders.wireIntentId, intent.id),
          inArray(orders.paymentStatus, ["unpaid", "pending"]),
        ),
      )
      .returning({ id: orders.id });

    if (updated.length === 0) {
      console.error("WIRE ORDER UPDATE SKIPPED");

      return NextResponse.json(
        { error: "Payment state conflict" },
        { status: 500 },
      );
    }

    console.log("WIRE PAYMENT SUCCESS");

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("WIRE WEBHOOK ERROR:", error);

    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
