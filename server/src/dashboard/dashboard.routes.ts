import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { dashboardSummarySchema } from "./dashboard.schema";
import * as dashboardController from "./dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router: Router = Router();

router.use(authMiddleware);

router.get(
  "/summary",
  validate(dashboardSummarySchema),
  dashboardController.getSummary,
);

export default router;
