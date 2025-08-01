import request from "supertest";
import { describe, beforeEach, test, vi } from "vitest";
import app from "../app";
import productService from "../services/product.service";
import { Product } from "@domain/src/entities/Product";
import { ITokenService } from "@domain/src/ports/token-service";
import { AuthenticatedUser } from "@domain/src/ports/auth-types";

const mocks = vi.hoisted(() => {
  return {
    tokenService: {
      generateToken: vi.fn(),
      verifyToken: vi.fn(),
    } as ITokenService,
  };
});

vi.mock("../middlewares/auth.middleware", () => {
  return {
    tokenService: mocks.tokenService,
    authenticate: vi.fn((req, res, next) => {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          ok: false,
          message: "No authentication token provided",
        });
      }

      const token = authHeader.split(" ")[1];

      try {
        const user = mocks.tokenService.verifyToken(token);
        req.user = user;
        next();
      } catch (error) {
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

vi.mock("../services/product.service.ts");

describe("Product Controller", () => {
  const mockAdminUser: AuthenticatedUser = {
    id: "admin123",
    email: "admin@example.com",
    username: "adminuser",
    role: "admin",
  };

  const mockUser: AuthenticatedUser = {
    id: "user123",
    email: "user@example.com",
    username: "normaluser",
    role: "user",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProduct: Product = {
    id: "1",
    name: "Test Product",
    description: "Description",
    price: 100,
    stock: 10,
    category: "Category",
    // @ts-ignore
    createdAt: new Date().toISOString(),
    // @ts-ignore
    updatedAt: new Date().toISOString(),
  };

  const mockProducts: Product[] = [
    mockProduct,
    { ...mockProduct, id: "2", name: "Another Product" },
  ];

  describe("GET /api/products", () => {
    test("should return 200 and all products", async () => {
      vi.mocked(productService.getAllProducts).mockResolvedValue(mockProducts);

      const res = await request(app).get("/api/products");

      expect(res.statusCode).toEqual(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(mockProducts);
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    });

    test("should return 500 if an error occurs", async () => {
      vi.mocked(productService.getAllProducts).mockRejectedValue(
        new Error("Database error")
      );

      const res = await request(app).get("/api/products");

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });

  describe("GET /api/products/:productId", () => {
    test("should return 200 and the product if found", async () => {
      vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

      const res = await request(app).get("/api/products/1");

      expect(res.statusCode).toEqual(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(mockProduct);
      expect(productService.getProductById).toHaveBeenCalledWith("1");
    });

    test("should return 404 if product not found", async () => {
      vi.mocked(productService.getProductById).mockResolvedValue(null);

      const res = await request(app).get("/api/products/non-existent");

      expect(res.statusCode).toEqual(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Producto con ID 'non-existent' no encontrado"
      );
      expect(productService.getProductById).toHaveBeenCalledWith(
        "non-existent"
      );
    });

    test("should return 500 if an error occurs", async () => {
      vi.mocked(productService.getProductById).mockRejectedValue(
        new Error("Database error")
      );

      const res = await request(app).get("/api/products/1");

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });

  describe("POST /api/products", () => {
    const newProductData = {
      name: "New Item",
      description: "Description of new item",
      price: 200,
      stock: 20,
      category: "Category of new item",
    };

    test("should return 201 and the created product for an admin", async () => {
      // @ts-ignore
      vi.mocked(mocks.tokenService.verifyToken).mockReturnValue(mockAdminUser);

      vi.mocked(productService.createProduct).mockResolvedValue({
        id: "new-id",
        ...newProductData,
        // @ts-ignore
        createdAt: new Date().toISOString(),
        // @ts-ignore
        updatedAt: new Date().toISOString(),
      });

      const res = await request(app)
        .post("/api/products")
        .set("Authorization", "Bearer mock-admin-token")
        .send(newProductData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(
        expect.objectContaining({ name: "New Item" })
      );
      expect(productService.createProduct).toHaveBeenCalledWith(
        expect.objectContaining(newProductData)
      );
    });

    test("should return 401 if no token is provided", async () => {
      const res = await request(app).post("/api/products").send(newProductData);

      expect(res.statusCode).toEqual(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("No authentication token provided");
      expect(productService.createProduct).not.toHaveBeenCalled();
    });

    test("should return 403 if user is not an admin", async () => {
      // @ts-ignore
      vi.mocked(mocks.tokenService.verifyToken).mockReturnValue(mockUser);

      const res = await request(app)
        .post("/api/products")
        .set("Authorization", "Bearer mock-user-token")
        .send(newProductData);

      expect(res.statusCode).toEqual(403);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Forbidden: Insufficient permissions");
      expect(productService.createProduct).not.toHaveBeenCalled();
    });

    test("should return 500 if an error occurs for an admin", async () => {
      // @ts-ignore
      vi.mocked(mocks.tokenService.verifyToken).mockReturnValue(mockAdminUser);

      vi.mocked(productService.createProduct).mockRejectedValue(
        new Error("Validation error")
      );

      const res = await request(app)
        .post("/api/products")
        .set("Authorization", "Bearer mock-admin-token")
        .send(newProductData);

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });

  describe("PUT /api/products/:productId", () => {
    const updateProductData = {
      name: "Updated Product",
      description: "Updated description",
      price: 150,
      stock: 15,
      category: "Updated Category",
    };

    const updatedProduct = {
      id: "1",
      ...updateProductData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    test("should return 200 and the updated product for an admin", async () => {
      // @ts-ignore
      vi.mocked(mocks.tokenService.verifyToken).mockReturnValue(mockAdminUser);
      // @ts-ignore
      vi.mocked(productService.updateProduct).mockResolvedValue(updatedProduct);

      const res = await request(app)
        .put("/api/products/1")
        .set("Authorization", "Bearer mock-admin-token")
        .send(updateProductData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(updatedProduct);
      expect(productService.updateProduct).toHaveBeenCalledWith(
        "1",
        updateProductData
      );
    });

    test("should return 404 if product to update is not found", async () => {
      // @ts-ignores
      vi.mocked(mocks.tokenService.verifyToken).mockReturnValue(mockAdminUser);
      vi.mocked(productService.updateProduct).mockResolvedValue(null);

      const res = await request(app)
        .put("/api/products/non-existent")
        .set("Authorization", "Bearer mock-admin-token")
        .send(updateProductData);

      expect(res.statusCode).toEqual(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Producto con ID 'non-existent' no encontrado"
      );
      expect(productService.updateProduct).toHaveBeenCalledWith(
        "non-existent",
        updateProductData
      );
    });

    test("should return 401 if no token is provided", async () => {
      const res = await request(app)
        .put("/api/products/1")
        .send(updateProductData);

      expect(res.statusCode).toEqual(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("No authentication token provided");
      expect(productService.updateProduct).not.toHaveBeenCalled();
    });

    test("should return 403 if user is not an admin", async () => {
      // @ts-ignore
      vi.mocked(mocks.tokenService.verifyToken).mockReturnValue(mockUser);

      const res = await request(app)
        .put("/api/products/1")
        .set("Authorization", "Bearer mock-user-token")
        .send(updateProductData);

      expect(res.statusCode).toEqual(403);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Forbidden: Insufficient permissions");
      expect(productService.updateProduct).not.toHaveBeenCalled();
    });

    test("should return 500 if an error occurs for an admin", async () => {
      // @ts-ignore
      vi.mocked(mocks.tokenService.verifyToken).mockReturnValue(mockAdminUser);
      vi.mocked(productService.updateProduct).mockRejectedValue(
        new Error("Database error")
      );

      const res = await request(app)
        .put("/api/products/1")
        .set("Authorization", "Bearer mock-admin-token")
        .send(updateProductData);

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });

  describe("DELETE /api/products/:productId", () => {
    test("should return 200 and success message when product is deleted by admin", async () => {
      // @ts-ignore
      vi.mocked(mocks.tokenService.verifyToken).mockReturnValue(mockAdminUser);
      vi.mocked(productService.deleteProduct).mockResolvedValue(true);

      const res = await request(app)
        .delete("/api/products/1")
        .set("Authorization", "Bearer mock-admin-token");

      expect(res.statusCode).toEqual(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toBe(true);
      expect(productService.deleteProduct).toHaveBeenCalledWith("1");
    });

    test("should return 404 if product to delete is not found", async () => {
      // @ts-ignore
      vi.mocked(mocks.tokenService.verifyToken).mockReturnValue(mockAdminUser);
      vi.mocked(productService.deleteProduct).mockResolvedValue(false);

      const res = await request(app)
        .delete("/api/products/non-existent")
        .set("Authorization", "Bearer mock-admin-token");

      expect(res.statusCode).toEqual(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Producto con ID 'non-existent' no encontrado"
      );
      expect(productService.deleteProduct).toHaveBeenCalledWith("non-existent");
    });

    test("should return 401 if no token is provided", async () => {
      const res = await request(app).delete("/api/products/1");

      expect(res.statusCode).toEqual(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("No authentication token provided");
      expect(productService.deleteProduct).not.toHaveBeenCalled();
    });

    test("should return 403 if user is not an admin", async () => {
      // @ts-ignore
      vi.mocked(mocks.tokenService.verifyToken).mockReturnValue(mockUser);

      const res = await request(app)
        .delete("/api/products/1")
        .set("Authorization", "Bearer mock-user-token");

      expect(res.statusCode).toEqual(403);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Forbidden: Insufficient permissions");
      expect(productService.deleteProduct).not.toHaveBeenCalled();
    });

    test("should return 500 if an error occurs for an admin", async () => {
      // @ts-ignore
      vi.mocked(mocks.tokenService.verifyToken).mockReturnValue(mockAdminUser);
      vi.mocked(productService.deleteProduct).mockRejectedValue(
        new Error("Database error")
      );

      const res = await request(app)
        .delete("/api/products/1")
        .set("Authorization", "Bearer mock-admin-token");

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });
});
