import { prisma } from "../utils/prisma";
import { User } from "@prisma/client";

export class UserRepository {
  async createUser(data: {
    email: string;
    passwordHash: string;
    name: string;
    phone?: string;
  }): Promise<User> {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}

export default new UserRepository();
