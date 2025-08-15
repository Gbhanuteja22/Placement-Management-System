import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../utils/toast';
import { jobsApi } from '../services/api';
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
  ExternalLink,
  CheckCircle,
  Filter,
  RefreshCw,
  Calendar
} from 'lucide-react';

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
    }
  ];

  const externalJobs = [
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
    }
  ];

  useEffect(() => {
    loadJobs();
    loadUserApplicationData();
  }, [user]);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobsApi.getJobs();
      setJobs(response.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs');
      // Fallback to static data if API fails
      setJobs([...onCampusJobs, ...externalJobs]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserApplicationData = () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`savedJobs_${user.id}`) || '[]';
    const applied = localStorage.getItem(`appliedJobs_${user.id}`) || '[]';
    setSavedJobs(JSON.parse(saved));
    setAppliedJobs(JSON.parse(applied));
  };

  const fetchExternalJobs = async () => {
    try {
      setIsLoading(true);
      // Example API call to fetch jobs (you can replace with actual API)
      // const response = await axios.get('https://api.adzuna.com/v1/api/jobs/in/search/1', {
      //   params: {
      //     app_id: process.env.VITE_ADZUNA_APP_ID,
      //     app_key: process.env.VITE_ADZUNA_API_KEY,
      //     results_per_page: 10,
      //     what: 'software engineer',
      //     where: 'bangalore'
      //   }
      // });
      
      // For now, we'll use the static data
      console.log('Would fetch external jobs here');
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaveJob = (jobId: string) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem(`savedJobs_${user.id}`, JSON.stringify(newSavedJobs));
    
    toast.success(
      savedJobs.includes(jobId) ? 'Job removed from saved' : 'Job saved successfully!'
    );
  };

  const handleApplyJob = async (job: any) => {
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
        console.log('Application submitted successfully!');
        alert('Application submitted successfully!');
      } else {
        // External job - redirect to external URL
        if (job.applyUrl) {
          window.open(job.applyUrl, '_blank');
        } else {
          window.open(job.externalUrl, '_blank');
        }
        console.log('Redirecting to company website...');
      }
    } catch (error) {
      console.error('Failed to apply. Please try again.');
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
    {
      id: "job-2",
      title: "Frontend Developer",
      company: "WebTech Solutions",
      location: "Mumbai",
      salary: "₹6-10 LPA",
      type: "Full-time",
      experience: "1-3 years",
      posted: "3 days ago",
      description: "Join our frontend team to build amazing user experiences...",
      requirements: ["React.js", "TypeScript", "CSS", "Git"],
      rating: 4.2,
      employees: "500+",
      urgent: false
    },
    {
      id: "job-3",
      title: "Data Analyst",
      company: "DataSoft",
      location: "Pune",
      salary: "₹5-8 LPA",
      type: "Full-time",
      experience: "1-2 years",
      posted: "1 week ago",
      description: "Analyze data to help drive business decisions...",
      requirements: ["Python", "SQL", "Tableau", "Excel"],
      rating: 4.0,
      employees: "250+",
      urgent: false
    },
    {
      id: "job-4",
      title: "Backend Developer",
      company: "CloudTech",
      location: "Hyderabad",
      salary: "₹7-11 LPA",
      type: "Full-time",
      experience: "2-5 years",
      posted: "4 days ago",
      description: "Build scalable backend systems and APIs...",
      requirements: ["Java", "Spring Boot", "MySQL", "Docker"],
      rating: 4.3,
      employees: "750+",
      urgent: true
    },
    {
      id: "job-5",
      title: "DevOps Engineer",
      company: "InfraTech",
      location: "Chennai",
      salary: "₹9-15 LPA",
      type: "Full-time",
      experience: "3-6 years",
      posted: "5 days ago",
      description: "Manage CI/CD pipelines and cloud infrastructure...",
      requirements: ["AWS", "Kubernetes", "Docker", "Jenkins"],
      rating: 4.4,
      employees: "300+",
      urgent: false
    },
    {
      id: "job-6",
      title: "UI/UX Designer",
      company: "DesignHub",
      location: "Delhi",
      salary: "₹4-7 LPA",
      type: "Full-time",
      experience: "1-3 years",
      posted: "6 days ago",
      description: "Create intuitive and beautiful user interfaces...",
      requirements: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
      rating: 4.1,
      employees: "150+",
      urgent: false
    }
  ];

  const handleSaveJob = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const handleApplyJob = (jobId: string) => {
    alert(`Applied for job: ${jobId}`);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesSalary = !filterSalary || job.salary.includes(filterSalary);
    return matchesSearch && matchesLocation && matchesSalary;
  });

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
          <p className="text-gray-600">Discover your next career opportunity</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div>
              <select
                value={filterSalary}
                onChange={(e) => setFilterSalary(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Salaries</option>
                <option value="0-5">0-5 LPA</option>
                <option value="5-10">5-10 LPA</option>
                <option value="10-15">10-15 LPA</option>
                <option value="15+">15+ LPA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{job.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{job.employees}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveJob(job.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {savedJobs.includes(job.id) ? (
                      <BookmarkCheck className="w-5 h-5" />
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
                    <span>{job.posted}</span>
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

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApplyJob(job.id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Apply Now
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
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
