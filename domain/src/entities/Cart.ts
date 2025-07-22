import { ProductProps } from "./Product";

export interface CartProps {
  id: string;
  userId: string;
  items: ProductProps[];
}

export interface CartItemProps {
  productId: string;
  quantity: number;
}
