import request from "supertest";
import { describe, beforeEach, test, vi } from "vitest";
import app from "../app";
import productService from "../services/product.service";
import { Product } from "@domain/src/entities/Product";

vi.mock("../services/product.service.ts");

describe("Product Controller", () => {
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
    createdAt: new Date().toISOString(),
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

  describe("PUT /api/products/:productId", () => {
    const updates = { name: "Updated Name", price: 150 };

    test("should return 200 and the updated product", async () => {
      const updatedProduct = { ...mockProduct, ...updates } as Product;
      vi.mocked(productService.updateProduct).mockResolvedValue(updatedProduct);

      const res = await request(app).put("/api/products/1").send(updates);

      expect(res.statusCode).toEqual(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(updatedProduct);
      expect(productService.updateProduct).toHaveBeenCalledWith("1", updates);
    });

    test("should return 404 if product to update is not found", async () => {
      vi.mocked(productService.updateProduct).mockResolvedValue(null);

      const res = await request(app)
        .put("/api/products/non-existent")
        .send(updates);

      expect(res.statusCode).toEqual(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.error).toBe(
        "Producto con ID 'non-existent' no encontrado"
      );
      expect(productService.updateProduct).toHaveBeenCalledWith(
        "non-existent",
        updates
      );
    });

    test("should return 500 if an error occurs", async () => {
      vi.mocked(productService.updateProduct).mockRejectedValue(
        new Error("Update error")
      );

      const res = await request(app).put("/api/products/1").send(updates);

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });

  describe("DELETE /api/products/:productId", () => {
    test("should return 200 and success message if product deleted", async () => {
      vi.mocked(productService.deleteProduct).mockResolvedValue(true);

      const res = await request(app).delete("/api/products/1");

      expect(res.statusCode).toEqual(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toBe(true);
      expect(productService.deleteProduct).toHaveBeenCalledWith("1");
    });

    test("should return 404 if product to delete is not found", async () => {
      vi.mocked(productService.deleteProduct).mockResolvedValue(false);

      const res = await request(app).delete("/api/products/non-existent");

      expect(res.statusCode).toEqual(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.error).toBe(
        "Producto con ID 'non-existent' no encontrado"
      );
      expect(productService.deleteProduct).toHaveBeenCalledWith("non-existent");
    });

    test("should return 500 if an error occurs", async () => {
      vi.mocked(productService.deleteProduct).mockRejectedValue(
        new Error("Delete error")
      );

      const res = await request(app).delete("/api/products/1");

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });
});
