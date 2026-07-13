import { Router } from "express";
import { loginController } from "../controllers/auth.controller.js";
import { loginRateLimit } from "../middlewares/rate-limit.js";
import { validateBody } from "../middlewares/validate.js";
import { loginSchema } from "../validators/auth.validator.js";

export const authRoutes = Router();

authRoutes.post("/login", loginRateLimit, validateBody(loginSchema), loginController);

