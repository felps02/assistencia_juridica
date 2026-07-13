import { UserRole } from "@prisma/client";
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Nome obrigatório."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  role: z.nativeEnum(UserRole).default(UserRole.ATTENDANT),
  active: z.boolean().default(true)
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.nativeEnum(UserRole).optional(),
  active: z.boolean().optional()
});

