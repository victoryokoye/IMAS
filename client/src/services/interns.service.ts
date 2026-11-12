/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api";
import { cleanParams } from "../utils/params";
import { toPaginated, unwrap } from "../utils/pagination";
import type { ActiveStatus, Intern, InternInput, Paginated } from "../types/api";

export interface InternListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ActiveStatus | "";
}

/**
 * The backend may send skills as an array (API spec) or a comma-separated string
 * (implementation guide), and may be null. The UI always receives string[].
 */
function toSkillList(value: unknown): string[] {
  const parts = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return parts.map((s) => String(s).trim()).filter(Boolean);
}

/** Also accepts `name` in place of `fullName`, which the deployed backend uses for staff. */
function normalizeIntern(raw: any): Intern {
  return {
    ...raw,
    fullName: raw.fullName ?? raw.name ?? "",
    skills: toSkillList(raw.skills),
    course: raw.course ?? null,
  };
}

export const internsService = {
  list: async (params: InternListParams): Promise<Paginated<Intern>> => {
    const res = await api.get("/interns", { params: cleanParams(params) });
    return toPaginated<Intern>(res.data, normalizeIntern, params);
  },

  get: async (id: string) => normalizeIntern(unwrap((await api.get(`/interns/${id}`)).data, "intern")),

  create: async (input: InternInput) =>
    normalizeIntern(unwrap((await api.post("/interns", input)).data, "intern")),

  update: async (id: string, input: InternInput) =>
    normalizeIntern(unwrap((await api.put(`/interns/${id}`, input)).data, "intern")),

  setStatus: async (id: string, status: ActiveStatus) =>
    normalizeIntern(unwrap((await api.patch(`/interns/${id}/status`, { status })).data, "intern")),

  setPin: async (id: string, pin: string) => {
    await api.put(`/interns/${id}/pin`, { pin });
  },
};
