import { describe, expect, it } from "vitest";
import { CreateProduct } from "./create-product";

describe("CreateProduct Use Case", () => {
  it("should return null", () => {
    const product = CreateProduct();
    expect(product).toEqual(null);
  });
});
