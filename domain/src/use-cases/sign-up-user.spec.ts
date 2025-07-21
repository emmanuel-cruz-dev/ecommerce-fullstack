import { describe, it, expect, test } from "vitest";
import { signUpUser } from "./sign-up-user";

describe("UserRegister Use Case", async () => {
  it("should throw an error if input is invalid", () => {
    expect(() => signUpUser()).toThrow("Not implemented");
  });
});
