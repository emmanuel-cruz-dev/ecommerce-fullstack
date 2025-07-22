import { beforeEach, describe, expect, it } from "vitest";
import { AddToCart, AddToCartRequest } from "./add-to-cart";
import {
  mockCartRepository,
  MockedCartRepository,
} from "../mocks/cart-repository-mock";
import { CartProps } from "../entities/Cart";

describe("AddToCart Use Case", () => {
  let validRequest: AddToCartRequest;
  let mockRepository: MockedCartRepository;

  beforeEach(() => {
    validRequest = {
      userId: "user-1",
      productId: "product-1",
      productName: "Test Product",
      productPrice: "19.99",
      quantity: 2,
    };

    mockRepository = mockCartRepository();
  });

  it("should create a new cart when user has no existing cart", async () => {
    const cart = await AddToCart(validRequest, mockRepository);

    expect(cart.userId).toBe(validRequest.userId);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]).toEqual({
      productId: validRequest.productId,
      quantity: validRequest.quantity,
    });
    expect(mockRepository.carts).toHaveLength(1);
  });

  it("should throw an error if userId is missing", async () => {
    const invalidRequest = { ...validRequest, userId: "" };
    await expect(() =>
      AddToCart(invalidRequest, mockRepository)
    ).rejects.toThrow("User ID is required");
  });

  it("should throw an error if productId is missing", async () => {
    const invalidRequest = { ...validRequest, productId: "" };
    await expect(() =>
      AddToCart(invalidRequest, mockRepository)
    ).rejects.toThrow("Product ID is required");
  });

  it("should throw an error if productName is missing", async () => {
    const invalidRequest = { ...validRequest, productName: "" };
    await expect(() =>
      AddToCart(invalidRequest, mockRepository)
    ).rejects.toThrow("Product name is required");
  });

  it("should throw an error if productPrice is missing", async () => {
    const invalidRequest = { ...validRequest, productPrice: "" };
    await expect(() =>
      AddToCart(invalidRequest, mockRepository)
    ).rejects.toThrow("Product price is required");
  });

  it("should throw an error if quantity is zero or negative", async () => {
    const invalidRequest = { ...validRequest, quantity: 0 };
    await expect(() =>
      AddToCart(invalidRequest, mockRepository)
    ).rejects.toThrow("Quantity must be greater than 0");
  });
});
