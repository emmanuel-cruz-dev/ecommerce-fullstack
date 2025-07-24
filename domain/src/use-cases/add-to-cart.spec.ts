import { beforeEach, describe, expect, test } from "vitest";
import { AddToCart, AddToCartRequest } from "./add-to-cart";
import {
  mockCartRepository,
  MockedCartRepository,
} from "../mocks/cart-repository-mock";

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

  test("should create a new cart when user has no existing cart", async () => {
    const cart = await AddToCart(validRequest, mockRepository);

    expect(cart.userId).toBe(validRequest.userId);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]).toEqual({
      productId: validRequest.productId,
      quantity: validRequest.quantity,
    });
    expect(mockRepository.carts).toHaveLength(1);
  });

  test("should throw an error if userId is missing", async () => {
    const invalidRequest = { ...validRequest, userId: "" };
    await expect(() =>
      AddToCart(invalidRequest, mockRepository)
    ).rejects.toThrow("User ID is required");
  });

  test("should throw an error if productId is missing", async () => {
    const invalidRequest = { ...validRequest, productId: "" };
    await expect(() =>
      AddToCart(invalidRequest, mockRepository)
    ).rejects.toThrow("Product ID is required");
  });

  test("should throw an error if productName is missing", async () => {
    const invalidRequest = { ...validRequest, productName: "" };
    await expect(() =>
      AddToCart(invalidRequest, mockRepository)
    ).rejects.toThrow("Product name is required");
  });

  test("should throw an error if productPrice is missing", async () => {
    const invalidRequest = { ...validRequest, productPrice: "" };
    await expect(() =>
      AddToCart(invalidRequest, mockRepository)
    ).rejects.toThrow("Product price is required");
  });

  test("should throw an error if quantity is zero or negative", async () => {
    const invalidRequest = { ...validRequest, quantity: 0 };
    await expect(() =>
      AddToCart(invalidRequest, mockRepository)
    ).rejects.toThrow("Quantity must be greater than 0");
  });

  test("should add new item to existing cart", async () => {
    const existingCart = {
      id: "cart-1",
      userId: validRequest.userId,
      items: [
        {
          productId: "existing-product",
          quantity: 1,
        },
      ],
    };
    mockRepository.saveCart(existingCart);

    const newRequest = {
      ...validRequest,
      productId: "new-product",
      quantity: 3,
    };
    const updatedCart = await AddToCart(newRequest, mockRepository);

    expect(updatedCart.items).toHaveLength(2);
    expect(updatedCart.items).toContainEqual({
      productId: "existing-product",
      quantity: 1,
    });
    expect(updatedCart.items).toContainEqual({
      productId: "new-product",
      quantity: 3,
    });
  });

  test("should increment quantity when adding existing product", async () => {
    const existingCart = {
      id: "cart-1",
      userId: validRequest.userId,
      items: [
        {
          productId: validRequest.productId,
          quantity: 2,
        },
      ],
    };
    mockRepository.saveCart(existingCart);

    const updatedCart = await AddToCart(validRequest, mockRepository);

    expect(updatedCart.items).toHaveLength(1);

    expect(updatedCart.items[0]).toEqual({
      productId: validRequest.productId,
      quantity: 4,
    });
  });
});
