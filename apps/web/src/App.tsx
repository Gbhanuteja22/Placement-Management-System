import React, { Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  SignedIn, 
  SignedOut, 
  UserButton, 
  useUser
} from '@clerk/clerk-react';
import { GraduationCap, Users, Briefcase, TrendingUp, ChevronRight, Zap } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Lazy load components
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const DynamicDashboard = React.lazy(() => import('./pages/DynamicDashboard'));
const JobsPage = React.lazy(() => import('./pages/Jobs'));
const JobDetailPage = React.lazy(() => import('./pages/JobDetail'));
const ApplicationsPage = React.lazy(() => import('./pages/Applications'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
const ProfileOnboardingPage = React.lazy(() => import('./pages/ProfileOnboardingPage'));
const CoordinatorDashboard = React.lazy(() => import('./pages/coordinator/CoordinatorDashboard'));
const CoordinatorSignupPage = React.lazy(() => import('./pages/CoordinatorSignupPage'));

function HomePage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Student Management",
      description: "Comprehensive student profile and progress tracking",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Briefcase className="w-8 h-8 text-green-600" />,
      title: "Job Opportunities", 
      description: "Access to latest placement opportunities and internships",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Career Growth",
      description: "Track your career progress and skill development",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-orange-600" />,
      title: "Training Programs",
      description: "Specialized training and certification programs",
      color: "from-orange-500 to-orange-600"
    }
  ];

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
            <div className="flex items-center space-x-4">
              <SignedOut>
                <div className="flex items-center space-x-3">
                  <nav className="hidden md:flex space-x-6 mr-4">
                    <a href="#features" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Features
                    </a>
                    <a href="#about" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      About
                    </a>
                    <a href="#contact" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Contact
                    </a>
                  </nav>
                  <button
                    onClick={() => navigate('/coordinator-signup')}
                    className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg text-sm font-medium hover:border-blue-800 transition-all duration-200"
                  >
                    For Coordinators
                  </button>
                  <button
                    onClick={() => navigate('/sign-in')}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 border border-gray-300 rounded-lg text-sm font-medium hover:border-blue-600 transition-all duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/sign-up')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Sign Up
                  </button>
                </div>
              </SignedOut>
              <SignedIn>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Welcome, {user?.firstName}!
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Gateway to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              {" "}Career Success
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline your placement process, connect with top employers, and accelerate your career growth with our comprehensive platform designed for students and institutions.
          </p>
          
          <SignedOut>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/sign-up')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold flex items-center"
              >
                Get Started Free
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/sign-in')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-200 text-lg font-semibold backdrop-blur-sm"
              >
                Sign In
              </button>
            </div>
          </SignedOut>
          
          <SignedIn>
            <button
              onClick={() => navigate('/dashboard')}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold"
            >
              <Zap className="mr-2 w-5 h-5" />
              Go to Dashboard
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignedIn>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and features designed to streamline your placement journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have successfully launched their careers with PlacementPro.
          </p>
          <SignedOut>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/sign-up')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold"
              >
                Get Started Today
              </button>
              <button 
                onClick={() => navigate('/sign-in')}
                className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-200 text-lg font-semibold"
              >
                Sign In
              </button>
            </div>
          </SignedOut>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <GraduationCap className="w-6 h-6" />
              <span className="text-xl font-bold">PlacementPro</span>
            </div>
            <p className="text-gray-400">
              © 2025 PlacementPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/sign-in" element={<AuthPage />} />
          <Route path="/sign-up" element={<AuthPage />} />
          <Route path="/coordinator-signup" element={<CoordinatorSignupPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <ProfileOnboardingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DynamicDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/jobs/:jobId" 
            element={
              <ProtectedRoute>
                <JobDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/applications" 
            element={
              <ProtectedRoute>
                <ApplicationsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/coordinator" 
            element={
              <ProtectedRoute>
                <CoordinatorDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
                  <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </Suspense>
      
      {/* Toast Container - Commented out until react-toastify is installed */}
      {/* <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}
    </div>
  );
}
