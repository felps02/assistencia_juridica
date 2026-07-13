import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  createLegalRequestController,
  createRequestNoteController,
  getLegalRequestController,
  listLegalRequestsController,
  listRequestHistoryController,
  listRequestNotesController,
  updateLegalRequestStatusController
} from "../controllers/legal-request.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { publicFormRateLimit } from "../middlewares/rate-limit.js";
import { upload } from "../middlewares/upload.js";
import { validateBody, validateQuery } from "../middlewares/validate.js";
import {
  createLegalRequestSchema,
  createNoteSchema,
  legalRequestFiltersSchema,
  updateStatusSchema
} from "../validators/legal-request.validator.js";

export const legalRequestRoutes = Router();

legalRequestRoutes.post(
  "/",
  publicFormRateLimit,
  upload.array("documents", 8),
  validateBody(createLegalRequestSchema),
  createLegalRequestController
);

legalRequestRoutes.use(authenticate, authorize([UserRole.ADMIN, UserRole.ATTENDANT]));
legalRequestRoutes.get("/", validateQuery(legalRequestFiltersSchema), listLegalRequestsController);
legalRequestRoutes.get("/:id", getLegalRequestController);
legalRequestRoutes.patch("/:id/status", validateBody(updateStatusSchema), updateLegalRequestStatusController);
legalRequestRoutes.post("/:id/notes", validateBody(createNoteSchema), createRequestNoteController);
legalRequestRoutes.get("/:id/notes", listRequestNotesController);
legalRequestRoutes.get("/:id/history", listRequestHistoryController);
