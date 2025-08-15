import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '../utils/toast';
import { applicationsApi } from '../services/api';
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
  RefreshCw
} from 'lucide-react';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: 'applied' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn';
  statusColor: string;
  lastUpdate: string;
  interviewDate?: string;
  notes?: string;
  isOnCampus?: boolean;
}

export default function ApplicationsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [user]);

  const loadApplications = async () => {
    if (!user?.id) {
      console.log('No user ID found');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Loading applications for student:', user.id);
      console.log('API URL:', `${import.meta.env.VITE_API_URL}/student/${user.id}/applications`);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/student/${user.id}/applications`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const applicationsData = await response.json();
        console.log('Loaded applications:', applicationsData);
        console.log('Applications count:', applicationsData.length);
        
        // Transform API data to match our interface
        const transformedApplications = applicationsData.map((app: any) => ({
          ...app,
          statusColor: getStatusColor(app.status),
          lastUpdate: getRelativeTime(app.lastUpdate || app.appliedDate),
          appliedDate: formatDate(app.appliedDate)
        }));
        
        console.log('Transformed applications:', transformedApplications);
        setApplications(transformedApplications);
        
        if (transformedApplications.length === 0) {
          toast.info('You haven\'t applied to any jobs yet. Visit the Jobs page to find opportunities.');
        }
      } else {
        const errorText = await response.text();
        console.log('Failed to load applications:', response.status, errorText);
        setApplications([]);
        toast.error('Failed to load your applications');
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
      toast.error('Failed to load your applications');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      'applied': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'interview_scheduled': 'bg-purple-100 text-purple-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied':
        return <Clock className="w-4 h-4" />;
      case 'under_review':
        return <Eye className="w-4 h-4" />;
      case 'interview_scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'withdrawn':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getStatusDisplayText = (status: string): string => {
    switch (status) {
      case 'accepted':
        return 'Selected';
      case 'under_review':
        return 'Under Review';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      default:
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    
    try {
      await applicationsApi.updateStatus(applicationId, 'withdrawn');
      toast.success('Application withdrawn successfully');
      loadApplications();
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast.error('Failed to withdraw application');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusCounts = () => {
    return {
      total: applications.length,
      applied: applications.filter(app => app.status === 'applied').length,
      under_review: applications.filter(app => app.status === 'under_review').length,
      interview_scheduled: applications.filter(app => app.status === 'interview_scheduled').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
  };

  const statusCounts = getStatusCounts();

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
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Jobs
              </button>
              <button className="text-blue-600 font-medium px-3 py-2 rounded-md text-sm">Applications</button>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600">Track your job applications and their status</p>
          </div>
          <button
            onClick={loadApplications}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.applied}</div>
            <div className="text-sm text-gray-600">Applied</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.under_review}</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-purple-600">{statusCounts.interview_scheduled}</div>
            <div className="text-sm text-gray-600">Interviews</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">{statusCounts.accepted}</div>
            <div className="text-sm text-gray-600">Selected</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="under_review">Under Review</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="accepted">Selected</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        )}

        {/* Applications List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{application.jobTitle}</h3>
                            {application.isOnCampus && (
                              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                On-Campus
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span>{application.company}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{application.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{application.salary}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${application.statusColor}`}>
                          {getStatusIcon(application.status)}
                          <span>{getStatusDisplayText(application.status)}</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Applied Date</div>
                          <div className="font-medium">{application.appliedDate}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Last Update</div>
                          <div className="font-medium">{application.lastUpdate}</div>
                        </div>
                        {application.interviewDate && (
                          <div>
                            <div className="text-sm text-gray-500">Interview Date</div>
                            <div className="font-medium">{formatDate(application.interviewDate)}</div>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {application.notes && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-500 mb-1">Notes</div>
                          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {application.notes}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/jobs/${application.jobId}`)}
                          className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Job</span>
                        </button>
                        {(application.status === 'applied' || application.status === 'under_review') && (
                          <button
                            onClick={() => handleWithdrawApplication(application.id)}
                            className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Withdraw</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">
              {applications.length === 0 
                ? "You haven't applied to any jobs yet" 
                : "Try adjusting your search criteria"
              }
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
