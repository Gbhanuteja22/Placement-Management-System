import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../utils/toast';
import { applicationsApi } from '../services/api';
import { motion } from 'framer-motion';
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
  ExternalLink
} from 'lucide-react';

export default function ApplicationsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const applications = [
    {
      id: "app-1",
      jobTitle: "Software Engineer",
      company: "TechCorp",
      location: "Bangalore",
      salary: "₹8-12 LPA",
      appliedDate: "2024-01-10",
      status: "Under Review",
      statusColor: "bg-yellow-100 text-yellow-800",
      lastUpdate: "2 days ago",
      interviewDate: "2024-01-20",
      notes: "First round completed, waiting for technical round"
    },
    {
      id: "app-2",
      jobTitle: "Frontend Developer",
      company: "WebTech Solutions",
      location: "Mumbai",
      salary: "₹6-10 LPA",
      appliedDate: "2024-01-08",
      status: "Shortlisted",
      statusColor: "bg-blue-100 text-blue-800",
      lastUpdate: "1 day ago",
      interviewDate: "2024-01-18",
      notes: "HR round scheduled for next week"
    },
    {
      id: "app-3",
      jobTitle: "Data Analyst",
      company: "DataSoft",
      location: "Pune",
      salary: "₹5-8 LPA",
      appliedDate: "2024-01-05",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-800",
      lastUpdate: "5 days ago",
      interviewDate: null,
      notes: "Position filled by another candidate"
    },
    {
      id: "app-4",
      jobTitle: "Backend Developer",
      company: "CloudTech",
      location: "Hyderabad",
      salary: "₹7-11 LPA",
      appliedDate: "2024-01-12",
      status: "Applied",
      statusColor: "bg-gray-100 text-gray-800",
      lastUpdate: "Just now",
      interviewDate: null,
      notes: "Application submitted successfully"
    },
    {
      id: "app-5",
      jobTitle: "DevOps Engineer",
      company: "InfraTech",
      location: "Chennai",
      salary: "₹9-15 LPA",
      appliedDate: "2024-01-06",
      status: "Interview Scheduled",
      statusColor: "bg-green-100 text-green-800",
      lastUpdate: "3 days ago",
      interviewDate: "2024-01-19",
      notes: "Technical interview scheduled for Friday"
    },
    {
      id: "app-6",
      jobTitle: "UI/UX Designer",
      company: "DesignHub",
      location: "Delhi",
      salary: "₹4-7 LPA",
      appliedDate: "2024-01-04",
      status: "Offer Received",
      statusColor: "bg-emerald-100 text-emerald-800",
      lastUpdate: "1 week ago",
      interviewDate: null,
      notes: "Offer letter received, deadline to accept: Jan 25"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Applied':
        return <Clock className="w-4 h-4" />;
      case 'Under Review':
        return <Eye className="w-4 h-4" />;
      case 'Shortlisted':
      case 'Interview Scheduled':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      case 'Offer Received':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    applied: applications.filter(app => app.status === 'Applied').length,
    review: applications.filter(app => app.status === 'Under Review').length,
    shortlisted: applications.filter(app => app.status === 'Shortlisted').length,
    interview: applications.filter(app => app.status === 'Interview Scheduled').length,
    rejected: applications.filter(app => app.status === 'Rejected').length,
    offer: applications.filter(app => app.status === 'Offer Received').length,
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your job application progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.applied}</div>
              <div className="text-sm text-gray-600">Applied</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.review}</div>
              <div className="text-sm text-gray-600">Under Review</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.shortlisted}</div>
              <div className="text-sm text-gray-600">Shortlisted</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.interview}</div>
              <div className="text-sm text-gray-600">Interview</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{statusCounts.offer}</div>
              <div className="text-sm text-gray-600">Offers</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
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
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer Received">Offer Received</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{application.jobTitle}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.statusColor}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Building className="w-4 h-4" />
                        <span>{application.company}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{application.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{application.salary}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {application.interviewDate && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-blue-800">
                          <Calendar className="w-4 h-4" />
                          <span>Interview Scheduled: {new Date(application.interviewDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Notes</p>
                          <p className="text-sm text-gray-600">{application.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-2">Last update: {application.lastUpdate}</p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        View Details
                      </button>
                      {application.status === 'Offer Received' && (
                        <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Accept Offer
                        </button>
                      )}
                      {application.status === 'Interview Scheduled' && (
                        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Join Interview
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">You haven't applied to any jobs yet or no applications match your search.</p>
            <button 
              onClick={() => navigate('/jobs')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
