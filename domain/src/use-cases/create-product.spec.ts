import { beforeEach, describe, expect, it } from "vitest";
import { ProductRepository } from "../repositories/product-repository";
import { mockProductRepository } from "../mocks/product-repository";
import { CreateProduct } from "./create-product";
import { ProductProps } from "../entities/Product";

describe("CreateProduct Use Case", () => {
  let mockRepository: ProductRepository;
  let validProduct: ProductProps;

  beforeEach(() => {
    mockRepository = mockProductRepository();
  });

  it("should create a product successfully", () => {
    validProduct = {
      id: "1",
      name: "Remera",
      description: "Remera de algodón",
      price: 200,
      stock: 20,
      category: "Ropa",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const product = CreateProduct(validProduct, mockRepository);

    expect(product).toEqual(product);
    expect(mockRepository.findById(product.id)).toEqual(product);
  });
});
