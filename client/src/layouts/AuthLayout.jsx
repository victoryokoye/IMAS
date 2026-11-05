import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Intern Management &amp; Attendance
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in with your staff account to continue.
          </p>
        </header>

        <main className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <Outlet />
        </main>

        <footer className="mt-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} IMAS
        </footer>
      </div>
    </div>
  );
}
