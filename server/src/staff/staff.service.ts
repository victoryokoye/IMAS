import bcrypt from "bcrypt";
import type {
  CreateStaffInput,
  UpdateStaffInput,
  UpdateStaffRoleInput,
  UpdateStaffStatusInput,
} from "./staff.schema";
import type { Staff } from "./staff.types";
import { db } from "../../prisma/db";

// Create staff
export const createStaff = async (data: CreateStaffInput): Promise<Staff> => {
  const existingStaff = await db.orm.public.Staff.where({
    email: data.email,
  }).first();

  if (existingStaff) {
    throw new Error("Staff with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return db.orm.public.Staff.create({
    name: data.fullName,
    email: data.email,
    password: hashedPassword,
    role: data.role,
    updatedAt: Temporal.Now.instant(),
  });
};

// Get all staff
export const getAllStaff = async (): Promise<Staff[]> => {
  return db.orm.public.Staff.all();
};

// Get a single staff member
export const getSingleStaff = async (id: string): Promise<Staff> => {
  const staff = await db.orm.public.Staff.where({ id }).first();

  if (!staff) {
    throw new Error("Staff not found");
  }

  return staff;
};

// Update staff details
export const updateStaff = async (
  id: string,
  data: UpdateStaffInput,
): Promise<Staff> => {
  if (data.email) {
    const existingStaff = await db.orm.public.Staff.where({
      email: data.email,
    }).first();

    if (existingStaff && existingStaff.id !== id) {
      throw new Error("Email is already being used by another staff member");
    }
  }

  const updatedStaff = await db.orm.public.Staff.where({ id }).update({
    ...(data.fullName !== undefined && { name: data.fullName }),
    ...(data.email !== undefined && { email: data.email }),
  });

  if (!updatedStaff) {
    throw new Error("Staff not found");
  }

  return updatedStaff;
};

// Update staff role
export const updateStaffRole = async (
  id: string,
  data: UpdateStaffRoleInput,
): Promise<Staff> => {
  const updatedStaff = await db.orm.public.Staff.where({ id }).update({
    role: data.role,
  });

  if (!updatedStaff) {
    throw new Error("Staff not found");
  }

  return updatedStaff;
};

// Update staff status
export const updateStaffStatus = async (
  id: string,
  data: UpdateStaffStatusInput,
): Promise<Staff> => {
  const updatedStaff = await db.orm.public.Staff.where({ id }).update({
    status: data.status,
  });

  if (!updatedStaff) {
    throw new Error("Staff not found");
  }

  return updatedStaff;
};
