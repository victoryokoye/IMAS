import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import attendanceRoutes from "./attendance/attendance.routes";
import dashboardRoutes from "./dashboard/dashboard.routes";
import { HttpError } from "./utils/http-error";

const app: express.Application = express();

app.use(express.json());

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
