export type Period = "today" | "week" | "month" | "all";

export type TrendItem = {
  label: string;
  revenue: number;
};

export type Report = {
  period: Period;
  totalRevenue: number;
  paidOrders: number;
  awaitingPayment: number;
  averageOrder: number;
  trend: TrendItem[];
};

export const formatMoney = (value: number) =>
  `${value.toLocaleString("mn-MN")}₮`;
