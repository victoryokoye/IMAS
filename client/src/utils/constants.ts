import type { ProjectStatus } from "../types/api";

/** Your implementation guide says exactly 4 digits. Change here if the backend changes. */
export const PIN_LENGTH = 4;

/** Company timezone (IANA). Attendance "today" is computed in this zone, not the browser's. */
export const TIMEZONE: string = import.meta.env.VITE_TIMEZONE ?? "Africa/Lagos";

export const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "OPEN", label: "Open" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ABANDONED", label: "Abandoned" },
  { value: "CANCELED", label: "Canceled" },
];
