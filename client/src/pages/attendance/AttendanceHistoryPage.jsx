import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorAlert, Spinner } from "../../components/common/Feedback";
import { useInterns } from "../../hooks/useInterns";
import {
  useAttendanceTotal,
  useInternAttendanceCounts,
} from "../../hooks/useAttendanceCounts";
import { useDebounce } from "../../hooks/useDebounce";

const LIMIT = 10; // interns per page

export default function AttendanceHistoryPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const invalidRange = Boolean(from && to && from > to);
  const range = { startDate: from, endDate: to };

  // Who to list: active interns, searched and paginated by the server
  const interns = useInterns({
    page,
    limit: LIMIT,
    search: debouncedSearch,
    status: "ACTIVE",
  });
  const internList = interns.data?.items ?? [];

  // How often each came in (GET /interns/:id/attendance -> meta.total), only for this page
  const perIntern = useInternAttendanceCounts(
    internList.map((i) => i.id),
    range,
    { enabled: !invalidRange },
  );
  // Headline total for the whole range (GET /attendance -> meta.total)
  const total = useAttendanceTotal(range, { enabled: !invalidRange });

  const rows = internList.map((i) => ({
    id: i.id,
    name: i.fullName || "Unknown intern",
    cameIn: perIntern.counts[i.id],
  }));
  const countLabel = (n) =>
    n !== undefined ? n : perIntern.isError ? "—" : "…";

  const totalInterns = interns.data?.meta.total ?? 0;
  const totalPages = interns.data?.meta.totalPages ?? 1;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Intern Attendance History
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        See who came in and how often.
      </p>

      <div className="flex flex-wrap gap-3 mb-2">
        <label className="text-xs font-semibold text-slate-800">
          From
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            className="block mt-1 rounded-lg bg-white shadow px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs font-semibold text-slate-800">
          To
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            className="block mt-1 rounded-lg bg-white shadow px-3 py-2 text-sm"
          />
        </label>
      </div>
      {invalidRange && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          The "From" date must be on or before the "To" date.
        </p>
      )}

      <div className="bg-white rounded-xl shadow border-l-4 border-green-500 p-4 my-6 max-w-xs">
        <p className="text-xs text-slate-500">Came In / Present</p>
        <p className="text-3xl font-bold">
          {total.data !== undefined
            ? total.data.toLocaleString()
            : total.isError
              ? "—"
              : "…"}{" "}
          <span className="text-sm font-normal text-slate-500">Times</span>
        </p>
        {total.isFetching && total.data !== undefined && (
          <p className="mt-1 text-xs text-slate-400">Updating…</p>
        )}
      </div>

      {total.isError && (
        <div className="mb-4">
          <ErrorAlert error={total.error} onRetry={() => total.refetch()} />
        </div>
      )}
      {perIntern.isError && (
        <p role="alert" className="mb-4 text-sm text-amber-700">
          Some counts could not be loaded.{" "}
          <button
            type="button"
            className="underline"
            onClick={perIntern.refetch}
          >
            Try again
          </button>
        </p>
      )}

      <div className="flex items-center gap-3 mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search intern name..."
          aria-label="Search interns"
          className="flex-1 rounded-lg bg-white shadow px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-slate-500 whitespace-nowrap">
          {totalInterns} interns
        </p>
      </div>

      {interns.isPending ? (
        <Spinner />
      ) : interns.isError ? (
        <ErrorAlert error={interns.error} onRetry={() => interns.refetch()} />
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-500">No interns found.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((intern) => (
            <li key={intern.id}>
              <Link
                to={`/attendance/history/${intern.id}`}
                className="bg-white rounded-xl shadow p-4 flex items-center gap-3 hover:bg-slate-50"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center font-semibold">
                  {intern.name.charAt(0).toUpperCase()}
                </div>
                <p className="flex-1 font-semibold text-slate-900">
                  {intern.name}
                </p>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
                  {countLabel(intern.cameIn)} Came In
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1 || interns.isFetching}
          className="px-4 py-2 rounded-lg bg-white shadow text-sm font-semibold disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-xs text-slate-500">
          Page {page} of {totalPages}
        </p>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages || interns.isFetching}
          className="px-4 py-2 rounded-lg bg-white shadow text-sm font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
