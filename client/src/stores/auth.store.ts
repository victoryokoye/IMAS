import { create } from "zustand";
import type { Staff } from "../types/api";

/**
 * Holds the logged-in staff PROFILE only (in memory). The JWT itself lives in an
 * HTTP-only cookie that the browser stores and sends; JavaScript never sees it.
 * On page refresh the store is empty again and useAuthBootstrap() restores it from /auth/me.
 *
 * status:
 *  "loading"         -> session check not finished (app start)
 *  "authenticated"   -> staff is set
 *  "unauthenticated" -> no valid session
 */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  staff: Staff | null;
  status: AuthStatus;
  setStaff: (staff: Staff) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  staff: null,
  status: "loading",
  setStaff: (staff) => set({ staff, status: "authenticated" }),
  clear: () => set({ staff: null, status: "unauthenticated" }),
}));
