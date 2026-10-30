import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        403 – Access denied
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Your role doesn’t have permission to view this page.
      </p>
      <Link
        to="/dashboard"
        className="mt-4 inline-block text-sm text-teal-700 underline"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
