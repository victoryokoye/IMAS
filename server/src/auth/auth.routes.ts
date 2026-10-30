import { Router } from "express";
import {
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
} from "./auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const router: Router = Router();

router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/forgot_password", forgotPassword);
router.post("/reset_password", resetPassword);
router.post("/logout", logout);

export default router;
