import { useState } from "react";
import {
  Users,
  UserCheck,
  Clock,
  LogOut,
  FolderKanban,
  ClipboardCheck,
  ArrowUpRight,
  CalendarDays,
  Activity,
} from "lucide-react";

function DashboardPage() {
  // Temporary role until authentication is connected
  const [currentRole, setCurrentRole] = useState("ADMINISTRATOR");

  const dashboardData = {
    ADMINISTRATOR: {
      title: "Administrator Dashboard",
      description: "Here's an overview of your internship programme.",
      stats: [
        {
          title: "Total Active Interns",
          value: 48,
          icon: Users,
          color: "blue",
        },
        {
          title: "Present Today",
          value: 36,
          icon: UserCheck,
          color: "green",
        },
        {
          title: "Currently Signed In",
          value: 28,
          icon: Clock,
          color: "purple",
        },
        {
          title: "Already Signed Out",
          value: 8,
          icon: LogOut,
          color: "orange",
        },
      ],
      quickLinks: [
        {
          title: "Manage Staff",
          description: "View and manage staff accounts",
          icon: Users,
          path: "/staff",
        },
        {
          title: "Manage Interns",
          description: "View registered interns",
          icon: UserCheck,
          path: "/interns",
        },
        {
          title: "Attendance",
          description: "Monitor daily attendance",
          icon: ClipboardCheck,
          path: "/attendance",
        },
        {
          title: "Projects",
          description: "View ongoing projects",
          icon: FolderKanban,
          path: "/projects",
        },
      ],
    },

    SUPERVISOR: {
      title: "Supervisor Dashboard",
      description: "Monitor your interns and project activities.",
      stats: [
        {
          title: "Total Active Interns",
          value: 18,
          icon: Users,
          color: "blue",
        },
        {
          title: "Present Today",
          value: 14,
          icon: UserCheck,
          color: "green",
        },
        {
          title: "Currently Signed In",
          value: 11,
          icon: Clock,
          color: "purple",
        },
      ],
      quickLinks: [
        {
          title: "Manage Interns",
          description: "View your assigned interns",
          icon: Users,
          path: "/interns",
        },
        {
          title: "Projects",
          description: "Monitor project activities",
          icon: FolderKanban,
          path: "/projects",
        },
        {
          title: "Attendance History",
          description: "Review attendance records",
          icon: ClipboardCheck,
          path: "/attendance/history",
        },
      ],
    },

    INTERN_COORDINATOR: {
      title: "Intern Coordinator Dashboard",
      description: "Keep track of interns and daily attendance.",
      stats: [
        {
          title: "Total Active Interns",
          value: 48,
          icon: Users,
          color: "blue",
        },
        {
          title: "Present Today",
          value: 36,
          icon: UserCheck,
          color: "green",
        },
        {
          title: "Currently Signed In",
          value: 28,
          icon: Clock,
          color: "purple",
        },
        {
          title: "Already Signed Out",
          value: 8,
          icon: LogOut,
          color: "orange",
        },
      ],
      quickLinks: [
        {
          title: "Manage Interns",
          description: "View registered interns",
          icon: Users,
          path: "/interns",
        },
        {
          title: "Today's Attendance",
          description: "Monitor today's attendance",
          icon: ClipboardCheck,
          path: "/attendance",
        },
        {
          title: "Attendance History",
          description: "Review previous records",
          icon: CalendarDays,
          path: "/attendance/history",
        },
      ],
    },
  };

  const data = dashboardData[currentRole];

  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{data.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="role-switcher"
          className="text-sm font-medium text-gray-700"
        >
          Preview Dashboard:
        </label>

        <select
          id="role-switcher"
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="ADMINISTRATOR">Administrator</option>
          <option value="SUPERVISOR">Supervisor</option>
          <option value="INTERN_COORDINATOR">Intern Coordinator</option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${colorStyles[stat.color]}`}>
                  <Icon size={23} />
                </div>

                <ArrowUpRight size={18} className="text-gray-400" />
              </div>

              <h2 className="mt-5 text-3xl font-bold text-gray-900">
                {stat.value}
              </h2>

              <p className="mt-1 text-sm text-gray-500">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
          <p className="mt-1 text-sm text-gray-500">
            Navigate to important areas of the platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.quickLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.title}
                href={link.path}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                    <Icon size={22} />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-gray-400 transition group-hover:text-blue-600"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  {link.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">{link.description}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 border-b border-gray-100 p-5">
          <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
            <Activity size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Recent Attendance Activity
            </h2>
            <p className="text-sm text-gray-500">
              A summary of today's attendance activity.
            </p>
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <CalendarDays size={23} />
          </div>

          <h3 className="mt-3 font-medium text-gray-900">
            No attendance activity available
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Attendance records will appear here when connected to the backend.
          </p>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
