import Job from "../models/Job.js";

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
};
