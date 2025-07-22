import { describe, it, expect, beforeEach } from "vitest";
import { UserRegister } from "./user-register";
import { UserProps } from "../entities/User";
import {
  mockUserRepository,
  MockedUserRepository,
} from "../mocks/user-repository-mock";

describe("UserRegister Use Case", async () => {
  let validUser: UserProps;
  let mockRepository: MockedUserRepository;

  beforeEach(() => {
    validUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      password: "securepassword",
      role: "user",
    };

    mockRepository = mockUserRepository();
  });

  it("should register a valid user", async () => {
    const user = UserRegister(validUser);
    expect(user).toEqual(validUser);
  });

  it("should throw an error if email is missing", async () => {
    const invalidUser = { ...validUser, email: "" };
    expect(() => UserRegister(invalidUser)).toThrow("Email is required");
  });

  it("should throw an error if password is missing", async () => {
    const invalidUser = { ...validUser, password: "" };
    expect(() => UserRegister(invalidUser)).toThrow("Password is required");
  });

  it("should throw an error if username is missing", async () => {
    const invalidUser = { ...validUser, username: "" };
    expect(() => UserRegister(invalidUser)).toThrow("Username is required");
  });

  it("should fail if email is already in use", async () => {
    const existingUser: UserProps = {
      id: "2",
      username: "existinguser",
      email: "test@example.com",
      password: "otherpassword",
      role: "user",
    };

    const prePopulatedRepository = mockUserRepository([existingUser]);

    await expect(() =>
      UserRegister(validUser, prePopulatedRepository)
    ).rejects.toThrow("Email is already in use");

    expect(prePopulatedRepository.users).toHaveLength(1);
    expect(prePopulatedRepository.users[0]).toEqual(existingUser);
  });
});
