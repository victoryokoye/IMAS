import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";

function StaffCreatePage() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
name: "",
email: "",
password: "",
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

console.log("New staff details:", formData);

alert("Form submitted. Backend integration is still pending.");

};

return (
<div className="space-y-6">
<button
onClick={() => navigate("/staff")}
className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
>
<ArrowLeft size={18} />
Back to Staff List
</button>

  <div>
    <h1 className="text-2xl font-bold text-gray-900">
      Create New Staff
    </h1>
    <p className="mt-1 text-sm text-gray-500">
      Add a new staff member to the IMAS platform.
    </p>
  </div>

  <form
    onSubmit={handleSubmit}
    className="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6"
  >
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
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
          placeholder="Enter full name"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
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
          placeholder="Enter email address"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
          minLength={8}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
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
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
    </div>

    <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
      <button
        type="button"
        onClick={() => navigate("/staff")}
        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        <UserPlus size={17} />
        Create Staff
      </button>
    </div>
  </form>
</div>

);
}

export default StaffCreatePage;