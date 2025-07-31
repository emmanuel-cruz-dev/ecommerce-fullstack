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

  describe("getProductById", () => {
    test("should return a product if found by ID", async () => {
      vi.mocked(productRepository.findById).mockResolvedValue(mockProduct);

      const product = await productService.getProductById("1");
      expect(product).toEqual(mockProduct);
      expect(productRepository.findById).toHaveBeenCalledWith("1");
    });

    test("should return null if product not found by ID", async () => {
      vi.mocked(productRepository.findById).mockResolvedValue(null);

      const product = await productService.getProductById("non-existent");
      expect(product).toBeNull();
      expect(productRepository.findById).toHaveBeenCalledWith("non-existent");
    });
  });

  describe("createProduct", () => {
    test("should create a new product and return it", async () => {
      const newProductData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
        name: "New Product",
        description: "New Description",
        price: 50,
        stock: 5,
        category: "New Category",
      };

      const createdProduct = {
        ...newProductData,
        id: "3",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product;

      vi.mocked(productRepository.save).mockResolvedValue(createdProduct);

      const result = await productService.createProduct(
        newProductData as Product
      );
      expect(result).toEqual(createdProduct);
      expect(productRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(newProductData)
      );
    });
  });

  describe("updateProduct", () => {
    test("should update an existing product and return it", async () => {
      const updates = { name: "Updated Name", price: 120 };
      const updatedProduct = { ...mockProduct, ...updates } as Product;
      vi.mocked(productRepository.updateById).mockResolvedValue(updatedProduct);

      const result = await productService.updateProduct("1", updates);
      expect(result).toEqual(updatedProduct);
      expect(productRepository.updateById).toHaveBeenCalledWith("1", updates);
    });

    test("should return null if product to update is not found", async () => {
      vi.mocked(productRepository.updateById).mockResolvedValue(null);

      const result = await productService.updateProduct("non-existent", {
        name: "test",
      });
      expect(result).toBeNull();
      expect(productRepository.updateById).toHaveBeenCalledWith(
        "non-existent",
        { name: "test" }
      );
    });
  });

  describe("deleteProduct", () => {
    test("should delete a product and return true", async () => {
      vi.mocked(productRepository.deleteById).mockResolvedValue(true);

      const result = await productService.deleteProduct("1");
      expect(result).toBe(true);
      expect(productRepository.deleteById).toHaveBeenCalledWith("1");
    });

    test("should return false if product to delete is not found", async () => {
      vi.mocked(productRepository.deleteById).mockResolvedValue(false);

      const result = await productService.deleteProduct("non-existent");
      expect(result).toBe(false);
      expect(productRepository.deleteById).toHaveBeenCalledWith("non-existent");
    });
  });
});
