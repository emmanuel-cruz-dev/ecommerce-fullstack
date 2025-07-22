import { UserProps } from "../entities/User";

export interface UserRepository {
  findByEmail(email: string): Promise<UserProps | null>;
  save(user: UserProps): Promise<UserProps>;
}
