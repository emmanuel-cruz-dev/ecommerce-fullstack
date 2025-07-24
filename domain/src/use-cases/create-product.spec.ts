import { beforeEach, describe, expect, test } from "vitest";
import { ProductRepository } from "../repositories/product-repository";
import { mockProductRepository } from "../mocks/product-repository-mock";
import { CreateProduct } from "./create-product";
import { Product } from "../entities/Product";

describe("CreateProduct Use Case", () => {
  let mockRepository: ProductRepository;
  let validProduct: Product;

  beforeEach(() => {
    mockRepository = mockProductRepository();
  });

  test("should create a product successfully", () => {
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

  test("should throw an error if name field is missing", () => {
    const invalidProductData = {
      id: "product-1",
      name: "",
      description: "A product for testing",
      price: 19.99,
      stock: 100,
      category: "Test Category",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => CreateProduct(invalidProductData, mockRepository)).toThrow(
      "Name is required"
    );
  });

  test("should throw an error if price is 0", () => {
    const invalidProductData = {
      id: "product-1",
      name: "Product",
      description: "A product for testing",
      price: 0,
      stock: 100,
      category: "Test Category",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => CreateProduct(invalidProductData, mockRepository)).toThrow(
      "Price must be greater than 0"
    );
  });

  test("should throw an error if stock is 0 or negative", () => {
    const invalidProductData = {
      id: "product-1",
      name: "Product",
      description: "A product for testing",
      price: 100,
      stock: -10,
      category: "Test Category",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => CreateProduct(invalidProductData, mockRepository)).toThrow(
      "Stock cannot be 0 or negative"
    );
  });
});
