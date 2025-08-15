import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '../utils/toast';
import { applicationsApi } from '../services/api';
import { 
  GraduationCap, 
  Search, 
  MapPin,
  Clock,
  DollarSign,
  Building,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Star,
  Users,
  CheckCircle,
  RefreshCw,
  Calendar
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

export default function JobsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  // Sample fallback data
  const fallbackJobs: Job[] = [
    {
      id: "fallback-1",
      title: "Software Development Engineer",
      company: "Microsoft",
      location: "Hyderabad",
      salary: "₹18-22 LPA",
      type: "Full-time",
      experience: "0-2 years",
      posted: "1 day ago",
      description: "Join Microsoft as an SDE and work on cutting-edge technologies...",
      requirements: ["React.js", "C#", ".NET", "Azure"],
      rating: 4.8,
      employees: "10,000+",
      urgent: true,
      isOnCampus: true,
      minCGPA: 7.5,
      allowedBranches: ["CSE", "IT", "ECE"],
      academicYear: ["3rd Year", "4th Year"],
      applicationDeadline: "2025-08-20"
    },
    {
      id: "fallback-2",
      title: "Frontend Developer",
      company: "Swiggy",
      location: "Hyderabad",
      salary: "₹8-12 LPA",
      type: "Full-time",
      experience: "1-3 years",
      posted: "3 days ago",
      description: "Build amazing user experiences for millions of users...",
      requirements: ["React.js", "TypeScript", "CSS", "Redux"],
      rating: 4.3,
      employees: "5,000+",
      urgent: false,
      isOnCampus: false,
      externalUrl: "https://careers.swiggy.com",
      applyUrl: "https://careers.swiggy.com/jobs/frontend-developer"
    },
    {
      id: "fallback-3",
      title: "Graduate Trainee Engineer",
      company: "Infosys",
      location: "Bangalore",
      salary: "₹6-8 LPA",
      type: "Full-time",
      experience: "0-1 years",
      posted: "2 days ago",
      description: "Join Infosys as a Graduate Trainee and kickstart your career in technology...",
      requirements: ["Programming Fundamentals", "Problem Solving", "Communication", "Adaptability"],
      rating: 4.2,
      employees: "50,000+",
      urgent: true,
      isOnCampus: true,
      minCGPA: 6.5,
      allowedBranches: ["CSE", "IT", "ECE", "EEE"],
      academicYear: ["4th Year"],
      applicationDeadline: "2025-08-25"
    },
    {
      id: "fallback-4",
      title: "Software Developer",
      company: "Wipro",
      location: "Hyderabad",
      salary: "₹5-7 LPA",
      type: "Full-time",
      experience: "0-2 years",
      posted: "1 day ago",
      description: "Start your career with Wipro as a Software Developer...",
      requirements: ["Java", "Spring Boot", "MySQL", "REST APIs"],
      rating: 4.0,
      employees: "30,000+",
      urgent: false,
      isOnCampus: true,
      minCGPA: 6.0,
      allowedBranches: ["CSE", "IT"],
      academicYear: ["3rd Year", "4th Year"],
      applicationDeadline: "2025-08-30"
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      await loadJobs();
      await loadUserApplicationData();
    };
    loadData();
  }, [user]);

  // Refresh applications when the page becomes visible (handles coordinator deletion)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadUserApplicationData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  useEffect(() => {
    // If jobId is provided, scroll to that job after jobs are loaded
    if (jobId && jobs.length > 0) {
      const jobElement = document.getElementById(`job-${jobId}`);
      if (jobElement) {
        jobElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the job briefly
        jobElement.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
          jobElement.style.boxShadow = '';
        }, 3000);
      }
    }
  }, [jobId, jobs]);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading jobs...');
      
      // Fetch jobs from student endpoint with access control
      const clerkUserId = user?.id;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/student/jobs?clerkUserId=${clerkUserId}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Student Jobs API Data:', data);
      
      // Handle the new response format with access level information
      if (data.jobs && data.jobs.length > 0) {
        const onCampusJobs = data.jobs.map((job: any) => ({
          id: job._id || job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          type: job.type,
          experience: job.experience,
          requirements: job.requirements || [],
          description: job.description,
          posted: job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Recently posted',
          postedDate: job.postedDate,
          deadline: job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'No deadline specified',
          applicationDeadline: job.applicationDeadline,
          minCGPA: job.minCGPA,
          allowedBranches: job.allowedBranches,
          academicYear: job.academicYear,
          isOnCampus: job.type === 'on-campus',
          externalUrl: job.externalUrl,
          applyUrl: job.applyUrl
        }));
        
        // Show access level message if available
        if (data.accessLevel && data.accessLevel.message) {
          if (!data.accessLevel.canAccessOnCampusJobs) {
            toast.info(data.accessLevel.message);
          }
        }
        
        // Always try to load external jobs as well
        await loadExternalJobs(onCampusJobs);
      } else {
        // If no on-campus jobs, still load external jobs
        console.log('🔄 No on-campus jobs, fetching external jobs...');
        await loadExternalJobs([]);
      }
      
    } catch (error) {
      console.error('❌ Error loading jobs:', error);
      toast.error('Failed to load job listings');
      // Load fallback external jobs on error
      await loadExternalJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExternalJobs = async (onCampusJobs: Job[] = []) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/external/jobs?what=software engineer&where=bangalore`);
      
      if (!response.ok) {
        throw new Error(`External API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 External Jobs API Data:', { count: data.count, results: data.results?.length });
      
      if (data.results && data.results.length > 0) {
        const externalJobs = data.results.map((job: any) => ({
          id: `adzuna_${job.id}`,
          title: job.title,
          company: job.company?.display_name || 'Company',
          location: job.location?.display_name || 'Location',
          salary: job.salary_min && job.salary_max 
            ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L`
            : job.salary_min 
            ? `₹${(job.salary_min / 100000).toFixed(1)}L+`
            : 'Salary not disclosed',
          type: 'external',
          experience: job.experience || 'Mid-level',
          requirements: ['Software Development', 'Programming'],
          description: job.description || 'Job description not available',
          posted: job.created ? new Date(job.created).toLocaleDateString() : 'Recently posted',
          postedDate: job.created ? new Date(job.created).toLocaleDateString() : 'Recently posted',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          isOnCampus: false,
          externalUrl: job.redirect_url,
          category: 'Software Development'
        }));
        
        // Combine on-campus and external jobs
        const allJobs = [...onCampusJobs, ...externalJobs];
        setJobs(allJobs);
        console.log(`✅ Loaded ${onCampusJobs.length} on-campus jobs + ${externalJobs.length} external jobs = ${allJobs.length} total`);
        
        if (onCampusJobs.length > 0 && externalJobs.length > 0) {
          toast.success(`Loaded ${onCampusJobs.length} on-campus jobs and ${externalJobs.length} external jobs!`);
        } else if (onCampusJobs.length > 0) {
          toast.success(`Loaded ${onCampusJobs.length} on-campus jobs!`);
        } else {
          toast.success(`Loaded ${externalJobs.length} external jobs!`);
        }
      } else {
        // If no external jobs either, just set on-campus jobs
        setJobs(onCampusJobs);
        console.log(`✅ Loaded ${onCampusJobs.length} on-campus jobs only`);
        if (onCampusJobs.length > 0) {
          toast.success(`Loaded ${onCampusJobs.length} on-campus jobs!`);
        } else {
          toast.info('No jobs available at the moment');
        }
      }
    } catch (error) {
      console.error('❌ Error loading external jobs:', error);
      // If external jobs fail, still show on-campus jobs
      setJobs(onCampusJobs);
      if (onCampusJobs.length > 0) {
        toast.success(`Loaded ${onCampusJobs.length} on-campus jobs!`);
        toast.info('External jobs temporarily unavailable');
      } else {
        toast.error('Failed to load jobs');
      }
    }
  };

  const loadUserApplicationData = async () => {
    if (!user) return;
    
    // Load saved jobs from localStorage (these are just bookmarks)
    const saved = localStorage.getItem(`savedJobs_${user.id}`) || '[]';
    setSavedJobs(JSON.parse(saved));
    
    // Fetch actual applied jobs from backend
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/student/${user.id}/applications`);
      if (response.ok) {
        const applications = await response.json();
        // Extract job IDs from applications
        const appliedJobIds = applications.map((app: any) => app.jobId?.toString()).filter(Boolean);
        setAppliedJobs(appliedJobIds);
      } else {
        console.warn('Failed to fetch applications, falling back to localStorage');
        // Fallback to localStorage if API fails
        const applied = localStorage.getItem(`appliedJobs_${user.id}`) || '[]';
        setAppliedJobs(JSON.parse(applied));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Fallback to localStorage if API fails
      const applied = localStorage.getItem(`appliedJobs_${user.id}`) || '[]';
      setAppliedJobs(JSON.parse(applied));
    }
  };

  const toggleSaveJob = (jobId: string) => {
    if (!user) return;
    
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem(`savedJobs_${user.id}`, JSON.stringify(newSavedJobs));
    
    toast.success(
      savedJobs.includes(jobId) ? 'Job removed from saved' : 'Job saved successfully!'
    );
  };

  const handleApplyJob = async (job: Job) => {
    if (!user) return;

    setApplyingJobId(job.id);

    try {
      if (job.isOnCampus) {
        // On-campus job application
        await applicationsApi.create({
          jobId: job.id,
          userId: user.id,
          status: 'applied',
          appliedAt: new Date().toISOString()
        });
        
        // Refresh applied jobs from backend to get the most current state
        await loadUserApplicationData();
        
        toast.success('Application submitted successfully!');
      } else {
        // External job - redirect to external URL
        if (job.applyUrl) {
          window.open(job.applyUrl, '_blank');
        } else if (job.externalUrl) {
          window.open(job.externalUrl, '_blank');
        }
        toast.success('Redirecting to company website...');
      }
    } catch (error) {
      console.error('Failed to apply:', error);
      toast.error('Failed to apply. Please try again.');
    } finally {
      setApplyingJobId(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    // Debug logging
    if (jobs.length > 0 && jobs.indexOf(job) === 0) {
      console.log('🔍 First job structure:', job);
      console.log('📊 Filter values:', { searchTerm, filterLocation });
    }
    
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filterLocation || job.location?.toLowerCase().includes(filterLocation.toLowerCase());
    
    const result = matchesSearch && matchesLocation;
    
    // Debug first few jobs
    if (jobs.indexOf(job) < 3) {
      console.log(`Job ${jobs.indexOf(job)}: ${job.title} - Matches: ${result}`, {
        matchesSearch, matchesLocation
      });
    }
    
    return result;
  });

  console.log(`📋 Total jobs: ${jobs.length}, Filtered jobs: ${filteredJobs.length}`);

  const refreshJobs = async () => {
    await loadJobs();
    await loadUserApplicationData();
  };

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
              <button className="text-blue-600 font-medium px-3 py-2 rounded-md text-sm">Jobs</button>
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
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
            <p className="text-gray-600">Discover your next career opportunity</p>
          </div>
          <button
            onClick={refreshJobs}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Locations</option>
                <option value="bangalore">Bangalore</option>
                <option value="mumbai">Mumbai</option>
                <option value="pune">Pune</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="chennai">Chennai</option>
                <option value="delhi">Delhi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                id={`job-${job.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Job Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        {job.urgent && (
                          <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                            Urgent
                          </span>
                        )}
                        {job.isOnCampus && (
                          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                            On-Campus
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                        {job.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{job.rating}</span>
                          </div>
                        )}
                        {job.employees && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{job.employees}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {savedJobs.includes(job.id) ? (
                        <BookmarkCheck className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{job.experience}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {job.isOnCampus && job.applicationDeadline ? (
                        <span className="text-red-600 font-medium">
                          Closes: {new Date(job.applicationDeadline).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      ) : (
                        <span>{job.posted}</span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* On-Campus Requirements */}
                  {job.isOnCampus && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="text-sm font-medium text-green-800 mb-2">Eligibility Criteria</h4>
                      <div className="text-xs text-green-700 space-y-1">
                        {job.minCGPA && <p>Min CGPA: {job.minCGPA}</p>}
                        {job.allowedBranches && <p>Branches: {job.allowedBranches.join(', ')}</p>}
                        {job.academicYear && <p>Academic Year: {job.academicYear.join(', ')}</p>}
                        {job.applicationDeadline && <p>Deadline: {job.applicationDeadline}</p>}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3">
                    {appliedJobs.includes(job.id) ? (
                      <div className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Applied
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApplyJob(job)}
                        disabled={applyingJobId === job.id}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {applyingJobId === job.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          <>
                            Apply Now
                            <ChevronRight className="ml-1 w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </main>
    </div>
  );
}
