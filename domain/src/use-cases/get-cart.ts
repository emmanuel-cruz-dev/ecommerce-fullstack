import { Cart } from "../entities/Cart";
import { CartRepository } from "../repositories/cart-repository";

/**
 * @param userId
 * @param repository
 * @returns
 */
export async function getCart(
  userId: string,
  repository: CartRepository
): Promise<Cart | null> {
  const cart = repository.findCartByUserId(userId);
  return cart || null;
}
