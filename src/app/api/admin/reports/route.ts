import { connection, NextResponse } from "next/server";
import { sql, type SQL } from "drizzle-orm";
import { db } from "@/app/db";
import { orders } from "@/app/db/schema";
import { requireAdmin } from "@/lib/require-admin";

type Period = "today" | "week" | "month" | "all";

const periods: Period[] = ["today", "week", "month", "all"];

const localNow = sql`
  (now() AT TIME ZONE 'Asia/Ulaanbaatar')
`;

const paidDate = sql`
  (COALESCE(${orders.paidAt}, ${orders.createdAt})
    AT TIME ZONE 'Asia/Ulaanbaatar')
`;

const createdDate = sql`
  (${orders.createdAt} AT TIME ZONE 'Asia/Ulaanbaatar')
`;

function dateFilter(date: SQL, period: Period) {
  if (period === "all") return sql`true`;

  const days = period === "today" ? 0 : period === "week" ? 6 : 29;

  return sql`
    ${date} >= date_trunc('day', ${localNow})
      - (${days} * interval '1 day')
    AND ${date} < date_trunc('day', ${localNow})
      + interval '1 day'
  `;
}

export async function GET(request: Request) {
  await connection();

  try {
    const access = await requireAdmin();

    if (!access.authorized) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: access.status },
      );
    }

    const { searchParams } = new URL(request.url);
    const input = searchParams.get("period") ?? "today";

    if (!periods.includes(input as Period)) {
      return NextResponse.json({ error: "Invalid period" }, { status: 400 });
    }

    const period = input as Period;

    const paidFilter = sql`
      ${orders.paymentStatus} = 'paid'
      AND ${dateFilter(paidDate, period)}
    `;

    const awaitingFilter = sql`
      ${orders.paymentStatus} IN ('unpaid', 'pending')
      AND ${dateFilter(createdDate, period)}
    `;

    const [summary] = await db
      .select({
        revenue: sql<string>`
          COALESCE(
            SUM(${orders.totalAmount})
            FILTER (WHERE ${paidFilter}),
            0
          )::text
        `,
        paidOrders: sql<number>`
          COUNT(*) FILTER (WHERE ${paidFilter})::int
        `,
        awaitingPayment: sql<number>`
          COUNT(*) FILTER (WHERE ${awaitingFilter})::int
        `,
      })
      .from(orders);

    const bucket =
      period === "today"
        ? sql`date_trunc('hour', ${paidDate})`
        : period === "all"
          ? sql`date_trunc('month', ${paidDate})`
          : sql`date_trunc('day', ${paidDate})`;

    const format =
      period === "today"
        ? sql`'HH24'`
        : period === "all"
          ? sql`'YYYY-MM'`
          : sql`'YYYY-MM-DD'`;

    const trend = await db
      .select({
        label: sql<string>`to_char(${bucket}, ${format})`,
        revenue: sql<string>`
      SUM(${orders.totalAmount})::text
    `,
      })
      .from(orders)
      .where(paidFilter)
      .groupBy(bucket)
      .orderBy(bucket);

    const totalRevenue = Number(summary.revenue);
    const paidOrders = summary.paidOrders;

    return NextResponse.json({
      period,
      totalRevenue,
      paidOrders,
      awaitingPayment: summary.awaitingPayment,
      averageOrder: paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0,
      trend: trend.map((item) => ({
        label: item.label,
        revenue: Number(item.revenue),
      })),
    });
  } catch (error) {
    console.error("GET sales report:", error);

    return NextResponse.json(
      { error: "Failed to load sales report" },
      { status: 500 },
    );
  }
}
