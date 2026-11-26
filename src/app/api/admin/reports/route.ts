import { connection, NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { db } from "@/app/db";
import { orders } from "@/app/db/schema";
import { requireAdmin } from "@/lib/require-admin";

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

    const [report] = await db
      .select({
        totalRevenue: sql<string>`
          COALESCE(
            SUM(${orders.totalAmount})
            FILTER (WHERE ${orders.paymentStatus} = 'paid'),
            0
          )::text
        `,

        paidOrders: sql<number>`
          COUNT(*) FILTER (
            WHERE ${orders.paymentStatus} = 'paid'
          )::int
        `,

        awaitingPayment: sql<number>`
          COUNT(*) FILTER (
            WHERE ${orders.paymentStatus} IN ('unpaid', 'pending')
          )::int
        `,
      })
      .from(orders);

    const totalRevenue = Number(report.totalRevenue);
    const paidOrders = report.paidOrders;

    return NextResponse.json({
      totalRevenue,
      paidOrders,
      awaitingPayment: report.awaitingPayment,
      averageOrder: paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0,
    });
  } catch (error) {
    console.error("GET sales report:", error);

    return NextResponse.json(
      { error: "Failed to load sales report" },
      { status: 500 },
    );
  }
}
