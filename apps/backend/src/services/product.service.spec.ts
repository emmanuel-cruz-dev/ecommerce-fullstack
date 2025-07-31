import { describe, beforeEach, test, vi } from "vitest";
import productService from "./product.service";
import productRepository from "../data/product.repository";
import { Product } from "@domain/src/entities/Product";

vi.mock("../data/product.repository.ts");

describe("Product Service", () => {
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

  describe("getAllProducts", () => {
    test("should return all products from the repository", async () => {
      vi.mocked(productRepository.getAllProducts).mockResolvedValue(
        mockProducts
      );

      const products = await productService.getAllProducts();
      expect(products).toEqual(mockProducts);
      expect(productRepository.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });
});
