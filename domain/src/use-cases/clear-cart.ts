import { CartRepository } from "../repositories/cart-repository";

export async function clearCart(
  userId: string,
  repository: CartRepository
): Promise<boolean> {
  return repository.clearCart(userId);
}
