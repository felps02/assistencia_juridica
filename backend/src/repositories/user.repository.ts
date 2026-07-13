import { Prisma, type UserRole } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  list() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true, updatedAt: true }
    });
  },

  create(data: { name: string; email: string; passwordHash: string; role: UserRole; active: boolean }) {
    return prisma.user.create({
      data,
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true, updatedAt: true }
    });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true, updatedAt: true }
    });
  }
};

