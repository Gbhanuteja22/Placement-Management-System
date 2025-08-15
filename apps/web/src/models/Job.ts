import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  type: { type: String, required: true }, // Full-time, Part-time, Internship
  experience: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  eligibilityCriteria: {
    minCGPA: { type: Number, required: true },
    allowedBranches: [String],
    academicYear: [String]
  },
  isOnCampus: { type: Boolean, default: false },
  externalUrl: { type: String }, // For external job redirects
  postedBy: { type: String }, // Admin/Coordinator clerk ID
  applicants: [{ type: String }], // Array of clerk IDs
  maxApplicants: { type: Number },
  applicationDeadline: { type: Date },
  rating: { type: Number, default: 0 },
  employees: { type: String },
  urgent: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
