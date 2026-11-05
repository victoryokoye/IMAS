import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./auth/auth.routes";
import internRoutes from "./intern/intern.routes";
import projectRoutes from "./project/project.routes";
import staffRoutes from "./staff/staff.routes";

const app: express.Application = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/interns", internRoutes);
app.use("/projects", projectRoutes);
app.use("/staffs", staffRoutes);

export default app;
