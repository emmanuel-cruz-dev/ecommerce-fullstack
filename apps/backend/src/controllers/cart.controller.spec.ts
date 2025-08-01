import request from "supertest";
import { describe, beforeEach, test, expect, vi } from "vitest";
import app from "../app";
import { AddToCart, AddToCartRequest } from "@domain/src/use-cases/add-to-cart";
import { Cart } from "@domain/src/entities/Cart";

vi.mock("@domain/src/use-cases/add-to-cart");

vi.mock("../middlewares/auth.middleware", () => {
  return {
    authenticate: vi.fn((req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          ok: false,
          message: "No authentication token provided",
        });
      }

      if (authHeader === "Bearer mock-user-token") {
        req.user = {
          id: "user123",
          email: "user@example.com",
          username: "normaluser",
          role: "user",
        };
        next();
      } else if (authHeader === "Bearer mock-admin-token") {
        req.user = {
          id: "admin123",
          email: "admin@example.com",
          username: "adminuser",
          role: "admin",
        };
        next();
      } else {
        return res.status(403).json({
          ok: false,
          message: "Invalid or expired token",
        });
      }
    }),
    authorize: vi.fn((roles) => {
      return vi.fn((req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
          return res.status(403).json({
            ok: false,
            message: "Forbidden: Insufficient permissions",
          });
        }
        next();
      });
    }),
  };
});

describe("Cart Controller", () => {
  const validAddToCartRequest: AddToCartRequest = {
    userId: "user123",
    productId: "prod-1",
    productName: "Test Product",
    productPrice: "9.99",
    quantity: 1,
  };
  const mockCart: Cart = {
    id: "cart-1",
    userId: "user123",
    items: [{ productId: "prod-1", quantity: 1 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/cart", () => {
    test("should return 200 and the updated cart for a valid request", async () => {
      vi.mocked(AddToCart).mockResolvedValue(mockCart);

      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", "Bearer mock-user-token")
        .send(validAddToCartRequest);

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(mockCart);
    });

    test("should return 400 for an invalid request", async () => {
      vi.mocked(AddToCart).mockRejectedValue(
        new Error("Quantity must be greater than 0")
      );

      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", "Bearer mock-user-token")
        .send({ ...validAddToCartRequest, quantity: 0 });

      expect(res.statusCode).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Quantity must be greater than 0");
    });
  });
});
