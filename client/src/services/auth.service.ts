import { api } from "./api";
import type { ApiSuccess, Staff } from "../types/api";

// Minimal: only what these pages need. Merge with your own auth.service.ts.
export const authService = {
  me: async () => (await api.get<ApiSuccess<Staff>>("/auth/me")).data.data,
};
