import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '../utils/toast';
import { applicationsApi } from '../services/api';
import { 
  GraduationCap, 
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Calendar,
  Users,
  Star,
  CheckCircle,
  BookmarkCheck,
  Bookmark,
  ExternalLink,
  FileText,
  Award,
  Target,
  Briefcase
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  posted: string;
  description: string;
  requirements: string[];
  rating?: number;
  employees?: string;
  urgent?: boolean;
  isOnCampus?: boolean;
  externalUrl?: string;
  applyUrl?: string;
  minCGPA?: number;
  allowedBranches?: string[];
  academicYear?: string[];
  applicationDeadline?: string;
}

export default function JobDetailPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
      checkApplicationStatus();
    }
  }, [jobId, user]);

  const loadJobDetails = async () => {
    try {
      setIsLoading(true);
      console.log('Loading job details for ID:', jobId);
      
      // First try to get from student jobs endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/student/jobs?clerkUserId=${user?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        const allJobs = data.jobs || [];
        
        // Find the specific job
        const foundJob = allJobs.find((j: any) => j._id === jobId || j.id === jobId);
        
        if (foundJob) {
          const jobData: Job = {
            id: foundJob._id || foundJob.id,
            title: foundJob.title,
            company: foundJob.company,
            location: foundJob.location,
            salary: foundJob.salary,
            type: foundJob.type,
            experience: foundJob.experience,
            posted: foundJob.postedDate || foundJob.posted,
            description: foundJob.description,
            requirements: foundJob.requirements || [],
            rating: foundJob.rating,
            employees: foundJob.employees,
            urgent: foundJob.urgent,
            isOnCampus: foundJob.isOnCampus,
            externalUrl: foundJob.externalUrl,
            applyUrl: foundJob.applyUrl,
            minCGPA: foundJob.minCGPA,
            allowedBranches: foundJob.allowedBranches,
            academicYear: foundJob.academicYear,
            applicationDeadline: foundJob.applicationDeadline
          };
          setJob(jobData);
        } else {
          toast.error('Job not found');
          navigate('/jobs');
        }
      }
    } catch (error) {
      console.error('Error loading job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      if (user?.id) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/student/${user.id}/applications`);
        if (response.ok) {
          const applications = await response.json();
          const applied = applications.some((app: any) => app.jobId === jobId);
          setHasApplied(applied);
        }
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApply = async () => {
    if (!user?.id || !job) return;

    try {
      setIsApplying(true);
      
      if (job.externalUrl) {
        // External job - open external URL
        window.open(job.applyUrl || job.externalUrl, '_blank');
        toast.info('Redirected to external application page');
      } else {
        // Internal job - apply via API
        await applicationsApi.create({
          jobId: job.id,
          userId: user.id
        });
        
        setHasApplied(true);
        toast.success('Application submitted successfully!');
      }
    } catch (error: any) {
      console.error('Error applying to job:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to apply to job';
      toast.error(errorMessage);
    } finally {
      setIsApplying(false);
    }
  };

  const toggleSaveJob = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Job removed from saved' : 'Job saved successfully!');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PlacementPro
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/jobs')}
                className="text-blue-600 font-medium px-3 py-2 rounded-md text-sm"
              >
                Jobs
              </button>
              <button 
                onClick={() => navigate('/applications')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Applications
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Profile
              </button>
            </nav>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user?.firstName} {user?.lastName}
              </span>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            >
              {/* Job Header */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                      {job.urgent && (
                        <span className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                          Urgent
                        </span>
                      )}
                      {job.isOnCampus && (
                        <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                          On-Campus
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Building className="w-5 h-5" />
                        <span className="text-lg font-medium">{job.company}</span>
                      </div>
                      {job.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{job.rating}</span>
                        </div>
                      )}
                      {job.employees && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{job.employees} employees</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{getTimeAgo(job.posted)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Job Description
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Eligibility Criteria */}
              {(job.minCGPA || job.allowedBranches || job.academicYear) && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Eligibility Criteria
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {job.minCGPA && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-blue-900">Minimum CGPA</div>
                        <div className="text-lg font-bold text-blue-600">{job.minCGPA}</div>
                      </div>
                    )}
                    {job.allowedBranches && job.allowedBranches.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-green-900">Allowed Branches</div>
                        <div className="text-sm text-green-700 mt-1">
                          {job.allowedBranches.join(', ')}
                        </div>
                      </div>
                    )}
                    {job.academicYear && job.academicYear.length > 0 && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-purple-900">Academic Year</div>
                        <div className="text-sm text-purple-700 mt-1">
                          {job.academicYear.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24"
            >
              {/* Application Deadline */}
              {job.applicationDeadline && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-orange-800">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Application Deadline</span>
                  </div>
                  <p className="text-orange-700 mt-1">{formatDate(job.applicationDeadline)}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleApply}
                  disabled={isApplying || hasApplied}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    hasApplied
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : isApplying
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Applied</span>
                    </>
                  ) : isApplying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                      <span>Applying...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>Apply Now</span>
                    </>
                  )}
                </button>

                <button
                  onClick={toggleSaveJob}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="w-5 h-5" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-5 h-5" />
                      <span>Save Job</span>
                    </>
                  )}
                </button>

                {job.externalUrl && (
                  <button
                    onClick={() => window.open(job.externalUrl, '_blank')}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>View Original</span>
                  </button>
                )}
              </div>

              {/* Job Info */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Job Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Experience Level</span>
                    <span className="text-gray-900">{job.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Job Type</span>
                    <span className="text-gray-900">{job.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Posted</span>
                    <span className="text-gray-900">{getTimeAgo(job.posted)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
