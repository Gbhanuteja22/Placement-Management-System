import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Building, 
  MapPin, 
  Users, 
  Mail, 
  Upload, 
  FileText, 
  Check,
  X,
  Plus,
  Trash2,
  Download
} from 'lucide-react';
import { toast } from '../utils/toast';

interface PlacementOfficer {
  name: string;
  email: string;
  designation: string;
}

interface StudentData {
  name?: string;
  email?: string;
  rollNumber?: string;
  branch?: string;
  semester?: string;
}

export default function CoordinatorSignupPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    coordinatorName: '',
    coordinatorEmail: '',
    institutionName: '',
    institutionAddress: '',
    institutionCity: '',
    institutionState: '',
    institutionPincode: '',
    institutionPhone: '',
    institutionWebsite: '',
    placementOfficers: [{ name: '', email: '', designation: 'Placement Officer' }] as PlacementOfficer[],
    studentData: [] as StudentData[],
    allowAllStudents: false
  });

  const [studentUploadMethod, setStudentUploadMethod] = useState<'manual' | 'excel' | 'text'>('manual');
  const [studentTextData, setStudentTextData] = useState('');

  const addPlacementOfficer = () => {
    setFormData(prev => ({
      ...prev,
      placementOfficers: [...prev.placementOfficers, { name: '', email: '', designation: 'Placement Officer' }]
    }));
  };

  const removePlacementOfficer = (index: number) => {
    if (formData.placementOfficers.length > 1) {
      setFormData(prev => ({
        ...prev,
        placementOfficers: prev.placementOfficers.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePlacementOfficer = (index: number, field: keyof PlacementOfficer, value: string) => {
    setFormData(prev => ({
      ...prev,
      placementOfficers: prev.placementOfficers.map((officer, i) => 
        i === index ? { ...officer, [field]: value } : officer
      )
    }));
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // This is a simplified version - in production, use a proper Excel parser like xlsx
        const text = e.target?.result as string;
        parseStudentData(text);
      };
      reader.readAsText(file);
    }
  };

  const parseStudentData = (text: string) => {
    try {
      const lines = text.split('\n').filter(line => line.trim());
      const students: StudentData[] = [];

      lines.forEach((line, index) => {
        if (index === 0) return; // Skip header
        const parts = line.split(',').map(part => part.trim());
        
        if (parts.length >= 2) {
          students.push({
            name: parts[0] || '',
            email: parts[1] || '',
            rollNumber: parts[2] || '',
            branch: parts[3] || '',
            semester: parts[4] || ''
          });
        }
      });

      setFormData(prev => ({ ...prev, studentData: students }));
      toast.success(`Parsed ${students.length} student records`);
    } catch (error) {
      toast.error('Failed to parse student data. Please check the format.');
    }
  };

  const handleTextDataParse = () => {
    parseStudentData(studentTextData);
  };

  const downloadSampleFile = () => {
    const csvContent = [
      'Name,Email,Roll Number,Branch,Semester',
      'John Doe,john.doe@example.edu,20CS01001,CSE,7',
      'Jane Smith,jane.smith@example.edu,20IT01002,IT,7',
      'Bob Johnson,bob.johnson@example.edu,20EC01003,ECE,6'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_data_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Comprehensive validation
      if (!formData.coordinatorName || !formData.coordinatorEmail || !formData.institutionName || 
          !formData.institutionAddress || !formData.institutionCity || !formData.institutionState) {
        toast.error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.coordinatorEmail)) {
        toast.error('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Check placement officers
      const validOfficers = formData.placementOfficers.filter(officer => officer.name && officer.email);
      if (validOfficers.length === 0) {
        toast.error('Please add at least one placement officer');
        setIsLoading(false);
        return;
      }

      // Validate placement officer emails
      for (const officer of validOfficers) {
        if (!emailRegex.test(officer.email)) {
          toast.error(`Invalid email format for officer: ${officer.name}`);
          setIsLoading(false);
          return;
        }
      }

      console.log('Submitting registration data:', formData);

      // API call to register institution
      const response = await fetch(`${import.meta.env.VITE_API_URL}/institutions/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();
      console.log('Registration response:', responseData);

      if (response.ok) {
        toast.success('Institution registered successfully!');
        // Store institution info for coordinator login
        localStorage.setItem('registeredInstitution', JSON.stringify({
          id: responseData.institutionId,
          name: formData.institutionName,
          coordinatorEmail: formData.coordinatorEmail
        }));
        navigate('/sign-in?type=coordinator');
      } else {
        console.error('Registration failed:', responseData);
        toast.error(responseData.message || responseData.error || 'Failed to register institution');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Institution Information</h2>
        <p className="text-gray-600">Let's start by setting up your institution details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            value={formData.coordinatorName}
            onChange={(e) => setFormData(prev => ({ ...prev, coordinatorName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Email *
          </label>
          <input
            type="email"
            value={formData.coordinatorEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, coordinatorEmail: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="coordinator@institution.edu"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institution Name *
          </label>
          <input
            type="text"
            value={formData.institutionName}
            onChange={(e) => setFormData(prev => ({ ...prev, institutionName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Mahatma Gandhi Institute of Technology"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institution Address *
          </label>
          <textarea
            value={formData.institutionAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, institutionAddress: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter complete address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.institutionCity}
            onChange={(e) => setFormData(prev => ({ ...prev, institutionCity: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="City"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            value={formData.institutionState}
            onChange={(e) => setFormData(prev => ({ ...prev, institutionState: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="State"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode
          </label>
          <input
            type="text"
            value={formData.institutionPincode}
            onChange={(e) => setFormData(prev => ({ ...prev, institutionPincode: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Pincode"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.institutionPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, institutionPhone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Phone number"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institution Website
          </label>
          <input
            type="url"
            value={formData.institutionWebsite}
            onChange={(e) => setFormData(prev => ({ ...prev, institutionWebsite: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.institution.edu"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Placement Officers</h2>
        <p className="text-gray-600">Add all placement officers who will have access to this dashboard</p>
      </div>

      <div className="space-y-4">
        {formData.placementOfficers.map((officer, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Officer {index + 1}</h3>
              {formData.placementOfficers.length > 1 && (
                <button
                  onClick={() => removePlacementOfficer(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={officer.name}
                  onChange={(e) => updatePlacementOfficer(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Officer name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={officer.email}
                  onChange={(e) => updatePlacementOfficer(index, 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="officer@institution.edu"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  value={officer.designation}
                  onChange={(e) => updatePlacementOfficer(index, 'designation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Designation"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addPlacementOfficer}
          className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Officer</span>
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Access</h2>
        <p className="text-gray-600">Configure which students can access the platform from your institution</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.allowAllStudents}
            onChange={(e) => setFormData(prev => ({ ...prev, allowAllStudents: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Allow all students from this institution to register</span>
        </label>

        {!formData.allowAllStudents && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Student Data</h3>
            
            <div className="mb-4">
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="manual"
                    checked={studentUploadMethod === 'manual'}
                    onChange={(e) => setStudentUploadMethod(e.target.value as any)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Manual Entry</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="excel"
                    checked={studentUploadMethod === 'excel'}
                    onChange={(e) => setStudentUploadMethod(e.target.value as any)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Excel Upload</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="text"
                    checked={studentUploadMethod === 'text'}
                    onChange={(e) => setStudentUploadMethod(e.target.value as any)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Text Data</span>
                </label>
              </div>
            </div>

            {studentUploadMethod === 'excel' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={downloadSampleFile}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Sample File</span>
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Excel/CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleExcelUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Format: Name, Email, Roll Number, Branch, Semester
                  </p>
                </div>
              </div>
            )}

            {studentUploadMethod === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste Student Data
                  </label>
                  <textarea
                    value={studentTextData}
                    onChange={(e) => setStudentTextData(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Name,Email,Roll Number,Branch,Semester&#10;John Doe,john.doe@example.edu,20CS01001,CSE,7&#10;Jane Smith,jane.smith@example.edu,20IT01002,IT,7"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Format: One student per line, comma-separated values
                  </p>
                </div>
                
                <button
                  onClick={handleTextDataParse}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Parse Data
                </button>
              </div>
            )}

            {formData.studentData.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  Student Data Preview ({formData.studentData.length} students)
                </h4>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">Roll Number</th>
                        <th className="px-3 py-2 text-left">Branch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.studentData.slice(0, 5).map((student, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-3 py-2">{student.name}</td>
                          <td className="px-3 py-2">{student.email}</td>
                          <td className="px-3 py-2">{student.rollNumber}</td>
                          <td className="px-3 py-2">{student.branch}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {formData.studentData.length > 5 && (
                    <p className="px-3 py-2 text-gray-500 text-center">
                      ... and {formData.studentData.length - 5} more students
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

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
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">Institution Details</span>
            <span className="text-sm text-gray-600">Placement Officers</span>
            <span className="text-sm text-gray-600">Student Access</span>
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/')}
              className="flex items-center space-x-2 px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span>{currentStep > 1 ? 'Previous' : 'Cancel'}</span>
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => {
                  // Validate current step before proceeding
                  if (currentStep === 1) {
                    if (!formData.coordinatorName || !formData.coordinatorEmail || !formData.institutionName || 
                        !formData.institutionAddress || !formData.institutionCity || !formData.institutionState) {
                      toast.error('Please fill in all required fields in this step');
                      return;
                    }
                  }
                  if (currentStep === 2) {
                    // Check if at least one placement officer has name and email
                    const validOfficers = formData.placementOfficers.filter(officer => officer.name && officer.email);
                    if (validOfficers.length === 0) {
                      toast.error('Please add at least one placement officer with name and email');
                      return;
                    }
                  }
                  setCurrentStep(currentStep + 1);
                }}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span>Next</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
