import { describe, test, expect, beforeEach } from "vitest";
import { UserRegister } from "./user-register";
import { User } from "../entities/User";
import {
  mockUserRepository,
  MockedUserRepository,
} from "../mocks/user-repository-mock";

describe("UserRegister Use Case", async () => {
  let validUser: User;
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

  test("should register a valid user", async () => {
    const user = await UserRegister(validUser, mockRepository);
    expect(user).toEqual(validUser);
    expect(mockRepository.users).toHaveLength(1);
  });

  test("should throw an error if email is missing", async () => {
    const invalidUser = { ...validUser, email: "" };
    await expect(() =>
      UserRegister(invalidUser, mockRepository)
    ).rejects.toThrow("Email is required");
  });

  test("should throw an error if password is missing", async () => {
    const invalidUser = { ...validUser, password: "" };
    await expect(() =>
      UserRegister(invalidUser, mockRepository)
    ).rejects.toThrow("Password is required");
  });

  test("should throw an error if username is missing", async () => {
    const invalidUser = { ...validUser, username: "" };
    await expect(() =>
      UserRegister(invalidUser, mockRepository)
    ).rejects.toThrow("Username is required");
  });

  test("should fail if email is already in use", async () => {
    const existingUser: User = {
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
