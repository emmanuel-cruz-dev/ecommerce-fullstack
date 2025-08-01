import { CartRepository } from "../repositories/cart-repository";

export interface RemoveFromCartRequest {
  userId: string;
  productId: string;
}

export async function removeFromCart(
  request: RemoveFromCartRequest,
  repository: CartRepository
): Promise<boolean> {
  const { userId, productId } = request;
  return repository.removeCartItem(userId, productId);
}
