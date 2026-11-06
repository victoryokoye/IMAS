import type { Role, ActiveStatus, Staff } from "./api";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "PERMITTED_ABSENCE";

export interface StaffRef {
  id: string;
  fullName: string;
}

export interface AttendanceRecord {
  id: string;
  internId: string;
  internName?: string;
  date: string; // YYYY-MM-DD
  signInAt: string | null; // ISO timestamp
  signOutAt: string | null;
  recordedBy: StaffRef | null;
  status?: AttendanceStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  internId?: string;
  status?: AttendanceStatus | "";
  search?: string;
}

export interface AttendanceCorrection {
  date: string;
  signInAt: string | null;
  signOutAt: string | null;
}

export interface PinAction {
  internId: string;
  pin: string;
}

export interface DashboardSummary {
  totalInterns: number;
  activeInterns: number;
  inactiveInterns: number;
  presentToday: number;
  signedOutToday: number;
  currentlyPresent: number;
  totalStaff: number;
  activeProjects: number;
}

export interface StaffMember extends Staff {
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffInput {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export interface StaffUpdate {
  fullName: string;
  email: string;
}

export type { ActiveStatus };
