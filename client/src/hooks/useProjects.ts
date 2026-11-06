import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  projectsService,
  type ProjectInternParams,
  type ProjectListParams,
} from "../services/projects.service";
import type { ProjectInput, ProjectStatus } from "../types/api";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (params: ProjectListParams) => [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  // nested under detail(id) so invalidating a project also refreshes its interns
  interns: (id: string, params: ProjectInternParams) =>
    [...projectKeys.detail(id), "interns", params] as const,
};

export function useProjects(params: ProjectListParams) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => projectsService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useProject(id?: string) {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ""),
    queryFn: () => projectsService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useProjectInterns(id: string | undefined, params: ProjectInternParams) {
  return useQuery({
    queryKey: projectKeys.interns(id ?? "", params),
    queryFn: () => projectsService.listInterns(id as string, params),
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectInput) => projectsService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Omit<ProjectInput, "status"> }) =>
      projectsService.update(id, input),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: projectKeys.detail(id) });
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useSetProjectStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      projectsService.setStatus(id, status),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: projectKeys.detail(id) });
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAssignInterns() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, internIds }: { id: string; internIds: string[] }) =>
      projectsService.assignInterns(id, internIds),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: projectKeys.detail(id) });
      qc.invalidateQueries({ queryKey: projectKeys.lists() }); // internCount changed
    },
  });
}

export function useRemoveProjectIntern() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, internId }: { id: string; internId: string }) =>
      projectsService.removeIntern(id, internId),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: projectKeys.detail(id) });
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}
