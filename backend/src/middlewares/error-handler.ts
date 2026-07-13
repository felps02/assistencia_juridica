import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/app-error.js";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Rota não encontrada: ${req.method} ${req.path}`, 404));
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return res.status(409).json({ success: false, message: "Registro duplicado." });
  }

  const isProduction = process.env.NODE_ENV === "production";
  return res.status(500).json({
    success: false,
    message: "Erro interno do servidor.",
    ...(isProduction ? {} : { detail: error.message })
  });
}

