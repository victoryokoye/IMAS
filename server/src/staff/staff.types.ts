import type { StaffRole, StaffStatus } from "./staff.schema";

export interface Staff {
  id: string;
  name: string;
  email: string;
  password: string;
  role: StaffRole;
  status: StaffStatus;
  createdAt: Temporal.Instant;
  updatedAt: Temporal.Instant;
}
