import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../utils/app-error.js";

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError("Erro de validação.", 422, parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))));
    }
    req.body = parsed.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return next(new AppError("Erro de validação.", 422, parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))));
    }
    req.query = parsed.data as Request["query"];
    next();
  };
}

