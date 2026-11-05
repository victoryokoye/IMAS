import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

import {
  createStaff,
  getAllStaff,
  getSingleStaff,
  updateStaff,
  updateStaffRole,
  updateStaffStatus,
} from "./staff.controller";
const router: Router = Router();

router.use(authMiddleware);

// All staff management routes are restricted to administrators
router.use(authorizeRoles("ADMINISTRATOR"));

router.post("/", createStaff);
router.get("/", getAllStaff);
router.get("/:id", getSingleStaff);
router.put("/:id", updateStaff);
router.patch("/:id/role", updateStaffRole);
router.patch("/:id/status", updateStaffStatus);

export default router;
