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
    createdAt: new Date(),
    updatedAt: new Date(),
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
      expect(res.body.payload).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "1",
            name: "Test Product",
            description: "Description",
            price: 100,
            stock: 10,
            category: "Category",
            createdAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
            ),
            updatedAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
            ),
          }),
        ])
      );
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
});
