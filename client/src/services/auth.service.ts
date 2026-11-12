/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { api } from "./api";
import { tokenStorage } from "../utils/tokenStorage";
import type { Staff } from "../types/api";
import type { LoginInput, ResetPasswordInput } from "../types/auth";

/**
 * The deployed backend returns `name` (not `fullName`) and no { status, data } envelope:
 *   POST /auth/login -> { message, staff: { id, name, email, role, status, ... }, token }
 * These helpers accept that shape and the documented one, and always produce a Staff.
 */
function normalizeStaff(raw: any): Staff | null {
  if (!raw?.id) return null;
  return {
    id: raw.id,
    fullName: raw.fullName ?? raw.name ?? "",
    email: raw.email,
    role: raw.role,
    status: raw.status,
  };
}

export const authService = {
  /** Saves the token and returns the staff member from the login response. */
  login: async (input: LoginInput): Promise<Staff | null> => {
    const { data } = await api.post<any>("/auth/login", input);
    const body = data?.data ?? data; // tolerate an optional { data } envelope
    if (body?.token) tokenStorage.set(body.token);
    return normalizeStaff(body?.staff ?? body?.user);
  },

  /** Always forgets the token locally, even if the request fails. */
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      tokenStorage.clear();
    }
  },

  /**
   * Current staff member, or null when there is no valid session.
   * 401/403 mean "not logged in" (normal). Network failures and 5xx still throw.
   */
  me: async (): Promise<Staff | null> => {
    try {
      const { data } = await api.get<any>("/auth/me");
      return normalizeStaff(data?.data ?? data?.staff ?? data?.user ?? data);
    } catch (err) {
      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        tokenStorage.clear();
        return null;
      }
      throw err;
    }
  },

  forgotPassword: async (email: string) => {
    await api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (input: ResetPasswordInput) => {
    await api.post("/auth/reset-password", input);
  },
};
