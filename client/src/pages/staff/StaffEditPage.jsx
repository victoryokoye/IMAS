import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import {
  useUpdateStaff,
  useSetStaffRole,
  useSetStaffStatus,
  useStaffMember,
} from "../../hooks/useStaff";
import { ErrorAlert, Spinner } from "../../components/common/Feedback";

function StaffEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: staff,
    isPending,
    isError,
    error,
    refetch,
  } = useStaffMember(id);

  const updateStaff = useUpdateStaff();
  const updateRole = useSetStaffRole();
  const updateStatus = useSetStaffStatus();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "SUPERVISOR",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        fullName: staff.fullName || staff.name || "",
        email: staff.email || "",
        role: staff.role,
        status: staff.status,
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update name and email
      await updateStaff.mutateAsync({
        id,
        input: {
          fullName: formData.fullName,
          email: formData.email,
        },
      });

      // Update role using its dedicated endpoint
      if (formData.role !== staff.role) {
        await updateRole.mutateAsync({
          id,
          role: formData.role,
        });
      }

      // Update status using its dedicated endpoint
      if (formData.status !== staff.status) {
        await updateStatus.mutateAsync({
          id,
          status: formData.status,
        });
      }

      navigate(`/staff/${id}`);
    } catch (error) {
      console.error("Failed to update staff:", error);
    }
  };

  if (isPending) return <Spinner />;
  if (isError) return <ErrorAlert error={error} onRetry={refetch} />;
  if (!staff) return <p>Staff member not found.</p>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/staff/${id}`)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={18} />
        Back to Staff Details
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Staff</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update staff information and account settings.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Staff Information
          </h2>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Staff Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            >
              <option value="ADMINISTRATOR">Administrator</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="INTERN_COORDINATOR">Intern Coordinator</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Account Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {updateStaff.isError && (
          <p className="text-sm text-red-600">
            {updateStaff.error?.message || "Failed to update staff."}
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={() => navigate(`/staff/${id}`)}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updateStaff.isPending}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={17} />
            {updateStaff.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StaffEditPage;
