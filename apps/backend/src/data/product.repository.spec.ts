import { describe, beforeEach, test } from "vitest";
import productRepository from "./product.repository";
import { productsDB } from "src/database/products.db";
import { Product } from "@domain/src/entities/Product";

describe("Product Repository", () => {
  beforeEach(() => {
    productsDB.splice(0, productsDB.length);
  });

  test("should return an empty array if no products exit", async () => {
    const products = await productRepository.getAllProducts();
    expect(products).toEqual([]);
  });
});
