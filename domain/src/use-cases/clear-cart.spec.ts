import { describe, test, expect, beforeEach, vi } from "vitest";
import { clearCart } from "./clear-cart";
import { CartRepository } from "../repositories/cart-repository";

describe("ClearCart Use Case", () => {
  let mockRepository: CartRepository;
  const userId = "user123";

  beforeEach(() => {
    mockRepository = {
      findCartByUserId: vi.fn(),
      saveCart: vi.fn(),
      clearCart: vi.fn(),
      removeCartItem: vi.fn(),
    };
  });

  test("should call the repository's clearCart method with the correct userId", async () => {
    vi.mocked(mockRepository.clearCart).mockResolvedValue(true);

    const result = await clearCart(userId, mockRepository);

    expect(mockRepository.clearCart).toHaveBeenCalledWith(userId);
    expect(result).toBe(true);
  });
});
