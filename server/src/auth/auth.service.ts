import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { Staff } from "./auth.types";
import type { LoginStaffInput } from "./auth.schema";
import { db } from "../../prisma/db";

// Staff Login
export const loginStaff = async ({
  email,
  password,
}: LoginStaffInput): Promise<{ staff: Staff; token: string }> => {
  const staff = await db.orm.public.Staff.where({ email }).first();

  if (!staff) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(password, staff.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  if (staff.status !== "ACTIVE") {
    throw new Error("Staff account is inactive");
  }

  const token = jwt.sign(
    {
      id: staff.id,
      role: staff.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    },
  );

  return {
    staff,
    token,
  };
};

// Get current authenticated staff
export const getCurrentStaff = async (
  staffId: string,
): Promise<Omit<Staff, "password">> => {
  const staff = await db.orm.public.Staff.where({
    id: staffId,
  }).first();

  if (!staff) {
    throw new Error("Staff not found");
  }

  const { password, ...staffDetails } = staff;

  return staffDetails;
};

export const forgotPassword = async (email: string) => {
  // Check if user with the email exist
  const user = await db.orm.public.Staff.where({ email }).first();
  // If no user retur something went wrong
  if (!user) {
    throw new Error("Something went wrong");
  }

  // If user exists generate token
  const token = crypto.randomBytes(32).toString("hex");
  // Hash token
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = Temporal.Instant.fromEpochMilliseconds(
    Date.now() + 10 * 60 * 1000,
  );

  // store token hash + expiry
  await db.orm.public.PasswordResetToken.create({
    staffId: user.id,
    token: tokenHash,
    expiresAt,
  });

  // genrate reset link
  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  // retur reset link
  return resetLink;
  // Recice token
};

export const resetPassword = async (token: string, newPassword: string) => {
  // Hash token
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  // Compare Hashed token with reset token from db
  const resetToken = await db.orm.public.PasswordResetToken.where({
    token: tokenHash,
  }).first();
  // check expiry
  if (!resetToken?.expiresAt) {
    throw new Error("Invalid token");
  }

  if (
    Temporal.Instant.compare(Temporal.Now.instant(), resetToken.expiresAt) > 0
  ) {
    throw new Error("Expired token");
  }

  // check if token has userId
  if (!resetToken?.staffId) {
    throw new Error("Invalid token");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // update new password in db
  await db.orm.public.Staff.where({
    id: resetToken.staffId,
  }).update({ password: hashedPassword });

  // delete reset token
  await db.orm.public.PasswordResetToken.where(resetToken).delete();
};
