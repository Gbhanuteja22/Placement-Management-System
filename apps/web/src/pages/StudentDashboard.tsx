import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, SignedIn, UserButton } from '@clerk/clerk-react';
import { 
  GraduationCap, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  BarChart3,
  Target,
  BookOpen,
  FileText,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserProfile {
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  age: number;
  address: string;
  collegeEmail: string;
  personalEmail: string;
  collegeName: string;
  academicYear: string;
  mobileNumber: string;
  cgpa: number;
  resumeUrl?: string;
  marksMemoUrl?: string;
  skills?: string[];
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    github?: string;
    demo?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: Date;
    credentialId?: string;
    url?: string;
    mediaUrl?: string;
  }>;
  achievements?: string[];
  isOnboardingComplete: boolean;
}

interface ApplicationStats {
  total: number;
  applied: number;
  under_review: number;
  interview_scheduled: number;
  accepted: number;
  rejected: number;
  recent_applications: Array<{
    id: string;
    jobTitle: string;
    company: string;
    status: string;
    appliedDate: string;
  }>;
}

export default function StudentDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applicationStats, setApplicationStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      setLoading(true);
      
      // First, check if the user is a coordinator
      const coordinatorCheckResponse = await fetch(`${import.meta.env.VITE_API_URL}/institutions/verify-coordinator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.emailAddresses[0]?.emailAddress })
      });

      if (coordinatorCheckResponse.ok) {
        const coordinatorData = await coordinatorCheckResponse.json();
        if (coordinatorData.isCoordinator) {
          // User is a coordinator, redirect to coordinator dashboard
          navigate('/coordinator');
          return;
        }
      }

      // Load student profile and stats
      await loadProfile();
      await loadApplicationStats();
    } catch (error) {
      console.error('Error during initialization:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/${user?.id}`);
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
      } else {
        // Profile doesn't exist, redirect to onboarding
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadApplicationStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/student/${user?.id}/applications`);
      if (response.ok) {
        const applications = await response.json();
        
        const stats: ApplicationStats = {
          total: applications.length,
          applied: applications.filter((app: any) => app.status === 'applied').length,
          under_review: applications.filter((app: any) => app.status === 'under_review').length,
          interview_scheduled: applications.filter((app: any) => app.status === 'interview_scheduled').length,
          accepted: applications.filter((app: any) => app.status === 'accepted').length,
          rejected: applications.filter((app: any) => app.status === 'rejected').length,
          recent_applications: applications.slice(0, 5).map((app: any) => ({
            id: app.id,
            jobTitle: app.jobTitle,
            company: app.company,
            status: app.status,
            appliedDate: app.appliedDate
          }))
        };
        
        setApplicationStats(stats);
      }
    } catch (error) {
      console.error('Error loading application stats:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'under_review':
        return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'interview_scheduled':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Please complete your profile setup</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Complete Profile Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <SignedIn>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">PlacementPro</span>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <a href="/dashboard" className="text-blue-600 font-medium">Dashboard</a>
                <a href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</a>
                <a href="/applications" className="text-gray-600 hover:text-gray-900">Applications</a>
                <a href="/profile" className="text-gray-600 hover:text-gray-900">Profile</a>
              </nav>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {profile.firstName} {profile.lastName}
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {profile.firstName}!
            </h1>
            <p className="text-gray-600">
              Here's your placement journey overview and application statistics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Statistics Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                    Application Statistics
                  </h2>
                  <button
                    onClick={() => navigate('/applications')}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    View All <ArrowUpRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                {applicationStats ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{applicationStats.total}</div>
                      <div className="text-sm text-blue-700">Total Applications</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{applicationStats.under_review}</div>
                      <div className="text-sm text-yellow-700">Under Review</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{applicationStats.interview_scheduled}</div>
                      <div className="text-sm text-purple-700">Interviews</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{applicationStats.accepted}</div>
                      <div className="text-sm text-green-700">Accepted</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{applicationStats.rejected}</div>
                      <div className="text-sm text-red-700">Rejected</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">{applicationStats.applied}</div>
                      <div className="text-sm text-gray-700">Applied</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No applications yet. Start applying to jobs!</p>
                    <button
                      onClick={() => navigate('/jobs')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Browse Jobs
                    </button>
                  </div>
                )}

                {/* Recent Applications */}
                {applicationStats && applicationStats.recent_applications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h3>
                    <div className="space-y-3">
                      {applicationStats.recent_applications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(app.status)}
                            <div>
                              <div className="font-medium text-gray-900">{app.jobTitle}</div>
                              <div className="text-sm text-gray-600">{app.company}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                              {app.status.replace('_', ' ').toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{formatDate(app.appliedDate)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-green-600" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/jobs')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Browse Jobs</div>
                      <div className="text-sm text-gray-600">Find new opportunities</div>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/applications')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="w-8 h-8 text-green-600 mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">My Applications</div>
                      <div className="text-sm text-gray-600">Track application status</div>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Users className="w-8 h-8 text-purple-600 mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Update Profile</div>
                      <div className="text-sm text-gray-600">Keep information current</div>
                    </div>
                  </button>
                  <button
                    onClick={() => toast('Mock interviews coming soon!')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <BookOpen className="w-8 h-8 text-orange-600 mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Mock Interview</div>
                      <div className="text-sm text-gray-600">Practice interviews</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Summary Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{profile.firstName} {profile.lastName}</div>
                      <div className="text-sm text-gray-600">{profile.rollNumber}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="text-sm text-gray-600">{profile.email}</div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-900">{profile.collegeName}</div>
                      <div className="text-sm text-gray-600">CGPA: {profile.cgpa}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div className="text-sm text-gray-600">{profile.mobileNumber}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center space-x-3 mb-3">
                  <Award className="w-8 h-8" />
                  <div>
                    <div className="font-semibold">Profile Complete</div>
                    <div className="text-sm opacity-90">Keep your information updated</div>
                  </div>
                </div>
                <div className="text-sm opacity-75">
                  Having a complete profile increases your chances of getting hired by 60%
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SignedIn>
  );
}
