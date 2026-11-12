import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import PinDialog from "./PinDialog";
import Pagination from "../../components/common/Pagination";
import { ErrorAlert, Spinner } from "../../components/common/Feedback";
import { useInterns } from "../../hooks/useInterns";
import { useTodayAttendance } from "../../hooks/useAttendance";
import { useDashboardSummary } from "../../hooks/useDashboard";
import { useDebounce } from "../../hooks/useDebounce";
import { canRecordAttendance } from "../../utils/permissions";
import { formatTime, getAttendanceState } from "../../utils/attendance";

const LIMIT = 10; // interns per page
const TODAY_LOOKUP_LIMIT = 100; // today's records fetched once and matched to interns by id

const STATE_BADGE = {
  NOT_SIGNED_IN: { label: "Not signed in", cls: "bg-slate-100 text-slate-600" },
  SIGNED_IN: { label: "Here now", cls: "bg-green-100 text-green-700" },
  SIGNED_OUT: { label: "Signed out", cls: "bg-blue-100 text-blue-700" },
};

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value ?? "—"}</p>
    </div>
  );
}

export default function TodayAttendancePage() {
  const staff = useAuthStore((s) => s.staff);
  const canMark = canRecordAttendance(staff?.role);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null); // { intern, action }
  const [notice, setNotice] = useState("");

  // 1) Who exists (active interns, server-side search + pagination)
  const interns = useInterns({
    page,
    limit: LIMIT,
    search: debouncedSearch,
    status: "ACTIVE",
  });

  // 2) Who has a record today (matched to interns by id below)
  const today = useTodayAttendance({ page: 1, limit: TODAY_LOOKUP_LIMIT });
  // 3) Headline numbers straight from the API
  const summary = useDashboardSummary();

  const recordsByIntern = useMemo(
    () => new Map((today.data?.items ?? []).map((r) => [r.internId, r])),
    [today.data],
  );

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  const attendanceReady = !today.isPending && !today.isError;
  const lookupIncomplete =
    today.data && today.data.meta.total > (today.data.items?.length ?? 0);

  const handleDone = (record) => {
    const { intern, action } = selected;
    const when = formatTime(
      action === "SIGN_IN" ? record?.signInAt : record?.signOutAt,
    );
    setNotice(
      `${intern.fullName} ${action === "SIGN_IN" ? "signed in" : "signed out"}${when !== "—" ? ` at ${when}` : ""}.`,
    );
    setSelected(null);
    // No manual refetch: the sign-in/out hooks already invalidate attendance + dashboard queries.
  };

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
        <StatCard label="Present today" value={summary.data?.presentToday} />
        <StatCard label="Here now" value={summary.data?.currentlyPresent} />
        <StatCard label="Signed out" value={summary.data?.signedOutToday} />
      </div>

      {notice && (
        <div
          role="status"
          className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {notice}
        </div>
      )}

      <input
        type="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search interns by name, group or tech area..."
        aria-label="Search interns"
        className="w-full rounded-lg bg-white shadow px-3 py-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-orange-500"
      />

      {today.isError && (
        <div className="mb-4">
          <ErrorAlert error={today.error} onRetry={() => today.refetch()} />
        </div>
      )}
      {lookupIncomplete && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Only the first {TODAY_LOOKUP_LIMIT} of {today.data.meta.total} records
          for today were loaded, so some statuses below may be wrong. Raise
          TODAY_LOOKUP_LIMIT or ask the backend for a today endpoint.
        </p>
      )}

      {interns.isPending ? (
        <Spinner />
      ) : interns.isError ? (
        <ErrorAlert error={interns.error} onRetry={() => interns.refetch()} />
      ) : interns.data.items.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-sm text-slate-600 shadow">
          {debouncedSearch
            ? "No active interns match your search."
            : "There are no active interns yet."}
        </p>
      ) : (
        <>
          <ul className="divide-y divide-slate-100 rounded-xl bg-white shadow">
            {interns.data.items.map((intern) => {
              const record = recordsByIntern.get(intern.id);
              const state = getAttendanceState(record);
              const badge = STATE_BADGE[state];
              const dialogIntern = { id: intern.id, fullName: intern.fullName };

              return (
                <li
                  key={intern.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      to={`/interns/${intern.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {intern.fullName}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {[intern.group, intern.techArea]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {record?.signInAt && (
                      <p className="mt-1 text-xs text-slate-500">
                        In {formatTime(record.signInAt)}
                        {record.signOutAt &&
                          ` · Out ${formatTime(record.signOutAt)}`}
                        {record.recordedBy?.fullName &&
                          ` · Recorded by ${record.recordedBy.fullName}`}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {attendanceReady && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    )}
                    {canMark &&
                      attendanceReady &&
                      state === "NOT_SIGNED_IN" && (
                        <button
                          type="button"
                          onClick={() =>
                            setSelected({
                              intern: dialogIntern,
                              action: "SIGN_IN",
                            })
                          }
                          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                          Sign in
                        </button>
                      )}
                    {canMark && attendanceReady && state === "SIGNED_IN" && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelected({
                            intern: dialogIntern,
                            action: "SIGN_OUT",
                          })
                        }
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                      >
                        Sign out
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <Pagination
            meta={interns.data.meta}
            onPageChange={setPage}
            disabled={interns.isFetching}
          />
        </>
      )}

      {selected && (
        <PinDialog
          intern={selected.intern}
          action={selected.action}
          onClose={() => setSelected(null)}
          onDone={handleDone}
        />
      )}
    </div>
  );
}
