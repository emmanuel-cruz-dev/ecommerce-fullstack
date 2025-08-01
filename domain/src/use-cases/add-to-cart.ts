import { Cart } from "../entities/Cart";
import { CartRepository } from "../repositories/cart-repository";

export interface AddToCartRequest {
  userId: string;
  productId: string;
  productName: string;
  productPrice: string;
  quantity: number;
}

export async function AddToCart(
  request: AddToCartRequest,
  repository: CartRepository
): Promise<Cart> {
  let cart = repository.findCartByUserId(request.userId);
  validateAddToCartData(request);

  if (!cart) {
    cart = {
      id: `cart-${Date.now()}`,
      userId: request.userId,
      items: [],
    };
    repository.saveCart(cart);
  }

  const existingItem = cart.items.find(
    (item) => item.productId === request.productId
  );

  if (existingItem) {
    existingItem.quantity += request.quantity;
  } else {
    cart.items.push({
      productId: request.productId,
      quantity: request.quantity,
    });
  }

  repository.saveCart(cart);

  return cart;
}

function validateAddToCartData(request: AddToCartRequest): void {
  if (!request.userId.trim()) {
    throw new Error("User ID is required");
  }
  if (!request.productId.trim()) {
    throw new Error("Product ID is required");
  }
  if (!request.productName.trim()) {
    throw new Error("Product name is required");
  }
  if (!request.productPrice.trim()) {
    throw new Error("Product price is required");
  }
  if (request.quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }
}
