import { z } from "zod";

export const staffLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password should be at least 8 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(8, "Password should be at least 8 characters"),
});

export type LoginStaffInput = z.infer<typeof staffLoginSchema>;

// Staff creation schema
// export const createStaffSchema = z.object({
//   email: z.string().email(),
//   name: z.string().max(100, "name is too long"),
//   password: z.string().min(8, "Password should be at least 8 characters"),
//   role: z.string(),
// });
