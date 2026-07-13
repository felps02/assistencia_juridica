import path from "node:path";
import multer from "multer";
import { env } from "../config/env.js";

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const allowedExtensions = new Set([".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]);
const blockedExtensions = new Set([".exe", ".bat", ".cmd", ".sh", ".js", ".msi", ".scr", ".ps1"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 8
  },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (blockedExtensions.has(extension) || !allowedExtensions.has(extension) || !allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error("Tipo de arquivo não permitido."));
    }
    return cb(null, true);
  }
});

