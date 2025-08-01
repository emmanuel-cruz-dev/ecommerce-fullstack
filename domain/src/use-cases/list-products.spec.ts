import { describe, test, expect, beforeEach, vi } from "vitest";
import { listProducts } from "./list-products";
import { ProductRepository } from "../repositories/product-repository";
import { Product } from "../entities/Product";

describe("ListProducts Use Case", () => {
  let mockRepository: ProductRepository;
  let mockProducts: Product[];

  beforeEach(() => {
    mockProducts = [
      {
        id: "1",
        name: "Product A",
        price: 10,
        stock: 5,
        category: "Tech",
        description: "...",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Product B",
        price: 20,
        stock: 10,
        category: "Home",
        description: "...",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockRepository = {
      findAll: vi.fn().mockResolvedValue(mockProducts),
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
  });

  test("should return all products from the repository", async () => {
    const products = await listProducts(mockRepository);

    expect(products).toEqual(mockProducts);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
