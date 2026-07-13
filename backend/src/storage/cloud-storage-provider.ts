import type { StorageProvider, StoredFile } from "./storage-provider.js";

export class CloudStorageProvider implements StorageProvider {
  async save(_file: Express.Multer.File): Promise<StoredFile> {
    throw new Error("UPLOAD_PROVIDER=cloud precisa ser conectado a Cloudinary, S3, Google Cloud Storage ou Supabase Storage.");
  }
}

