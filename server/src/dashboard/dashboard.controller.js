import {} from "express";
import * as dashboardService from "./dashboard.service";
export async function getSummary(_req, res, next) {
    try {
        const data = await dashboardService.getDashboardSummary();
        res.status(200).json({ status: "success", data });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=dashboard.controller.js.map