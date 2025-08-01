import { describe, test, expect, beforeEach, vi } from "vitest";
import { getCart } from "./get-cart";
import { CartRepository } from "../repositories/cart-repository";
import { Cart } from "../entities/Cart";

describe("GetCart Use Case", () => {
  let mockRepository: CartRepository;
  const userId = "user123";
  const mockCart: Cart = {
    id: "cart-1",
    userId: "user123",
    items: [{ productId: "prod-1", quantity: 2 }],
  };

  beforeEach(() => {
    mockRepository = {
      findCartByUserId: vi.fn(),
      saveCart: vi.fn(),
      clearCart: vi.fn(),
      removeCartItem: vi.fn(),
    };
  });

  test("should return the cart when it exists for the user", async () => {
    vi.mocked(mockRepository.findCartByUserId).mockResolvedValue(mockCart);

    const result = await getCart(userId, mockRepository);

    expect(mockRepository.findCartByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockCart);
  });

  test("should return null when the cart does not exist for the user", async () => {
    vi.mocked(mockRepository.findCartByUserId).mockResolvedValue(undefined);

    const result = await getCart(userId, mockRepository);

    expect(mockRepository.findCartByUserId).toHaveBeenCalledWith(userId);
    expect(result).toBeUndefined();
  });
});
