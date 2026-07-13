import { env } from "../config/env.js";
import { CloudStorageProvider } from "./cloud-storage-provider.js";
import { LocalStorageProvider } from "./local-storage-provider.js";
import type { StorageProvider } from "./storage-provider.js";

export function makeStorageProvider(): StorageProvider {
  return env.UPLOAD_PROVIDER === "cloud" ? new CloudStorageProvider() : new LocalStorageProvider();
}

