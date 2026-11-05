import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useLogout } from '../../hooks/auth/useLogout';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', roles: ['ADMINISTRATOR', 'SUPERVISOR', 'INTERN_COORDINATOR'] },
  { to: '/interns', label: 'Interns', roles: ['ADMINISTRATOR', 'SUPERVISOR', 'INTERN_COORDINATOR'] },
  { to: '/staff', label: 'Staff Directory', roles: ['ADMINISTRATOR'] },
  { to: '/attendance', label: 'Attendance Monitor', roles: ['ADMINISTRATOR', 'SUPERVISOR', 'INTERN_COORDINATOR'] },
  { to: '/projects', label: 'Projects & Tasks', roles: ['ADMINISTRATOR', 'SUPERVISOR'] },
];

export default function RoleNavigation() {
  const staff = useAuthStore((s) => s.staff);
  const logout = useLogout();

  if (!staff) return null;

  const items = NAV_ITEMS.filter((item) => item.roles.includes(staff.role));

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm ${
              isActive ? 'bg-orange-600 text-white font-semibold' : 'text-slate-600'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
      <button
        onClick={logout}
        className="px-3 py-2 text-left text-sm text-slate-600"
      >
        Logout
      </button>
    </nav>
  );
}