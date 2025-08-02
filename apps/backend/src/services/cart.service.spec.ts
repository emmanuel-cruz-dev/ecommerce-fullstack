import { describe, beforeEach, test, vi, expect } from "vitest";
import cartService from "./cart.service";
import cartRepository from "../data/cart.repository";
import { Cart } from "@domain/src/entities/Cart";

vi.mock("../data/cart.repository.ts");
vi.mock("uuid", () => ({ v4: () => "mock-uuid" }));

describe("Cart Service", () => {
  const userId = "user-123";
  const productId = "prod-abc";
  const newProduct = {
    productId: productId,
    productName: "Test Product",
    productPrice: 10,
    quantity: 1,
    userId: userId,
  };

  const existingCart: Cart = {
    id: "cart-123",
    userId: userId,
    items: [
      { productId: "prod-xyz", quantity: 5 },
      { productId: productId, quantity: 2 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCartContent", () => {
    test("should return the cart content for a given user ID", async () => {
      vi.mocked(cartRepository.findCartByUserId).mockResolvedValue(
        existingCart
      );

      const result = await cartService.getCartContent(userId);

      expect(result).toEqual(existingCart);
      expect(cartRepository.findCartByUserId).toHaveBeenCalledWith(userId);
    });

    test("should return null if the cart does not exist", async () => {
      vi.mocked(cartRepository.findCartByUserId).mockResolvedValue(null);

      const result = await cartService.getCartContent(userId);

      expect(result).toBeNull();
      expect(cartRepository.findCartByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe("addToCart", () => {
    test("should add a new cart if one does not exist", async () => {
      vi.mocked(cartRepository.findCartByUserId).mockResolvedValue(null);
      const newCart: Cart = {
        id: "mock-uuid",
        userId: userId,
        items: [{ productId: productId, quantity: 1 }],
      };
      vi.mocked(cartRepository.saveCart).mockResolvedValue(newCart);

      const result = await cartService.addToCart(newProduct);

      expect(result).toEqual(newCart);
      expect(cartRepository.findCartByUserId).toHaveBeenCalledWith(userId);
      expect(cartRepository.saveCart).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "mock-uuid",
          userId: userId,
          items: [{ productId: productId, quantity: 1 }],
        })
      );
    });

    test("should add a new product to an existing cart", async () => {
      vi.mocked(cartRepository.findCartByUserId).mockResolvedValue({
        ...existingCart,
        items: [{ productId: "other-prod", quantity: 1 }],
      });
      const updatedCart: Cart = {
        ...existingCart,
        items: [
          { productId: "other-prod", quantity: 1 },
          { productId: productId, quantity: 1 },
        ],
      };
      vi.mocked(cartRepository.saveCart).mockResolvedValue(updatedCart);

      const result = await cartService.addToCart(newProduct);

      expect(result).toEqual(updatedCart);
      expect(cartRepository.findCartByUserId).toHaveBeenCalledWith(userId);
      expect(cartRepository.saveCart).toHaveBeenCalledWith(updatedCart);
    });

    test("should increase quantity if the product already exists in the cart", async () => {
      vi.mocked(cartRepository.findCartByUserId).mockResolvedValue(
        existingCart
      );
      const updatedCart: Cart = {
        ...existingCart,
        items: [
          { productId: "prod-xyz", quantity: 5 },
          { productId: productId, quantity: 3 }, // 2 + 1 = 3
        ],
      };
      vi.mocked(cartRepository.saveCart).mockResolvedValue(updatedCart);

      const result = await cartService.addToCart(newProduct);

      expect(result).toEqual(updatedCart);
      expect(cartRepository.findCartByUserId).toHaveBeenCalledWith(userId);
      expect(cartRepository.saveCart).toHaveBeenCalledWith(updatedCart);
    });
  });

  describe("clearCart", () => {
    test("should call the repository to clear the cart", async () => {
      vi.mocked(cartRepository.clearCart).mockResolvedValue(true);

      const result = await cartService.clearCart(userId);

      expect(result).toBe(true);
      expect(cartRepository.clearCart).toHaveBeenCalledWith(userId);
    });
  });

  describe("removeFromCart", () => {
    test("should call the repository to remove a cart item", async () => {
      vi.mocked(cartRepository.removeCartItem).mockResolvedValue(true);

      const result = await cartService.removeFromCart(userId, productId);

      expect(result).toBe(true);
      expect(cartRepository.removeCartItem).toHaveBeenCalledWith(
        userId,
        productId
      );
    });
  });
});
