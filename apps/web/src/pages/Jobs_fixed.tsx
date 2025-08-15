import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../utils/toast';
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
  X
} from 'lucide-react';

const Jobs = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterSalary, setFilterSalary] = useState('');
  const [filterType, setFilterType] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  // Sample on-campus jobs and external jobs
  const onCampusJobs = [
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
      isOnCampus: true
    },
    {
      id: "campus-2",
      title: "Product Manager",
      company: "Google",
      location: "Bangalore",
      salary: "₹25-30 LPA",
      type: "Full-time",
      experience: "2-4 years",
      posted: "2 days ago",
      description: "Lead product initiatives at Google...",
      requirements: ["Product Strategy", "Analytics", "Communication"],
      rating: 4.9,
      employees: "50,000+",
      urgent: true,
      isOnCampus: true
    },
    {
      id: "campus-3",
      title: "Data Scientist",
      company: "Amazon",
      location: "Chennai",
      salary: "₹20-24 LPA",
      type: "Full-time",
      experience: "1-3 years",
      posted: "3 days ago",
      description: "Work with big data at Amazon...",
      requirements: ["Python", "ML", "Statistics", "SQL"],
      rating: 4.7,
      employees: "100,000+",
      urgent: false,
      isOnCampus: true
    }
  ];

  const externalJobs = [
    {
      id: "ext-1",
      title: "Frontend Developer",
      company: "Startup Hub",
      location: "Remote",
      salary: "₹8-12 LPA",
      type: "Full-time",
      experience: "1-2 years",
      posted: "1 day ago",
      description: "Build amazing user interfaces...",
      requirements: ["React", "TypeScript", "CSS"],
      rating: 4.2,
      employees: "50+",
      urgent: false,
      isOnCampus: false,
      applyUrl: "https://startup-hub.com/careers"
    },
    {
      id: "ext-2",
      title: "Backend Engineer",
      company: "Tech Solutions",
      location: "Mumbai",
      salary: "₹10-15 LPA",
      type: "Full-time",
      experience: "2-4 years",
      posted: "2 days ago",
      description: "Develop scalable backend systems...",
      requirements: ["Node.js", "Python", "MongoDB"],
      rating: 4.3,
      employees: "200+",
      urgent: true,
      isOnCampus: false,
      applyUrl: "https://techsolutions.com/apply"
    }
  ];

  useEffect(() => {
    if (user) {
      const userSavedJobs = localStorage.getItem(`savedJobs_${user.id}`);
      const userAppliedJobs = localStorage.getItem(`appliedJobs_${user.id}`);
      
      if (userSavedJobs) {
        setSavedJobs(JSON.parse(userSavedJobs));
      }
      if (userAppliedJobs) {
        setAppliedJobs(JSON.parse(userAppliedJobs));
      }
    }

    // Combine all jobs
    setJobs([...onCampusJobs, ...externalJobs]);
  }, [user]);

  const handleApplyJob = async (job: any) => {
    if (!user) {
      toast.error('Please sign in to apply for jobs');
      return;
    }

    setApplyingJobId(job.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (job.isOnCampus) {
        // On-campus job application
        const newAppliedJobs = [...appliedJobs, job.id];
        setAppliedJobs(newAppliedJobs);
        localStorage.setItem(`appliedJobs_${user.id}`, JSON.stringify(newAppliedJobs));
        
        // Store application details for Applications page
        const applications = JSON.parse(localStorage.getItem(`applications_${user.id}`) || '[]');
        const newApplication = {
          id: `app-${Date.now()}`,
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          appliedDate: new Date().toISOString(),
          status: 'Applied',
          salary: job.salary,
          location: job.location
        };
        applications.push(newApplication);
        localStorage.setItem(`applications_${user.id}`, JSON.stringify(applications));
        
        toast.success('Application submitted successfully!');
      } else {
        // External job - redirect to external URL
        if (job.applyUrl) {
          window.open(job.applyUrl, '_blank');
        } else {
          window.open(job.externalUrl, '_blank');
        }
        toast.success('Redirecting to company website...');
      }
    } catch (error) {
      toast.error('Failed to apply. Please try again.');
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

  const handleSaveJob = (jobId: string) => {
    if (!user) {
      toast.error('Please sign in to save jobs');
      return;
    }

    const newSavedJobs = savedJobs.includes(jobId) 
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem(`savedJobs_${user.id}`, JSON.stringify(newSavedJobs));
    
    toast.success(
      savedJobs.includes(jobId) ? 'Job removed from saved' : 'Job saved successfully!'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNavigateHome}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <GraduationCap className="h-8 w-8" />
                <span className="text-xl font-bold">MGIT Placements</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {user?.firstName}!
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Opportunities</h1>
          <p className="text-xl text-gray-600">Discover your next career opportunity</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Enter location..."
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary (LPA)</label>
                    <input
                      type="number"
                      placeholder="5"
                      value={filterSalary}
                      onChange={(e) => setFilterSalary(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    {job.isOnCampus ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        On-Campus
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        External
                      </span>
                    )}
                    {job.urgent && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Urgent
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleSaveJob(job.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {savedJobs.includes(job.id) ? (
                      <BookmarkCheck className="h-5 w-5 text-red-500" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Building className="h-4 w-4" />
                  <span className="text-sm">{job.company}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">{job.rating}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{job.location}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium text-green-600">{job.salary}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 mb-4">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{job.posted}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requirements.slice(0, 3).map((req: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {req}
                    </span>
                  ))}
                  {job.requirements.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{job.requirements.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{job.employees}</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApplyJob(job)}
                    disabled={applyingJobId === job.id || appliedJobs.includes(job.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      appliedJobs.includes(job.id)
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : applyingJobId === job.id
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : job.isOnCampus
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {appliedJobs.includes(job.id) ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Applied</span>
                      </>
                    ) : applyingJobId === job.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                        <span>Applying...</span>
                      </>
                    ) : job.isOnCampus ? (
                      <>
                        <ChevronRight className="h-4 w-4" />
                        <span>Apply Now</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4" />
                        <span>Apply External</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-lg">No jobs found matching your criteria</div>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
