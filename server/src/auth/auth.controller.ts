import type { Request, Response } from "express";
import {
  staffLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema";
import {
  loginStaff,
  getCurrentStaff,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
} from "./auth.service";

// login
export const login = async (req: Request, res: Response) => {
  // Validate login credentials.
  const validation = staffLoginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.flatten(),
    });
  }

  try {
    const { email, password } = validation.data;
    const { staff, token } = await loginStaff({ email, password });

    // Exclude the password from the response.
    const { password: _, ...staffDetails } = staff;

    // Store the JWT in an HTTP-only cookie.
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      message: "Login successful",
      staff: staffDetails,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    if (message === "Invalid email or password") {
      return res.status(401).json({ message });
    }

    if (message === "Staff account is inactive") {
      return res.status(403).json({ message });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get current user
export const getMe = async (req: Request, res: Response) => {
  try {
    // Get the authenticated staff ID from the authentication middleware.
    const staffId = req.user?.id;

    if (!staffId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const staff = await getCurrentStaff(staffId);

    return res.status(200).json({
      message: "Staff retrieved successfully",
      staff,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Staff not found") {
      return res.status(404).json({ message: error.message });
    }

    console.error("Get current staff error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// forgot passsword
export const forgotPassword = async (req: Request, res: Response) => {
  // Validate the email address.
  const validation = forgotPasswordSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.flatten(),
    });
  }

  try {
    const resetLink = await forgotPasswordService(validation.data.email);

    return res.status(200).json({
      message: "Password reset link generated successfully",
      resetLink,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Something went wrong") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// reset password
export const resetPassword = async (req: Request, res: Response) => {
  // Validate the reset token and new password.
  const validation = resetPasswordSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.flatten(),
    });
  }

  try {
    const { token, newPassword } = validation.data;

    await resetPasswordService(token, newPassword);

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid token") {
        return res.status(400).json({ message: error.message });
      }

      if (error.message === "Expired token") {
        return res.status(400).json({ message: error.message });
      }
    }

    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// logout
export const logout = (req: Request, res: Response) => {
  // Clear the authentication cookie.
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
};
