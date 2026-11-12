import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorAlert, Spinner } from "../../components/common/Feedback";
import { useIntern } from "../../hooks/useInterns";
import { useInternAttendance } from "../../hooks/useAttendance";
import { formatDate } from "../../utils/format";
import { formatTime, getAttendanceState } from "../../utils/attendance";

const LIMIT = 10; // records per page

const STATE_LABEL = {
  NOT_SIGNED_IN: "Not signed in",
  SIGNED_IN: "Signed in",
  SIGNED_OUT: "Signed out",
};

function statusLabel(record) {
  if (record.status === "ABSENT") return "Absent";
  if (record.status === "PERMITTED_ABSENCE") return "Permitted absence";
  return STATE_LABEL[getAttendanceState(record)];
}

export default function InternAttendanceRecordsPage() {
  const { internId } = useParams();
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const invalidRange = Boolean(from && to && from > to);

  const intern = useIntern(internId); // only used for the page heading
  const { data, isPending, isError, error, refetch, isFetching } =
    useInternAttendance(internId, {
      page,
      limit: LIMIT,
      startDate: from,
      endDate: to,
    });

  const records = data?.items ?? [];
  const totalPages = data?.meta.totalPages ?? 1;
  const totalRecords = data?.meta.total ?? 0;

  return (
    <div className="p-4 md:p-8">
      <Link
        to="/attendance/history"
        className="mb-3 inline-block text-xs font-semibold text-orange-700 hover:underline"
      >
        ← Back to History
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        {intern.data?.fullName
          ? `${intern.data.fullName}'s Attendance`
          : "Intern Attendance"}
      </h1>
      <p className="text-sm text-slate-500 mb-6">Filter records by date.</p>

      <div className="flex flex-wrap items-end gap-3 mb-2">
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
        {data && !invalidRange && (
          <p className="pb-2 text-xs text-slate-500">
            {totalRecords} record{totalRecords === 1 ? "" : "s"}
            {isFetching && " · Updating…"}
          </p>
        )}
      </div>

      {invalidRange ? (
        <p role="alert" className="mt-4 text-sm text-red-600">
          The "From" date must be on or before the "To" date.
        </p>
      ) : isPending ? (
        <Spinner />
      ) : isError ? (
        <div className="mt-4">
          <ErrorAlert error={error} onRetry={() => refetch()} />
        </div>
      ) : records.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No records found.</p>
      ) : (
        <div className="mt-4 overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50 text-xs text-slate-600">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Sign In</th>
                <th className="px-4 py-3">Sign Out</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Recorded by</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`/attendance/${r.id}`)}
                  className="border-t cursor-pointer hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/attendance/${r.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {formatDate(r.date)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{formatTime(r.signInAt)}</td>
                  <td className="px-4 py-3">{formatTime(r.signOutAt)}</td>
                  <td className="px-4 py-3">{statusLabel(r)}</td>
                  <td className="px-4 py-3">{r.recordedBy?.fullName || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1 || isFetching}
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
          disabled={page >= totalPages || isFetching}
          className="px-4 py-2 rounded-lg bg-white shadow text-sm font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
