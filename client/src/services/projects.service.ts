import { api } from "./api";
import { cleanParams } from "../utils/params";
import type {
  ApiList,
  ApiSuccess,
  Paginated,
  Project,
  ProjectInput,
  ProjectIntern,
  ProjectStatus,
} from "../types/api";

export interface ProjectListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus | "";
}

export interface ProjectInternParams {
  page?: number;
  limit?: number;
}

export const projectsService = {
  list: async (params: ProjectListParams): Promise<Paginated<Project>> => {
    const { data } = await api.get<ApiList<Project>>("/projects", {
      params: cleanParams(params),
    });
    return { items: data.data, meta: data.meta };
  },

  get: async (id: string) => (await api.get<ApiSuccess<Project>>(`/projects/${id}`)).data.data,

  create: async (input: ProjectInput) =>
    (await api.post<ApiSuccess<Project>>("/projects", input)).data.data,

  // PUT does not accept `status`; the contract has a dedicated PATCH for that
  update: async (id: string, input: Omit<ProjectInput, "status">) =>
    (await api.put<ApiSuccess<Project>>(`/projects/${id}`, input)).data.data,

  setStatus: async (id: string, status: ProjectStatus) =>
    (await api.patch<ApiSuccess<Project>>(`/projects/${id}/status`, { status })).data.data,

  listInterns: async (
    id: string,
    params: ProjectInternParams,
  ): Promise<Paginated<ProjectIntern>> => {
    const { data } = await api.get<ApiList<ProjectIntern>>(`/projects/${id}/interns`, {
      params: cleanParams(params),
    });
    return { items: data.data, meta: data.meta };
  },

  assignInterns: async (id: string, internIds: string[]) => {
    await api.post(`/projects/${id}/interns`, { internIds });
  },

  removeIntern: async (id: string, internId: string) => {
    await api.delete(`/projects/${id}/interns/${internId}`);
  },
};
