import Job from "../models/jobs.js";

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
            pagination:{
                currentPage: parseInt(page),
                limit: parseInt(limit),
                totalPages,
                totalJobs,
            }
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
        const newJob = new Job({ title, description, type, location, company, salary, postedBy: userId });
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
        console.log("Wildcard:", wildcard);

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

        if (job.postedBy.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const updatedJob = await Job.findByIdAndUpdate(jobId, updates, { new: true, runValidators: true });
        res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ message: "Failed to update job" });
    }
};


//TODO: Perform delete job handler!

export { getJobs, postJob, getJobById, updateJob };
