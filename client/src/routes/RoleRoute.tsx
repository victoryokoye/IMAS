import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import type { Role } from "../types/api";

/** Nest inside ProtectedRoute. UX only: the backend still enforces every permission. */
export default function RoleRoute({ allowed }: { allowed: Role[] }) {
  const role = useAuthStore((s) => s.staff?.role);
  if (!role || !allowed.includes(role)) return <Navigate to="/403" replace />;
  return <Outlet />;
}
