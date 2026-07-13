import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allowedOrigins, env } from "./config/env.js";
import { authRoutes } from "./routes/auth.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { healthRoutes } from "./routes/health.routes.js";
import { legalRequestRoutes } from "./routes/legal-request.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origem não permitida pelo CORS."));
  }
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/uploads", express.static(path.resolve(__dirname, "..", env.UPLOAD_DIR)));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/legal-requests", legalRequestRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

