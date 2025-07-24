import { beforeEach, describe, expect, test } from "vitest";
import { ProductRepository } from "../repositories/product-repository";
import { mockProductRepository } from "../mocks/product-repository-mock";
import { CreateProduct } from "./create-product";
import { Product } from "../entities/Product";

describe("CreateProduct Use Case", () => {
  let mockRepository: ProductRepository;
  let validProduct: Product;

  beforeEach(() => {
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

    mockRepository = mockProductRepository();
  });

  test("should create a product successfully", () => {
    const product = CreateProduct(validProduct, mockRepository);

    expect(product).toEqual(product);
    expect(product.id).toEqual(validProduct.id);
    expect(product.name).toEqual(validProduct.name);
    expect(product.description).toEqual(validProduct.description);
    expect(mockRepository.findById(product.id)).toEqual(product);
  });

  test("should throw an error if name field is missing", () => {
    validProduct.name = "";

    expect(() => CreateProduct(validProduct, mockRepository)).toThrow(
      "Name is required"
    );
  });

  test("should throw an error if description field is missing", () => {
    validProduct.description = "";

    expect(() => CreateProduct(validProduct, mockRepository)).toThrow(
      "Description is required"
    );
  });

  test("should throw an error if price is 0", () => {
    validProduct.price = 0;

    expect(() => CreateProduct(validProduct, mockRepository)).toThrow(
      "Price must be greater than 0"
    );
  });

  test("should throw an error if stock is 0 or negative", () => {
    validProduct.stock = -10;

    expect(() => CreateProduct(validProduct, mockRepository)).toThrow(
      "Stock cannot be 0 or negative"
    );
  });
});
