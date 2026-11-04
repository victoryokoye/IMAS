import bcrypt from "bcrypt";
import { db } from "../prisma/db";
import { HttpError } from "../utils/http-error";
import type {
  CheckInInput,
  CheckOutInput,
  ListAttendanceQuery,
  MarkPermittedAbsenceInput,
  EditAttendanceInput,
} from "./attendance.schema";

// ---------------------------------------------------------------------------
// Helper: verify intern exists, is ACTIVE, and the PIN matches their bcrypt hash
// ---------------------------------------------------------------------------
async function verifyIntern(internId: string, pin: string) {
  const intern = await db.orm.public.Intern.where({ id: internId }).first();

  if (!intern) {
    throw new HttpError(404, "Intern not found");
  }
  if (intern.status !== "ACTIVE") {
    throw new HttpError(403, "Intern account is inactive");
  }

  const pinValid = await bcrypt.compare(pin, intern.pin);
  if (!pinValid) {
    throw new HttpError(401, "Invalid PIN");
  }

  return intern;
}

// Postgres unique violation. Prisma 8 has no P2002 code, so check the driver error.
function isUniqueViolation(err: any) {
  return err?.code === "23505" || err?.cause?.code === "23505";
}
// ---------------------------------------------------------------------------
// Attendance service
// ---------------------------------------------------------------------------
export const attendanceService = {
  // -------------------------------------------------------------------------
  // Intern signs in for today using their 4-digit PIN.
  // Creates a new attendance record (PRESENT, signInTime = now).
  // Rejects if the intern already has an open sign-in for today.
  // -------------------------------------------------------------------------
  async checkIn({ internId, pin }: CheckInInput): Promise<object> {
    await verifyIntern(internId, pin);

    const today = Temporal.Now.plainDateISO();

    // Check for an existing record today
    const existing = await db.orm.public.Attendance.where({
      internId,
      date: today,
    }).first();

    if (existing) {
      if (existing.signInTime !== null) {
        throw new HttpError(409, "Already signed in for today");
      }
      // Record exists but has no signInTime (e.g. pre-created as ABSENT by a
      // daily job). Update it to PRESENT with signInTime.
      const updated = await db.orm.public.Attendance.where({
        internId,
        date: today,
      }).update({
        status: "PRESENT",
        signInTime: Temporal.Now.instant(),
      });
      if (!updated) throw new HttpError(500, "Failed to update attendance");
      return updated;
    }

    // No record yet — create one
    return db.orm.public.Attendance.create({
      internId,
      date: today,
      status: "PRESENT",
      signInTime: Temporal.Now.instant(),
    });
  },

  // -------------------------------------------------------------------------
  // Intern signs out for today using their 4-digit PIN.
  // Updates the existing PRESENT record with signOutTime.
  // -------------------------------------------------------------------------
  async checkOut({ internId, pin }: CheckOutInput): Promise<object> {
    await verifyIntern(internId, pin);

    const today = Temporal.Now.plainDateISO();

    const record = await db.orm.public.Attendance.where({
      internId,
      date: today,
    }).first();

    if (!record) {
      throw new HttpError(404, "No attendance record found for today");
    }
    if (record.status !== "PRESENT") {
      throw new HttpError(409, "Cannot sign out: not marked as PRESENT today");
    }
    if (record.signInTime === null) {
      throw new HttpError(409, "Cannot sign out: no sign-in recorded today");
    }
    if (record.signOutTime !== null) {
      throw new HttpError(409, "Already signed out for today");
    }

    const updated = await db.orm.public.Attendance.where({
      internId,
      date: today,
    }).update({
      signOutTime: Temporal.Now.instant(),
    });

    if (!updated) throw new HttpError(500, "Failed to update attendance");
    return updated;
  },

  // -------------------------------------------------------------------------
  // Staff marks a permitted absence for an intern on a given date.
  // Only ADMINISTRATOR and SUPERVISOR roles are authorised to call this.
  // The staffId is injected by the auth middleware (res.locals.staff.id).
  // -------------------------------------------------------------------------
  async markPermittedAbsence(
    { internId, date }: MarkPermittedAbsenceInput,
    // staffId: string,
  ): Promise<object> {
    // Verify intern exists
    const intern = await db.orm.public.Intern.where({ id: internId }).first();
    if (!intern) throw new HttpError(404, "Intern not found");

    const absenceDate = Temporal.PlainDate.from(
      date.toISOString().slice(0, 10),
    );

    const existing = await db.orm.public.Attendance.where({
      internId,
      date: absenceDate,
    }).first();

    if (existing) {
      if (existing.status === "PERMITTED_ABSENCE") {
        throw new HttpError(
          409,
          "Absence already marked as permitted for this date",
        );
      }
      // Override whatever was there (e.g. ABSENT) to PERMITTED_ABSENCE
      const updated = await db.orm.public.Attendance.where({
        internId,
        date: absenceDate,
      }).update({
        status: "PERMITTED_ABSENCE",
        // signedInBy: staffId,
      });
      if (!updated) throw new HttpError(500, "Failed to update attendance");
      return updated;
    }

    // No record yet — create one
    return db.orm.public.Attendance.create({
      internId,
      date: absenceDate,
      status: "PERMITTED_ABSENCE",
      // signedInBy: staffId,
    });
  },

  async editAttendance(input: EditAttendanceInput) {
    const { params, body } = input;
    const Attendance = db.orm.public.Attendance;
    const existing = await Attendance.where({ id: params.id }).first();
    if (!existing) throw new HttpError(404, "Attendance record not found");

    const newDate = Temporal.PlainDate.from(body.date);
    const signInTime = Temporal.Instant.from(body.signInAt);
    const signOutTime = body.signOutAt
      ? Temporal.Instant.from(body.signOutAt)
      : null;

    // Friendly pre-check for the (internId, date) unique rule
    if (!newDate.equals(existing.date)) {
      const clash = await Attendance.where({
        internId: existing.internId,
        date: newDate,
      }).first();
      if (clash && clash.id !== params.id) {
        throw new HttpError(
          409,
          "This intern already has an attendance record for that date",
        );
      }
    }

    const updated = await (async () => {
      try {
        return await Attendance.where({ id: params.id }).update({
          date: newDate,
          signInTime,
          signOutTime,
          updatedAt: Temporal.Now.instant(),
        });
      } catch (err) {
        if (isUniqueViolation(err)) {
          throw new HttpError(
            409,
            "This intern already has an attendance record for that date",
          );
        }
        throw err;
      }
    })();

    // Narrow the type. This also covers the record being deleted between the lookup and the update.
    if (!updated) throw new HttpError(404, "Attendance record not found");

    const intern = await db.orm.public.Intern.where({
      id: updated.internId,
    }).first();
    const signer = updated.signedInBy
      ? await db.orm.public.Staff.where({ id: updated.signedInBy }).first()
      : null;

    const iso = (i: Temporal.Instant | null) =>
      i ? i.toString({ fractionalSecondDigits: 3 }) : null; // "2026-10-23T08:00:00.000Z"

    return {
      id: updated.id,
      internId: updated.internId,
      internName: intern?.name ?? null,
      date: updated.date.toString(), // "2026-10-23"
      signInAt: iso(updated.signInTime),
      signOutAt: iso(updated.signOutTime),
      recordedBy: signer ? { id: signer.id, fullName: signer.name } : null,
      createdAt: iso(updated.createdAt),
      updatedAt: iso(updated.updatedAt),
    };
  },

  // -------------------------------------------------------------------------
  // List attendance records (staff view) with filtering and pagination.
  // -------------------------------------------------------------------------
  async list({
    internId,
    from,
    to,
    status,
    page,
    limit,
  }: ListAttendanceQuery): Promise<IMAS.Attendance.ListResponse> {
    type AttendanceWhere = {
      internId?: string;
      status?: "PRESENT" | "ABSENT" | "PERMITTED_ABSENCE";
    };

    const where: AttendanceWhere = {
      ...(internId && { internId }),
      ...(status && { status }),
    };

    const allRecords = await db.orm.public.Attendance.where(where)
      .include("intern", (intern) => intern.select("id", "name"))
      .include("signInStaff", (staff) => staff.select("id", "name"))
      .include("signOutStaff", (staff) => staff.select("id", "name"))
      .all();

    // Date range filter
    const fromStr = from ? from.toISOString().slice(0, 10) : undefined;
    const toStr = to ? to.toISOString().slice(0, 10) : undefined;

    const filtered = allRecords.filter((r) => {
      const dStr = r.date.toString();
      if (fromStr && dStr < fromStr) return false;
      if (toStr && dStr > toStr) return false;
      return true;
    });

    const total = filtered.length;
    const sliced = filtered.slice((page - 1) * limit, page * limit);
    const data: IMAS.Attendance.AttendanceListItem[] = sliced.map((item) => ({
      id: item.id,
      internId: item.internId,
      internName: item.intern?.name ?? "Unknown",
      date: item.date.toString(),
      signInAt: item.signInTime?.toString() ?? null,
      signOutAt: item.signOutTime?.toString() ?? null,
      recordedBy: item.signInStaff
        ? {
            id: item.signInStaff.id,
            fullName: item.signInStaff.name,
          }
        : item.signOutStaff
          ? {
              id: item.signOutStaff.id,
              fullName: item.signOutStaff.name,
            }
          : null,
    }));

    return {
      status: "success",
      data,
      meta: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // -------------------------------------------------------------------------
  // List attendance records (staff view) of a specific intern.
  // -------------------------------------------------------------------------
  async listByIntern(
    id: string,
    { internId, from, to, status, page, limit }: ListAttendanceQuery,
  ): Promise<IMAS.Attendance.InternHistoryResponse> {
    type AttendanceWhere = {
      internId?: string;
      status?: "PRESENT" | "ABSENT" | "PERMITTED_ABSENCE";
    };

    const where: AttendanceWhere = {
      ...(internId && { internId }),
      ...(status && { status }),
    };

    const allRecords = await db.orm.public.Attendance.where({ internId: id })
      .where(where)
      .include("intern", (intern) => intern.select("id", "name"))
      .include("signInStaff", (staff) => staff.select("id", "name"))
      .include("signOutStaff", (staff) => staff.select("id", "name"))
      .all();

    if (!allRecords) throw new HttpError(404, "Attendance record not found");

    // Date range filter
    const fromStr = from ? from.toISOString().slice(0, 10) : undefined;
    const toStr = to ? to.toISOString().slice(0, 10) : undefined;

    const filtered = allRecords.filter((r) => {
      const dStr = r.date.toString();
      if (fromStr && dStr < fromStr) return false;
      if (toStr && dStr > toStr) return false;
      return true;
    });

    const total = filtered.length;
    const sliced = filtered.slice((page - 1) * limit, page * limit);
    const data: IMAS.Attendance.InternAttendanceItem[] = sliced.map((item) => ({
      id: item.id,
      date: item.date.toString(),
      signInAt: item.signInTime?.toString() ?? null,
      signOutAt: item.signOutTime?.toString() ?? null,
      recordedBy: item.signInStaff
        ? {
            id: item.signInStaff.id,
            fullName: item.signInStaff.name,
          }
        : item.signOutStaff
          ? {
              id: item.signOutStaff.id,
              fullName: item.signOutStaff.name,
            }
          : null,
    }));

    return {
      status: "success",
      data,
      meta: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // -------------------------------------------------------------------------
  // Fetch a single attendance record by UUID.
  // -------------------------------------------------------------------------
  async getById(id: string): Promise<IMAS.Attendance.DetailResponse> {
    const record = await db.orm.public.Attendance.where({ id })
      .include("intern", (intern) => intern.select("id", "name"))
      .include("signInStaff", (staff) => staff.select("id", "name"))
      .include("signOutStaff", (staff) => staff.select("id", "name"))
      .first();

    if (!record) throw new HttpError(404, "Attendance record not found");

    const data = {
      id: record.id,
      internId: record.internId,
      internName: record.intern?.name ?? "Unknown",
      date: record.date.toString(),
      signInAt: record.signInTime?.toString() ?? null,
      signOutAt: record.signOutTime?.toString() ?? null,
      recordedBy: record.signInStaff
        ? {
            id: record.signInStaff.id,
            fullName: record.signInStaff.name,
          }
        : record.signOutStaff
          ? {
              id: record.signOutStaff.id,
              fullName: record.signOutStaff.name,
            }
          : null,
      createdAt: record.createdAt.toString(),
      updatedAt: record.updatedAt.toString(),
    };
    return {
      status: "success",
      data: data,
    };
  },

  // -------------------------------------------------------------------------
  // Fetch a single attendance record by UUID.
  // -------------------------------------------------------------------------
  async deleteAttendance(id: string) {
    // Deletes one record and returns it, or null when no record has this ID
    const deleted = await db.orm.public.Attendance.where({ id }).delete();

    if (!deleted) throw new HttpError(404, "Attendance record not found");

    return { id: deleted.id };
  },
};
