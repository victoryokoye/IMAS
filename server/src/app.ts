import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/auth.routes";
import internRoutes from "./intern/intern.routes";

const app: express.Application = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("interns", internRoutes);

export default app;
