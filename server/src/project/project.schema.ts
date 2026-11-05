import { z } from "zod";

export const createProjectSchema = z
  .object({
    name: z.string().trim().min(1, "Project name is required"),

    description: z.string().trim().nullable().optional(),

    department: z.string().trim().nullable().optional(),

    status: z.enum(["OPEN", "COMPLETED", "ABANDONED", "CANCELLED"]).optional(),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1).optional(),

    description: z.string().trim().nullable().optional(),

    department: z.string().trim().nullable().optional(),

    status: z.enum(["OPEN", "COMPLETED", "ABANDONED", "CANCELLED"]).optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const projectIdSchema = z.object({
  id: z.uuid(),
});

export const assignInternsSchema = z.object({
  internIds: z
    .array(z.uuid())
    .min(1, "At least one intern must be selected")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Duplicate intern IDs are not allowed",
    }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AssignInternsInput = z.infer<typeof assignInternsSchema>;
