import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useAttendanceRecord } from '../../hooks/attendance/useAttendanceRecord';

const CAN_EDIT = ['ADMINISTRATOR']; // from the spec: only administrators correct or delete

function toLocalInput(value) {
  if (!value) return '';
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AttendanceDetailsPage() {
  const { id } = useParams();
  const staff = useAuthStore((s) => s.staff);
  const { record, isLoading, isSaving, error, actionError, update, remove } =
    useAttendanceRecord(id);
  const navigate = useNavigate();
  const canEdit = CAN_EDIT.includes(staff?.role);

  const [signIn, setSignIn] = useState('');
  const [signOut, setSignOut] = useState('');

  useEffect(() => {
    if (record) {
      setSignIn(toLocalInput(record.signInAt));
      setSignOut(toLocalInput(record.signOutAt));
    }
  }, [record]);

  async function handleSave(e) {
    e.preventDefault();
    const ok = await update({
      date: record.date,
      signInAt: signIn ? new Date(signIn).toISOString() : null,
      signOutAt: signOut ? new Date(signOut).toISOString() : null,
    });
    if (ok) navigate('/attendance/history');
  }

  async function handleDelete() {
    if (!window.confirm('Delete this record?')) return;
    const ok = await remove();
    if (ok) navigate('/attendance/history');
  }

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p role="alert" className="p-4 text-red-600">{error}</p>;
  if (!record) return null;

  return (
    <div className="p-4 md:p-8 max-w-lg">
      <button
        onClick={() => navigate('/attendance/history')}
        className="text-xs font-semibold text-orange-700 mb-3"
      >
        ← Back to History
      </button>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Attendance Details</h1>
      <p className="text-sm text-slate-500 mb-6">
        {record.internName} · {new Date(record.date).toLocaleDateString()}
      </p>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow p-6">
        <label className="block text-xs font-semibold text-slate-800 mb-1">Sign In</label>
        <input
          type="datetime-local"
          value={signIn}
          onChange={(e) => setSignIn(e.target.value)}
          disabled={!canEdit}
          className="w-full rounded-lg bg-blue-50 px-3 py-3 text-sm mb-4 disabled:opacity-70"
        />

        <label className="block text-xs font-semibold text-slate-800 mb-1">Sign Out</label>
        <input
          type="datetime-local"
          value={signOut}
          onChange={(e) => setSignOut(e.target.value)}
          disabled={!canEdit}
          className="w-full rounded-lg bg-blue-50 px-3 py-3 text-sm mb-4 disabled:opacity-70"
        />

        {actionError && (
          <p role="alert" className="text-sm text-red-600 mb-3">
            {actionError}
          </p>
        )}

        {canEdit && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="flex-1 rounded-lg bg-red-50 text-red-700 font-semibold py-3 disabled:opacity-60"
            >
              Delete
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-lg bg-orange-600 text-white font-semibold py-3 disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}