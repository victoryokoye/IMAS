import bcrypt from "bcrypt";
import type {
  CreateInternInput,
  UpdateInternInput,
  UpdateInternStatusInput,
  SetInternPinInput,
} from "./intern.schema";
import type { Intern } from "./intern.types";
import { db } from "../../prisma/db";

// Create intern
export const createIntern = async (
  data: CreateInternInput,
): Promise<Intern> => {
  const existingIntern = await db.orm.public.Intern.where({
    email: data.email,
  }).first();

  if (existingIntern) {
    throw new Error("Intern with this email already exists");
  }

  return db.orm.public.Intern.create({
    name: data.fullName,
    phone: data.phone,
    email: data.email,
    group: data.group,
    techArea: data.techArea,
    course: data.course ?? null,
    skills: JSON.stringify(data.skills),
    startDate: Temporal.Instant.fromEpochMilliseconds(
      new Date(data.startDate).getTime(),
    ),
    endDate: Temporal.Instant.fromEpochMilliseconds(
      new Date(data.endDate).getTime(),
    ),
  });
};

// Get all interns
export const getAllInterns = async (): Promise<Intern[]> => {
  return db.orm.public.Intern.all();
};

// Get a single intern
export const getSingleIntern = async (id: string): Promise<Intern> => {
  const intern = await db.orm.public.Intern.where({ id }).first();

  if (!intern) {
    throw new Error("Intern not found");
  }

  return intern;
};

// Update intern details
export const updateIntern = async (
  id: string,
  data: UpdateInternInput,
): Promise<Intern> => {
  const updatedIntern = await db.orm.public.Intern.where({ id }).update({
    name: data.fullName,
    phone: data.phone,
    email: data.email,
    group: data.group,
    techArea: data.techArea,
    course: data.course ?? null,
    skills: JSON.stringify(data.skills),
    startDate: Temporal.Instant.fromEpochMilliseconds(
      new Date(data.startDate).getTime(),
    ),
    endDate: Temporal.Instant.fromEpochMilliseconds(
      new Date(data.endDate).getTime(),
    ),
  });

  if (!updatedIntern) {
    throw new Error("Intern not found");
  }

  return updatedIntern;
};

// Update intern status
export const updateInternStatus = async (
  id: string,
  data: UpdateInternStatusInput,
): Promise<Intern> => {
  const updatedIntern = await db.orm.public.Intern.where({ id }).update({
    status: data.status,
  });

  if (!updatedIntern) {
    throw new Error("Intern not found");
  }

  return updatedIntern;
};

// Set or reset intern PIN
export const setInternPin = async (
  id: string,
  data: SetInternPinInput,
): Promise<void> => {
  const existingIntern = await db.orm.public.Intern.where({ id }).first();

  if (!existingIntern) {
    throw new Error("Intern not found");
  }

  const hashedPin = await bcrypt.hash(data.pin, 10);

  await db.orm.public.Intern.where({ id }).update({
    pin: hashedPin,
  });
};

// Verify intern PIN
export const verifyInternPin = async (
  id: string,
  pin: string,
): Promise<boolean> => {
  const intern = await db.orm.public.Intern.where({ id }).first();

  if (!intern) {
    throw new Error("Intern not found");
  }

  if (!intern.pin) {
    throw new Error("Intern PIN has not been set");
  }

  return bcrypt.compare(pin, intern.pin);
};
