import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { staffService, type StaffListParams } from "../services/staff.service";
import type { ActiveStatus, Role } from "../types/api";
import type { StaffInput, StaffUpdate } from "../types/attendance";

export const staffKeys = {
  all: ["staff"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
  list: (p: StaffListParams) => [...staffKeys.lists(), p] as const,
  details: () => [...staffKeys.all, "detail"] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
};

export function useStaffList(params: StaffListParams) {
  return useQuery({
    queryKey: staffKeys.list(params),
    queryFn: () => staffService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useStaffMember(id?: string) {
  return useQuery({
    queryKey: staffKeys.detail(id ?? ""),
    queryFn: () => staffService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: StaffInput) => staffService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffKeys.lists() });
      qc.invalidateQueries({ queryKey: ["dashboard"] }); // totalStaff
    },
  });
}

export function useUpdateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: StaffUpdate }) => staffService.update(id, input),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: staffKeys.detail(id) });
      qc.invalidateQueries({ queryKey: staffKeys.lists() });
      qc.invalidateQueries({ queryKey: ["auth", "me"] }); // in case it was the logged-in user
    },
  });
}

export function useSetStaffStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ActiveStatus }) =>
      staffService.setStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: staffKeys.all }),
  });
}

export function useSetStaffRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => staffService.setRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffKeys.all });
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
