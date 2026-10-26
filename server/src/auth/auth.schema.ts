import { z } from "zod";

// Staff creation schema
export const createStaffSchema = z.object({
  email: z.string().email(),
  name: z.string().max(100, "name is too long"),
  password: z.string().min(8, "Password should be at least 8 characters"),
  role: z.string(),
});

// Staff Login Schema
export const staffLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password should be at least 8 characters"),
});

// Intern creation schema
export const createInternSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(7, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  group: z.string().min(1, "Group is required"),
  techArea: z.string().min(1, "Tech area is required"),
  course: z.string().optional(),
  skills: z.string().min(1, "Skills are required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export type StaffData = z.infer<typeof createStaffSchema>;
export type StaffLoginData = z.infer<typeof staffLoginSchema>;
export type InternData = z.infer<typeof createInternSchema>;
