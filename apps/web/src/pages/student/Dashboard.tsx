import { SignedIn, useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Bell, 
  Search,
  Filter,
  ChevronRight,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  // Handler functions for dashboard actions
  const handleApplyJob = (jobId: string) => {
    console.log('Applying for job:', jobId);
    // TODO: Implement job application logic
    alert('Job application feature coming soon!');
  };

  const handleViewAllJobs = () => {
    navigate('/jobs');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleViewAnalytics = () => {
    console.log('Viewing analytics');
    // TODO: Navigate to analytics page
    alert('Analytics feature coming soon!');
  };

  const handleScheduleInterview = () => {
    console.log('Scheduling interview');
    // TODO: Open interview scheduling modal
    alert('Interview scheduling feature coming soon!');
  };

  const stats = [
    { 
      title: "Applications", 
      value: "12", 
      change: "+3 this week",
      icon: <Briefcase className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      title: "Interviews", 
      value: "5", 
      change: "2 upcoming",
      icon: <Calendar className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      title: "Offers", 
      value: "2", 
      change: "1 pending",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      title: "Profile Views", 
      value: "48", 
      change: "+12 this month",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const recentJobs = [
    {
      id: "job-1",
      title: "Software Engineer",
      company: "TechCorp",
      location: "Bangalore",
      salary: "₹8-12 LPA",
      type: "Full-time",
      posted: "2 days ago",
      urgent: true
    },
    {
      id: "job-2",
      title: "Frontend Developer",
      company: "WebTech Solutions",
      location: "Mumbai",
      salary: "₹6-10 LPA",
      type: "Full-time",
      posted: "3 days ago",
      urgent: false
    },
    {
      id: "job-3",
      title: "Data Analyst",
      company: "DataSoft",
      location: "Pune",
      salary: "₹5-8 LPA",
      type: "Intern",
      posted: "1 week ago",
      urgent: false
    }
  ];

  const upcomingInterviews = [
    {
      company: "TechCorp",
      position: "Software Engineer",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "Technical Round"
    },
    {
      company: "DataSoft",
      position: "Data Analyst",
      date: "Friday",
      time: "2:00 PM",
      type: "HR Round"
    }
  ];

  return (
    <SignedIn>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">PlacementPro</span>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                  <button className="text-blue-600 font-medium">Dashboard</button>
                  <button 
                    onClick={() => navigate('/jobs')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Jobs
                  </button>
                  <button 
                    onClick={() => navigate('/applications')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Applications
                  </button>
                  <button 
                    onClick={handleViewProfile}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Profile
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-gray-600">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonPopoverCard: "shadow-lg",
                        userButtonPopoverActions: "[&>*:nth-child(3)]:hidden" // Hide add email option
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Here's what's happening with your placement journey today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Job Opportunities */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Latest Job Opportunities</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Search className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentJobs.map((job, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                              {job.urgent && (
                                <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 font-medium mb-2">{job.company}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{job.posted}</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleApplyJob(job.id)}
                            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            Apply
                            <ChevronRight className="ml-1 w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleViewAllJobs}
                    className="mt-4 w-full py-2 text-blue-600 font-medium hover:text-blue-700"
                  >
                    View All Jobs
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Interviews */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">{interview.position}</h4>
                        <p className="text-sm text-gray-600">{interview.company}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>{interview.date} at {interview.time}</p>
                          <p className="text-blue-600">{interview.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full py-2 text-blue-600 font-medium hover:text-blue-700">
                    View Calendar
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-3">
                  <button 
                    onClick={handleViewProfile}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Profile
                  </button>
                  <button 
                    onClick={() => alert('Resume upload feature coming soon!')}
                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Upload Resume
                  </button>
                  <button 
                    onClick={handleScheduleInterview}
                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Schedule Mock Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
}
