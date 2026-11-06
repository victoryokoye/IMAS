import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { attendanceController } from "./attendance.controller";
import {
  attendanceIdSchema,
  checkInSchema,
  checkOutSchema,
  listAttendanceSchema,
  markPermittedAbsenceSchema,
  listByInternSchema,
  editAttendanceSchema,
  deleteAttendanceSchema,
} from "./attendance.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router: Router = Router();

router.use(authMiddleware);

// Intern self-service using 4-digit PIN
router.post(
  "/attendance/sign-in",
  authorizeRoles("ADMINISTRATOR", "INTERN_COORDINATOR"),
  validate(checkInSchema),
  attendanceController.checkIn,
);

router.post(
  "/attendance/sign-out",
  authorizeRoles("ADMINISTRATOR", "INTERN_COORDINATOR"),
  validate(checkOutSchema),
  attendanceController.checkOut,
);

// Staff-only: mark permitted absence (Admins and Supervisors only)
router.post(
  "/attendance/permitted-absence",
  authorizeRoles("ADMINISTRATOR", "SUPERVISOR"),
  validate(markPermittedAbsenceSchema),
  attendanceController.markPermittedAbsence,
);

// Admin-only: Edit Attendance Record (Admins only)
router.put(
  "/attendance/:id",
  authorizeRoles("ADMINISTRATOR"),
  validate(editAttendanceSchema),
  attendanceController.editAttendance,
);

// Attendance query routes
router.get(
  "/attendance",
  validate(listAttendanceSchema),
  attendanceController.list,
);
router.get(
  "/interns/:id/attendance",
  validate(listByInternSchema),
  attendanceController.listByIntern,
);
router.get(
  "/attendance/:id",
  validate(attendanceIdSchema),
  attendanceController.getById,
);

router.delete(
  "/attendance/:id",
  authorizeRoles("ADMINISTRATOR"),
  validate(deleteAttendanceSchema),
  attendanceController.deleteAttendance,
);

export default router;
