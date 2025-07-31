import request from "supertest";
import { describe, beforeEach, test, vi } from "vitest";
import app from "../app";
import productService from "../services/product.service";
import { Product } from "@domain/src/entities/Product";

vi.mock("../services/product.service.ts");

describe("Product Controller", () => {
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
});
