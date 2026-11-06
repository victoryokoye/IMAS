import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ErrorAlert, Spinner } from "../common/Feedback";
import { useRecentAttendance } from "../../hooks/useDashboard";
import { formatDate } from "../../utils/format";
import { formatTime, todayInCompanyTz } from "../../utils/attendance";
import type { AttendanceRecord } from "../../types/attendance";
import { Activity } from "lucide-react";

type EventKind = "SIGN_IN" | "SIGN_OUT" | "ABSENT" | "PERMITTED_ABSENCE";

interface LogEvent {
  key: string;
  internId: string;
  internName: string;
  kind: EventKind;
  ts: number; // for sorting
  time: string | null; // ISO timestamp, null for absence entries (no clock time)
  by: string | null;
}

const LABEL: Record<EventKind, string> = {
  SIGN_IN: "signed in",
  SIGN_OUT: "signed out",
  ABSENT: "was marked absent",
  PERMITTED_ABSENCE: "has a permitted absence",
};

const DOT: Record<EventKind, string> = {
  SIGN_IN: "bg-green-500",
  SIGN_OUT: "bg-slate-400",
  ABSENT: "bg-red-500",
  PERMITTED_ABSENCE: "bg-amber-500",
};

/** One attendance record -> one or two log entries. Missing fields are simply skipped. */
function toEvents(r: AttendanceRecord): LogEvent[] {
  const base = {
    internId: r.internId,
    internName: r.internName || "Unknown intern",
    by: r.recordedBy?.fullName || null,
  };
  const events: LogEvent[] = [];

  if (r.signInAt) {
    events.push({
      ...base,
      key: `${r.id}-in`,
      kind: "SIGN_IN",
      time: r.signInAt,
      ts: Date.parse(r.signInAt),
    });
  }
  if (r.signOutAt) {
    events.push({
      ...base,
      key: `${r.id}-out`,
      kind: "SIGN_OUT",
      time: r.signOutAt,
      ts: Date.parse(r.signOutAt),
    });
  }
  if (
    events.length === 0 &&
    (r.status === "ABSENT" || r.status === "PERMITTED_ABSENCE")
  ) {
    events.push({
      ...base,
      key: `${r.id}-${r.status}`,
      kind: r.status,
      time: null,
      ts: Date.parse(r.date),
    });
  }
  return events;
}

function dayKey(ts: number) {
  return todayInCompanyTz(new Date(ts)); // YYYY-MM-DD in the company timezone
}

function dayLabel(key: string) {
  if (key === todayInCompanyTz()) return "Today";
  if (key === todayInCompanyTz(new Date(Date.now() - 86_400_000)))
    return "Yesterday";
  return formatDate(key);
}

export default function RecentAttendanceLog({
  maxEntries = 12,
}: {
  maxEntries?: number;
}) {
  // const { data, isPending, isError, error, refetch, isFetching } =
  //   useRecentAttendance(maxEntries);

  const data = {
    items: [
      {
        id: "att-1",
        internId: "intern-1",
        internName: "Oluwaseun Adeleke",
        date: "2026-11-06",
        signInAt: "2026-11-06T07:55:00.000Z",
        signOutAt: "2026-11-06T15:00:00.000Z",
        recordedBy: { id: "staff-3", fullName: "Tolu Balogun" },
      },
      {
        id: "att-2",
        internId: "intern-2",
        internName: "Chinedu Okonkwo",
        date: "2026-11-06",
        signInAt: "2026-11-06T08:10:00.000Z",
        signOutAt: null,
        recordedBy: { id: "staff-3", fullName: "Tolu Balogun" },
      },
      {
        id: "att-3",
        internId: "intern-3",
        internName: "Aisha Yusuf",
        date: "2026-11-06",
        signInAt: "2026-11-06T08:20:00.000Z",
        signOutAt: null,
        recordedBy: { id: "staff-1", fullName: "Adebayo Ogunleye" },
      },
      {
        id: "att-4",
        internId: "intern-1",
        internName: "Oluwaseun Adeleke",
        date: "2026-11-05",
        signInAt: "2026-11-05T08:00:00.000Z",
        signOutAt: "2026-11-05T15:30:00.000Z",
        recordedBy: { id: "staff-3", fullName: "Tolu Balogun" },
      },
      {
        id: "att-5",
        internId: "intern-4",
        internName: "Emeka Nnamdi",
        date: "2026-11-05",
        signInAt: "2026-11-05T08:15:00.000Z",
        signOutAt: "2026-11-05T15:45:00.000Z",
        recordedBy: { id: "staff-1", fullName: "Adebayo Ogunleye" },
      },
    ],
  };

  const groups = useMemo(() => {
    const events = (data?.items ?? [])
      .flatMap(toEvents)
      .filter((e) => !Number.isNaN(e.ts))
      .sort((a, b) => b.ts - a.ts)
      .slice(0, maxEntries);

    const byDay = new Map<string, LogEvent[]>();
    for (const e of events) {
      const k = dayKey(e.ts);
      byDay.set(k, [...(byDay.get(k) ?? []), e]);
    }
    return [...byDay.entries()]; // Map preserves insertion order = newest day first
  }, [data, maxEntries]);

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white"
      aria-labelledby="recent-attendance-title"
    >
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <Activity
            size={35}
            className="bg-blue-100 text-blue-700 rounded-sm p-2"
          />
          <h2
            id="recent-attendance-title"
            className="text-base font-semibold text-slate-900"
          >
            Recent attendance activity
          </h2>
          {/* {isFetching && !isPending && (
            <span className="text-xs text-slate-500">Updating…</span>
          )} */}
        </div>
        <Link
          to="/attendance/history"
          className="text-sm font-medium text-slate-700 hover:underline"
        >
          View all
        </Link>
      </header>

      <div className="max-h-[26rem] overflow-y-auto px-5 py-4">
        {/* {isPending ? (
          <Spinner />
        ) : isError ? (
          <ErrorAlert error={error} onRetry={() => refetch()} />
        ) :  */}
        {/* groups.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-600">
          No attendance activity yet. Sign-ins and sign-outs will appear here.
        </p>
        ) : ( */}
        <ol className="space-y-5">
          {groups.map(([key, events]) => (
            <li key={key}>
              <h3 className="mb-2 text-xs font-medium text-slate-500">
                {dayLabel(key)}
              </h3>
              <ul className="space-y-3 border-l border-slate-200 pl-4">
                {events.map((e) => (
                  <li key={e.key} className="relative flex gap-3">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[1.3rem] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${DOT[e.kind]}`}
                    />
                    <span className="w-14 shrink-0 pt-px text-sm tabular-nums text-slate-500">
                      {e.time ? formatTime(e.time) : "All day"}
                    </span>
                    <div className="min-w-0 text-sm">
                      <p className="text-slate-900">
                        <Link
                          to={`/interns/${e.internId}`}
                          className="font-medium hover:underline"
                        >
                          {e.internName}
                        </Link>{" "}
                        {LABEL[e.kind]}
                      </p>
                      {e.by && (
                        <p className="text-xs text-slate-500">
                          Recorded by {e.by}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        {/* )} */}
      </div>
    </section>
  );
}
