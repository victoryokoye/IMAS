import cookieParser from "cookie-parser";

import cors from "cors";

import authRoutes from "./auth/auth.routes";
import internRoutes from "./intern/intern.routes";
import projectRoutes from "./project/project.routes";
import staffRoutes from "./staff/staff.routes";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import attendanceRoutes from "./attendance/attendance.routes";
import dashboardRoutes from "./dashboard/dashboard.routes";
import { HttpError } from "./utils/http-error";

const app: express.Application = express();

const allowedOrigins = (process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/interns", internRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/staffs", staffRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1", attendanceRoutes);

// Centralized error-handling middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
