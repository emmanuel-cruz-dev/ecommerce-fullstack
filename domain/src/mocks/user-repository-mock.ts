import { UserProps } from "../entities/User";
import { UserRepository } from "../repositories/user-repository";

export interface MockedUserRepository extends UserRepository {
  users: UserProps[];
}

export function mockUserRepository(
  users: UserProps[] = []
): MockedUserRepository {
  return {
    users,
    findByEmail: async (email: string): Promise<UserProps | null> => {
      const user = users.find((user) => user.email === email);
      const result = user ? { ...user } : null;
      return result;
    },
    save: async (user: UserProps): Promise<UserProps> => {
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
