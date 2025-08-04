import { describe, beforeEach, test, expect } from "vitest";
import cartRepository from "./cart.repository";
import { cartsDB } from "../database/cart.db";
import { Cart } from "@domain/src/entities/Cart";

describe("Cart Repository", () => {
  const mockCart: Cart = {
    id: "cart-123",
    userId: "user-123",
    items: [
      { productId: "prod-abc", quantity: 2 },
      { productId: "prod-xyz", quantity: 5 },
    ],
  };

  beforeEach(() => {
    cartsDB.length = 0;
    cartsDB.push(mockCart);
  });

  describe("findCartByUserId", () => {
    test("should return the cart if a matching userId is found", async () => {
      const foundCart = await cartRepository.findCartByUserId("user-123");
      expect(foundCart).toEqual(mockCart);
    });

    test("should return null if no cart is found for the given userId", async () => {
      const foundCart = await cartRepository.findCartByUserId(
        "non-existent-user"
      );
      expect(foundCart).toBeNull();
    });
  });

  describe("saveCart", () => {
    test("should save a new cart to the database", async () => {
      const newCart: Cart = {
        id: "cart-456",
        userId: "user-456",
        items: [],
      };
      const savedCart = await cartRepository.saveCart(newCart);

      expect(savedCart).toEqual(newCart);
      expect(cartsDB.length).toBe(2);
      expect(cartsDB).toContainEqual(newCart);
    });

    test("should update an existing cart in the database", async () => {
      const updatedCart: Cart = {
        ...mockCart,
        items: [{ productId: "prod-abc", quantity: 10 }],
      };
      const savedCart = await cartRepository.saveCart(updatedCart);

      expect(savedCart).toEqual(updatedCart);
      expect(cartsDB.length).toBe(1);
      expect(cartsDB[0]).toEqual(updatedCart);
    });
  });

  describe("clearCart", () => {
    test("should remove the cart from the database if a matching userId is found", async () => {
      const isCleared = await cartRepository.clearCart("user-123");
      expect(isCleared).toBe(true);
      expect(cartsDB.length).toBe(0);
    });

    test("should return false if no cart is found for the given userId", async () => {
      const isCleared = await cartRepository.clearCart("non-existent-user");
      expect(isCleared).toBe(false);
      expect(cartsDB.length).toBe(1);
    });
  });

  describe("removeCartItem", () => {
    const initialCart = {
      id: "cart-123",
      userId: "user-123",
      items: [
        { productId: "prod-abc", quantity: 2 },
        { productId: "prod-xyz", quantity: 5 },
      ],
    };

    beforeEach(() => {
      cartsDB.length = 0;
      cartsDB.push(JSON.parse(JSON.stringify(initialCart)));
    });

    test("should remove a specific item from the cart and return true", async () => {
      const isRemoved = await cartRepository.removeCartItem(
        "user-123",
        "prod-abc"
      );

      expect(isRemoved).toBe(true);
      expect(cartsDB[0].items.length).toBe(1);
      expect(cartsDB[0].items[0]).toEqual({
        productId: "prod-xyz",
        quantity: 5,
      });
    });

    test("should return false if the cart is not found", async () => {
      const isRemoved = await cartRepository.removeCartItem(
        "non-existent-user",
        "prod-abc"
      );

      expect(isRemoved).toBe(false);
      expect(cartsDB.length).toBe(1);
    });

    test("should return false if the item is not found in the cart", async () => {
      const isRemoved = await cartRepository.removeCartItem(
        "user-123",
        "non-existent-prod"
      );

      expect(isRemoved).toBe(false);
      expect(cartsDB[0].items.length).toBe(2);
    });
  });
});
