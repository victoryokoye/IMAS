import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";

import InternListPage from "../pages/interns/InternListPage";
import InternFormPage from "../pages/interns/InternFormPage";
import InternDetailsPage from "../pages/interns/InternDetailsPage";

import TodayAttendancePage from "../pages/attendance/TodayAttendancePage";
import AttendanceHistoryPage from "../pages/attendance/AttendanceHistoryPage";
import InternAttendanceRecordsPage from "../pages/attendance/InternAttendanceRecordsPage";
import AttendanceDetailsPage from "../pages/attendance/AttendanceDetailsPage";

import ProjectListPage from "../pages/projects/ProjectListPage";
import ProjectFormPage from "../pages/projects/ProjectFormPage";
import ProjectDetailsPage from "../pages/projects/ProjectDetailsPage";

import StaffListPage from "../pages/staff/StaffListPage";
import StaffCreatePage from "../pages/staff/StaffCreatePage";
import StaffDetailsPage from "../pages/staff/StaffDetailsPage";
import StaffEditPage from "../pages/staff/StaffEditPage";

import ForbiddenPage from "../pages/system/ForbiddenPage";
import NotFoundPage from "../pages/system/NotFoundPage";

const ROLES = {
  ADMIN: "ADMINISTRATOR",
  SUPERVISOR: "SUPERVISOR",
  COORDINATOR: "INTERN_COORDINATOR",
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Authenticated (any role) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="staff">
            {" "}
            <Route index element={<StaffListPage />} />{" "}
            <Route path="new" element={<StaffCreatePage />} />{" "}
            <Route path=":id/edit" element={<StaffEditPage />} />{" "}
            <Route path=":id" element={<StaffDetailsPage />} />{" "}
          </Route>
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="interns">
            <Route index element={<InternListPage />} />
            <Route path="new" element={<InternFormPage />} />
            <Route path=":id" element={<InternDetailsPage />} />
            <Route path=":id/edit" element={<InternFormPage />} />
          </Route>

          <Route path="attendance">
            <Route index element={<TodayAttendancePage />} />
            <Route path="history" element={<AttendanceHistoryPage />} />
            <Route
              path="history/:internId"
              element={<InternAttendanceRecordsPage />}
            />{" "}
            {/* 2 */}
            <Route path=":id" element={<AttendanceDetailsPage />} />
          </Route>

          <Route path="403" element={<ForbiddenPage />} />

          {/* Administrator + Supervisor */}
          <Route
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]} />
            }
          >
            <Route path="projects">
              <Route index element={<ProjectListPage />} />
              <Route path="new" element={<ProjectFormPage />} />
              <Route path=":id" element={<ProjectDetailsPage />} />
              <Route path=":id/edit" element={<ProjectFormPage />} />
            </Route>
          </Route>

          {/* Administrator only */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="staff">
              <Route index element={<StaffListPage />} />
              <Route path="new" element={<StaffCreatePage />} />
              <Route path=":id" element={<StaffDetailsPage />} />
              <Route path=":id/edit" element={<StaffEditPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
