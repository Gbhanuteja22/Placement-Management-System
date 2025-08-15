import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: String, required: true }, // Clerk ID
  status: { 
    type: String, 
    enum: ['applied', 'shortlisted', 'interview_scheduled', 'interview_completed', 'selected', 'rejected'],
    default: 'applied'
  },
  appliedAt: { type: Date, default: Date.now },
  interviewDetails: {
    date: Date,
    time: String,
    venue: String,
    interviewerName: String,
    meetingLink: String,
    feedback: String
  },
  documents: {
    resumeUrl: String,
    coverLetterUrl: String,
    additionalDocs: [String]
  },
  notes: { type: String }
}, {
  timestamps: true
});

export const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
