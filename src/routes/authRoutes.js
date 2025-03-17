import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// router.get()
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/logout", requireAuth, logoutUser);
router.get("/auth/me", requireAuth, getUserProfile);

export default router;
