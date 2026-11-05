import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export default function ProtectedRoute({ allowedRoles }) {
  const status = useAuthStore((s) => s.status);
  const staff = useAuthStore((s) => s.staff);
  const location = useLocation();

  if (status === 'loading') return <p>Loading...</p>;

  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(staff?.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}