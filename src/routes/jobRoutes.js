import express from "express";
import {
  getJobs,
  postJob,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByUser,
  applyToJob,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/jobController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/jobs", getJobs);
router.get("/jobs/:id", getJobById);
router.post("/jobs", requireAuth, postJob);
router.put("/jobs/:id", requireAuth, updateJob);
router.delete("/jobs/:id", requireAuth, deleteJob); //user deletes their own job postings, or admin deletes any
router.get("/jobs/my-jobs", requireAuth, getJobsByUser); //user views their own job postings
router.post("/jobs/:id/apply", requireAuth, applyToJob); //user applies to a job posting
router.get("/jobs/:id/applications", requireAuth, getJobApplications); //user/admin views applications for their job postings
router.put(
  "/jobs/:id/applications/:applicationId",
  requireAuth,
  updateApplicationStatus,
); //user/admin updates application status for their job postings - accept/reject
router.delete(
  "/jobs/:id/applications/:applicationId",
  requireAuth,
  deleteApplication,
); //user/admin deletes a specific application for their job postings (perhaps spam)

export default router;
