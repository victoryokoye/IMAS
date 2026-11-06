import { api } from "./api";
import { cleanParams } from "../utils/params";
import type {
  ActiveStatus,
  ApiList,
  ApiSuccess,
  Intern,
  InternInput,
  Paginated,
} from "../types/api";

export interface InternListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ActiveStatus | "";
}

export const internsService = {
  list: async (params: InternListParams): Promise<Paginated<Intern>> => {
    const { data } = await api.get<ApiList<Intern>>("/interns", {
      params: cleanParams(params),
    });
    return { items: data.data, meta: data.meta };
  },

  get: async (id: string) => (await api.get<ApiSuccess<Intern>>(`/interns/${id}`)).data.data,

  create: async (input: InternInput) =>
    (await api.post<ApiSuccess<Intern>>("/interns", input)).data.data,

  update: async (id: string, input: InternInput) =>
    (await api.put<ApiSuccess<Intern>>(`/interns/${id}`, input)).data.data,

  setStatus: async (id: string, status: ActiveStatus) =>
    (await api.patch<ApiSuccess<Intern>>(`/interns/${id}/status`, { status })).data.data,

  setPin: async (id: string, pin: string) => {
    await api.put(`/interns/${id}/pin`, { pin });
  },
};
