import express from "express";
import {
  getJobs,
  postJob,
  getJobById,
  updateJob,
  getJobsByUser,
} from "../controllers/jobController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/jobs", getJobs);
router.post("/jobs", requireAuth, postJob);
router.get("/jobs/:id", getJobById);
router.put("/jobs/:id", requireAuth, updateJob);
router.delete("/jobs/:id", requireAuth, updateJob); //user deletes their own job postings, or admin deletes any
router.get("/jobs/my-jobs", requireAuth, getJobsByUser); //user views their own job postings

export default router;
