import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  collegeEmail: { type: String, required: true, unique: true },
  personalEmail: { type: String, required: true },
  collegeName: { type: String, required: true },
  academicYear: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  cgpa: { type: Number, required: true },
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    github: String,
    demo: String
  }],
  resumeUrl: { type: String },
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    credentialId: String,
    url: String,
    mediaUrl: String
  }],
  skills: [String],
  achievements: [String],
  education: [{
    degree: String,
    institution: String,
    year: String,
    percentage: Number
  }],
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String
  },
  isProfileComplete: { type: Boolean, default: false },
  profileCompletedAt: { type: Date }
}, {
  timestamps: true
});

export const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);
