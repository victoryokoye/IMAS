export interface CreateStaffInput {
  name: string;
  email: string;
  password: string;
  role: "ADMINISTRATOR" | "SUPERVISOR" | "INTERN_COORDINATOR";
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "ADMINISTRATOR" | "SUPERVISOR" | "INTERN_COORDINATOR";
  status: "ACTIVE" | "INACTIVE";

  createdAt: Temporal.Instant;
  updatedAt: Temporal.Instant;
}

export interface LoginStaffInput {
  email: string;
  password: string;
}

export interface CreateInternInput {
  name: string;
  phone: string;
  email: string;
  group: string;
  techArea: string;
  course?: string;
  skills: string;
  startDate: Date;
  endDate: Date;
}

interface Intern {
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
  status: "ACTIVE" | "INACTIVE";
  pin: string;
  createdAt: Temporal.Instant;
  updatedAt: Temporal.Instant;
}
export interface CreateInternResult {
  intern: Intern;
  pin: string;
}
