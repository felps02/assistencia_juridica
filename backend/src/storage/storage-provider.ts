export type StoredFile = {
  originalName: string;
  storedName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
};

export interface StorageProvider {
  save(file: Express.Multer.File): Promise<StoredFile>;
}

