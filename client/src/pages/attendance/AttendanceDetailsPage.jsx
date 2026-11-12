import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { ErrorAlert, Spinner } from "../../components/common/Feedback";
import { ConfirmDialog } from "../../components/common/Modal";
import {
  useAttendanceRecord,
  useCorrectAttendance,
  useDeleteAttendance,
} from "../../hooks/useAttendance";
import { canCorrectAttendance } from "../../utils/permissions";
import { formatDate } from "../../utils/format";
import { inputToIso, isoToInput } from "../../utils/datetime";
import { TIMEZONE } from "../../utils/constants";

export default function AttendanceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const staff = useAuthStore((s) => s.staff);
  const canEdit = canCorrectAttendance(staff?.role);

  const {
    data: record,
    isPending,
    isError,
    error,
    refetch,
  } = useAttendanceRecord(id);
  const correct = useCorrectAttendance();
  const remove = useDeleteAttendance();

  const [signIn, setSignIn] = useState("");
  const [signOut, setSignOut] = useState("");
  const [validationError, setValidationError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fill the form from the loaded record (shown in company time, not the browser's)
  useEffect(() => {
    if (record) {
      setSignIn(isoToInput(record.signInAt));
      setSignOut(isoToInput(record.signOutAt));
    }
  }, [record]);

  if (isPending) return <Spinner />;
  if (isError) {
    return (
      <div className="p-4 md:p-8">
        <ErrorAlert error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  const backTo = record.internId
    ? `/attendance/history/${record.internId}`
    : "/attendance/history";
  const unchanged =
    signIn === isoToInput(record.signInAt) &&
    signOut === isoToInput(record.signOutAt);

  function handleSave(e) {
    e.preventDefault();
    if (signOut && !signIn)
      return setValidationError("A sign-out needs a sign-in time.");
    if (signIn && signOut && signOut < signIn) {
      return setValidationError("Sign-out cannot be earlier than sign-in.");
    }
    setValidationError("");
    correct.mutate(
      {
        id: record.id,
        input: {
          date: record.date,
          signInAt: inputToIso(signIn),
          signOutAt: inputToIso(signOut),
        },
      },
      { onSuccess: () => navigate(backTo) },
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-lg">
      <Link
        to={backTo}
        className="mb-3 inline-block text-xs font-semibold text-orange-700 hover:underline"
      >
        ← Back to History
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        Attendance Details
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        {record.internName || "Intern"} · {formatDate(record.date)}
        {record.recordedBy?.fullName &&
          ` · Recorded by ${record.recordedBy.fullName}`}
      </p>

      <form
        onSubmit={handleSave}
        noValidate
        className="bg-white rounded-xl shadow p-6"
      >
        <label
          htmlFor="sign-in"
          className="block text-xs font-semibold text-slate-800 mb-1"
        >
          Sign In
        </label>
        <input
          id="sign-in"
          type="datetime-local"
          value={signIn}
          onChange={(e) => setSignIn(e.target.value)}
          disabled={!canEdit || correct.isPending}
          className="w-full rounded-lg bg-blue-50 px-3 py-3 text-sm mb-4 disabled:opacity-70"
        />

        <label
          htmlFor="sign-out"
          className="block text-xs font-semibold text-slate-800 mb-1"
        >
          Sign Out
        </label>
        <input
          id="sign-out"
          type="datetime-local"
          value={signOut}
          onChange={(e) => setSignOut(e.target.value)}
          disabled={!canEdit || correct.isPending}
          className="w-full rounded-lg bg-blue-50 px-3 py-3 text-sm mb-2 disabled:opacity-70"
        />
        <p className="mb-4 text-xs text-slate-500">
          Times are in {TIMEZONE.replace("_", " ")} time.
        </p>

        {validationError && (
          <p role="alert" className="text-sm text-red-600 mb-3">
            {validationError}
          </p>
        )}
        {correct.error && (
          <div className="mb-3">
            <ErrorAlert error={correct.error} />
          </div>
        )}

        {canEdit ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={correct.isPending}
              className="flex-1 rounded-lg bg-red-50 text-red-700 font-semibold py-3 disabled:opacity-60"
            >
              Delete
            </button>
            <button
              type="submit"
              disabled={correct.isPending || unchanged}
              className="flex-1 rounded-lg bg-orange-600 text-white font-semibold py-3 disabled:opacity-60"
            >
              {correct.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            Only administrators can correct or delete attendance records.
          </p>
        )}
      </form>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete this record?"
          message="This permanently removes the attendance record. This cannot be undone."
          confirmLabel="Delete"
          destructive
          loading={remove.isPending}
          error={remove.error ? <ErrorAlert error={remove.error} /> : undefined}
          onCancel={() => {
            remove.reset();
            setConfirmDelete(false);
          }}
          onConfirm={() =>
            remove.mutate(record.id, { onSuccess: () => navigate(backTo) })
          }
        />
      )}
    </div>
  );
}
