import { describe, test, expect, beforeEach, vi } from "vitest";
import { removeFromCart, RemoveFromCartRequest } from "./remove-from-cart";
import { CartRepository } from "../repositories/cart-repository";

describe("RemoveFromCart Use Case", () => {
  let mockRepository: CartRepository;
  const request: RemoveFromCartRequest = {
    userId: "user123",
    productId: "prod456",
  };

  beforeEach(() => {
    mockRepository = {
      findCartByUserId: vi.fn(),
      saveCart: vi.fn(),
      clearCart: vi.fn(),
      removeCartItem: vi.fn(),
    };
  });

  test("should return true when a product is successfully removed from the cart", async () => {
    vi.mocked(mockRepository.removeCartItem).mockResolvedValue(true);

    const result = await removeFromCart(request, mockRepository);

    expect(mockRepository.removeCartItem).toHaveBeenCalledWith(
      request.userId,
      request.productId
    );
    expect(result).toBe(true);
  });

  test("should return false when the product or cart is not found", async () => {
    vi.mocked(mockRepository.removeCartItem).mockResolvedValue(false);

    const result = await removeFromCart(request, mockRepository);

    expect(mockRepository.removeCartItem).toHaveBeenCalledWith(
      request.userId,
      request.productId
    );
    expect(result).toBe(false);
  });
});
