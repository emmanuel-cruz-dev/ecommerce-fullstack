import { describe, it, expect, beforeEach } from "vitest";
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

  it("should throw an error if email is missing", () => {
    const invalidUser = { ...validUser, email: "" };
    expect(() => UserRegister(invalidUser)).toThrow("Email is required");
  });

  it("should throw an error if password is missing", () => {
    const invalidUser = { ...validUser, password: "" };
    expect(() => UserRegister(invalidUser)).toThrow("Password is required");
  });

  it("should throw an error if username is missing", () => {
    const invalidUser = { ...validUser, username: "" };
    expect(() => UserRegister(invalidUser)).toThrow("Username is required");
  });
});
