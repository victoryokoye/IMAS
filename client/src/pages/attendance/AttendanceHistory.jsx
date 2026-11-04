import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendanceSummary } from '../../hooks/attendance/useAttendanceSummary';

const LIMIT = 10; // assumed: records per page, spec default is 10

export default function AttendanceHistoryPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { rows, totalCameIn, totalInterns, totalPages, isLoading, error } =
    useAttendanceSummary({ from, to, search, page, limit: LIMIT });
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Intern Attendance History</h1>
      <p className="text-sm text-slate-500 mb-6">See who came in and how often.</p>

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

      <div className="bg-white rounded-xl shadow border-l-4 border-green-500 p-4 mb-6 max-w-xs">
        <p className="text-xs text-slate-500">Came In / Present</p>
        <p className="text-3xl font-bold">
          {totalCameIn.toLocaleString()}{' '}
          <span className="text-sm font-normal text-slate-500">Times</span>
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // 3
          }}
          placeholder="Search intern name..."
          className="flex-1 rounded-lg bg-white shadow px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-slate-500 whitespace-nowrap">
          {totalInterns} interns
        </p>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p role="alert" className="text-red-600">{error}</p>}
      {!isLoading && !error && rows.length === 0 && (
        <p className="text-sm text-slate-500">No interns found.</p>
      )}

      <ul className="flex flex-col gap-2">
        {rows.map((intern) => (
          <li
            key={intern.id}
            onClick={() => navigate(`/attendance/history/${intern.id}`)}
            className="bg-white rounded-xl shadow p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50"
          >
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center font-semibold">
              {intern.name[0]}
            </div>
            <p className="flex-1 font-semibold text-slate-900">{intern.name}</p>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
              {intern.cameIn} Came In
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))} // 1
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
          disabled={page >= totalPages} // 2
          className="px-4 py-2 rounded-lg bg-white shadow text-sm font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}