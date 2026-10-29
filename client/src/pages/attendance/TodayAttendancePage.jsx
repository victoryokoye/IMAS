import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useTodayAttendance } from '../../hooks/attendance/useTodayAttendance';
import PinDialog from './PinDialog';

const CAN_MARK = ['admin', 'intern_supervisor'];
const FILTERS = ['all', 'here', 'away'];

export default function TodayAttendancePage() {
  const staff = useAuthStore((s) => s.staff);
  const { interns, isLoading, error, refetch } = useTodayAttendance();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const canMark = CAN_MARK.includes(staff?.role); // 1

  const hereCount = interns.filter((i) => i.status === 'here').length;
  const awayCount = interns.length - hereCount;

  const visible = interns.filter(
    (i) =>
      (filter === 'all' || i.status === filter) &&
      i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Monitor</h1>
          <p className="text-sm text-slate-500">
            See who is here today and mark attendance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-2xl font-bold">{interns.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-xs text-slate-500">Here Now</p>
          <p className="text-2xl font-bold">{hereCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-xs text-slate-500">Away</p>
          <p className="text-2xl font-bold">{awayCount}</p>
        </div>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)} // 2
        placeholder="Search intern name..."
        className="w-full rounded-lg bg-white shadow px-3 py-3 text-sm mb-3 outline-none focus:ring-2 focus:ring-orange-500"
      />

      <div className="flex gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs capitalize ${
              filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p role="alert" className="text-red-600">{error}</p>}
      {!isLoading && !error && visible.length === 0 && (
        <p className="text-sm text-slate-500">No interns found.</p>
      )}

      <ul className="flex flex-col gap-3">
        {visible.map((intern) => (
          <li
            key={intern.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-3"
          >
            <div className="flex items-center gap-3 flex-1">
              {intern.avatarUrl ? (
                <img src={intern.avatarUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center font-semibold">
                  {intern.name[0]}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-900">{intern.name}</p>
                <p className="text-xs text-slate-500">{intern.email}</p>
                {intern.signedInAt && (
                <p className="text-xs text-slate-500">
                    In since{' '}
                    {new Date(intern.signedInAt).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    })}
                </p>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 md:w-40">{intern.project}</p>

            <span
              className={`text-xs font-semibold px-2 py-1 rounded w-fit ${
                intern.status === 'here'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {intern.status === 'here' ? 'Here' : 'Away'}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/interns/${intern.id}`)}
                className="px-3 py-2 rounded-lg bg-blue-50 text-xs font-semibold text-slate-800"
              >
                View Profile
              </button>
              {canMark && (
                <>
                  <button
                    onClick={() => setSelected({ intern, action: 'sign-out' })}
                    className="px-3 py-2 rounded-lg bg-red-50 text-xs font-semibold text-red-700"
                  >
                    Absent
                  </button>
                  <button
                    onClick={() => setSelected({ intern, action: 'sign-in' })} // 3
                    className="px-3 py-2 rounded-lg bg-green-600 text-xs font-semibold text-white"
                  >
                    Present
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

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