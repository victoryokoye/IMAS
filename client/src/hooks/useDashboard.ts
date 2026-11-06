import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import { attendanceService } from "../services/attendance.service";
import { attendanceKeys } from "./useAttendance";

/** Summary cards. Refreshes every minute while the tab is visible. */
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.summary,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

/**
 * "Recent attendance activity". The API has no dedicated endpoint, so this reads the first
 * page of GET /attendance. Confirm the backend returns newest first.
 */
export function useRecentAttendance(limit = 8) {
  const params = { page: 1, limit };
  return useQuery({
    queryKey: [...attendanceKeys.list(params), "recent"],
    queryFn: () => attendanceService.list(params),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}
