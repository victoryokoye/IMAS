import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { attendanceController } from "./attendance.controller";
import { attendanceIdSchema, checkInSchema, checkOutSchema, listAttendanceSchema, markPermittedAbsenceSchema, listByInternSchema, editAttendanceSchema, deleteAttendanceSchema, } from "./attendance.schema";
const router = Router();
// Intern self-service using 4-digit PIN
router.post("/attendance/sign-in", validate(checkInSchema), attendanceController.checkIn);
router.post("/attendance/sign-out", validate(checkOutSchema), attendanceController.checkOut);
// Staff-only: mark permitted absence (Admins and Supervisors only)
router.post("/attendance/permitted-absence", 
// requireStaff("ADMINISTRATOR", "SUPERVISOR"),
validate(markPermittedAbsenceSchema), attendanceController.markPermittedAbsence);
// Admin-only: Edit Attendance Record (Admins only)
router.put("/attendance/:id", 
// requireStaff("ADMINISTRATOR"),
validate(editAttendanceSchema), attendanceController.editAttendance);
// Attendance query routes
router.get("/attendance", validate(listAttendanceSchema), attendanceController.list);
router.get("/interns/:id/attendance", validate(listByInternSchema), attendanceController.listByIntern);
router.get("/attendance/:id", validate(attendanceIdSchema), attendanceController.getById);
router.delete("/attendance/:id", 
// authenticate,
// requireStaff("ADMINISTRATOR"),
validate(deleteAttendanceSchema), attendanceController.deleteAttendance);
export default router;
//# sourceMappingURL=attendance.routes.js.map