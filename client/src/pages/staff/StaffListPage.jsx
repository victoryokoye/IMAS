import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStaffList, useSetStaffStatus } from "../../hooks/useStaff";
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
import { ErrorAlert, Spinner } from "../../components/common/Feedback";

const ROLE_LABELS = {
  ADMINISTRATOR: "Administrator",
  SUPERVISOR: "Supervisor",
  INTERN_COORDINATOR: "Intern Coordinator",
};

function StaffListPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const params = {
    page: 1,
    limit: 100,
    search: searchTerm,
    role: roleFilter === "ALL" ? "" : roleFilter,
    status: statusFilter === "ALL" ? "" : statusFilter,
  };

  const { data, isPending, isError, error, refetch, isFetching } =
    useStaffList(params);

  const staff = data?.items ?? [];

  const statusMutation = useSetStaffStatus();

  const totalStaff = staff.length;
  const activeStaff = staff.filter(
    (person) => person.status === "ACTIVE",
  ).length;
  const inactiveStaff = staff.filter(
    (person) => person.status === "INACTIVE",
  ).length;

  // Search is already handled by the backend.
  // This handles any additional filtering locally.
  const filteredStaff = useMemo(() => staff, [staff]);

  const toggleStatus = async (person) => {
    const nextStatus = person.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await statusMutation.mutateAsync({
        id: person.id,
        status: nextStatus,
      });
    } catch (error) {
      console.error("Failed to update staff status:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Staff Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage staff members and their account access.
          </p>
        </div>

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
            <p className="text-sm font-medium text-slate-500">Total Staff</p>
            <Users size={20} className="text-slate-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {totalStaff}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Active Staff</p>
            <UserCheck size={20} className="text-green-600" />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {activeStaff}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Inactive Staff</p>
            <UserX size={20} className="text-red-500" />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-red-500">
            {inactiveStaff}
          </h2>
        </div>
      </div>

      {/* Staff Table */}
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
              <option value="INTERN_COORDINATOR">Intern Coordinator</option>
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

        {statusMutation.isError && (
          <div className="p-4">
            <ErrorAlert error={statusMutation.error} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4 font-semibold">Staff Member</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            {isPending ? (
              <tbody>
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center">
                    <Spinner />
                  </td>
                </tr>
              </tbody>
            ) : isError ? (
              <tbody>
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center">
                    <ErrorAlert error={error} onRetry={refetch} />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((person) => (
                    <tr key={person.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {person.fullName || person.name || "—"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {person.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {ROLE_LABELS[person.role] || person.role}
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
                            onClick={() => navigate(`/staff/${person.id}/edit`)}
                            title="Edit staff"
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#FF5722]"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => toggleStatus(person)}
                            disabled={statusMutation.isPending}
                            title={
                              person.status === "ACTIVE"
                                ? "Deactivate staff"
                                : "Activate staff"
                            }
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Users size={32} className="text-slate-300" />

                        <p className="mt-3 font-medium text-slate-700">
                          No staff members found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your search or filters.
                        </p>

                        <button
                          onClick={clearFilters}
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
            )}
          </table>
        </div>

        <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
          Showing {filteredStaff.length} of {totalStaff} staff members
          {isFetching && !isPending && (
            <span className="ml-2">Updating...</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffListPage;
