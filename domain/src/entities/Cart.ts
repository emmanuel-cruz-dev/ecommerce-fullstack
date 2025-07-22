export interface CartProps {
  id: string;
  userId: string;
  items: CartItemProps[];
}

export interface CartItemProps {
  productId: string;
  quantity: number;
}
