import type { Role } from "../types/api";

// UX only. The backend enforces every permission independently.
export const canDeactivateIntern = (role?: Role) =>
  role === "ADMINISTRATOR" || role === "SUPERVISOR";

// API spec + requirements doc: all three roles. The implementation guide says
// Administrator/Supervisor only. If that is the final rule, drop INTERN_COORDINATOR here.
export const canSetPin = (role?: Role) =>
  role === "ADMINISTRATOR" || role === "SUPERVISOR" || role === "INTERN_COORDINATOR";

export const canManageProjects = (role?: Role) =>
  role === "ADMINISTRATOR" || role === "SUPERVISOR";

export const canManageStaff = (role?: Role) => role === "ADMINISTRATOR";

export const canRecordAttendance = (role?: Role) =>
  role === "ADMINISTRATOR" || role === "INTERN_COORDINATOR";

export const canCorrectAttendance = (role?: Role) => role === "ADMINISTRATOR";
