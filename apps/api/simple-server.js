const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Helper function to validate Google Drive URLs
function isValidGoogleDriveUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  const googleDrivePatterns = [
    /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view(\?[^?]*)?$/,
    /^https:\/\/drive\.google\.com\/open\?id=[a-zA-Z0-9_-]+$/,
    /^https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+\/[^?]*(\?[^?]*)?$/
  ];
  
  return googleDrivePatterns.some(pattern => pattern.test(url));
}

const app = express();
const PORT = process.env.PORT || 3008;
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3004', 'http://localhost:3005'],
  credentials: true,
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Use environment variable for MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

const UserProfileSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  collegeEmail: { type: String, required: true },
  personalEmail: { type: String, required: true },
  collegeName: { type: String, required: true },
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
  isRegisteredInstitution: { type: Boolean, default: false },
  branch: { type: String, required: true },
  academicStartYear: { type: String, required: true },
  academicEndYear: { type: String, required: true },
  currentSemester: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  cgpa: { type: Number, required: true },
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    github: String,
    demo: String
  }],
  resumeUrl: String,
  marksMemoUrl: String,
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
  linkedinUrl: String,
  githubUrl: String,
  portfolioUrl: String,
  isOnboardingComplete: { type: Boolean, default: true },
  isEligibleForPlacements: { type: Boolean, default: true },
  profilePicture: String,
  dateOfBirth: Date,
  gender: String,
  parentName: String,
  parentPhone: String,
  tenthPercentage: Number,
  twelfthPercentage: Number,
  diplomaPercentage: Number,
  backlogs: { type: Number, default: 0 },
  // Semester-wise SGPA details
  semesterGrades: [{
    semester: { type: String, required: true }, // e.g., "1st Semester", "2nd Semester"
    sgpa: { type: Number, required: true, min: 0, max: 10 },
    credits: { type: Number }, // optional credits for weighted calculation
    subjects: [{ // optional subject-wise details
      name: String,
      grade: String,
      credits: Number
    }]
  }],
  isManualEntry: { type: Boolean, default: false },
  preferredLocations: [String],
  preferredCompanyTypes: [String],
  expectedSalary: String
}, { timestamps: true });

// Institution Schema
const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String },
  phone: { type: String },
  website: { type: String },
  coordinators: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    designation: { type: String, default: 'Placement Officer' },
    isMainCoordinator: { type: Boolean, default: false }
  }],
  allowAllStudents: { type: Boolean, default: false },
  authorizedStudents: [{
    name: String,
    email: String,
    rollNumber: String,
    branch: String,
    semester: String
  }],
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Institution = mongoose.model('Institution', institutionSchema);

// Job Schema
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  type: { type: String, required: true },
  experience: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  applicationDeadline: { type: Date, required: true },
  minCGPA: { type: Number, required: true },
  allowedBranches: [String],
  academicYear: [String],
  maxApplications: Number,
  isActive: { type: Boolean, default: true },
  postedBy: { type: String, required: true }, // Coordinator's clerk ID
  postedDate: { type: Date, default: Date.now },
  applicationsCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Application schema for tracking student applications
