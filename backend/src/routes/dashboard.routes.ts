import { Router } from "express";
import { metricsController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/metrics", authenticate, metricsController);

