import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository";

export class AuthService {
  async register(input: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    const { email, password, name, phone } = input;
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw { statusCode: 400, message: "Email already in use" };
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserRepository.createUser({
      email,
      passwordHash,
      name,
      phone,
    });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    };
  }

  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw { statusCode: 401, message: "Invalid credentials" };
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw { statusCode: 401, message: "Invalid credentials" };
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
  }

  async getProfile(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw { statusCode: 404, message: "User not found" };
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    };
  }
}

export default new AuthService();
