import { api } from "./api";
import { cleanParams } from "../utils/params";
import { toPaginated, unwrap } from "../utils/pagination";
import type {
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

/** Fills in names the backend might send differently, so the UI sees one shape. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProjectIntern(raw: any): ProjectIntern {
  return { ...raw, fullName: raw.fullName ?? raw.name ?? "" };
}

export const projectsService = {
  list: async (params: ProjectListParams): Promise<Paginated<Project>> => {
    const res = await api.get("/projects", { params: cleanParams(params) });
    return toPaginated<Project>(res.data, undefined, params);
  },

  get: async (id: string) => unwrap<Project>((await api.get(`/projects/${id}`)).data, "project"),

  create: async (input: ProjectInput) =>
    unwrap<Project>((await api.post("/projects", input)).data, "project"),

  // PUT does not accept `status`; the contract has a dedicated PATCH for that
  update: async (id: string, input: Omit<ProjectInput, "status">) =>
    unwrap<Project>((await api.put(`/projects/${id}`, input)).data, "project"),

  setStatus: async (id: string, status: ProjectStatus) =>
    unwrap<Project>((await api.patch(`/projects/${id}/status`, { status })).data, "project"),

  listInterns: async (id: string, params: ProjectInternParams): Promise<Paginated<ProjectIntern>> => {
    const res = await api.get(`/projects/${id}/interns`, { params: cleanParams(params) });
    return toPaginated<ProjectIntern>(res.data, normalizeProjectIntern, params);
  },

  assignInterns: async (id: string, internIds: string[]) => {
    await api.post(`/projects/${id}/interns`, { internIds });
  },

  removeIntern: async (id: string, internId: string) => {
    await api.delete(`/projects/${id}/interns/${internId}`);
  },
};
