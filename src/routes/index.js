import express from "express";
import authRoutes from "./authRoutes.js";
import jobRoutes from "./jobRoutes.js";

const router = express.Router();
router.use(authRoutes);
router.use(jobRoutes);

export default router; // Export the combined router
