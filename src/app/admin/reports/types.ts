export type Period = "today" | "week" | "month" | "all";

export type TrendItem = {
  label: string;
  revenue: number;
};

export type TopProduct = {
  productName: string;
  quantity: number;
  revenue: number;
};

export type Report = {
  period: Period;
  totalRevenue: number;
  paidOrders: number;
  awaitingPayment: number;
  averageOrder: number;
  trend: TrendItem[];
  topProducts: TopProduct[];
};

export const formatMoney = (value: number) =>
  `${value.toLocaleString("mn-MN")}₮`;
