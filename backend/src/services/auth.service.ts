import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/app-error.js";
import { stripSensitiveUser } from "../utils/sanitize.js";

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user || !user.active) throw new AppError("Credenciais inválidas.", 401);

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) throw new AppError("Credenciais inválidas.", 401);

    const token = jwt.sign(
      { role: user.role, email: user.email, name: user.name },
      env.JWT_SECRET,
      { subject: user.id, expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] }
    );

    return { token, user: stripSensitiveUser(user) };
  }
};
