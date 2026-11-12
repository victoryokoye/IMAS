import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../stores/auth.store";
import type { LoginInput, ResetPasswordInput } from "../types/auth";

export const authKeys = {
  me: ["auth", "me"] as const,
};

/** Read-only view of the session for components. Pages should use this, not fetch /auth/me. */
export function useAuth() {
  const staff = useAuthStore((s) => s.staff);
  const status = useAuthStore((s) => s.status);
  return {
    staff,
    role: staff?.role,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}

/**
 * Restores the session on page load. Call ONCE near the top of the app (App.tsx).
 * Runs GET /auth/me with the stored token and syncs the result into the store.
 */
export function useAuthBootstrap() {
  const setStaff = useAuthStore((s) => s.setStaff);
  const clear = useAuthStore((s) => s.clear);

  const query = useQuery({
    queryKey: authKeys.me,
    queryFn: authService.me, // resolves to null when logged out
    retry: false,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess) {
      const staff = query.data;
      // Guide: an inactive staff member must not be able to authenticate
      if (staff && staff.status !== "INACTIVE") setStaff(staff);
      else clear();
    } else if (query.isError) {
      clear();
    }
  }, [query.isSuccess, query.isError, query.data, setStaff, clear]);

  return query;
}

/** Logs in, saves the token (in the service), and puts the staff profile in the store. */
export function useLogin() {
  const qc = useQueryClient();
  const setStaff = useAuthStore((s) => s.setStaff);

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      // Prefer the staff in the login response; fall back to /auth/me
      const staff = (await authService.login(input)) ?? (await authService.me());
      if (!staff) {
        throw new Error(
          "Signed in, but the session could not be verified. Check that the API returns the staff member and token.",
        );
      }
      if (staff.status === "INACTIVE") {
        await authService.logout().catch(() => undefined);
        throw new Error("This account is inactive. Contact an administrator.");
      }
      return staff;
    },
    onSuccess: (staff) => {
      qc.clear(); // drop any cache left by a previous user
      qc.setQueryData(authKeys.me, staff);
      setStaff(staff);
    },
  });
}

/** Clears local state even if the request fails, so the user is never stuck "logged in". */
export function useLogout() {
  const qc = useQueryClient();
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clear();
      qc.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => authService.resetPassword(input),
  });
}
