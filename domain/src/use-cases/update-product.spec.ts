import { describe, test, expect, beforeEach, vi } from "vitest";
import { updateProduct } from "./update-product";
import { ProductRepository } from "../repositories/product-repository";
import { Product } from "../entities/Product";

describe("UpdateProduct Use Case", () => {
  let mockRepository: ProductRepository;
  let mockProduct: Product;

  beforeEach(() => {
    mockProduct = {
      id: "1",
      name: "Old Product",
      price: 10,
      stock: 5,
      category: "Tech",
      description: "...",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository = {
      findById: vi.fn().mockReturnValue(mockProduct),
      save: vi.fn().mockReturnValue(undefined),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
  });

  test("should update the product and return the updated object", () => {
    const updatedData = { name: "New Product", price: 20 };
    const result = updateProduct("1", updatedData, mockRepository);

    expect(mockRepository.findById).toHaveBeenCalledWith("1");
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockProduct,
        ...updatedData,
        updatedAt: expect.any(Date),
      })
    );
    expect(result).not.toBeNull();
    expect(result?.name).toBe("New Product");
    expect(result?.price).toBe(20);
    expect(result?.updatedAt).toBeInstanceOf(Date);
    expect(result!.updatedAt.getTime()).toBeGreaterThan(
      mockProduct.updatedAt.getTime()
    );
  });

  test("should return null if the product is not found", () => {
    vi.mocked(mockRepository.findById).mockReturnValue(undefined);

    const updatedData = { name: "New Product" };
    const result = updateProduct(
      "non-existent-id",
      updatedData,
      mockRepository
    );

    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
    expect(mockRepository.save).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
