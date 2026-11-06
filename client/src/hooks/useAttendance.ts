import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "../services/attendance.service";
import { todayInCompanyTz } from "../utils/attendance";
import type { AttendanceCorrection, AttendanceParams, PinAction } from "../types/attendance";

export const attendanceKeys = {
  all: ["attendance"] as const,
  lists: () => [...attendanceKeys.all, "list"] as const,
  list: (p: AttendanceParams) => [...attendanceKeys.lists(), p] as const,
  details: () => [...attendanceKeys.all, "detail"] as const,
  detail: (id: string) => [...attendanceKeys.details(), id] as const,
  intern: (internId: string, p: object) => [...attendanceKeys.all, "intern", internId, p] as const,
};

/** Attendance history with filters (date range, intern, status, page). */
export function useAttendance(params: AttendanceParams) {
  return useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => attendanceService.list(params),
    placeholderData: keepPreviousData,
  });
}

/**
 * Today's attendance. Short staleTime + polling so several coordinators see each other's
 * sign-ins without a manual refresh. Polling pauses when the tab is hidden.
 */
export function useTodayAttendance(opts: { page?: number; limit?: number } = {}) {
  const today = todayInCompanyTz();
  const params: AttendanceParams = {
    startDate: today,
    endDate: today,
    page: opts.page ?? 1,
    limit: opts.limit ?? 50,
  };
  return useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => attendanceService.list(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useAttendanceRecord(id?: string) {
  return useQuery({
    queryKey: attendanceKeys.detail(id ?? ""),
    queryFn: () => attendanceService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useInternAttendance(
  internId: string | undefined,
  params: { page?: number; limit?: number; startDate?: string; endDate?: string } = {},
) {
  return useQuery({
    queryKey: attendanceKeys.intern(internId ?? "", params),
    queryFn: () => attendanceService.listForIntern(internId as string, params),
    enabled: Boolean(internId),
    placeholderData: keepPreviousData,
  });
}

/** Everything that displays attendance numbers must refresh after a change. */
function useRefreshAttendance() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: attendanceKeys.all });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };
}

export function useSignIn() {
  const refresh = useRefreshAttendance();
  return useMutation({
    mutationFn: (input: PinAction) => attendanceService.signIn(input),
    onSuccess: refresh,
  });
}

export function useSignOut() {
  const refresh = useRefreshAttendance();
  return useMutation({
    mutationFn: (input: PinAction) => attendanceService.signOut(input),
    onSuccess: refresh,
  });
}

export function useCorrectAttendance() {
  const refresh = useRefreshAttendance();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AttendanceCorrection }) =>
      attendanceService.correct(id, input),
    onSuccess: refresh,
  });
}

export function useDeleteAttendance() {
  const refresh = useRefreshAttendance();
  return useMutation({
    mutationFn: (id: string) => attendanceService.remove(id),
    onSuccess: refresh,
  });
}
