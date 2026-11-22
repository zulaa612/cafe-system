export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
};

export type ProductFormData = {
  name: string;
  description: string;
  category: string;
  price: string;
  imageUrl: string;
};

export const emptyForm: ProductFormData = {
  name: "",
  description: "",
  category: "Coffee",
  price: "",
  imageUrl: "",
};
