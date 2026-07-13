import { UserRole } from "@prisma/client";
import { Router } from "express";
import { createUserController, listUsersController, updateUserController } from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema } from "../validators/user.validator.js";

export const userRoutes = Router();

userRoutes.use(authenticate, authorize([UserRole.ADMIN]));
userRoutes.get("/", listUsersController);
userRoutes.post("/", validateBody(createUserSchema), createUserController);
userRoutes.patch("/:id", validateBody(updateUserSchema), updateUserController);

