import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

/**
 * Cached GET /auth/me. If you already expose the staff member through
 * auth.store.ts, replace this hook's body with a read from that store.
 */
export function useCurrentStaff() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.me,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
