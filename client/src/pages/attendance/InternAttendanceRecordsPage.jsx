import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAttendanceHistory } from '../../hooks/attendance/useAttendanceHistory';

const LIMIT = 10; // assumed: records per page, spec default is 10

function formatTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function InternAttendanceRecordsPage() {
  const { internId } = useParams();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const { records, totalPages, isLoading, error } = useAttendanceHistory({
    from,
    to,
    internId,
    page,
    limit: LIMIT,
  });
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8">
      <button
        onClick={() => navigate('/attendance/history')}
        className="text-xs font-semibold text-orange-700 mb-3"
      >
        ← Back to History
      </button>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Intern Attendance</h1>
      <p className="text-sm text-slate-500 mb-6">Filter records by date.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <label className="text-xs font-semibold text-slate-800">
          From
          <input
            type="date"
            value={from}
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
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            className="block mt-1 rounded-lg bg-white shadow px-3 py-2 text-sm"
          />
        </label>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p role="alert" className="text-red-600">{error}</p>}
      {!isLoading && !error && records.length === 0 && (
        <p className="text-sm text-slate-500">No records found.</p>
      )}

      {records.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50 text-xs text-slate-600">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Sign In</th>
                <th className="px-4 py-3">Sign Out</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`/attendance/${r.id}`)}
                  className="border-t cursor-pointer hover:bg-slate-50"
                >
                  <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{formatTime(r.signInAt)}</td>
                  <td className="px-4 py-3">{formatTime(r.signOutAt)}</td>
                  <td className="px-4 py-3">{r.signOutAt ? 'Signed out' : 'Signed in'}</td> {/* assumed: the API has no status field, so this is worked out from signOutAt */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
          disabled={page >= totalPages}
          className="px-4 py-2 rounded-lg bg-white shadow text-sm font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}