export type OrderStatus = "pending" | "preparing" | "ready" | "cancelled";

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
};
