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
  getFeaturedJobs,
  searchJobs,
  getRecentJobs,
  getPopularCategories,
  saveJob,
  getSavedJobs,
  removeSavedJob,
  getJobStats,
  reportJob,
  getJobRecommendations,
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
); //user/admin deletes a specific application for their job postings

router.get("/featured-jobs", getFeaturedJobs); // Get featured/highlighted jobs
router.get("/search-jobs", searchJobs); // Search jobs with advanced filtering
router.get("/recent-jobs", getRecentJobs); // Get recently posted jobs
router.get("/popular-categories", getPopularCategories); // Get popular job categories
router.post("/jobs/:id/save", requireAuth, saveJob); // Save a job for later
router.get("/saved-jobs", requireAuth, getSavedJobs); // Get user's saved jobs
router.delete("/saved-jobs/:id", requireAuth, removeSavedJob); // Remove a saved job
router.get("/job-stats", getJobStats); // Get overall job statistics
router.post("/jobs/:id/report", requireAuth, reportJob); // Report a problematic job posting
router.get("/job-recommendations", requireAuth, getJobRecommendations); // Get personalized job recommendations

export default router;
