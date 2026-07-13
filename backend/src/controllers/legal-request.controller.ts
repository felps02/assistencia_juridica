import type { NextFunction, Request, Response } from "express";
import { legalRequestService } from "../services/legal-request.service.js";
import { successResponse } from "../utils/api-response.js";

export async function createLegalRequestController(req: Request, res: Response, next: NextFunction) {
  try {
    const files = (req.files as Express.Multer.File[]) ?? [];
    const data = await legalRequestService.create(req.body, files, {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    return successResponse(res, "Solicitação cadastrada com sucesso.", data, 201);
  } catch (error) {
    return next(error);
  }
}

export async function listLegalRequestsController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await legalRequestService.list(req.query as never);
    return successResponse(res, "Solicitações listadas com sucesso.", data);
  } catch (error) {
    return next(error);
  }
}

export async function getLegalRequestController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await legalRequestService.findById(req.params.id);
    return successResponse(res, "Solicitação encontrada.", data);
  } catch (error) {
    return next(error);
  }
}

export async function updateLegalRequestStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await legalRequestService.updateStatus(req.params.id, req.user!.id, req.body.status);
    return successResponse(res, "Status atualizado com sucesso.", data);
  } catch (error) {
    return next(error);
  }
}

export async function createRequestNoteController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await legalRequestService.createNote(req.params.id, req.user!.id, req.body.content);
    return successResponse(res, "Observação cadastrada com sucesso.", data, 201);
  } catch (error) {
    return next(error);
  }
}

export async function listRequestNotesController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await legalRequestService.listNotes(req.params.id);
    return successResponse(res, "Observações listadas com sucesso.", data);
  } catch (error) {
    return next(error);
  }
}

export async function listRequestHistoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await legalRequestService.listHistory(req.params.id);
    return successResponse(res, "Histórico listado com sucesso.", data);
  } catch (error) {
    return next(error);
  }
}

