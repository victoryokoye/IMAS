import { useNavigate, useParams } from "react-router-dom";
import {
ArrowLeft,
Mail,
ShieldCheck,
Users,
FolderKanban,
UserRound,
Pencil,
UserPlus,
CalendarDays,
} from "lucide-react";

function StaffDetailsPage() {
const navigate = useNavigate();
const { id } = useParams();

// Temporary staff data until backend integration
const staff = {
id: id || "STF-001",
name: "Jane Cooper",
email: "jane.cooper@example.com",
role: "SUPERVISOR",
status: "ACTIVE",
joinedDate: "October 12, 2026",
supervisedInterns: 12,
projectsLed: 4,
interns: [
{ name: "Alex Johnson", role: "Frontend Developer", status: "Active" },
{ name: "Sarah Williams", role: "UI/UX Designer", status: "Active" },
{ name: "Michael Brown", role: "Backend Developer", status: "Active" },
{ name: "Emily Davis", role: "Frontend Developer", status: "Active" },
],
};

const roleLabels = {
ADMINISTRATOR: "Administrator",
SUPERVISOR: "Supervisor",
INTERN_COORDINATOR: "Intern Coordinator",
};

return (
<div className="space-y-6">
<button
onClick={() => navigate("/staff")}
className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
>
<ArrowLeft size={18} />
Back to Staff List
</button>

  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Staff Details
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        View staff information and assigned responsibilities.
      </p>
    </div>

    <button
      onClick={() => navigate(`/staff/${staff.id}/edit`)}
      className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
    >
      <Pencil size={17} />
      Edit Profile
    </button>
  </div>

  <div className="rounded-xl border border-gray-200 bg-white p-6">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
        {staff.name
          .split(" ")
          .map((part) => part[0])
          .join("")}
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900">
          {staff.name}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {roleLabels[staff.role]}
        </p>

        <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-600"></span>
          {staff.status}
        </span>
      </div>

      <div className="text-sm text-gray-500">
        <p>Staff ID</p>
        <p className="mt-1 font-semibold text-gray-900">
          {staff.id}
        </p>
      </div>
    </div>

    <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
          <Mail size={19} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Email Address</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {staff.email}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
          <ShieldCheck size={19} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Staff Role</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {roleLabels[staff.role]}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
          <CalendarDays size={19} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Date Added</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {staff.joinedDate}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
          <UserRound size={19} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Account Status</p>
          <p className="mt-1 text-sm font-medium text-green-700">
            {staff.status}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div className="grid gap-4 sm:grid-cols-2">
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Supervised Interns
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {staff.supervisedInterns}
          </h3>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Users size={25} />
        </div>
      </div>
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Projects Led
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {staff.projectsLed}
          </h3>
        </div>

        <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
          <FolderKanban size={25} />
        </div>
      </div>
    </div>
  </div>

  <div className="rounded-xl border border-gray-200 bg-white">
    <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Assigned Interns
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Interns currently under this staff member.
        </p>
      </div>

      <button
        onClick={() => navigate(`/staff/${staff.id}/assignments`)}
        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        <UserPlus size={17} />
        Manage Assignments
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-5 py-4 font-semibold">Intern Name</th>
            <th className="px-5 py-4 font-semibold">Role</th>
            <th className="px-5 py-4 font-semibold">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {staff.interns.map((intern, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                {intern.name}
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                {intern.role}
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {intern.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

);
}

export default StaffDetailsPage;
