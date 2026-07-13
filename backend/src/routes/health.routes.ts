import { Router } from "express";
import { prisma } from "../config/prisma.js";

export const healthRoutes = Router();

healthRoutes.get("/", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ success: true, message: "API online", database: "connected" });
  } catch (error) {
    return next(error);
  }
});

