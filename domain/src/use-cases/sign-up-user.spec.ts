import { describe, it, expect, test } from "vitest";
import { signUpUser } from "./sign-up-user";

describe("UserRegister Use Case", async () => {
  test("With an email already in use, fails with InvalidData", async () => {
    const payload = {
      email: "existing@user.com",
      password: "12345678",
      username: "Test User",
    };
  });
});
