import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  GraduationCap, 
  Search, 
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  FileText,
  Download,
  ExternalLink,
  Filter
} from 'lucide-react';

interface Application {
  id: string;
  jobId: string;
  job: any;
  status: 'applied' | 'shortlisted' | 'interview_scheduled' | 'selected' | 'rejected';
  appliedAt: string;
  interviewDate?: string;
  interviewTime?: string;
  feedback?: string;
  lastUpdate?: string;
}

export default function ApplicationsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = () => {
    setIsLoading(true);
    try {
      // Load applied jobs from localStorage
      const applied = localStorage.getItem(`appliedJobs_${user?.id}`) || '[]';
      const appliedJobIds = JSON.parse(applied);
      setAppliedJobs(appliedJobIds);
      
      // Create application records for applied jobs
      const mockApplications: Application[] = appliedJobIds.map((jobId: string, index: number) => {
        const job = getAllJobs().find(j => j.id === jobId);
        if (!job) return null;
        
        // Generate realistic status progression
        const statuses: Application['status'][] = ['applied', 'shortlisted', 'interview_scheduled', 'selected', 'rejected'];
        let status: Application['status'] = 'applied';
        
        // Simulate different stages for demo
        if (index === 0) status = 'selected';
        else if (index === 1) status = 'interview_scheduled';
        else if (index === 2) status = 'shortlisted';
        else if (index === 3) status = 'rejected';
        else status = statuses[Math.floor(Math.random() * 3)]; // Random for others, but not selected/rejected
        
        const appliedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        return {
          id: `app-${jobId}`,
          jobId,
          job,
          status,
          appliedAt: appliedDate.toISOString(),
          interviewDate: status === 'interview_scheduled' ? '2025-08-20' : status === 'selected' ? '2025-08-15' : undefined,
          interviewTime: status === 'interview_scheduled' ? '10:00 AM' : status === 'selected' ? '2:00 PM' : undefined,
          feedback: status === 'rejected' ? 'Thank you for your interest. We will keep your profile for future opportunities.' : 
                   status === 'selected' ? 'Congratulations! We are pleased to offer you this position.' : undefined,
          lastUpdate: getRandomLastUpdate()
        };
      }).filter(Boolean) as Application[];
      
      setApplications(mockApplications.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()));
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomLastUpdate = () => {
    const updates = ['Just now', '2 hours ago', '1 day ago', '2 days ago', '3 days ago', '1 week ago'];
    return updates[Math.floor(Math.random() * updates.length)];
  };

  // Mock function to get all jobs (in real app, this would come from API/database)
  const getAllJobs = () => [
    {
      id: "campus-1",
      title: "Software Development Engineer",
      company: "Microsoft",
      location: "Hyderabad",
      salary: "₹18-22 LPA",
      type: "Full-time",
      isOnCampus: true,
      logo: "/api/placeholder/40/40"
    },
    {
      id: "campus-2", 
      title: "Data Analyst",
      company: "Infosys",
      location: "Bangalore",
      salary: "₹6-8 LPA",
      type: "Full-time",
      isOnCampus: true,
      logo: "/api/placeholder/40/40"
    },
    {
      id: "campus-3",
      title: "Product Manager Trainee",
      company: "Wipro",
      location: "Pune",
      salary: "₹5-7 LPA",
      type: "Full-time",
      isOnCampus: true,
      logo: "/api/placeholder/40/40"
    },
    {
      id: "ext-1",
      title: "Frontend Developer", 
      company: "Swiggy",
      location: "Hyderabad",
      salary: "₹8-12 LPA",
      type: "Full-time",
      isOnCampus: false,
      logo: "/api/placeholder/40/40"
    },
    {
      id: "ext-2",
      title: "Backend Engineer",
      company: "Zomato", 
      location: "Gurugram",
      salary: "₹10-15 LPA",
      type: "Full-time",
      isOnCampus: false,
      logo: "/api/placeholder/40/40"
    },
    {
      id: "ext-3",
      title: "Full Stack Developer",
      company: "Razorpay",
      location: "Bangalore",
      salary: "₹12-18 LPA",
      type: "Full-time",
      isOnCampus: false,
      logo: "/api/placeholder/40/40"
    }
  ];

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'applied':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'shortlisted':
        return <Eye className="h-5 w-5 text-yellow-500" />;
      case 'interview_scheduled':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'selected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shortlisted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'interview_scheduled':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'selected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'applied':
        return 'Applied';
      case 'shortlisted':
        return 'Shortlisted';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'selected':
        return 'Selected';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleNavigateHome = () => {
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h2>
          <p className="text-gray-600">Track your job applications and interview schedules</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applied</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.shortlisted || 0}</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interviews</p>
                <p className="text-2xl font-bold text-orange-600">{statusCounts.interview_scheduled || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.selected || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.rejected || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
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
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">You haven't applied to any jobs yet. Start exploring opportunities!</p>
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600 mb-4">
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
            
            <AnimatePresence>
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building className="h-6 w-6 text-gray-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {application.job.title}
                              </h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <Building className="h-4 w-4 mr-2" />
                                <span className="font-medium">{application.job.company}</span>
                                {application.job.isOnCampus && (
                                  <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    On-Campus
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                                {getStatusIcon(application.status)}
                                <span className="ml-2">{getStatusText(application.status)}</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              {application.job.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                              {application.job.salary}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              Applied: {formatDate(application.appliedAt)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              {application.lastUpdate}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interview Details */}
                    {application.status === 'interview_scheduled' && application.interviewDate && (
                      <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                          <h4 className="font-medium text-orange-900">Interview Scheduled</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-orange-800">Date:</span>
                            <span className="text-orange-700 ml-2">{application.interviewDate}</span>
                          </div>
                          <div>
                            <span className="font-medium text-orange-800">Time:</span>
                            <span className="text-orange-700 ml-2">{application.interviewTime}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success Message */}
                    {application.status === 'selected' && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <h4 className="font-medium text-green-900">Congratulations!</h4>
                        </div>
                        <p className="text-sm text-green-700">{application.feedback}</p>
                      </div>
                    )}

                    {/* Rejection Feedback */}
                    {application.status === 'rejected' && application.feedback && (
                      <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center mb-2">
                          <XCircle className="h-5 w-5 text-red-600 mr-2" />
                          <h4 className="font-medium text-red-900">Application Update</h4>
                        </div>
                        <p className="text-sm text-red-700">{application.feedback}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                        {!application.job.isOnCampus && (
                          <button className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Company Page
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredApplications.length === 0 && applications.length > 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
