import { z } from "zod";

const internFields = {
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(7, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  group: z.string().min(1, "Group is required"),
  techArea: z.string().min(1, "Tech area is required"),
  course: z.string().optional(),
  skills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
};

export const createInternSchema = z
  .object(internFields)
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export const updateInternSchema = createInternSchema;

export const updateInternStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const setInternPinSchema = z.object({
  pin: z.string().regex(/^\d{4}$/, "PIN must contain exactly 4 digits"),
});

export const verifyInternPinSchema = setInternPinSchema;

export const listInternsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateInternInput = z.infer<typeof createInternSchema>;
export type UpdateInternInput = z.infer<typeof updateInternSchema>;
export type UpdateInternStatusInput = z.infer<typeof updateInternStatusSchema>;
export type SetInternPinInput = z.infer<typeof setInternPinSchema>;
export type VerifyInternPinInput = z.infer<typeof verifyInternPinSchema>;
export type ListInternsQuery = z.infer<typeof listInternsQuerySchema>;
