// export interface CreateStaffInput {
//   name: string;
//   email: string;
//   password: string;
//   role: "ADMINISTRATOR" | "SUPERVISOR" | "INTERN_COORDINATOR";
// }

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
