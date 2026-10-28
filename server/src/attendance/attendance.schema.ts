import { z } from "zod";

// ---------------------------------------------------------------------------
// Intern self-service: sign in via 4-digit PIN
// ---------------------------------------------------------------------------
export const checkInSchema = z.object({
  body: z.object({
    internId: z.string().uuid("internId must be a valid UUID"),
    pin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d{4}$/, "PIN must contain only digits"),
  }),
});

// ---------------------------------------------------------------------------
// Intern self-service: sign out via 4-digit PIN
// ---------------------------------------------------------------------------
export const checkOutSchema = z.object({
  body: z.object({
    internId: z.string().uuid("internId must be a valid UUID"),
    pin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d{4}$/, "PIN must contain only digits"),
  }),
});

// ---------------------------------------------------------------------------
// Staff-only: mark a permitted absence for a specific intern on a date.
// Allowed roles: ADMINISTRATOR, SUPERVISOR.
// ---------------------------------------------------------------------------
export const markPermittedAbsenceSchema = z.object({
  body: z.object({
    internId: z.string().uuid("internId must be a valid UUID"),
    // ISO date string e.g. "2025-09-28"
    date: z.coerce.date(),
  }),
});

// ---------------------------------------------------------------------------
// Admin-only: Edit an attendance record of a specific intern on a specific date.
// Allowed roles: ADMINISTRATOR.
// ---------------------------------------------------------------------------
export const editAttendanceSchema = z.object({
  params: z.object({
    id: z.string().uuid("id must be a valid UUID"),
  }),
  body: z
    .object({
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
      signInAt: z
        .string()
        .datetime({ message: "signInAt must be an ISO 8601 timestamp" }),
      signOutAt: z
        .string()
        .datetime({ message: "signOutAt must be an ISO 8601 timestamp" })
        .nullable(),
    })
    .refine(
      (d) =>
        d.signOutAt === null || new Date(d.signOutAt) >= new Date(d.signInAt),
      {
        message: "signOutAt must not be earlier than signInAt",
        path: ["signOutAt"],
      },
    ),
});

// ---------------------------------------------------------------------------
// Query / list attendance records (staff view)
// ---------------------------------------------------------------------------
export const listAttendanceSchema = z.object({
  query: z.object({
    internId: z.string().uuid().optional(),
    // ISO date string filters
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    status: z.enum(["PRESENT", "ABSENT", "PERMITTED_ABSENCE"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});

// ---------------------------------------------------------------------------
// Query / list attendance records (staff view)
// ---------------------------------------------------------------------------
export const listByInternSchema = z.object({
  params: z.object({
    id: z.string().uuid("id must be a valid UUID"),
  }),
  query: z.object({
    // ISO date string filters
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    status: z.enum(["PRESENT", "ABSENT", "PERMITTED_ABSENCE"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});

// ---------------------------------------------------------------------------
// Fetch a single attendance record by its UUID
// ---------------------------------------------------------------------------
export const attendanceIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("id must be a valid UUID"),
  }),
});
// ---------------------------------------------------------------------------
// Delete a single attendance record by its UUID
// ---------------------------------------------------------------------------
export const deleteAttendanceSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid("Invalid attendance ID"),
  }),
});

// ---------------------------------------------------------------------------
// Exported input types
// ---------------------------------------------------------------------------
export type CheckInInput = z.infer<typeof checkInSchema>["body"];
export type CheckOutInput = z.infer<typeof checkOutSchema>["body"];
export type MarkPermittedAbsenceInput = z.infer<
  typeof markPermittedAbsenceSchema
>["body"];
export type ListAttendanceQuery = z.infer<typeof listAttendanceSchema>["query"];
export type EditAttendanceInput = z.infer<typeof editAttendanceSchema>;
export type DeleteAttendanceParams = z.infer<
  typeof deleteAttendanceSchema
>["params"];
