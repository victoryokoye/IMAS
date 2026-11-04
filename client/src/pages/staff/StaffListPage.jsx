import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
Plus,
Search,
Eye,
Pencil,
UserCheck,
UserX,
Users,
X,
} from "lucide-react";

const INITIAL_STAFF = [
{
id: 1,
name: "Jane Doe",
email: "[jane.doe@imas.com](mailto:jane.doe@imas.com)",
role: "ADMINISTRATOR",
status: "ACTIVE",
},
{
id: 2,
name: "Michael Johnson",
email: "[michael@imas.com](mailto:michael@imas.com)",
role: "SUPERVISOR",
status: "ACTIVE",
},
{
id: 3,
name: "Sarah Williams",
email: "[sarah@imas.com](mailto:sarah@imas.com)",
role: "INTERN_COORDINATOR",
status: "ACTIVE",
},
{
id: 4,
name: "David Brown",
email: "[david@imas.com](mailto:david@imas.com)",
role: "SUPERVISOR",
status: "INACTIVE",
},
{
id: 5,
name: "Grace Wilson",
email: "[grace@imas.com](mailto:grace@imas.com)",
role: "INTERN_COORDINATOR",
status: "ACTIVE",
},
];

const ROLE_LABELS = {
ADMINISTRATOR: "Administrator",
SUPERVISOR: "Supervisor",
INTERN_COORDINATOR: "Intern Coordinator",
};

function StaffListPage() {
const navigate = useNavigate();

const [staff, setStaff] = useState(INITIAL_STAFF);
const [searchTerm, setSearchTerm] = useState("");
const [roleFilter, setRoleFilter] = useState("ALL");
const [statusFilter, setStatusFilter] = useState("ALL");

const totalStaff = staff.length;
const activeStaff = staff.filter(
(person) => person.status === "ACTIVE"
).length;
const inactiveStaff = staff.filter(
(person) => person.status === "INACTIVE"
).length;

const filteredStaff = useMemo(() => {
return staff.filter((person) => {
const matchesSearch =
person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
person.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesRole =
    roleFilter === "ALL" || person.role === roleFilter;

  const matchesStatus =
    statusFilter === "ALL" || person.status === statusFilter;

  return matchesSearch && matchesRole && matchesStatus;
});

}, [staff, searchTerm, roleFilter, statusFilter]);

const toggleStatus = (id) => {
setStaff((currentStaff) =>
currentStaff.map((person) =>
person.id === id
? {
...person,
status:
person.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
}
: person
)
);
};

return ( <div className="space-y-6">
{/* Page Header */} <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"> <div> <h1 className="text-2xl font-bold text-slate-900">
Staff Management </h1> <p className="mt-1 text-sm text-slate-500">
Manage staff members and their account access. </p> </div>


    <button
      onClick={() => navigate("/staff/new")}
      className="flex items-center justify-center gap-2 rounded-lg bg-[#FF5722] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#e64a19]"
    >
      <Plus size={18} />
      Add Staff
    </button>
  </div>

  {/* Overview Cards */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          Total Staff
        </p>
        <Users size={20} className="text-slate-400" />
      </div>
      <h2 className="mt-3 text-3xl font-bold text-slate-900">
        {totalStaff}
      </h2>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          Active Staff
        </p>
        <UserCheck size={20} className="text-green-600" />
      </div>
      <h2 className="mt-3 text-3xl font-bold text-green-600">
        {activeStaff}
      </h2>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          Inactive Staff
        </p>
        <UserX size={20} className="text-red-500" />
      </div>
      <h2 className="mt-3 text-3xl font-bold text-red-500">
        {inactiveStaff}
      </h2>
    </div>
  </div>

  {/* Staff Table Section */}
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div className="border-b border-slate-200 p-5">
      <h2 className="text-lg font-semibold text-slate-900">
        All Staff Members
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        View and manage staff accounts.
      </p>

      {/* Search and Filters */}
      <div className="mt-5 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5722]"
        >
          <option value="ALL">All Roles</option>
          <option value="ADMINISTRATOR">Administrator</option>
          <option value="SUPERVISOR">Supervisor</option>
          <option value="INTERN_COORDINATOR">
            Intern Coordinator
          </option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5722]"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left">
        <thead className="bg-slate-50">
          <tr className="text-xs uppercase tracking-wide text-slate-500">
            <th className="px-5 py-4 font-semibold">Staff Member</th>
            <th className="px-5 py-4 font-semibold">Role</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {filteredStaff.map((person) => (
            <tr key={person.id} className="hover:bg-slate-50">
              <td className="px-5 py-4">
                <p className="font-medium text-slate-900">
                  {person.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {person.email}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-slate-600">
                {ROLE_LABELS[person.role]}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    person.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {person.status === "ACTIVE" ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => navigate(`/staff/${person.id}`)}
                    title="View staff"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/staff/${person.id}/edit`)
                    }
                    title="Edit staff"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#FF5722]"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => toggleStatus(person.id)}
                    title={
                      person.status === "ACTIVE"
                        ? "Deactivate staff"
                        : "Activate staff"
                    }
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  >
                    {person.status === "ACTIVE" ? (
                      <UserX size={17} className="text-red-500" />
                    ) : (
                      <UserCheck size={17} className="text-green-600" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {filteredStaff.length === 0 && (
            <tr>
              <td colSpan="4" className="px-5 py-12 text-center">
                <div className="flex flex-col items-center">
                  <Users size={32} className="text-slate-300" />
                  <p className="mt-3 font-medium text-slate-700">
                    No staff members found
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setRoleFilter("ALL");
                      setStatusFilter("ALL");
                    }}
                    className="mt-3 flex items-center gap-1 text-sm font-medium text-[#FF5722]"
                  >
                    <X size={15} />
                    Clear filters
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
      Showing {filteredStaff.length} of {totalStaff} staff members
    </div>
  </div>
</div>
);
}

export default StaffListPage;
