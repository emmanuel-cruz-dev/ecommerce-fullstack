import { describe, test, expect, beforeEach, vi } from "vitest";
import { UserLogin, UserLoginError } from "./user-login";
import { User } from "../entities/User";
import {
  mockUserRepository,
  MockedUserRepository,
  MockPasswordHasher,
} from "../mocks/user-repository-mock";
import { IPasswordHasher } from "../ports/password-hasher";

describe("UserLogin Use Case", () => {
  let mockRepository: MockedUserRepository;
  let mockPasswordHasher: IPasswordHasher;
  let existingUser: User;

  beforeEach(() => {
    existingUser = {
      id: "user123",
      username: "johndoe",
      email: "john@example.com",
      password: "hashed_securepassword123",
      role: "user",
    };
    mockRepository = mockUserRepository([existingUser]);
    mockPasswordHasher = new MockPasswordHasher();

    vi.spyOn(mockPasswordHasher, "compare").mockImplementation(
      async (password, hashedPassword) => {
        return `hashed_${password}` === hashedPassword;
      }
    );
  });

  test("should successfully log in a user with valid credentials", async () => {
    const user = await UserLogin(
      "john@example.com",
      "securepassword123",
      mockRepository,
      mockPasswordHasher
    );
    expect(user).toEqual(existingUser);
    expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
      "securepassword123",
      "hashed_securepassword123"
    );
  });

  test("should throw an error if email is missing", async () => {
    await expect(() =>
      UserLogin("", "securepassword123", mockRepository, mockPasswordHasher)
    ).rejects.toThrow(UserLoginError);
    await expect(() =>
      UserLogin("", "securepassword123", mockRepository, mockPasswordHasher)
    ).rejects.toThrow("Email and password are required");
  });

  test("should throw an error if password is missing", async () => {
    await expect(() =>
      UserLogin("john@example.com", "", mockRepository, mockPasswordHasher)
    ).rejects.toThrow(UserLoginError);
    await expect(() =>
      UserLogin("john@example.com", "", mockRepository, mockPasswordHasher)
    ).rejects.toThrow("Email and password are required");
  });

  test("should throw an error for non-existent email", async () => {
    vi.spyOn(mockRepository, "findByEmail").mockResolvedValue(null);

    await expect(() =>
      UserLogin(
        "nonexistent@example.com",
        "anypassword",
        mockRepository,
        mockPasswordHasher
      )
    ).rejects.toThrow(UserLoginError);
    await expect(() =>
      UserLogin(
        "nonexistent@example.com",
        "anypassword",
        mockRepository,
        mockPasswordHasher
      )
    ).rejects.toThrow("Invalid credentials");
  });

  test("should throw an error for incorrect password", async () => {
    vi.spyOn(mockPasswordHasher, "compare").mockResolvedValue(false);

    await expect(() =>
      UserLogin(
        "john@example.com",
        "wrongpassword",
        mockRepository,
        mockPasswordHasher
      )
    ).rejects.toThrow(UserLoginError);
    await expect(() =>
      UserLogin(
        "john@example.com",
        "wrongpassword",
        mockRepository,
        mockPasswordHasher
      )
    ).rejects.toThrow("Invalid credentials");
  });
});
