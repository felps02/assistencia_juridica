import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function isValidCpfOrCnpj(value: string) {
  const digits = onlyDigits(value);
  return digits.length === 11 || digits.length === 14;
}

