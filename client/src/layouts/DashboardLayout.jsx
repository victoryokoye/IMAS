import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../stores/auth.store";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FolderKanban,
  UserCog,
} from "lucide-react";

const ROLE_LABELS = {
  ADMINISTRATOR: "Administrator",
  SUPERVISOR: "Supervisor",
  INTERN_COORDINATOR: "Intern Coordinator",
};

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/interns",
    label: "Interns",
    icon: Users,
  },
  {
    to: "/attendance",
    label: "Attendance",
    icon: ClipboardCheck,
  },
  {
    to: "/projects",
    label: "Projects",
    icon: FolderKanban,
    roles: ["ADMINISTRATOR", "SUPERVISOR"],
  },
  {
    to: "/staff",
    label: "Staff",
    icon: UserCog,
    roles: ["ADMINISTRATOR"],
  },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

const Staff = {
  user: {
    id: "staff-uuid",
    fullName: "Jane Doe",
    email: "jane@example.com",
    role: "ADMINISTRATOR",
    status: "ACTIVE",
    createdAt: "2026-10-01T09:00:00.000Z",
    updatedAt: "2026-10-10T12:00:00.000Z",
  },
  logout: () => {
    console.log("Log User out");
  },
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = Staff;
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.fullName ?? "Staff";
  const navItems = NAV_ITEMS.filter(
    (i) => !i.roles || i.roles.includes(user?.role),
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    [
      "block mx-2 rounded-sm flex gap-3 px-3 py-2.5 text-sm transition-colors",
      isActive
        ? "bg-[#FF5722] font-medium text-white"
        : "border-transparent text-slate-800 hover:bg-[#FF5722]/10 hover:text-black",
    ].join(" ");

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Left navigation */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-white transition-transform lg:static lg:translate-x-0 shadow-md",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="px-5 py-5">
          <p className="text-lg font-semibold">IMAS</p>
          <p className="text-xs text-slate-800">
            Intern Management &amp; Attendance
          </p>
        </div>

        <nav className="mt-2 flex-1 overflow-y-auto" aria-label="Main">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Right side: header + page content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            className="rounded p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium text-slate-900">
                {displayName}
              </p>
              <p className="text-xs text-slate-500">
                {user?.email} · {ROLE_LABELS[user?.role] ?? user?.role}
              </p>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-medium text-white"
              aria-hidden="true"
            >
              {getInitials(displayName)}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
