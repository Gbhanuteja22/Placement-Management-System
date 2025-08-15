import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { GraduationCap, AlertCircle, CheckCircle, Mail } from 'lucide-react';

// Organizational email domains
const ALLOWED_DOMAINS = [
  'mgit.ac.in',
  'mriirs.edu.in', 
  'iitd.ac.in',
  'iitr.ac.in',
  'nitc.ac.in',
  // Add more organizational domains as needed
];

function isOrganizationalEmail(email: string): boolean {
  if (!email) return false;
  const domain = email.split('@')[1];
  return ALLOWED_DOMAINS.includes(domain?.toLowerCase());
}

interface AuthPageProps {
  mode?: 'sign-in' | 'sign-up';
}

export default function AuthPage({ mode = 'sign-in' }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoaded } = useAuth();
  
  // Determine initial tab based on current route
  const getInitialTab = (): 'sign-in' | 'sign-up' => {
    if (location.pathname === '/sign-up') return 'sign-up';
    if (location.pathname === '/sign-in') return 'sign-in';
    return mode;
  };
  
  const [activeTab, setActiveTab] = useState<'sign-in' | 'sign-up'>(getInitialTab());
  const [emailError, setEmailError] = useState<string>('');
  const [testEmail, setTestEmail] = useState<string>('');

  const handleEmailValidation = (email: string) => {
    setTestEmail(email);
    if (email && !isOrganizationalEmail(email)) {
      setEmailError('Please use your organizational email to sign in');
    } else {
      setEmailError('');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PlacementPro
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {activeTab === 'sign-in' ? 'Welcome back' : 'Join PlacementPro'}
          </h2>
          <p className="text-gray-600">
            {activeTab === 'sign-in' 
              ? 'Sign in to access your placement dashboard' 
              : 'Create your account to get started'
            }
          </p>
        </div>

        {/* Email Domain Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Organizational Email Required</h4>
              <p className="text-sm text-blue-700 mt-1">
                Please use your organizational email address to access PlacementPro.
              </p>
              <div className="mt-2">
                <p className="text-xs text-blue-600 font-medium">Accepted domains:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ALLOWED_DOMAINS.slice(0, 3).map(domain => (
                    <span key={domain} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      @{domain}
                    </span>
                  ))}
                  {ALLOWED_DOMAINS.length > 3 && (
                    <span className="text-xs text-blue-600">+{ALLOWED_DOMAINS.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Validation Test */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test your email domain:
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="student@mgit.ac.in"
              value={testEmail}
              onChange={(e) => handleEmailValidation(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {testEmail && (
              <div className="flex items-center">
                {isOrganizationalEmail(testEmail) ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          {emailError && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {emailError}
            </p>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setActiveTab('sign-in');
              navigate('/sign-in');
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'sign-in'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('sign-up');
              navigate('/sign-up');
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'sign-up'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Forms */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            {activeTab === 'sign-in' ? (
              <SignIn
                afterSignInUrl="/dashboard"
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full",
                    card: "shadow-none border-0 w-full",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50 w-full",
                    formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full",
                    footerActionLink: "text-blue-600 hover:text-blue-700",
                    form: "w-full",
                    formFieldRow: "w-full",
                    formField: "w-full"
                  },
                  layout: {
                    socialButtonsPlacement: "bottom"
                  }
                }}
              />
            ) : (
              <SignUp
                afterSignUpUrl="/dashboard"
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full",
                    card: "shadow-none border-0 w-full",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50 w-full",
                    formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full",
                    footerActionLink: "text-blue-600 hover:text-blue-700",
                    form: "w-full",
                    formFieldRow: "w-full",
                    formField: "w-full"
                  },
                  layout: {
                    socialButtonsPlacement: "bottom"
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
