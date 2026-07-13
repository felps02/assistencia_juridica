import bcrypt from "bcrypt";
import type { Prisma } from "@prisma/client";
import { userRepository } from "../repositories/user.repository.js";

export const userService = {
  list() {
    return userRepository.list();
  },

  async create(data: { name: string; email: string; password: string; role: "ADMIN" | "ATTENDANT"; active: boolean }) {
    const passwordHash = await bcrypt.hash(data.password, 12);
    return userRepository.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      active: data.active
    });
  },

  async update(id: string, data: { name?: string; email?: string; password?: string; role?: "ADMIN" | "ATTENDANT"; active?: boolean }) {
    const { password, ...rest } = data;
    const updateData: Prisma.UserUpdateInput = { ...rest };
    if (rest.email) updateData.email = rest.email.toLowerCase();
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 12);
    }
    return userRepository.update(id, updateData);
  }
};
