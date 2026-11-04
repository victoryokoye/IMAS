import { Navigate, Route, Routes } from "react-router-dom";

// import ProtectedRoute from "./ProtectedRoute";
// import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// import LoginPage from "../pages/auth/LoginPage";
// import DashboardPage from "../pages/dashboard/DashboardPage";

// import InternListPage from "../pages/interns/InternListPage";
// import InternCreatePage from "../pages/interns/InternCreatePage";
// import InternDetailPage from "../pages/interns/InternDetailPage";
// import InternEditPage from "../pages/interns/InternEditPage";

// import AttendanceTodayPage from "../pages/attendance/AttendanceTodayPage";
// import AttendanceHistoryPage from "../pages/attendance/AttendanceHistoryPage";

// import ProjectListPage from "../pages/projects/ProjectListPage";
// import ProjectCreatePage from "../pages/projects/ProjectCreatePage";
// import ProjectDetailPage from "../pages/projects/ProjectDetailPage";
// import ProjectEditPage from "../pages/projects/ProjectEditPage";

// import StaffListPage from "../pages/staff/StaffListPage";
// import StaffCreatePage from "../pages/staff/StaffCreatePage";
// import StaffDetailPage from "../pages/staff/StaffDetailPage";
// import StaffEditPage from "../pages/staff/StaffEditPage";

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
      {/* <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route> */}

      {/* Authenticated (any role) */}
      {/* <Route element={<ProtectedRoute />}> */}
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        {/* <Route path="dashboard" element={<DashboardPage />} /> */}
        {/* 
        <Route path="interns">
          <Route index element={<InternListPage />} />
          <Route path="new" element={<InternCreatePage />} />
          <Route path=":id" element={<InternDetailPage />} />
          <Route path=":id/edit" element={<InternEditPage />} />
        </Route>

        <Route path="attendance">
          <Route index element={<AttendanceTodayPage />} />
          <Route path="history" element={<AttendanceHistoryPage />} />
        </Route> */}

        <Route path="403" element={<ForbiddenPage />} />

        {/* Administrator + Supervisor */}
        {/* <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]} />
          }
        >
          <Route path="projects">
            <Route index element={<ProjectListPage />} />
            <Route path="new" element={<ProjectCreatePage />} />
            <Route path=":id" element={<ProjectDetailPage />} />
            <Route path=":id/edit" element={<ProjectEditPage />} />
          </Route> */}
      </Route>

      {/* Administrator only */}
      {/* <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="staff">
            <Route index element={<StaffListPage />} />
            <Route path="new" element={<StaffCreatePage />} />
            <Route path=":id" element={<StaffDetailPage />} />
            <Route path=":id/edit" element={<StaffEditPage />} />
          </Route>
        </Route>
      </Route> */}
      {/* </Route> */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
