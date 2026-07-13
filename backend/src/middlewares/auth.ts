import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

type JwtPayload = {
  sub: string;
  role: UserRole;
  email: string;
  name: string;
};

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  if (!token) return next(new AppError("Token de autenticação não informado.", 401));

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { id: payload.sub, role: payload.role, email: payload.email, name: payload.name };
    return next();
  } catch {
    return next(new AppError("Token inválido ou expirado.", 401));
  }
}

export function authorize(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Acesso não autorizado.", 403));
    }
    return next();
  };
}