const ApplicationSchema = new mongoose.Schema({
  studentId: { type: String, required: true }, // Clerk user ID
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  // Student details for easy access and export
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  rollNumber: { type: String, required: true },
  branch: { type: String, required: true },
  cgpa: { type: Number, required: true },
  semester: { type: String, required: true },
  phone: String,
  resumeUrl: String,
  marksMemoUrl: String, // CMM URL for consolidated marks memo
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'shortlisted', 'selected', 'rejected'],
    default: 'pending'
  },
  appliedDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  notes: String
}, {
  timestamps: true
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
const Job = mongoose.model('Job', JobSchema);
const Application = mongoose.model('Application', ApplicationSchema);
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'placement-api'
  });
});
app.get('/db-test/status', async (req, res) => {
  try {
    const connectionStatus = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    res.json({
      status: 'ok',
      mongodb: {
        status: statusMap[connectionStatus],
        host: mongoose.connection.host,
        database: mongoose.connection.db?.databaseName,
        readyState: connectionStatus
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
app.post('/users/profile', async (req, res) => {
  try {
    const { clerkUserId, rollNumber } = req.body;
    if (!clerkUserId) {
      return res.status(400).json({
        error: 'clerkUserId is required',
        timestamp: new Date().toISOString()
      });
    }

    // Check if roll number already exists (for other users)
    if (rollNumber) {
      const existingUser = await UserProfile.findOne({ 
        rollNumber: rollNumber,
        clerkUserId: { $ne: clerkUserId } // Exclude current user
      });
      
      if (existingUser) {
        return res.status(409).json({
          error: 'Roll number already exists',
          message: 'A student with this roll number is already registered',
          timestamp: new Date().toISOString()
        });
      }
    }

    const profileData = {
      ...req.body,
      isOnboardingComplete: true
    };

    const savedProfile = await UserProfile.findOneAndUpdate(
      { clerkUserId: clerkUserId },
      profileData,
      { 
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json(savedProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    let statusCode = 500;
    let errorMessage = 'Failed to create profile';

    if (error.code === 11000) {
      // Handle duplicate key error
      if (error.keyPattern && error.keyPattern.rollNumber) {
        statusCode = 409;
        errorMessage = 'Roll number already exists';
      } else if (error.keyPattern && error.keyPattern.clerkUserId) {
        statusCode = 409;
        errorMessage = 'Profile already exists for this user';
      } else {
        statusCode = 409;
        errorMessage = 'Duplicate entry detected';
      }
    } else if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = 'Invalid profile data: ' + error.message;
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
app.get('/users/profile/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const profile = await UserProfile.findOne({ clerkUserId });
    if (!profile) {
      return res.status(404).json({
        error: 'User profile not found',
        timestamp: new Date().toISOString()
      });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Update user profile
app.put('/users/profile', async (req, res) => {
  try {
    const { clerkUserId } = req.body;
    if (!clerkUserId) {
      return res.status(400).json({
        error: 'clerkUserId is required',
        timestamp: new Date().toISOString()
      });
    }
    
    const updateData = { ...req.body };
    delete updateData.clerkUserId; // Don't update the clerkUserId itself
    
    // Validate Google Drive URL if provided
    if (updateData.resumeUrl && updateData.resumeUrl.trim() !== '') {
      if (!isValidGoogleDriveUrl(updateData.resumeUrl)) {
        return res.status(400).json({
          error: 'Please provide a valid Google Drive URL for Resume (e.g., https://drive.google.com/file/d/your-file-id/view)',
          timestamp: new Date().toISOString()
        });
      }
    }

    // Validate CMM Google Drive URL if provided
    if (updateData.marksMemoUrl && updateData.marksMemoUrl.trim() !== '') {
      if (!isValidGoogleDriveUrl(updateData.marksMemoUrl)) {
        return res.status(400).json({
          error: 'Please provide a valid Google Drive URL for CMM (e.g., https://drive.google.com/file/d/your-file-id/view)',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { clerkUserId: clerkUserId },
      updateData,
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({
        error: 'Profile not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    let statusCode = 500;
    let errorMessage = 'Failed to update profile';
    if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
    }
    res.status(statusCode).json({
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/users/profile/:clerkUserId/check-onboarding', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const profile = await UserProfile.findOne({ clerkUserId });
    if (!profile) {
      return res.json({
        isOnboardingComplete: false,
        hasProfile: false,
        timestamp: new Date().toISOString()
      });
    }
    res.json({
      isOnboardingComplete: profile.isOnboardingComplete,
      hasProfile: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    res.status(500).json({
      error: 'Failed to check onboarding status',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
app.get('/external/jobs', async (req, res) => {
  try {
    const { what = 'software engineer', where = 'bangalore', page = 1 } = req.query;
    
    // Note: You need to set ADZUNA_APP_ID and ADZUNA_API_KEY environment variables
    const appId = process.env.ADZUNA_APP_ID || 'demo_app_id';
    const apiKey = process.env.ADZUNA_API_KEY || 'demo_api_key';
    
    console.log('Environment check:');
    console.log('ADZUNA_APP_ID:', appId);
    console.log('ADZUNA_API_KEY:', apiKey ? apiKey.substring(0, 8) + '...' : 'undefined');
    
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/in/search/${page}`;
    const params = new URLSearchParams({
      app_id: appId,
      app_key: apiKey,
      results_per_page: '20',
      what: what,
      where: where,
      sort_by: 'relevance'
    });
    
    // For demo purposes, return mock data if no API keys are set
    if (appId === 'demo_app_id' || apiKey === 'demo_api_key') {
      console.log('Using demo data - API credentials not configured properly');
      return res.json({
        count: 5,
        results: [
          {
            id: 'ext_1',
            title: 'Senior Software Engineer',
            company: { display_name: 'Tech Solutions Pvt Ltd' },
            location: { display_name: 'Bangalore, Karnataka' },
            salary_min: 1200000,
            salary_max: 1800000,
            description: 'Looking for an experienced software engineer...',
            redirect_url: 'https://example.com/job/1',
            created: new Date().toISOString()
          },
          {
            id: 'ext_2', 
            title: 'Full Stack Developer',
            company: { display_name: 'InnovateLabs' },
            location: { display_name: 'Hyderabad, Telangana' },
            salary_min: 800000,
            salary_max: 1400000,
            description: 'Full stack developer with React and Node.js experience...',
            redirect_url: 'https://example.com/job/2',
            created: new Date().toISOString()
          }
        ]
      });
    }
    
    console.log('Making API call to Adzuna:', `${adzunaUrl}?${params}`);
    const response = await fetch(`${adzunaUrl}?${params}`);
    const data = await response.json();
    
    console.log('Adzuna API response status:', response.status);
    console.log('Jobs returned:', data.count || 0);
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching external jobs:', error);
    res.status(500).json({
      error: 'Failed to fetch external jobs',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ========================
// COORDINATOR ENDPOINTS
// ========================

// Get all jobs posted by coordinator
app.get('/coordinator/:coordinatorId/jobs', async (req, res) => {
  try {
    const { coordinatorId } = req.params;
    
    const jobs = await Job.find({ postedBy: coordinatorId })
      .sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching coordinator jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Create new job posting
app.post('/coordinator/jobs', async (req, res) => {
  try {
    const {
      title, company, location, salaryMin, salaryMax, experience,
      description, requirements, applicationDeadline, minCGPA, allowedBranches,
      academicYear, maxApplications, isActive, postedBy
    } = req.body;

    const salary = `₹${salaryMin}-${salaryMax} LPA`;
    
    const newJob = new Job({
      title, 
      company, 
      location, 
      salary, 
      type: 'on-campus', // Force on-campus type for coordinator-created jobs
      experience, 
      description,
      requirements, 
      applicationDeadline, 
      minCGPA, 
      allowedBranches,
      academicYear, 
      maxApplications, 
      isActive, 
      postedBy
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

// Update job posting
app.put('/coordinator/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;
    
    if (updateData.salaryMin && updateData.salaryMax) {
      updateData.salary = `₹${updateData.salaryMin}-${updateData.salaryMax} LPA`;
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job posting
app.delete('/coordinator/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const deletedJob = await Job.findByIdAndDelete(jobId);
    
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Also delete all applications for this job
    await Application.deleteMany({ jobId });

    res.json({ message: 'Job and associated applications deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// Get applications for a specific job
app.get('/coordinator/jobs/:jobId/applications', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const applications = await Application.find({ jobId })
      .populate('jobId', 'title company')
      .sort({ appliedDate: -1 });

    // Get student profiles for each application
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        try {
          const studentProfile = await UserProfile.findOne({ clerkUserId: app.studentId });
          return {
            ...app.toObject(),
            studentName: studentProfile ? `${studentProfile.firstName} ${studentProfile.lastName}` : 'Unknown',
            studentEmail: studentProfile?.email || 'Unknown',
            rollNumber: studentProfile?.rollNumber || 'Unknown',
            cgpa: studentProfile?.cgpa || 0,
            branch: studentProfile?.rollNumber?.substring(2, 4) === 'CS' ? 'CSE' : 
                   studentProfile?.rollNumber?.substring(2, 4) === 'IT' ? 'IT' : 'Unknown',
            semester: studentProfile?.currentSemester || 'Unknown'
          };
        } catch (err) {
          console.error('Error enriching application:', err);
          return app.toObject();
        }
      })
    );

    res.json(enrichedApplications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get all applications for coordinator's jobs
app.get('/coordinator/:coordinatorId/applications', async (req, res) => {
  try {
    const { coordinatorId } = req.params;
    
    // First get all jobs posted by this coordinator
    const coordinatorJobs = await Job.find({ postedBy: coordinatorId });
    const jobIds = coordinatorJobs.map(job => job._id);
    
    // Then get all applications for those jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId', 'title company')
      .sort({ appliedDate: -1 });

    // Enrich with student data
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        try {
          const studentProfile = await UserProfile.findOne({ clerkUserId: app.studentId });
          const appObj = app.toObject();
          return {
            ...appObj,
            id: appObj._id.toString(), // Ensure id field is available
            studentName: studentProfile ? `${studentProfile.firstName} ${studentProfile.lastName}` : 'Unknown',
            studentEmail: studentProfile?.email || 'Unknown',
            rollNumber: studentProfile?.rollNumber || 'Unknown',
            cgpa: studentProfile?.cgpa || 0,
            branch: studentProfile?.rollNumber?.substring(2, 4) === 'CS' ? 'CSE' : 
                   studentProfile?.rollNumber?.substring(2, 4) === 'IT' ? 'IT' : 'Unknown',
            semester: studentProfile?.currentSemester || 'Unknown',
            jobTitle: app.jobId?.title + ' - ' + app.jobId?.company
          };
        } catch (err) {
          console.error('Error enriching application:', err);
          const appObj = app.toObject();
          return {
            ...appObj,
            id: appObj._id.toString() // Ensure id field is available even on error
          };
        }
      })
    );

    res.json(enrichedApplications);
  } catch (error) {
    console.error('Error fetching coordinator applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Update application status
app.put('/coordinator/applications/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    console.log('Updating application status:', {
      applicationId,
      status,
      notes,
      requestBody: req.body
    });

    // Validate status value
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'selected', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status value', 
        validStatuses,
        received: status
      });
    }

    // Check if application exists first
    const existingApplication = await Application.findById(applicationId);
    if (!existingApplication) {
      console.log('Application not found:', applicationId);
      return res.status(404).json({ error: 'Application not found' });
    }

    console.log('Existing application before update:', {
      id: existingApplication._id,
      currentStatus: existingApplication.status,
      studentId: existingApplication.studentId,
      jobId: existingApplication.jobId
    });

    // Update the application
    const updateData = { 
      status, 
      lastUpdated: new Date() 
    };
    
    if (notes) {
      updateData.notes = notes;
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true, runValidators: true }
    ).populate('jobId', 'title company');

    if (!updatedApplication) {
      console.log('Failed to update application:', applicationId);
      return res.status(500).json({ error: 'Failed to update application in database' });
    }

    console.log('Successfully updated application:', {
      id: updatedApplication._id,
      newStatus: updatedApplication.status,
      lastUpdated: updatedApplication.lastUpdated
    });

    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ 
      error: 'Failed to update application status',
      details: error.message 
    });
  }
});

// Delete application (for coordinators)
app.delete('/coordinator/applications/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;

    console.log('Deleting application:', { applicationId });

    if (!applicationId) {
      console.log('Application ID is missing');
      return res.status(400).json({ error: 'Application ID is required' });
    }

    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      console.log('Application not found:', applicationId);
      return res.status(404).json({ error: 'Application not found' });
    }

    // Delete the application
    await Application.findByIdAndDelete(applicationId);

    console.log('Successfully deleted application:', applicationId);
    res.json({ message: 'Application deleted successfully', deletedId: applicationId });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ 
      error: 'Failed to delete application',
      details: error.message 
    });
  }
});

// Student Management Endpoints (for coordinators)
// Get all students for an institution
app.get('/coordinator/students/:institutionId', async (req, res) => {
  try {
    const { institutionId } = req.params;
    console.log('Fetching students for institution:', institutionId);
    
    // Find students by institutionId OR by collegeName matching institution
    const institution = await Institution.findById(institutionId);
    console.log('Institution found:', institution?.name);
    
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }
    
    // Create flexible query to match students in multiple ways
    let query = { 
      $or: [
        // Direct institution ID match
        { institutionId: institutionId },
        // Exact college name match
        { collegeName: institution.name },
        // Case-insensitive college name match
        { collegeName: { $regex: new RegExp(institution.name, 'i') } },
        // Match by domain (if email ends with institution domain)
        ...(institution.domain ? [{ email: { $regex: new RegExp(`@${institution.domain}$`, 'i') } }] : []),
        // Match by any of the institution's alternative names if they exist
        ...(institution.alternativeNames ? 
          institution.alternativeNames.map(altName => ({ 
            collegeName: { $regex: new RegExp(altName, 'i') } 
          })) : []
        )
      ]
    };
    
    const students = await UserProfile.find(query).sort({ firstName: 1 });
    console.log(`Found ${students.length} students for institution ${institutionId}`);
    
    // Check for duplicate roll numbers and flag them
    const rollNumberMap = new Map();
    const duplicateRollNumbers = new Set();
    
    students.forEach(student => {
      if (student.rollNumber) {
        if (rollNumberMap.has(student.rollNumber)) {
          duplicateRollNumbers.add(student.rollNumber);
        } else {
          rollNumberMap.set(student.rollNumber, student);
        }
      }
    });
    
    if (duplicateRollNumbers.size > 0) {
      console.warn('Duplicate roll numbers found:', Array.from(duplicateRollNumbers));
    }

    const studentsData = students.map(student => ({
      id: student._id,
      name: `${student.firstName} ${student.lastName}`,
      email: student.email,
      rollNumber: student.rollNumber,
      branch: student.branch || 'Not specified',
      semester: student.currentSemester,
      cgpa: student.cgpa,
      phone: student.mobileNumber,
      dateOfBirth: student.dateOfBirth,
      address: student.address,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      resumeUrl: student.resumeUrl,
      marksMemoUrl: student.marksMemoUrl,
      registeredDate: student.createdAt,
      isVerified: true,
      tenthPercentage: student.tenthPercentage,
      twelfthPercentage: student.twelfthPercentage,
      diplomaPercentage: student.diplomaPercentage,
      backlogs: student.backlogs,
      isDuplicate: duplicateRollNumbers.has(student.rollNumber),
      // Add metadata about how the student was matched
      matchType: student.institutionId === institutionId ? 'direct' : 
                 student.collegeName === institution.name ? 'collegeName' : 'inferred'
    }));

    res.json(studentsData);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Add new student (manual entry by coordinator)
app.post('/coordinator/students', async (req, res) => {
  try {
    const {
      name,
      email,
      rollNumber,
      branch,
      semester,
      cgpa,
      phone,
      dateOfBirth,
      address,
      parentName,
      parentPhone,
      tenthPercentage,
      twelfthPercentage,
      diplomaPercentage,
      backlogs,
      institutionId
    } = req.body;

    // Check if student already exists
    const existingStudent = await UserProfile.findOne({ 
      $or: [
        { email: email },
        { rollNumber: rollNumber }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({ 
        error: 'Student with this email or roll number already exists' 
      });
    }

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Student';

    // Create a placeholder clerk user ID for manually added students
    const clerkUserId = `manual_${rollNumber}_${Date.now()}`;

    const newStudent = new UserProfile({
      clerkUserId: clerkUserId,
      email: email,
      firstName: firstName,
      lastName: lastName,
      rollNumber: rollNumber,
      age: dateOfBirth ? new Date().getFullYear() - new Date(dateOfBirth).getFullYear() : 20,
      address: address || '',
      collegeEmail: email,
      personalEmail: email,
      collegeName: 'Institution Student', // Will be filled from institution data
      institutionId: institutionId,
      isRegisteredInstitution: true,
      branch: branch,
      academicStartYear: new Date().getFullYear() - 2, // Default estimation
      academicEndYear: new Date().getFullYear() + 2,   // Default estimation
      currentSemester: semester,
      mobileNumber: phone || '',
      cgpa: parseFloat(cgpa),
      projects: [],
      certifications: [],
      skills: [],
      achievements: [],
      dateOfBirth: dateOfBirth,
      parentName: parentName,
      parentPhone: parentPhone,
      tenthPercentage: tenthPercentage ? parseFloat(tenthPercentage) : undefined,
      twelfthPercentage: twelfthPercentage ? parseFloat(twelfthPercentage) : undefined,
      diplomaPercentage: diplomaPercentage ? parseFloat(diplomaPercentage) : undefined,
      backlogs: backlogs ? parseInt(backlogs) : 0,
      isManualEntry: true // Flag to identify manually added students
    });

    const savedStudent = await newStudent.save();
    res.status(201).json({ 
      message: 'Student added successfully',
      student: {
        id: savedStudent._id,
        name: `${savedStudent.firstName} ${savedStudent.lastName}`,
        email: savedStudent.email,
        rollNumber: savedStudent.rollNumber,
        branch: savedStudent.branch
      }
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Update student details
app.put('/coordinator/students/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.clerkUserId;
    delete updateData._id;
    delete updateData.id;

    const updatedStudent = await UserProfile.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
app.delete('/coordinator/students/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    const deletedStudent = await UserProfile.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Cleanup duplicate roll numbers
app.post('/coordinator/cleanup-duplicates/:institutionId', async (req, res) => {
  try {
    const { institutionId } = req.params;
    
    // Find all students for this institution
    const institution = await Institution.findById(institutionId);
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }
    
    let query = { 
      $or: [
        { institutionId: institutionId },
        { collegeName: institution.name },
        { collegeName: { $regex: new RegExp(institution.name, 'i') } }
      ]
    };
    
    const students = await UserProfile.find(query);
    
    // Group by roll number
    const rollNumberGroups = {};
    students.forEach(student => {
      if (student.rollNumber) {
        if (!rollNumberGroups[student.rollNumber]) {
          rollNumberGroups[student.rollNumber] = [];
        }
        rollNumberGroups[student.rollNumber].push(student);
      }
    });
    
    // Find duplicates and keep the most recent one
    let duplicatesRemoved = 0;
    for (const [rollNumber, studentGroup] of Object.entries(rollNumberGroups)) {
      if (studentGroup.length > 1) {
        // Sort by creation date, keep the most recent
        studentGroup.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const toKeep = studentGroup[0];
        const toRemove = studentGroup.slice(1);
        
        console.log(`Roll number ${rollNumber}: keeping ${toKeep._id}, removing ${toRemove.length} duplicates`);
        
        // Remove duplicates
        for (const duplicate of toRemove) {
          await UserProfile.findByIdAndDelete(duplicate._id);
          duplicatesRemoved++;
        }
      }
    }
    
    res.json({ 
      message: `Cleanup completed. Removed ${duplicatesRemoved} duplicate entries.`,
      duplicatesRemoved
    });
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({ error: 'Failed to cleanup duplicates' });
  }
});

// Export applications for a specific job in Excel format
app.get('/coordinator/jobs/:jobId/applications/export', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Get all applications for this job
    const applications = await Application.find({ jobId: jobId })
      .sort({ appliedDate: -1 });
    
    if (applications.length === 0) {
      return res.status(404).json({ error: 'No applications found for this job' });
    }
    
    // Format data for Excel export
    const exportData = applications.map((app, index) => ({
      'S.No': index + 1,
      'Student Name': app.studentName,
      'Email': app.studentEmail,
      'Roll Number': app.rollNumber,
      'Branch': app.branch,
      'Semester': app.semester,
      'CGPA': app.cgpa,
      'Phone': app.phone || 'Not provided',
      'Applied Date': new Date(app.appliedDate).toLocaleDateString('en-IN'),
      'Status': app.status.charAt(0).toUpperCase() + app.status.slice(1),
      'Resume URL': app.resumeUrl || 'Not provided',
      'CMM URL': app.marksMemoUrl || 'Not provided', // Consolidated Marks Memo
      'Notes': app.notes || 'No notes'
    }));
    
    // Set response headers for Excel download
    const fileName = `${job.title.replace(/[^a-zA-Z0-9]/g, '_')}_Applications_${new Date().toISOString().split('T')[0]}.json`;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Send the data - frontend will handle Excel conversion
    res.json({
      jobTitle: job.title,
      company: job.company,
      exportDate: new Date().toISOString(),
      totalApplications: applications.length,
      data: exportData
    });
    
  } catch (error) {
    console.error('Error exporting applications:', error);
    res.status(500).json({ error: 'Failed to export applications' });
  }
});

// Student applies to a job
// Institution Routes

// Register new institution
app.post('/institutions/register', async (req, res) => {
  try {
    console.log('Institution registration request received:', JSON.stringify(req.body, null, 2));
    
    const {
      coordinatorName,
      coordinatorEmail,
      institutionName,
      institutionAddress,
      institutionCity,
      institutionState,
      institutionPincode,
      institutionPhone,
      institutionWebsite,
      placementOfficers,
      allowAllStudents,
      studentData
    } = req.body;

    // Validate required fields
    if (!coordinatorName || !coordinatorEmail || !institutionName || !institutionAddress || !institutionCity || !institutionState) {
      console.log('Missing required fields:', {
        coordinatorName: !!coordinatorName,
        coordinatorEmail: !!coordinatorEmail,
        institutionName: !!institutionName,
        institutionAddress: !!institutionAddress,
        institutionCity: !!institutionCity,
        institutionState: !!institutionState
      });
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['coordinatorName', 'coordinatorEmail', 'institutionName', 'institutionAddress', 'institutionCity', 'institutionState']
      });
    }

    // Check if institution already exists
    const existingInstitution = await Institution.findOne({ 
      name: institutionName,
      city: institutionCity 
    });

    if (existingInstitution) {
      console.log('Institution already exists:', institutionName, institutionCity);
      return res.status(400).json({ message: 'Institution already registered' });
    }

    // Prepare coordinators array - handle both array and non-array cases
    let coordinators = [];
    
    if (placementOfficers && Array.isArray(placementOfficers)) {
      coordinators = placementOfficers
        .filter(officer => officer.name && officer.email) // Only include officers with name and email
        .map((officer, index) => ({
          name: officer.name,
          email: officer.email,
          designation: officer.designation || 'Placement Officer',
          isMainCoordinator: index === 0 // First officer is main coordinator
        }));
    }

    // Add the main coordinator if not in the list
    const mainCoordinatorExists = coordinators.some(coord => coord.email === coordinatorEmail);
    if (!mainCoordinatorExists) {
      coordinators.unshift({
        name: coordinatorName,
        email: coordinatorEmail,
        designation: 'Placement Coordinator',
        isMainCoordinator: true
      });
    }

    console.log('Prepared coordinators:', coordinators);

    // Prepare student data - ensure it's an array
    const authorizedStudents = Array.isArray(studentData) ? studentData : [];
    
    console.log('Creating institution with data:', {
      name: institutionName,
      address: institutionAddress,
      city: institutionCity,
      state: institutionState,
      coordinatorsCount: coordinators.length,
      allowAllStudents,
      authorizedStudentsCount: authorizedStudents.length
    });

    const institution = new Institution({
      name: institutionName,
      address: institutionAddress,
      city: institutionCity,
      state: institutionState,
      pincode: institutionPincode || '',
      phone: institutionPhone || '',
      website: institutionWebsite || '',
      coordinators,
      allowAllStudents: !!allowAllStudents,
      authorizedStudents,
      isApproved: true // Auto-approve for now
    });

    const savedInstitution = await institution.save();
    console.log('Institution saved successfully:', savedInstitution._id);

    res.status(201).json({
      message: 'Institution registered successfully',
      institutionId: savedInstitution._id,
      institution: {
        name: savedInstitution.name,
        city: savedInstitution.city,
        state: savedInstitution.state
      }
    });
  } catch (error) {
    console.error('Institution registration error:', error);
    console.error('Error stack:', error.stack);
    
    // Send more detailed error information
    let errorMessage = 'Failed to register institution';
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ');
    } else if (error.code === 11000) {
      statusCode = 400;
      errorMessage = 'Institution with this name and city already exists';
    }

    res.status(statusCode).json({ 
      message: errorMessage,
      error: error.message,
      details: error.name === 'ValidationError' ? error.errors : undefined
    });
  }
});

// Get all institutions
app.get('/institutions', async (req, res) => {
  try {
    const institutions = await Institution.find({ isApproved: true })
      .select('name city state')
      .sort({ name: 1 });

    res.json(institutions);
  } catch (error) {
    console.error('Get institutions error:', error);
    res.status(500).json({ message: 'Failed to fetch institutions' });
  }
});

// Get institution by ID
app.get('/institutions/:id', async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);
    
    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    res.json(institution);
  } catch (error) {
    console.error('Get institution error:', error);
    res.status(500).json({ message: 'Failed to fetch institution' });
  }
});

// Check if user is authorized coordinator
app.post('/institutions/verify-coordinator', async (req, res) => {
  try {
    const { email } = req.body;

    const institution = await Institution.findOne({
      'coordinators.email': email,
      isApproved: true
    });

    if (!institution) {
      return res.status(404).json({ message: 'Coordinator not found' });
    }

    const coordinator = institution.coordinators.find(coord => coord.email === email);

    res.json({
      isCoordinator: true,
      institution: {
        id: institution._id,
        name: institution.name,
        city: institution.city,
        state: institution.state,
        address: institution.address,
        phone: institution.phone,
        website: institution.website
      },
      coordinatorInfo: coordinator
    });
  } catch (error) {
    console.error('Verify coordinator error:', error);
    res.status(500).json({ message: 'Failed to verify coordinator' });
  }
});

// Check if student is authorized to register
app.post('/institutions/verify-student', async (req, res) => {
  try {
    const { email, institutionId } = req.body;

    const institution = await Institution.findById(institutionId);

    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    // If institution allows all students
    if (institution.allowAllStudents) {
      return res.json({ isAuthorized: true, institution });
    }

    // Check if student is in authorized list
    const isAuthorized = institution.authorizedStudents.some(
      student => student.email === email
    );

    res.json({ 
      isAuthorized, 
      institution: isAuthorized ? institution : null 
    });
  } catch (error) {
    console.error('Verify student error:', error);
    res.status(500).json({ message: 'Failed to verify student' });
  }
});

// Student Routes

app.post('/student/apply/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { studentId } = req.body;

    // Check if student has already applied
    const existingApplication = await Application.findOne({ studentId, jobId });
    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }

    // Check job eligibility (CGPA, branch, etc.)
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const studentProfile = await UserProfile.findOne({ clerkUserId: studentId });
    if (!studentProfile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Check CGPA requirement
    if (studentProfile.cgpa < job.minCGPA) {
      return res.status(400).json({ 
        error: `CGPA requirement not met. Required: ${job.minCGPA}, Your CGPA: ${studentProfile.cgpa}` 
      });
    }

    // Check application deadline
    if (new Date() > new Date(job.applicationDeadline)) {
      return res.status(400).json({ error: 'Application deadline has passed' });
    }

    // Check max applications limit
    if (job.maxApplications) {
      const currentApplicationsCount = await Application.countDocuments({ jobId });
      if (currentApplicationsCount >= job.maxApplications) {
        return res.status(400).json({ error: 'Maximum applications limit reached' });
      }
    }

    // Create application with student details for easier export
    const newApplication = new Application({
      studentId,
      jobId,
      studentName: `${studentProfile.firstName} ${studentProfile.lastName}`,
      studentEmail: studentProfile.email,
      rollNumber: studentProfile.rollNumber,
      branch: studentProfile.branch,
      cgpa: studentProfile.cgpa,
      semester: studentProfile.currentSemester,
      phone: studentProfile.mobileNumber,
      resumeUrl: studentProfile.resumeUrl,
      marksMemoUrl: studentProfile.marksMemoUrl, // CMM URL
      status: 'pending',
      appliedDate: new Date()
    });

    const savedApplication = await newApplication.save();

    // Update job applications count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    res.status(201).json(savedApplication);
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get student's applications
app.get('/student/:studentId/applications', async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log('Fetching applications for student:', studentId);
    
    // Find applications by student ID (clerk user ID)
    const applications = await Application.find({ studentId: studentId })
      .populate('jobId')
      .sort({ appliedDate: -1 });
      
    console.log(`Found ${applications.length} applications for student ${studentId}`);

    if (applications.length === 0) {
      return res.json([]);
    }

    const applicationsData = applications.map(app => {
      if (!app.jobId) {
        console.warn('Application with missing job details:', app._id);
        return {
          id: app._id,
          jobId: null,
          jobTitle: 'Job not found',
          company: 'Unknown',
          location: 'Not specified',
          salary: 'Not disclosed',
          appliedDate: app.appliedDate,
          status: app.status === 'selected' ? 'accepted' : app.status, // Map 'selected' to 'accepted' for student view
          lastUpdate: app.lastUpdated || app.appliedDate,
          interviewDate: app.interviewDate,
          notes: app.notes,
          isOnCampus: false
        };
      }

      return {
        id: app._id,
        jobId: app.jobId._id,
        jobTitle: app.jobId.title,
        company: app.jobId.company,
        location: app.jobId.location,
        salary: app.jobId.salary,
        appliedDate: app.appliedDate,
        status: app.status === 'selected' ? 'accepted' : app.status, // Map 'selected' to 'accepted' for student view
        lastUpdate: app.lastUpdated || app.appliedDate,
        interviewDate: app.interviewDate,
        notes: app.notes,
        isOnCampus: app.jobId.isOnCampus || false
      };
    });

    res.json(applicationsData);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get on-campus jobs for students
app.get('/student/jobs', async (req, res) => {
  try {
    const { branch, academicYear, cgpa, clerkUserId } = req.query;
    
    // Check if student is from registered institution
    let isFromRegisteredInstitution = false;
    if (clerkUserId) {
      const student = await UserProfile.findOne({ clerkUserId: clerkUserId });
      if (student) {
        isFromRegisteredInstitution = student.isRegisteredInstitution;
      }
    }
    
    let query = { isActive: true, applicationDeadline: { $gte: new Date() } };
    
    // If student is not from registered institution, only show external jobs
    if (!isFromRegisteredInstitution) {
      query.type = 'external'; // Assuming we have a type field to distinguish job types
    }
    
    // Filter by eligibility if provided
    if (branch) {
      query.allowedBranches = { $in: [branch] };
    }
    
    if (academicYear) {
      query.academicYear = { $in: [academicYear] };
    }
    
    if (cgpa) {
      query.minCGPA = { $lte: parseFloat(cgpa) };
    }

    const jobs = await Job.find(query).sort({ postedDate: -1 });
    
    // Add access level information to response
    const response = {
      jobs: jobs,
      accessLevel: {
        isFromRegisteredInstitution: isFromRegisteredInstitution,
        canAccessOnCampusJobs: isFromRegisteredInstitution,
        message: isFromRegisteredInstitution 
          ? 'You have access to both on-campus and external job opportunities.' 
          : 'You can only access external job opportunities. To access on-campus jobs, your institution must be registered with PlacementPro.'
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching student jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.db.databaseName);
    
    // Setup file uploads directory
    const uploadsDir = path.join(__dirname, 'uploads', 'resumes');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Setup multer for file uploads
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadsDir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });
    
    const upload = multer({ 
      storage: storage,
      fileFilter: function (req, file, cb) {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const extname = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(extname)) {
          return cb(null, true);
        } else {
          cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
      }
    });
    
    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    
    // Resume upload endpoint
    app.post('/upload/resume', upload.single('resume'), (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const resumeUrl = `/uploads/resumes/${req.file.filename}`;
        res.json({ 
          success: true, 
          resumeUrl: resumeUrl,
          filename: req.file.filename,
          originalName: req.file.originalname 
        });
      } catch (error) {
        console.error('Resume upload error:', error);
        res.status(500).json({ error: 'Failed to upload resume' });
      }
    });
    
    // Resume download/view endpoint
    app.get('/resumes/:filename', (req, res) => {
      try {
        const filename = req.params.filename;
        const filepath = path.join(uploadsDir, filename);
        
        if (!fs.existsSync(filepath)) {
          return res.status(404).json({ error: 'Resume not found' });
        }
        
        res.sendFile(filepath);
      } catch (error) {
        console.error('Resume view error:', error);
        res.status(500).json({ error: 'Failed to load resume' });
      }
    });
    
    console.log('File upload system initialized');
    console.log('Uploads directory:', uploadsDir);
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`API Server running on http://localhost:${PORT}`);
      console.log('Available endpoints:');
      console.log('  GET  /health');
      console.log('  GET  /db-test/status');
      console.log('  POST /users/profile');
      console.log('  PUT  /users/profile');
      console.log('  GET  /users/profile/:clerkUserId');
      console.log('  GET  /users/profile/:clerkUserId/check-onboarding');
      console.log('  GET  /external/jobs');
      console.log('  -- INSTITUTION ENDPOINTS --');
      console.log('  POST /institutions/register');
      console.log('  GET  /institutions');
      console.log('  GET  /institutions/:id');
      console.log('  POST /institutions/verify-coordinator');
      console.log('  POST /institutions/verify-student');
      console.log('  -- COORDINATOR ENDPOINTS --');
      console.log('  GET  /coordinator/:coordinatorId/jobs');
      console.log('  POST /coordinator/jobs');
      console.log('  PUT  /coordinator/jobs/:jobId');
      console.log('  DELETE /coordinator/jobs/:jobId');
      console.log('  GET  /coordinator/jobs/:jobId/applications');
      console.log('  GET  /coordinator/jobs/:jobId/applications/export');
      console.log('  GET  /coordinator/:coordinatorId/applications');
      console.log('  PUT  /coordinator/applications/:applicationId/status');
      console.log('  DELETE /coordinator/applications/:applicationId');
      console.log('  GET  /coordinator/students/:institutionId');
      console.log('  POST /coordinator/students');
      console.log('  PUT  /coordinator/students/:studentId');
      console.log('  DELETE /coordinator/students/:studentId');
      console.log('  -- STUDENT ENDPOINTS --');
      console.log('  GET  /student/jobs');
      console.log('  POST /student/apply/:jobId');
      console.log('  GET  /student/:studentId/applications');
    });
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
process.on('SIGINT', async () => {
  console.log('\nDisconnecting from MongoDB...');
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
  process.exit(0);
});
process.on('SIGTERM', async () => {
  console.log('\nDisconnecting from MongoDB...');
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
  process.exit(0);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
startServer();
