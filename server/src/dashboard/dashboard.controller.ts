import { type Request, type Response, type NextFunction } from "express";
import * as dashboardService from "./dashboard.service";

export async function getSummary(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await dashboardService.getDashboardSummary();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}
