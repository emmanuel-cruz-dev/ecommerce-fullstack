import { User } from "../entities/User";
import { UserRepository } from "../repositories/user-repository";

export interface MockedUserRepository extends UserRepository {
  users: User[];
}

export function mockUserRepository(users: User[] = []): MockedUserRepository {
  return {
    users,
    findByEmail: async (email: string) => {
      const user = users.find((user) => user.email === email);
      const result = user ? { ...user } : null;
      return result;
    },
    save: async (user: User) => {
      const existingUserIndex = users.findIndex((u) => u.email === user.email);
      if (existingUserIndex !== -1) {
        users[existingUserIndex] = { ...user };
      } else {
        users.push({ ...user });
      }
      return { ...user };
    },
  };
}
