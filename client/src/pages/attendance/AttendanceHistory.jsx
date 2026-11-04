import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendanceSummary } from '../../hooks/attendance/useAttendanceSummary';

const TABS = [
  { id: 'all', label: 'All Interns' },
  { id: 'perfect', label: 'Perfect Records' },
  { id: 'review', label: 'Needs Review' },
];

export default function AttendanceHistoryPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const { summary, isLoading, error } = useAttendanceSummary({ from, to });
  const navigate = useNavigate();

  const visible = summary.interns.filter((i) => { // 1
    if (tab === 'perfect' && i.missed !== 0) return false;
    if (tab === 'review' && i.missed === 0) return false;
    return i.name.toLowerCase().includes(search.toLowerCase()); // 2
  });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Intern Attendance History</h1>
      <p className="text-sm text-slate-500 mb-6">See who came in and who missed.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <label className="text-xs font-semibold text-slate-800">
          From
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="block mt-1 rounded-lg bg-white shadow px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs font-semibold text-slate-800">
          To
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="block mt-1 rounded-lg bg-white shadow px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow border-l-4 border-green-500 p-4">
          <p className="text-xs text-slate-500">Came In / Present</p>
          <p className="text-3xl font-bold">
            {summary.totalCameIn.toLocaleString()}{' '}
            <span className="text-sm font-normal text-slate-500">Times</span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow border-l-4 border-red-500 p-4">
          <p className="text-xs text-slate-500">Missed / Absent</p>
          <p className="text-3xl font-bold">
            {summary.totalMissed.toLocaleString()}{' '}
            <span className="text-sm font-normal text-slate-500">Times</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              tab === t.id ? 'bg-orange-600 text-white' : 'bg-white text-slate-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search intern name..."
          className="flex-1 rounded-lg bg-white shadow px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-slate-500 whitespace-nowrap">
          Showing {visible.length} interns
        </p>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p role="alert" className="text-red-600">{error}</p>}
      {!isLoading && !error && visible.length === 0 && (
        <p className="text-sm text-slate-500">No interns found.</p>
      )}

      <ul className="flex flex-col gap-2">
        {visible.map((intern) => (
          <li
            key={intern.id} // 3
            onClick={() => navigate(`/attendance/history/${intern.id}`)}
            className="bg-white rounded-xl shadow p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50"
          >
            {intern.avatarUrl ? (
              <img src={intern.avatarUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center font-semibold">
                {intern.name[0]}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{intern.name}</p>
              <p className="text-xs text-slate-500">{intern.totalDays} days total</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
              {intern.cameIn} Came In
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-700">
              {intern.missed} Missed
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}