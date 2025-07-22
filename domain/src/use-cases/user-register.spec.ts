import { describe, it, expect, test } from "vitest";
import { UserRegister } from "./user-register";

describe("UserRegister Use Case", async () => {
  it("should throw an error if input is invalid", () => {
    expect(() => UserRegister()).toThrow("Not implemented");
  });
});
