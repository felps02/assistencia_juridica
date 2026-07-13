import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import type { StorageProvider, StoredFile } from "./storage-provider.js";

export class LocalStorageProvider implements StorageProvider {
  async save(file: Express.Multer.File): Promise<StoredFile> {
    const now = new Date();
    const folder = path.resolve(env.UPLOAD_DIR, String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, "0"));
    await fs.mkdir(folder, { recursive: true });
    const extension = path.extname(file.originalname).toLowerCase();
    const storedName = `${crypto.randomUUID()}${extension}`;
    const destination = path.join(folder, storedName);
    await fs.writeFile(destination, file.buffer);

    const relativeUrl = `/${path.relative(process.cwd(), destination).replace(/\\/g, "/")}`;
    return {
      originalName: file.originalname,
      storedName,
      fileUrl: relativeUrl,
      mimeType: file.mimetype,
      fileSize: file.size
    };
  }
}

