import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { useTodayAttendance } from "../../hooks/attendance/useTodayAttendance";
import PinDialog from "./PinDialouge";

const CAN_MARK = ["ADMINISTRATOR", "SUPERVISOR", "INTERN_COORDINATOR"];
const LIMIT = 10; // assumed: records per page, spec default is 10

export default function TodayAttendancePage() {
  const staff = useAuthStore((s) => s.staff);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { interns, stats, totalPages, isLoading, error, refetch } =
    useTodayAttendance({ search, page, limit: LIMIT });
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const canMark = CAN_MARK.includes(staff?.role);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Attendance Monitor
        </h1>
        <p className="text-sm text-slate-500">
          See who is here today and mark attendance.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-xs text-slate-500">Here Now</p>
          <p className="text-2xl font-bold">{stats.here}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-xs text-slate-500">Away</p>
          <p className="text-2xl font-bold">{stats.away}</p>
        </div>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // 2
        }}
        placeholder="Search intern name..."
        className="w-full rounded-lg bg-white shadow px-3 py-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-orange-500"
      />

      {isLoading && <p>Loading...</p>}
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      {!isLoading && !error && interns.length === 0 && (
        <p className="text-sm text-slate-500">No interns found.</p>
      )}

      <ul className="flex flex-col gap-3">
        {interns.map((intern) => (
          <li
            key={intern.id}
            className="group bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-3"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center font-semibold">
                {intern.name[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{intern.name}</p>
                <p className="text-xs text-slate-500">{intern.email}</p>
                {intern.signedInAt && (
                  <p className="text-xs text-slate-500">
                    In since{" "}
                    {new Date(intern.signedInAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 md:w-40">{intern.project}</p>

            <span
              className={`text-xs font-semibold px-2 py-1 rounded w-fit ${
                intern.status === "here"
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {intern.status === "here" ? "Here" : "Away"}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/interns/${intern.id}`)}
                className="px-3 py-2 rounded-lg bg-blue-50 text-xs font-semibold text-slate-800"
              >
                View Profile
              </button>
              {canMark && (
                <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
                  {/* assumed: Absent has no onClick because the API has no absent endpoint yet */}
                  <button className="px-3 py-2 rounded-lg bg-red-50 text-xs font-semibold text-red-700">
                    Absent
                  </button>
                  {intern.status === "here" && (
                    <button
                      onClick={() =>
                        setSelected({ intern, action: "sign-out" })
                      }
                      className="px-3 py-2 rounded-lg bg-blue-50 text-xs font-semibold text-slate-800"
                    >
                      Sign Out
                    </button>
                  )}
                  <button
                    onClick={() => setSelected({ intern, action: "sign-in" })}
                    className="px-3 py-2 rounded-lg bg-green-600 text-xs font-semibold text-white"
                  >
                    Present
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg bg-white shadow text-sm font-semibold disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-xs text-slate-500">
          Page {page} of {totalPages}
        </p>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages} // 3
          className="px-4 py-2 rounded-lg bg-white shadow text-sm font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selected && (
        <PinDialog
          intern={selected.intern}
          action={selected.action}
          onClose={() => setSelected(null)}
          onDone={() => {
            setSelected(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
