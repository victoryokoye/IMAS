import { z } from "zod";

// Staff roles
export const staffRoleSchema = z.enum([
  "ADMINISTRATOR",
  "SUPERVISOR",
  "INTERN_COORDINATOR",
]);

// Staff status
export const staffStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

// Create staff
export const createStaffSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: staffRoleSchema,
});

// Update staff details
export const updateStaffSchema = z
  .object({
    fullName: z.string().trim().min(2).optional(),
    email: z.string().trim().email().toLowerCase().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

// Update staff role
export const updateStaffRoleSchema = z.object({
  role: staffRoleSchema,
});

// Update staff status
export const updateStaffStatusSchema = z.object({
  status: staffStatusSchema,
});

// Staff ID parameter
export const staffIdSchema = z.object({
  id: z.string().uuid("Invalid staff ID"),
});

// Inferred types
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type UpdateStaffRoleInput = z.infer<typeof updateStaffRoleSchema>;
export type UpdateStaffStatusInput = z.infer<typeof updateStaffStatusSchema>;
export type StaffRole = z.infer<typeof staffRoleSchema>;
export type StaffStatus = z.infer<typeof staffStatusSchema>;
