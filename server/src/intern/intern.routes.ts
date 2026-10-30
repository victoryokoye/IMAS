import { Router } from "express";
import {
  createIntern,
  getAllInterns,
  getSingleIntern,
  updateIntern,
  updateInternStatus,
  setInternPin,
  verifyInternPin,
} from "./intern.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router: Router = Router();

router.use(authMiddleware);

// Get interns
router.get("/", getAllInterns);
router.get("/:id", getSingleIntern);

// Create intern
router.post(
  "/",
  authorizeRoles("ADMINISTRATOR", "INTERN_COORDINATOR"),
  createIntern,
);

// Update intern details
router.put(
  "/:id",
  authorizeRoles("ADMINISTRATOR", "INTERN_COORDINATOR"),
  updateIntern,
);

// Update intern status
router.patch(
  "/:id/status",
  authorizeRoles("ADMINISTRATOR", "INTERN_COORDINATOR"),
  updateInternStatus,
);

// Set or reset intern PIN
router.put(
  "/:id/pin",
  authorizeRoles("ADMINISTRATOR", "INTERN_COORDINATOR"),
  setInternPin,
);

// Verify intern PIN
router.post("/:id/verify-pin", verifyInternPin);

export default router;
