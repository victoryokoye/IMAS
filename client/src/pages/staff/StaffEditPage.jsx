import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

function StaffEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    role: "SUPERVISOR",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated staff details:", {
      id,
      ...formData,
    });

    alert("Staff details updated. Backend integration is still pending.");
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/staff/${id}`)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
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
        className="mx-auto w-full max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6"e
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={() => navigate(`/staff/${id}`)}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default StaffEditPage;
