import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/auth.js";

const router = express.Router();

// router.get()
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
// router.post("/auth/forgot-password", forgotPassword);
// router.post("/auth/reset-password", resetPassword);
// router.post("/auth/logout", logoutUser);
router.post("/auth/me", getUserProfile);

export default router;
