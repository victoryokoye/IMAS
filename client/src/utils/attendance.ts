import { TIMEZONE } from "./constants";
import type { AttendanceRecord } from "../types/attendance";

/** "YYYY-MM-DD" for today in the company timezone (not the browser's). */
export function todayInCompanyTz(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function formatTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString(undefined, { timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export type AttendanceState = "NOT_SIGNED_IN" | "SIGNED_IN" | "SIGNED_OUT";

/** What the coordinator should be offered for an intern, from today's record (if any). */
export function getAttendanceState(record?: AttendanceRecord | null): AttendanceState {
  if (!record || !record.signInAt) return "NOT_SIGNED_IN";
  return record.signOutAt ? "SIGNED_OUT" : "SIGNED_IN";
}
