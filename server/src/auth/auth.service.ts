import type {
  CreateStaffInput,
  Staff,
  LoginStaffInput,
  CreateInternInput,
  CreateInternResult,
} from "./auth.types";
import { db } from "../../prisma/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Staff registration
export const registerStaff = async ({
  name,
  email,
  password,
  role,
}: CreateStaffInput): Promise<Staff> => {
  const existingStaff = await db.orm.public.Staff.where({ email }).first();

  if (existingStaff) {
    throw new Error("Staff with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const staff = await db.orm.public.Staff.create({
    name,
    email,
    password: hashedPassword,
    role,
    updatedAt: Temporal.Now.instant(),
  });

  return staff;
};

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

// Intern onboarding
export const createIntern = async (
  data: CreateInternInput,
): Promise<CreateInternResult> => {
  const existingIntern = await db.orm.public.Intern.where({
    email: data.email,
  }).first();

  if (existingIntern) {
    throw new Error("Intern with this email already exists");
  }

  const plainPin = Math.floor(1000 + Math.random() * 9000).toString();

  const hashedPin = await bcrypt.hash(plainPin, 10);

  const startDate = Temporal.Instant.fromEpochMilliseconds(
    data.startDate.getTime(),
  );

  const endDate = Temporal.Instant.fromEpochMilliseconds(
    data.endDate.getTime(),
  );

  const intern = await db.orm.public.Intern.create({
    name: data.name,
    phone: data.phone,
    email: data.email,
    group: data.group,
    techArea: data.techArea,
    course: data.course ?? null,
    skills: data.skills,
    startDate,
    endDate,
    pin: hashedPin,
  });

  return {
    intern,
    pin: plainPin,
  };
};
