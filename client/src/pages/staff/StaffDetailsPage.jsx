import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck, UserRound, Pencil } from "lucide-react";
import { useStaffMember } from "../../hooks/useStaff";
import { ErrorAlert, Spinner } from "../../components/common/Feedback";

const roleLabels = {
  ADMINISTRATOR: "Administrator",
  SUPERVISOR: "Supervisor",
  INTERN_COORDINATOR: "Intern Coordinator",
};

function StaffDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: staff,
    isPending,
    isError,
    error,
    refetch,
  } = useStaffMember(id);

  if (isPending) return <Spinner />;
  if (isError) return <ErrorAlert error={error} onRetry={refetch} />;
  if (!staff) return <p>Staff member not found.</p>;

  const fullName = staff.fullName || staff.name || "";

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/staff")}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={18} />
        Back to Staff List
      </button>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            View staff information and account access.
          </p>
        </div>

        <button
          onClick={() => navigate(`/staff/${staff.id}/edit`)}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Pencil size={17} />
          Edit Profile
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
            {fullName
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>

            <p className="mt-1 text-sm text-gray-500">
              {roleLabels[staff.role] || staff.role}
            </p>

            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                staff.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {staff.status}
            </span>
          </div>

          <div className="text-sm text-gray-500">
            <p>Staff ID</p>
            <p className="mt-1 font-semibold text-gray-900">{staff.id}</p>
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
                {roleLabels[staff.role] || staff.role}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
              <UserRound size={19} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Account Status</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {staff.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDetailsPage;
