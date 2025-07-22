import { describe, it, expect, test, beforeEach } from "vitest";
import { UserRegister } from "./user-register";
import { UserProps } from "../entities/User";

describe("UserRegister Use Case", async () => {
  let validUser: UserProps;

  beforeEach(() => {
    validUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      password: "securepassword",
      role: "user",
    };
  });

  it("should register a valid user", () => {
    const user = UserRegister(validUser);
    expect(user).toEqual(validUser);
  });
});
