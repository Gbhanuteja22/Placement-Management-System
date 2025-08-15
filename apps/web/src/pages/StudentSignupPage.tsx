import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Building, Search, Check, X } from 'lucide-react';
import { toast } from '../utils/toast';

interface Institution {
  _id: string;
  name: string;
  city: string;
  state: string;
}

export default function StudentSignupPage() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isAuthorized: boolean;
    institution?: Institution;
  } | null>(null);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/institutions`);
      if (response.ok) {
        const data = await response.json();
        setInstitutions(data);
      } else {
        toast.error('Failed to load institutions');
      }
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('Failed to load institutions');
    }
  };

  const filteredInstitutions = institutions.filter(institution =>
    institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInstitutionSelect = (institution: Institution) => {
    setSelectedInstitution(institution);
    setVerificationResult(null);
  };

  const verifyStudentEligibility = async () => {
    if (!selectedInstitution || !studentEmail) {
      toast.error('Please select an institution and enter your email');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/institutions/verify-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: studentEmail,
          institutionId: selectedInstitution._id
        })
      });

      const result = await response.json();
      setVerificationResult(result);

      if (result.isAuthorized) {
        toast.success('You are authorized to register from this institution!');
      } else {
        toast.error('You are not authorized to register from this institution. Please contact your placement coordinator.');
      }
    } catch (error) {
      console.error('Error verifying student:', error);
      toast.error('Failed to verify student eligibility');
    } finally {
      setIsVerifying(false);
    }
  };

  const proceedToSignup = () => {
    if (verificationResult?.isAuthorized) {
      // Store institution info for signup process
      localStorage.setItem('selectedInstitution', JSON.stringify(selectedInstitution));
      navigate('/sign-up');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b">
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
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
            <p className="text-gray-600">Select your institution to get started</p>
          </div>

          {/* Step 1: Institution Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Select Your Institution
            </h2>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search institutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredInstitutions.map((institution) => (
                <button
                  key={institution._id}
                  onClick={() => handleInstitutionSelect(institution)}
                  className={`w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    selectedInstitution?._id === institution._id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{institution.name}</h3>
                      <p className="text-sm text-gray-600">{institution.city}, {institution.state}</p>
                    </div>
                    {selectedInstitution?._id === institution._id && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {filteredInstitutions.length === 0 && searchTerm && (
              <div className="text-center py-8 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No institutions found matching your search.</p>
                <p className="text-sm mt-2">
                  Can't find your institution? Ask your placement coordinator to register it.
                </p>
              </div>
            )}
          </div>

          {/* Step 2: Email Verification */}
          {selectedInstitution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Verify Your Eligibility
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800">
                  <strong>Selected Institution:</strong> {selectedInstitution.name}
                </p>
                <p className="text-blue-600 text-sm">
                  {selectedInstitution.city}, {selectedInstitution.state}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Institutional Email Address *
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="your.email@institution.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use your official institutional email address
                  </p>
                </div>

                <button
                  onClick={verifyStudentEligibility}
                  disabled={isVerifying || !studentEmail || !selectedInstitution}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify Eligibility'
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Verification Result */}
          {verificationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {verificationResult.isAuthorized ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Verification Successful!
                  </h3>
                  <p className="text-green-700 mb-6">
                    You are authorized to register for placements from {selectedInstitution?.name}.
                  </p>
                  <button
                    onClick={proceedToSignup}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Proceed to Sign Up
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <X className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Access Not Authorized
                  </h3>
                  <p className="text-red-700 mb-4">
                    You are not currently authorized to register from {selectedInstitution?.name}.
                  </p>
                  <div className="bg-red-100 rounded-lg p-4 text-sm text-red-800">
                    <p className="font-medium mb-2">What can you do?</p>
                    <ul className="text-left space-y-1">
                      <li>• Contact your placement coordinator</li>
                      <li>• Verify your institutional email address</li>
                      <li>• Check if your details were added to the authorized list</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Need Help?
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Can't find your institution? Ask your placement coordinator to register it first.</p>
              <p>• Having trouble with verification? Contact your placement office for assistance.</p>
              <p>• For technical support, reach out to our support team.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
