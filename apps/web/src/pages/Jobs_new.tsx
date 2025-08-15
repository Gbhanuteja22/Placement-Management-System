import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
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
  Calendar,
  Users,
  ExternalLink,
  CheckCircle,
  Filter,
  SlidersHorizontal
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
  rating: number;
  employees: string;
  urgent: boolean;
  isOnCampus: boolean;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterSalary, setFilterSalary] = useState('');
  const [filterType, setFilterType] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  // Sample on-campus jobs and external jobs
  const onCampusJobs: Job[] = [
    {
      id: "campus-1",
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
      id: "campus-2",
      title: "Data Analyst",
      company: "Infosys",
      location: "Bangalore",
      salary: "₹6-8 LPA",
      type: "Full-time",
      experience: "0-1 years",
      posted: "2 days ago",
      description: "Analyze complex data sets and provide business insights...",
      requirements: ["Python", "SQL", "Tableau", "Excel"],
      rating: 4.2,
      employees: "50,000+",
      urgent: false,
      isOnCampus: true,
      minCGPA: 6.5,
      allowedBranches: ["CSE", "IT", "ECE", "EEE"],
      academicYear: ["4th Year"],
      applicationDeadline: "2025-08-25"
    },
    {
      id: "campus-3",
      title: "Product Manager Trainee",
      company: "Wipro",
      location: "Pune",
      salary: "₹5-7 LPA",
      type: "Full-time",
      experience: "0-1 years",
      posted: "3 days ago",
      description: "Join our product management training program...",
      requirements: ["Business Analysis", "Communication", "Problem Solving"],
      rating: 4.0,
      employees: "25,000+",
      urgent: false,
      isOnCampus: true,
      minCGPA: 6.0,
      allowedBranches: ["CSE", "IT", "ECE", "EEE", "MECH"],
      academicYear: ["4th Year"],
      applicationDeadline: "2025-08-30"
    }
  ];

  const externalJobs: Job[] = [
    {
      id: "ext-1",
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
      id: "ext-2",
      title: "Backend Engineer",
      company: "Zomato",
      location: "Gurugram",
      salary: "₹10-15 LPA",
      type: "Full-time",
      experience: "2-4 years",
      posted: "1 week ago",
      description: "Scale backend systems to serve millions of food orders...",
      requirements: ["Node.js", "MongoDB", "AWS", "Microservices"],
      rating: 4.1,
      employees: "3,000+",
      urgent: false,
      isOnCampus: false,
      externalUrl: "https://careers.zomato.com",
      applyUrl: "https://careers.zomato.com/jobs/backend-engineer"
    },
    {
      id: "ext-3",
      title: "Full Stack Developer",
      company: "Razorpay",
      location: "Bangalore",
      salary: "₹12-18 LPA",
      type: "Full-time",
      experience: "2-4 years",
      posted: "4 days ago",
      description: "Work on fintech products that power millions of transactions...",
      requirements: ["React.js", "Node.js", "PostgreSQL", "Docker"],
      rating: 4.6,
      employees: "2,000+",
      urgent: true,
      isOnCampus: false,
      externalUrl: "https://razorpay.com/jobs",
      applyUrl: "https://razorpay.com/jobs/full-stack-developer"
    }
  ];

  useEffect(() => {
    // Load saved and applied jobs from localStorage
    if (user) {
      const saved = localStorage.getItem(`savedJobs_${user.id}`) || '[]';
      const applied = localStorage.getItem(`appliedJobs_${user.id}`) || '[]';
      setSavedJobs(JSON.parse(saved));
      setAppliedJobs(JSON.parse(applied));
    }
    
    // Initialize with on-campus jobs first
    setJobs([...onCampusJobs]);
    
    // Then fetch external jobs from Adzuna API
    fetchExternalJobs();
  }, [user]);

  const fetchExternalJobs = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Starting to fetch external jobs from Adzuna API...');
      
      // Fetch jobs from Adzuna API via our backend
      const apiUrl = `${import.meta.env.VITE_API_URL}/external/jobs?what=software engineer&where=bangalore`;
      console.log('📡 API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('📈 API Response Status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 API Data received:', { 
        count: data.count, 
        resultsLength: data.results?.length,
        firstJobTitle: data.results?.[0]?.title 
      });
      
      if (data.results && data.results.length > 0) {
        const externalJobsFromAPI = data.results.map((job: any) => ({
          id: `adzuna_${job.id}`,
          title: job.title,
          company: job.company?.display_name || 'Company',
          location: job.location?.display_name || 'Location',
          salary: job.salary_min && job.salary_max 
            ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L`
            : job.salary_min 
            ? `₹${(job.salary_min / 100000).toFixed(1)}L+`
            : 'Salary not disclosed',
          type: 'Full-time',
          experience: 'Mid-level',
          skills: ['Software Development', 'Programming'],
          description: job.description || 'Job description not available',
          postedDate: job.created ? new Date(job.created).toLocaleDateString() : 'Recently posted',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          isOnCampus: false,
          externalUrl: job.redirect_url,
          category: 'Software Development'
        }));
        
        // Replace static external jobs with real API jobs
        setJobs(prevJobs => [...onCampusJobs, ...externalJobsFromAPI]);
        console.log(`✅ SUCCESS: Loaded ${externalJobsFromAPI.length} real jobs from Adzuna API (Total available: ${data.count})`);
        
        toast.success(`Loaded ${data.count} live jobs from Adzuna!`, {
          position: 'bottom-right',
          autoClose: 3000
        });
      } else {
        console.log('⚠️ No external jobs found, using static data');
        setJobs(prevJobs => [...onCampusJobs, ...externalJobs]);
        
        toast.warning('No external jobs available, showing campus jobs only', {
          position: 'bottom-right'
        });
      }
    } catch (error) {
      console.error('❌ Error fetching external jobs:', error);
      console.log('Using static external jobs as fallback');
      setJobs(prevJobs => [...onCampusJobs, ...externalJobs]);
      
      toast.error('Failed to load external jobs. Showing local jobs only.', {
        position: 'bottom-right'
      });
    } finally {
      setIsLoading(false);
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
      savedJobs.includes(jobId) ? 'Job removed from saved' : 'Job saved successfully!',
      { position: 'bottom-right' }
    );
  };

  const handleApplyJob = async (job: Job) => {
    if (!user) return;

    setApplyingJobId(job.id);

    try {
      if (job.isOnCampus) {
        // On-campus job application
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        
        const newAppliedJobs = [...appliedJobs, job.id];
        setAppliedJobs(newAppliedJobs);
        localStorage.setItem(`appliedJobs_${user.id}`, JSON.stringify(newAppliedJobs));
        
        // Show success animation
        toast.success(
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span>Application submitted successfully!</span>
          </div>,
          { 
            position: 'bottom-right',
            autoClose: 3000
          }
        );
      } else {
        // External job - redirect to external URL
        if (job.applyUrl) {
          window.open(job.applyUrl, '_blank');
        } else if (job.externalUrl) {
          window.open(job.externalUrl, '_blank');
        }
        toast.info('Redirecting to company website...', { position: 'bottom-right' });
      }
    } catch (error) {
      toast.error('Failed to apply. Please try again.', { position: 'bottom-right' });
    } finally {
      setApplyingJobId(null);
    }
  };

  const parseMinSalary = (salary: string): number => {
    const match = salary.match(/₹(\d+)-?/);
    return match ? parseInt(match[1]) : 0;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesSalary = !filterSalary || parseMinSalary(job.salary) >= parseInt(filterSalary);
    const matchesType = !filterType || job.type === filterType;
    
    return matchesSearch && matchesLocation && matchesSalary && matchesType;
  });

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleNavigateHome}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <GraduationCap className="h-8 w-8 mr-3" />
                <h1 className="text-2xl font-bold">PlacementPro</h1>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h2>
          <p className="text-gray-600">Discover opportunities from top companies and on-campus placements</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 inline mr-1" />
                      Minimum Salary (LPA)
                    </label>
                    <select
                      value={filterSalary}
                      onChange={(e) => setFilterSalary(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Any Salary</option>
                      <option value="3">3+ LPA</option>
                      <option value="5">5+ LPA</option>
                      <option value="7">7+ LPA</option>
                      <option value="10">10+ LPA</option>
                      <option value="15">15+ LPA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building className="h-4 w-4 inline mr-1" />
                      Job Type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Job Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
          </p>
          {isLoading && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Loading more jobs...
            </div>
          )}
        </div>

        {/* Job Cards */}
        <div className="grid gap-6">
          <AnimatePresence>
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 mr-3">{job.title}</h3>
                        {job.urgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Urgent
                          </span>
                        )}
                        {job.isOnCampus && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full ml-2">
                            On-Campus
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building className="h-4 w-4 mr-2" />
                        <span className="font-medium">{job.company}</span>
                        <div className="flex items-center ml-4">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{job.rating}</span>
                        </div>
                        <div className="flex items-center ml-4">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="text-sm">{job.employees}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-full transition-colors ${
                        savedJobs.includes(job.id)
                          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                          : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {savedJobs.includes(job.id) ? (
                        <BookmarkCheck className="h-5 w-5" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      {job.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {job.experience}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {job.posted}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                  {/* Requirements */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 4).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requirements.length > 4 && (
                        <span className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-full">
                          +{job.requirements.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* On-campus specific info */}
                  {job.isOnCampus && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        {job.minCGPA && (
                          <div>
                            <span className="font-medium text-green-800">Min CGPA:</span>
                            <span className="text-green-700 ml-1">{job.minCGPA}</span>
                          </div>
                        )}
                        {job.allowedBranches && (
                          <div>
                            <span className="font-medium text-green-800">Branches:</span>
                            <span className="text-green-700 ml-1">{job.allowedBranches.join(', ')}</span>
                          </div>
                        )}
                        {job.applicationDeadline && (
                          <div>
                            <span className="font-medium text-green-800">Deadline:</span>
                            <span className="text-green-700 ml-1">{job.applicationDeadline}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleApplyJob(job)}
                        disabled={appliedJobs.includes(job.id) || applyingJobId === job.id}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                          appliedJobs.includes(job.id)
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : applyingJobId === job.id
                            ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                            : job.isOnCampus
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                      >
                        {applyingJobId === job.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Applying...
                          </>
                        ) : appliedJobs.includes(job.id) ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Applied
                          </>
                        ) : (
                          <>
                            {job.isOnCampus ? 'Apply Now' : 'Apply on Website'}
                            {!job.isOnCampus && <ExternalLink className="h-4 w-4 ml-2" />}
                          </>
                        )}
                      </motion.button>
                    </div>

                    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredJobs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
