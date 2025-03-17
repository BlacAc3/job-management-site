import { Job, Application } from "../models/jobs.js";
import { User } from "../models/user.js";

const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, location } = req.query; // Get query parameters
    const query = {}; // Initialize query object
    if (type) query.type = type;
    if (location) query.location = location;

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit); // Calculate total pages
    const jobs = await Job.find(query)
      .select("-__v")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      jobs,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        totalJobs,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

const postJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, type, location, company, salary } = req.body;
    if (!title || !description || !type || !location || !company) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newJob = new Job({
      title,
      description,
      type,
      location,
      company,
      salary,
      postedBy: userId,
    });
    const savedJob = await newJob.save();

    res.status(201).json({
      message: "Job posted successfully",
      job: savedJob,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ message: "Failed to post job" });
  }
};

const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

const updateJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;
    const updates = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Failed to update job" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};

const getJobsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const jobs = await Job.find({ postedBy: userId });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// New functions for application-related routes

const applyToJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;
    const { coverLetter, resume } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user has already applied to this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job" });
    }

    // Create new application
    const newApplication = new Application({
      job: jobId,
      applicant: userId,
      coverLetter,
      resume,
      status: "pending",
    });

    const savedApplication = await newApplication.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application: savedApplication,
    });
  } catch (error) {
    console.error("Error applying to job:", error);
    res.status(500).json({ message: "Failed to apply to job" });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user is authorized to view applications
    if (job.postedBy.toString() !== userId && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view applications" });
    }

    // Get all applications for the job
    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email") // Populate applicant data
      .select("-__v");

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: jobId, applicationId } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Valid status is required" });
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user is authorized to update application
    if (job.postedBy.toString() !== userId && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update application status" });
    }

    // Find and update the application
    const application = await Application.findById(applicationId);
    if (!application || application.job.toString() !== jobId) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    application.updatedAt = Date.now();
    const updatedApplication = await application.save();

    res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Failed to update application status" });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: jobId, applicationId } = req.params;

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Find the application
    const application = await Application.findById(applicationId);
    if (!application || application.job.toString() !== jobId) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if user is authorized to delete the application
    if (
      job.postedBy.toString() !== userId &&
      application.applicant.toString() !== userId &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this application" });
    }

    await Application.findByIdAndDelete(applicationId);
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Failed to delete application" });
  }
};
const getFeaturedJobs = async (req, res) => {
  try {
    // Get featured jobs - could be jobs marked as featured or with highest ratings
    const featuredJobs = await Job.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(featuredJobs);
  } catch (error) {
    console.error("Error fetching featured jobs:", error);
    res.status(500).json({ message: "Failed to fetch featured jobs" });
  }
};

const searchJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      type,
      minSalary,
      maxSalary,
      company,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build the query object
    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) query.location = { $regex: location, $options: "i" };
    if (type) query.type = type;
    if (company) query.company = { $regex: company, $options: "i" };

    // Salary range filtering
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = Number(minSalary);
      if (maxSalary) query.salary.$lte = Number(maxSalary);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    const jobs = await Job.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      jobs,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalJobs,
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({ message: "Failed to search jobs" });
  }
};

const getRecentJobs = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json(recentJobs);
  } catch (error) {
    console.error("Error fetching recent jobs:", error);
    res.status(500).json({ message: "Failed to fetch recent jobs" });
  }
};

const getPopularCategories = async (req, res) => {
  try {
    // Aggregate jobs to get counts by type/category
    const categories = await Job.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching popular categories:", error);
    res.status(500).json({ message: "Failed to fetch popular categories" });
  }
};

const saveJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if job is already saved by the user
    const user = await User.findById(userId);
    if (user.savedJobs && user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job already saved" });
    }

    // Add job to saved jobs
    await User.findByIdAndUpdate(
      userId,
      { $push: { savedJobs: jobId } },
      { new: true },
    );

    res.status(200).json({ message: "Job saved successfully" });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: "Failed to save job" });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with populated saved jobs
    const user = await User.findById(userId).populate("savedJobs");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.savedJobs || []);
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ message: "Failed to fetch saved jobs" });
  }
};

const removeSavedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    // Remove job from saved jobs
    await User.findByIdAndUpdate(userId, { $pull: { savedJobs: jobId } });

    res.status(200).json({ message: "Job removed from saved jobs" });
  } catch (error) {
    console.error("Error removing saved job:", error);
    res.status(500).json({ message: "Failed to remove saved job" });
  }
};

const getJobStats = async (req, res) => {
  try {
    // Get overall job statistics
    const totalJobs = await Job.countDocuments();

    // Jobs by type
    const jobsByType = await Job.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Jobs by location
    const jobsByLocation = await Job.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Average salary
    const salaryStats = await Job.aggregate([
      { $match: { salary: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: null,
          averageSalary: { $avg: "$salary" },
          minSalary: { $min: "$salary" },
          maxSalary: { $max: "$salary" },
        },
      },
    ]);

    // Jobs posted in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentJobsCount = await Job.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      totalJobs,
      jobsByType,
      jobsByLocation,
      salaryStats: salaryStats[0] || {},
      recentJobsCount,
    });
  } catch (error) {
    console.error("Error fetching job stats:", error);
    res.status(500).json({ message: "Failed to fetch job statistics" });
  }
};

const reportJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;
    const { reason, details } = req.body;

    if (!reason) {
      return res
        .status(400)
        .json({ message: "Reason for reporting is required" });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Create a report
    const report = {
      job: jobId,
      reportedBy: userId,
      reason,
      details,
      status: "pending",
      createdAt: new Date(),
    };

    // Add to reports array in the job document
    await Job.findByIdAndUpdate(jobId, { $push: { reports: report } });

    res.status(200).json({
      message: "Job reported successfully",
      report,
    });
  } catch (error) {
    console.error("Error reporting job:", error);
    res.status(500).json({ message: "Failed to report job" });
  }
};

const getJobRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's application history to understand preferences
    const userApplications = await Application.find({ applicant: userId });

    // Extract job IDs to find similar jobs
    const appliedJobIds = userApplications.map((app) => app.job);

    // Find the jobs the user applied to
    const appliedJobs = await Job.find({ _id: { $in: appliedJobIds } });

    // Extract common types, locations, etc.
    const jobTypes = [...new Set(appliedJobs.map((job) => job.type))];
    const locations = [...new Set(appliedJobs.map((job) => job.location))];

    // Find jobs with similar attributes but not already applied to
    const recommendations = await Job.find({
      _id: { $nin: appliedJobIds },
      $or: [{ type: { $in: jobTypes } }, { location: { $in: locations } }],
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error getting job recommendations:", error);
    res.status(500).json({ message: "Failed to get job recommendations" });
  }
};

// Make sure to export all the new functions
export {
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
};
