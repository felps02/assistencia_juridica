import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(16).default("development-secret-change-me"),
  JWT_EXPIRES_IN: z.string().default("8h"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  ADMIN_NOTIFICATION_EMAIL: z.string().optional(),
  MAX_FILE_SIZE_MB: z.coerce.number().default(10),
  UPLOAD_PROVIDER: z.enum(["local", "cloud"]).default("local"),
  UPLOAD_DIR: z.string().default("uploads")
});

export const env = envSchema.parse(process.env);
export const allowedOrigins = env.FRONTEND_URL.split(",").map((origin) => origin.trim()).filter(Boolean);

