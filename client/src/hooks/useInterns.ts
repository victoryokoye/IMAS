import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { internsService, type InternListParams } from "../services/interns.service";
import type { ActiveStatus, InternInput } from "../types/api";

export const internKeys = {
  all: ["interns"] as const,
  lists: () => [...internKeys.all, "list"] as const,
  list: (params: InternListParams) => [...internKeys.lists(), params] as const,
  details: () => [...internKeys.all, "detail"] as const,
  detail: (id: string) => [...internKeys.details(), id] as const,
};

export function useInterns(params: InternListParams) {
  return useQuery({
    queryKey: internKeys.list(params),
    queryFn: () => internsService.list(params),
    placeholderData: keepPreviousData, // no flicker when changing page/search
  });
}

export function useIntern(id?: string) {
  return useQuery({
    queryKey: internKeys.detail(id ?? ""),
    queryFn: () => internsService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateIntern() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: InternInput) => internsService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: internKeys.lists() }),
  });
}

export function useUpdateIntern() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: InternInput }) =>
      internsService.update(id, input),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: internKeys.detail(id) });
      qc.invalidateQueries({ queryKey: internKeys.lists() });
    },
  });
}

export function useSetInternStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ActiveStatus }) =>
      internsService.setStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: internKeys.all });
      qc.invalidateQueries({ queryKey: ["projects"] }); // assigned-intern lists show status
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useSetInternPin() {
  return useMutation({
    mutationFn: ({ id, pin }: { id: string; pin: string }) => internsService.setPin(id, pin),
  });
}
