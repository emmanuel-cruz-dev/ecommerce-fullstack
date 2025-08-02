import { Request, Response, NextFunction } from "express";
import request from "supertest";
import { describe, beforeEach, test, vi, expect } from "vitest";
import app from "../app";
import { AuthenticatedUser } from "@domain/src/ports/auth-types";
import { Cart } from "@domain/src/entities/Cart";
import cartService from "../services/cart.service";

vi.mock("../services/cart.service");

vi.mock("../middlewares/auth.middleware", () => {
  const mockUser: AuthenticatedUser = {
    id: "user123",
    email: "user@example.com",
    username: "normaluser",
    role: "user",
  };
  return {
    authenticate: vi.fn((req, res, next) => {
      req.user = mockUser;
      next();
    }),
    authorize: vi.fn(
      () => (req: Request, res: Response, next: NextFunction) => next()
    ),
  };
});

describe("Cart Controller", () => {
  const mockUser: AuthenticatedUser = {
    id: "user123",
    email: "user@example.com",
    username: "normaluser",
    role: "user",
  };

  const mockCart: Cart = {
    id: "cart-1",
    userId: mockUser.id,
    items: [{ productId: "prod-1", quantity: 1 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/cart", () => {
    const validAddToCartRequest = {
      productId: "prod-1",
      productName: "Test Product",
      productPrice: 10,
      quantity: 1,
    };

    test("should return 200 and the updated cart for a valid request", async () => {
      vi.mocked(cartService.addToCart).mockResolvedValue(mockCart);

      const res = await request(app)
        .post("/api/cart")
        .send(validAddToCartRequest);

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload.items[0]).toEqual(mockCart.items[0]);
      expect(cartService.addToCart).toHaveBeenCalledWith({
        ...validAddToCartRequest,
        userId: mockUser.id,
      });
    });

    test("should return 400 for an invalid request (quantity <= 0)", async () => {
      // Esta validación debe estar en el controlador o servicio.
      // Aquí, mockeamos el servicio para que lance un error, simulando la validación
      vi.mocked(cartService.addToCart).mockRejectedValue(
        new Error("Quantity must be greater than 0")
      );

      const res = await request(app)
        .post("/api/cart")
        .send({ ...validAddToCartRequest, quantity: 0 });

      expect(res.statusCode).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Quantity must be greater than 0");
    });
  });

  describe("GET /api/cart", () => {
    test("should return 200 and the cart content for an authenticated user", async () => {
      vi.mocked(cartService.getCartContent).mockResolvedValue(mockCart);

      const res = await request(app).get("/api/cart");

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(mockCart);
      expect(cartService.getCartContent).toHaveBeenCalledWith(mockUser.id);
    });

    test("should return 200 and a null payload if the cart is empty", async () => {
      vi.mocked(cartService.getCartContent).mockResolvedValue(null);

      const res = await request(app).get("/api/cart");

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toBeNull();
    });
  });

  describe("DELETE /api/cart", () => {
    test("should return 200 and a success message when clearing the cart", async () => {
      vi.mocked(cartService.clearCart).mockResolvedValue(true);

      const res = await request(app).delete("/api/cart");

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.message).toBe("Carrito vaciado correctamente");
      expect(cartService.clearCart).toHaveBeenCalledWith(mockUser.id);
    });

    test("should return 404 if the cart does not exist", async () => {
      vi.mocked(cartService.clearCart).mockResolvedValue(false);

      const res = await request(app).delete("/api/cart");

      expect(res.statusCode).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("El carrito del usuario no se encontró");
    });
  });

  describe("DELETE /api/cart/:productId", () => {
    const productId = "prod-1";

    test("should return 200 and a success message when a product is removed", async () => {
      vi.mocked(cartService.removeFromCart).mockResolvedValue(true);

      const res = await request(app).delete(`/api/cart/${productId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.message).toBe("Producto eliminado del carrito");
      expect(cartService.removeFromCart).toHaveBeenCalledWith(
        mockUser.id,
        productId
      );
    });

    test("should return 404 if the product is not found in the cart", async () => {
      vi.mocked(cartService.removeFromCart).mockResolvedValue(false);

      const res = await request(app).delete(`/api/cart/${productId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("El producto no se encontró en el carrito");
    });
  });
});
