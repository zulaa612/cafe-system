import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/app/db";
import { orders } from "@/app/db/schema";
import { requireAdmin } from "@/lib/require-admin";

type Status = typeof orders.$inferSelect.status;

const transitions: Partial<Record<Status, Status[]>> = {
  pending: ["preparing", "cancelled"],
  preparing: ["ready"],
  ready: ["completed"],
};

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

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const status: unknown = body?.status;

    const validStatuses = [
      "pending",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (typeof status !== "string" || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 },
      );
    }

    const [currentOrder] = await db
      .select({ status: orders.status })
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const newStatus = status as Status;

    if (!transitions[currentOrder.status]?.includes(newStatus)) {
      return NextResponse.json(
        { error: "Invalid status transition" },
        { status: 409 },
      );
    }

    const [updated] = await db
      .update(orders)
      .set({ status: newStatus })
      .where(and(eq(orders.id, id), eq(orders.status, currentOrder.status)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Order changed. Please refresh." },
        { status: 409 },
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH admin order:", error);

    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
