import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";
import { attendanceService } from "../services/attendance.service";
import { attendanceKeys } from "./useAttendance";

interface Range {
  startDate?: string;
  endDate?: string;
}

/**
 * Total attendance records in the date range (all interns): one request with limit=1,
 * reading only meta.total. Empty dates = all time.
 */
export function useAttendanceTotal(
  range: Range,
  opts: { enabled?: boolean } = {},
) {
  const params = { ...range, page: 1, limit: 1 };
  return useQuery({
    queryKey: [...attendanceKeys.list(params), "total"] as const,
    queryFn: async () => (await attendanceService.list(params)).meta.total,
    enabled: opts.enabled ?? true,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Per-intern totals for the interns currently on screen: one tiny request each
 * (GET /interns/:id/attendance?limit=1), reading only meta.total.
 * Cached under attendanceKeys.all, so a sign-in/out refreshes these automatically.
 */
export function useInternAttendanceCounts(
  internIds: string[],
  range: Range,
  opts: { enabled?: boolean } = {},
) {
  const enabled = opts.enabled ?? true;
  const results = useQueries({
    queries: internIds.map((id) => {
      const params = { ...range, page: 1, limit: 1 };
      return {
        queryKey: [...attendanceKeys.intern(id, params), "count"] as const,
        queryFn: async () =>
          (await attendanceService.listForIntern(id, params)).meta.total,
        enabled,
        staleTime: 60_000,
        // No placeholderData here: it is matched by position and could show another intern's count.
      };
    }),
  });

  const counts: Record<string, number | undefined> = {};
  internIds.forEach((id, i) => {
    counts[id] = results[i]?.data;
  });

  return {
    counts,
    isPending: results.some((r) => r.isPending && r.fetchStatus !== "idle"),
    isError: results.some((r) => r.isError),
    refetch: () => results.forEach((r) => r.refetch()),
  };
}
