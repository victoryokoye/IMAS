import { api } from "./api";
import { cleanParams } from "../utils/params";
import type { ActiveStatus, ApiList, ApiSuccess, Paginated, Role } from "../types/api";
import type { StaffInput, StaffMember, StaffUpdate } from "../types/attendance";

export interface StaffListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role | "";
  status?: ActiveStatus | "";
}

export const staffService = {
  list: async (params: StaffListParams): Promise<Paginated<StaffMember>> => {
    const { data } = await api.get<ApiList<StaffMember>>("/staff", { params: cleanParams(params) });
    return { items: data.data, meta: data.meta };
  },

  get: async (id: string) => (await api.get<ApiSuccess<StaffMember>>(`/staff/${id}`)).data.data,

  create: async (input: StaffInput) =>
    (await api.post<ApiSuccess<StaffMember>>("/staff", input)).data.data,

  update: async (id: string, input: StaffUpdate) =>
    (await api.put<ApiSuccess<StaffMember>>(`/staff/${id}`, input)).data.data,

  setStatus: async (id: string, status: ActiveStatus) =>
    (await api.patch<ApiSuccess<StaffMember>>(`/staff/${id}/status`, { status })).data.data,

  setRole: async (id: string, role: Role) =>
    (await api.patch<ApiSuccess<StaffMember>>(`/staff/${id}/role`, { role })).data.data,
};
