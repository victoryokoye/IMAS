export type ProjectStatus = "OPEN" | "COMPLETED" | "ABANDONED" | "CANCELLED";

export type ProjectSortField = "name" | "startDate" | "endDate" | "createdAt";

export interface ProjectIntern {
  id: string;
  internId: string;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  department: string | null;
  status: ProjectStatus;
  startDate: Temporal.Instant;
  endDate: Temporal.Instant;
  createdAt: Temporal.Instant;
  updatedAt: Temporal.Instant;
}

export interface ProjectWithInterns extends Project {
  interns: ProjectIntern[];
}
