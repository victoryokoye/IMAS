import { api } from "./api";
import type { ApiSuccess } from "../types/api";
import type { DashboardSummary } from "../types/attendance";

export const dashboardService = {
  summary: async () =>
    (await api.get<ApiSuccess<DashboardSummary>>("/dashboard/summary")).data.data,
};
