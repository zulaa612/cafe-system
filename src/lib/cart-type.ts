export type CartProduct = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
};

export type CartItem = CartProduct & {
  quantity: number;
};
