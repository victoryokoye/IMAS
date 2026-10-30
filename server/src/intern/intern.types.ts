export type InternStatus = "ACTIVE" | "INACTIVE";

export interface Intern {
  id: string;
  name: string;
  phone: string;
  email: string;
  group: string;
  techArea: string;
  course: string | null;
  skills: string | null;
  startDate: Temporal.Instant;
  endDate: Temporal.Instant;
  status: InternStatus;
  pin: string | null;
  createdAt: Temporal.Instant;
  updatedAt: Temporal.Instant;
}

export interface InternListResponse {
  data: Intern[];
  total: number;
}

export interface InternPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
