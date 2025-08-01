import { describe, test, expect, beforeEach, vi } from "vitest";
import { deleteProduct } from "./delete-product";
import { ProductRepository } from "../repositories/product-repository";

describe("DeleteProduct Use Case", () => {
  let mockRepository: ProductRepository;

  beforeEach(() => {
    mockRepository = {
      delete: vi.fn().mockResolvedValue(true),
      findById: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
    };
  });

  test("should return true if the product is successfully deleted", async () => {
    const result = await deleteProduct("1", mockRepository);

    expect(result).toBe(true);
    expect(mockRepository.delete).toHaveBeenCalledWith("1");
  });

  test("should return false if the product is not found and cannot be deleted", async () => {
    vi.mocked(mockRepository.delete).mockResolvedValue(false);

    const result = await deleteProduct("non-existent-id", mockRepository);

    expect(result).toBe(false);
    expect(mockRepository.delete).toHaveBeenCalledWith("non-existent-id");
  });
});
