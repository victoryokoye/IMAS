import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { dashboardSummarySchema } from "./dashboard.schema";
import * as dashboardController from "./dashboard.controller";
const router = Router();
router.get("/summary", validate(dashboardSummarySchema), dashboardController.getSummary);
export default router;
//# sourceMappingURL=dashboard.routes.js.map