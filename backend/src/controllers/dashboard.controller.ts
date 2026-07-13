import type { NextFunction, Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { successResponse } from "../utils/api-response.js";

export async function metricsController(_req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, "Métricas carregadas com sucesso.", await dashboardService.metrics());
  } catch (error) {
    return next(error);
  }
}

