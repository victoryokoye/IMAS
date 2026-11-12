/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api";
import { cleanParams } from "../utils/params";
import { toPaginated, unwrap } from "../utils/pagination";
import type { ActiveStatus, Paginated, Role } from "../types/api";
import type { StaffInput, StaffMember, StaffUpdate } from "../types/attendance";

export interface StaffListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role | "";
  status?: ActiveStatus | "";
}

/** The deployed backend returns `name`; the UI uses `fullName`. */
function normalizeStaff(raw: any): StaffMember {
  return { ...raw, fullName: raw.fullName ?? raw.name ?? "" };
}

export const staffService = {
  list: async (params: StaffListParams): Promise<Paginated<StaffMember>> => {
    const res = await api.get("/staffs", { params: cleanParams(params) });
    return toPaginated<StaffMember>(res.data, normalizeStaff, params);
  },

  get: async (id: string) =>
    normalizeStaff(unwrap((await api.get(`/staffs/${id}`)).data, "staff")),

  create: async (input: StaffInput) =>
    normalizeStaff(unwrap((await api.post("/staffs", input)).data, "staff")),

  update: async (id: string, input: StaffUpdate) =>
    normalizeStaff(
      unwrap((await api.put(`/staffs/${id}`, input)).data, "staff"),
    ),

  setStatus: async (id: string, status: ActiveStatus) =>
    normalizeStaff(
      unwrap(
        (await api.patch(`/staffs/${id}/status`, { status })).data,
        "staff",
      ),
    ),

  setRole: async (id: string, role: Role) =>
    normalizeStaff(
      unwrap((await api.patch(`/staffs/${id}/role`, { role })).data, "staff"),
    ),
};
