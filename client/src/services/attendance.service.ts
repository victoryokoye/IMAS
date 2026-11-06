/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api";
import { cleanParams } from "../utils/params";
import type { PaginationMeta, Paginated } from "../types/api";
import type {
  AttendanceCorrection,
  AttendanceParams,
  AttendanceRecord,
  PinAction,
  StaffRef,
} from "../types/attendance";

/**
 * Your three attendance sources disagree, so everything that might differ lives here.
 *
 *  api-specifications.md : POST /attendance/sign-in | sign-out, signInAt/signOutAt,
 *                          recordedBy, { status, data, meta }
 *  Postman collection    : POST /attendance/check-in | check-out, signInTime/signOutTime,
 *                          signedInBy, { items, total, page, limit, pages }
 *
 * Change ENDPOINTS if the deployed backend uses the Postman names. The normalisers below
 * accept both response shapes, so the UI always receives one consistent AttendanceRecord.
 */
export const ENDPOINTS = {
  signIn: "/attendance/sign-in",
  signOut: "/attendance/sign-out",
} as const;

function toStaffRef(v: any): StaffRef | null {
  if (!v) return null;
  if (typeof v === "string") return null; // only an id was returned; no display name available
  return {
    id: String(v.id ?? ""),
    fullName: String(v.fullName ?? v.name ?? ""),
  };
}

function normalizeRecord(raw: any): AttendanceRecord {
  return {
    id: raw.id,
    internId: raw.internId ?? raw.intern?.id ?? "",
    internName: raw.internName ?? raw.intern?.fullName ?? raw.intern?.name,
    date: raw.date,
    signInAt: raw.signInAt ?? raw.signInTime ?? null,
    signOutAt: raw.signOutAt ?? raw.signOutTime ?? null,
    recordedBy: toStaffRef(raw.recordedBy) ?? toStaffRef(raw.signedInBy),
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function normalizeList(body: any): Paginated<AttendanceRecord> {
  if (Array.isArray(body?.data)) {
    const items = body.data.map(normalizeRecord);
    const meta: PaginationMeta = body.meta ?? {
      page: 1,
      limit: items.length,
      total: items.length,
      totalPages: 1,
    };
    return { items, meta };
  }
  if (Array.isArray(body?.items)) {
    const items = body.items.map(normalizeRecord);
    return {
      items,
      meta: {
        page: body.page ?? 1,
        limit: body.limit ?? items.length,
        total: body.total ?? items.length,
        totalPages: body.pages ?? body.totalPages ?? 1,
      },
    };
  }
  return { items: [], meta: { page: 1, limit: 0, total: 0, totalPages: 1 } };
}

const unwrap = (body: any) => normalizeRecord(body?.data ?? body);

export const attendanceService = {
  list: async (params: AttendanceParams) =>
    normalizeList(
      (await api.get("/attendance", { params: cleanParams(params) })).data,
    ),

  get: async (id: string) => unwrap((await api.get(`/attendance/${id}`)).data),

  listForIntern: async (
    internId: string,
    params: Pick<AttendanceParams, "page" | "limit" | "startDate" | "endDate">,
  ) =>
    normalizeList(
      (
        await api.get(`/interns/${internId}/attendance`, {
          params: cleanParams(params),
        })
      ).data,
    ),

  signIn: async (input: PinAction) =>
    unwrap((await api.post(ENDPOINTS.signIn, input)).data),

  signOut: async (input: PinAction) =>
    unwrap((await api.post(ENDPOINTS.signOut, input)).data),

  /** Administrator only */
  correct: async (id: string, input: AttendanceCorrection) =>
    unwrap((await api.put(`/attendance/${id}`, input)).data),

  /** Administrator only */
  remove: async (id: string) => {
    await api.delete(`/attendance/${id}`);
  },
};
