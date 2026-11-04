import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-xl font-semibold text-slate-900">
        404 – Page not found
      </h1>
      <Link to="/dashboard" className="mt-3 text-sm text-teal-700 underline">
        Back to dashboard
      </Link>
    </div>
  );
}
