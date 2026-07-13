import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { successResponse } from "../utils/api-response.js";

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.login(req.body.email, req.body.password);
    return successResponse(res, "Login realizado com sucesso.", data);
  } catch (error) {
    return next(error);
  }
}

