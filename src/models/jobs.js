import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: { type: String },
    resume: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true },
);

// Create a schema for job reports
const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: { type: String, required: true },
    details: { type: String },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    company: { type: String, required: true },
    salary: { type: Number },
    // Add fields for new features
    featured: { type: Boolean, default: false },
    // Track views count for popularity metrics
    viewsCount: { type: Number, default: 0 },
    // Store categories/tags for better search
    categories: [String],
    tags: [String],
    // Add requirements, benefits, etc.
    requirements: [String],
    benefits: [String],
    // Add contact information
    contactEmail: { type: String },
    contactPhone: { type: String },
    // Add deadline for applications
    applicationDeadline: { type: Date },
    // Add state for if the job is still active
    isActive: { type: Boolean, default: true },
    // Track the applications for this job
    applications: [applicationSchema],
    // Store reports about this job
    reports: [reportSchema],
    // Reference to the user who posted the job
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Add text index for better searching
jobSchema.index({
  title: "text",
  description: "text",
  company: "text",
  location: "text",
});

const Job = mongoose.model("Job", jobSchema);

// Also create an Application model to support the application functionality
const Application = mongoose.model("Application", applicationSchema);

export { Job, Application };
export default Job;
