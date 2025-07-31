import { describe, beforeEach, test } from "vitest";
import productRepository from "./product.repository";
import { productsDB } from "../database/products.db";
import { Product } from "@domain/src/entities/Product";

describe("Product Repository", () => {
  beforeEach(() => {
    productsDB.splice(0, productsDB.length);
  });

  test("should return an empty array if no products exit", async () => {
    const products = await productRepository.getAllProducts();
    expect(products).toEqual([]);
  });

  test("should save a new product and return it with an ID and timestamps", async () => {
    const newProductData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      name: "Test Product",
      description: "Description of test product",
      price: 99.99,
      stock: 10,
      category: "Category of test product",
    };
    const savedProduct = await productRepository.save(
      newProductData as Product
    );

    expect(savedProduct).toHaveProperty("id");
    expect(typeof savedProduct.id).toBe("string");
    expect(savedProduct).toHaveProperty("createdAt");
    expect(savedProduct).toHaveProperty("updatedAt");
    expect(typeof savedProduct.updatedAt).toBe("object");
    expect(savedProduct.name).toBe("Test Product");
    expect(productsDB).toContainEqual(savedProduct);
  });

  test("should return null if product not found by ID", async () => {
    const product = await productRepository.findById("non-existent-id");
    expect(product).toBeNull();
  });

  test("should return a product by its ID", async () => {
    const product1: Product = {
      id: "1",
      name: "Product A",
      description: "Desc A",
      price: 10,
      stock: 5,
      category: "Category A",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const product2: Product = {
      id: "2",
      name: "Product B",
      description: "Desc B",
      price: 20,
      stock: 10,
      category: "Category B",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    productsDB.push(product1, product2);

    const foundProduct = await productRepository.findById("1");
    expect(foundProduct).toEqual(product1);
  });

  test("should update an existing product by ID and return the updated product", async () => {
    const product: Product = {
      id: "123",
      name: "Original Name",
      description: "Original Desc",
      price: 50,
      stock: 5,
      category: "Original Cat",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    productsDB.push(product);

    const updates = { name: "Updated Name", price: 60 };
    const updatedProduct = await productRepository.updateById("123", updates);

    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct?.name).toBe("Updated Name");
    expect(updatedProduct?.price).toBe(60);
    expect(updatedProduct?.updatedAt).toBeInstanceOf(Date);
    expect(productsDB[0]).toEqual(updatedProduct);
  });
});
