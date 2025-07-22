import { beforeEach, describe, expect, it } from "vitest";
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
});
