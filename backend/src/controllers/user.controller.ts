import type { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service.js";
import { successResponse } from "../utils/api-response.js";

export async function listUsersController(_req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, "Usuários listados com sucesso.", await userService.list());
  } catch (error) {
    return next(error);
  }
}

export async function createUserController(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, "Usuário criado com sucesso.", await userService.create(req.body), 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateUserController(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, "Usuário atualizado com sucesso.", await userService.update(req.params.id, req.body));
  } catch (error) {
    return next(error);
  }
}

