import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, default: null },

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    // Add user preferences for job recommendations
    preferences: {
      jobTypes: [String],
      locations: [String],
      desiredSalary: Number,
    },
    // Add user role for admin features
    role: {
      type: String,
      enum: ["user", "employer", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
