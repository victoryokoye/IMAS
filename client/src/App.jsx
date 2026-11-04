import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useCurrentStaff } from './hooks/auth/useCurrentStaff';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleNavigation from './components/common/RoleNavigation';
import LoginPage from './pages/auth/LoginPage';
import TodayAttendancePage from './pages/attendance/TodayAttendancePage';
import AttendanceHistoryPage from './pages/attendance/AttendanceHistoryPage';
import InternAttendanceRecordsPage from './pages/attendance/InternAttendanceRecordsPage';
import AttendanceDetailsPage from './pages/attendance/AttendanceDetailsPage';

function AppLayout() { // assumed
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 p-4 bg-white shadow">
        <RoleNavigation />
      </aside>
      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  useCurrentStaff();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<p className="p-8">403 Forbidden</p>} /> {/* assumed */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/attendance" replace />} /> {/* 3, assumed */}
          <Route path="/attendance" element={<TodayAttendancePage />} />
          <Route path="/attendance/history" element={<AttendanceHistoryPage />} />{/* 1 */}
          <Route path="/attendance/history/:internId" element={<InternAttendanceRecordsPage />} /> {/* 2 */}
          <Route path="/attendance/:id" element={<AttendanceDetailsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<p className="p-8">404 Not Found</p>} /> {/* assumed */}
    </Routes>
  );
}