import { useState } from "react";
import { useDashboardSummary } from "../../hooks/useDashboard";
import RecentAttendanceLog from "../../components/dashboard/RecentAttendanceLog";
import {
  Users,
  UserCheck,
  Clock,
  LogOut,
  FolderKanban,
  ClipboardCheck,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";

function DashboardPage() {
  // Temporary role until authentication is connected
  const [currentRole, setCurrentRole] = useState("ADMINISTRATOR");

  // const summary = useDashboardSummary();

  const summary = {
    data: {
      totalInterns: 6,
      activeInterns: 5,
      inactiveInterns: 1,
      presentToday: 3,
      signedOutToday: 1,
      currentlyPresent: 2,
      totalStaff: 4,
      activeProjects: 2,
    },
  };

  const dashboardData = {
    ADMINISTRATOR: {
      title: "Administrator Dashboard",
      description: "Here's an overview of your internship programme.",
      stats: [
        {
          title: "Total Active Interns",
          value: summary.data?.activeInterns,
          icon: Users,
          color: "blue",
        },
        {
          title: "Present Today",
          value: summary.data?.presentToday,
          icon: UserCheck,
          color: "green",
        },
        {
          title: "Currently Signed In",
          value: summary.data?.currentlyPresent,
          icon: Clock,
          color: "purple",
        },
        {
          title: "Already Signed Out",
          value: summary.data?.signedOutToday,
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
          value: summary.data?.activeInterns || "--",
          icon: Users,
          color: "blue",
        },
        {
          title: "Present Today",
          value: summary.data?.presentToday || "--",
          icon: UserCheck,
          color: "green",
        },
        {
          title: "Currently Signed In",
          value: summary.data?.currentlyPresent || "--",
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
          value: summary.data?.activeInterns || "--",
          icon: Users,
          color: "blue",
        },
        {
          title: "Present Today",
          value: summary.data?.presentToday || "--",
          icon: UserCheck,
          color: "green",
        },
        {
          title: "Currently Signed In",
          value: summary.data?.currentlyPresent || "--",
          icon: Clock,
          color: "purple",
        },
        {
          title: "Already Signed Out",
          value: summary.data?.signedOutToday || "--",
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

      <RecentAttendanceLog maxEntries={8} />
    </div>
  );
}

export default DashboardPage;
