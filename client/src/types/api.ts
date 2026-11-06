export type Role = "ADMINISTRATOR" | "SUPERVISOR" | "INTERN_COORDINATOR";
export type ActiveStatus = "ACTIVE" | "INACTIVE";
export type ProjectStatus = "OPEN" | "COMPLETED" | "ABANDONED" | "CANCELED";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Raw envelopes returned by the API */
export interface ApiSuccess<T> {
  status: "success";
  data: T;
}
export interface ApiList<T> extends ApiSuccess<T[]> {
  meta: PaginationMeta;
}

/** Normalised shape the services hand to the UI */
export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface Staff {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  status: ActiveStatus;
}

export interface Intern {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  group: string;
  techArea: string;
  course?: string | null;
  skills: string[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: ActiveStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface InternInput {
  fullName: string;
  phone: string;
  email: string;
  group: string;
  techArea: string;
  course?: string;
  skills: string[];
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  department?: string | null;
  techArea?: string | null;
  internCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectInput {
  name: string;
  description?: string;
  department?: string;
  techArea?: string;
  /** Only accepted on create; use PATCH /projects/:id/status afterwards */
  status?: ProjectStatus;
}

export interface ProjectIntern {
  id: string;
  fullName: string;
  techArea?: string | null;
  status: ActiveStatus;
  assignedAt?: string;
}
