import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  Award,
  FileText,
  Upload,
  Plus,
  X,
  Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const BRANCH_OPTIONS = [
  'CSE', 'CSM', 'CSD', 'CSB', 'IT', 'ECE', 'Mechanical', 'Mechatronics', 
  'AIML', 'AIDS (Data Science)', 'Civil', 'EEE', 'Chemical', 'Biotechnology', 
  'Aerospace', 'Automobile', 'Mining', 'Metallurgy', 'Textile', 'Food Technology'
];

interface Institution {
  _id: string;
  name: string;
  city: string;
  state: string;
}

interface ProfileData {
  name: string;
  rollNumber: string;
  age: number;
  address: string;
  collegeEmail: string;
  personalEmail: string;
  collegeName: string;
  institutionId: string; // New field for institution ID
  isRegisteredInstitution: boolean; // New field to track if from registered institution
  branch: string; // New field for branch
  academicStartYear: string;
  academicEndYear: string;
  currentSemester: string;
  mobileNumber: string;
  cgpa: number;
  // Semester-wise SGPA tracking
  semesterGrades: Array<{
    semester: string;
    sgpa: number;
    credits?: number;
    subjects?: Array<{
      name: string;
      grade: string;
      credits: number;
    }>;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    github?: string;
    demo?: string;
  }>;
  resumeFile?: File;
  resumeUrl?: string;
  marksMemoUrl?: string;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
    url?: string;
    mediaUrl?: string;
  }>;
  skills: string[];
  achievements: string[];
}

export default function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    rollNumber: '',
    age: 18,
    address: '',
    collegeEmail: user?.emailAddresses?.[0]?.emailAddress || '',
    personalEmail: '',
    collegeName: '',
    institutionId: '',
    isRegisteredInstitution: false,
    branch: '',
    academicStartYear: '',
    academicEndYear: '',
    currentSemester: '',
    mobileNumber: '',
    cgpa: 0,
    semesterGrades: [],
    projects: [],
    resumeUrl: '',
    marksMemoUrl: '',
    certifications: [],
    skills: [],
    achievements: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [resumeUploadStatus, setResumeUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // Fetch institutions on component mount
  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoadingInstitutions(true);
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
    } finally {
      setLoadingInstitutions(false);
    }
  };

  const handleInstitutionChange = (value: string) => {
    if (value === 'other') {
      setProfileData(prev => ({
        ...prev,
        institutionId: '',
        collegeName: '',
        isRegisteredInstitution: false
      }));
    } else {
      const selectedInstitution = institutions.find(inst => inst._id === value);
      if (selectedInstitution) {
        setProfileData(prev => ({
          ...prev,
          institutionId: value,
          collegeName: selectedInstitution.name,
          isRegisteredInstitution: true
        }));
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    setResumeUploadStatus('uploading');
    try {
      // For now, we'll just store the file locally and simulate upload
      setProfileData(prev => ({
        ...prev,
        resumeFile: file,
        resumeUrl: `resume_${file.name}`
      }));
      setResumeUploadStatus('success');
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      console.error('Resume upload error:', error);
      setResumeUploadStatus('error');
      toast.error('Failed to upload resume');
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setProfileData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (achievement: string) => {
    setProfileData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a !== achievement)
    }));
  };

  // Semester-wise SGPA management functions
  const generateRequiredSemesters = (currentSemester: string) => {
    const semesterNumber = parseInt(currentSemester);
    if (semesterNumber <= 1) return [];
    
    const requiredSemesters = [];
    // Generate all previous semesters up to current semester - 1
    for (let i = 1; i < semesterNumber; i++) {
      requiredSemesters.push(`${i}${getOrdinalSuffix(i)} Semester`);
    }
    return requiredSemesters;
  };

  const getOrdinalSuffix = (num: number) => {
    if (num >= 11 && num <= 13) return 'th';
    switch (num % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const updateSemesterGrade = (semester: string, sgpa: number) => {
    setProfileData(prev => {
      const existingIndex = prev.semesterGrades.findIndex(sg => sg.semester === semester);
      const newSemesterGrades = [...prev.semesterGrades];
      
      if (existingIndex >= 0) {
        newSemesterGrades[existingIndex] = { ...newSemesterGrades[existingIndex], sgpa };
      } else {
        newSemesterGrades.push({ semester, sgpa });
      }
      
      return {
        ...prev,
        semesterGrades: newSemesterGrades
      };
    });
  };

  const calculateCGPA = () => {
    if (profileData.semesterGrades.length === 0) return profileData.cgpa;
    
    const totalSGPA = profileData.semesterGrades.reduce((sum, sg) => sum + sg.sgpa, 0);
    return +(totalSGPA / profileData.semesterGrades.length).toFixed(2);
  };

  // Update CGPA whenever semester grades change
  const handleSemesterChange = (semester: string) => {
    handleInputChange('currentSemester', semester);
    
    // Auto-generate semester grades for any semester above 1st
    if (parseInt(semester) > 1) {
      const requiredSemesters = generateRequiredSemesters(semester);
      const newSemesterGrades = requiredSemesters.map(sem => ({
        semester: sem,
        sgpa: profileData.semesterGrades.find(sg => sg.semester === sem)?.sgpa || 0
      }));
      
      setProfileData(prev => ({
        ...prev,
        currentSemester: semester,
        semesterGrades: newSemesterGrades
      }));
    } else {
      // Clear semester grades for 1st semester students
      setProfileData(prev => ({
        ...prev,
        currentSemester: semester,
        semesterGrades: []
      }));
    }
  };

  const addProject = () => {
    setProfileData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        title: '',
        description: '',
        technologies: [],
        github: '',
        demo: ''
      }]
    }));
  };

  const updateProject = (index: number, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    setProfileData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        name: '',
        issuer: '',
        date: '',
        credentialId: '',
        url: '',
        mediaUrl: ''
      }]
    }));
  };

  const updateCertification = (index: number, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    // Validate academic year information
    if (!profileData.academicStartYear || !profileData.academicEndYear || !profileData.currentSemester || !profileData.branch) {
      toast.error('Please fill in all academic information including branch');
      return;
    }

    if (parseInt(profileData.academicStartYear) >= parseInt(profileData.academicEndYear)) {
      toast.error('End year must be after start year');
      return;
    }

    // Validate CMM Google Drive URL if provided
    if (profileData.marksMemoUrl && profileData.marksMemoUrl.trim() !== '') {
      const googleDrivePattern = /^https:\/\/(drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view|drive\.google\.com\/open\?id=[a-zA-Z0-9_-]+|docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+)/;
      if (!googleDrivePattern.test(profileData.marksMemoUrl)) {
        toast.error('Please provide a valid Google Drive URL for CMM. Example: https://drive.google.com/file/d/your-file-id/view');
        return;
      }
    }

    // Calculate final CGPA for semester-wise entries
    let finalCGPA = profileData.cgpa;
    if (parseInt(profileData.currentSemester) >= 7 && profileData.semesterGrades.length > 0) {
      finalCGPA = calculateCGPA();
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          email: profileData.collegeEmail,
          firstName: user.firstName || profileData.name.split(' ')[0],
          lastName: user.lastName || profileData.name.split(' ')[1] || '',
          ...profileData,
          cgpa: finalCGPA
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      toast.success('Profile created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return profileData.name && profileData.rollNumber && profileData.age;
      case 1:
        return profileData.personalEmail && profileData.mobileNumber && profileData.address;
      case 2:
        const basicAcademicInfo = profileData.collegeName && profileData.branch && 
                                 profileData.academicStartYear && profileData.academicEndYear && 
                                 profileData.currentSemester;
        
        if (!basicAcademicInfo) return false;
        
        const currentSem = parseInt(profileData.currentSemester);
        if (currentSem >= 7) {
          // For 7th/8th semester students, check if all required semester SGPAs are filled
          const requiredSemesters = generateRequiredSemesters(profileData.currentSemester);
          const allSemesterGradesFilled = requiredSemesters.every(semester => {
            const grade = profileData.semesterGrades.find(sg => sg.semester === semester);
            return grade && grade.sgpa > 0;
          });
          return allSemesterGradesFilled;
        } else {
          // For students below 7th semester, check regular CGPA
          return profileData.cgpa > 0;
        }
      case 3:
        return profileData.skills.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const stepTitles = [
    'Personal Information',
    'Contact Details',
    'Academic Information',
    'Skills & Projects',
    'Achievements & Certifications'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">PlacementPro</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
            <p className="text-gray-600">Let's set up your profile to get started with placements</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {stepTitles.map((title, index) => (
                <div key={index} className="flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        index <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < stepTitles.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-2">
                    <p className={`text-sm ${index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                      {title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      value={profileData.rollNumber}
                      onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your roll number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your age"
                      min="16"
                      max="30"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      College Email (Auto-filled)
                    </label>
                    <input
                      type="email"
                      value={profileData.collegeEmail}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">This is your registered college email</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Email *
                    </label>
                    <input
                      type="email"
                      value={profileData.personalEmail}
                      onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your personal email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={profileData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your complete address"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Institution *
                    </label>
                    {loadingInstitutions ? (
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Loading institutions...
                      </div>
                    ) : (
                      <select
                        value={profileData.institutionId || (profileData.isRegisteredInstitution ? '' : 'other')}
                        onChange={(e) => handleInstitutionChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select your institution</option>
                        {institutions.map(institution => (
                          <option key={institution._id} value={institution._id}>
                            {institution.name} - {institution.city}, {institution.state}
                          </option>
                        ))}
                        <option value="other">Other (Not Listed)</option>
                      </select>
                    )}
                    
                    {!profileData.isRegisteredInstitution && profileData.institutionId === '' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter Institution Name *
                        </label>
                        <input
                          type="text"
                          value={profileData.collegeName}
                          onChange={(e) => handleInputChange('collegeName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your institution name"
                          required
                        />
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-yellow-800">
                                Limited Access Notice
                              </h3>
                              <div className="mt-1 text-sm text-yellow-700">
                                <p>Since your institution is not registered with PlacementPro, you will only have access to external job postings. On-campus placements will not be available.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {profileData.isRegisteredInstitution && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                              Great! Your institution is registered with PlacementPro.
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                              You'll have access to both on-campus and external job opportunities.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch/Department *
                    </label>
                    <select
                      value={profileData.branch}
                      onChange={(e) => handleInputChange('branch', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Your Branch</option>
                      {BRANCH_OPTIONS.map(branch => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Start Year *
                    </label>
                    <select
                      value={profileData.academicStartYear}
                      onChange={(e) => handleInputChange('academicStartYear', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Start Year</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() - 5 + i;
                        return (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic End Year *
                    </label>
                    <select
                      value={profileData.academicEndYear}
                      onChange={(e) => handleInputChange('academicEndYear', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select End Year</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() - 1 + i;
                        return (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Semester *
                    </label>
                    <select
                      value={profileData.currentSemester}
                      onChange={(e) => handleSemesterChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Semester</option>
                      <option value="1">1st Semester</option>
                      <option value="2">2nd Semester</option>
                      <option value="3">3rd Semester</option>
                      <option value="4">4th Semester</option>
                      <option value="5">5th Semester</option>
                      <option value="6">6th Semester</option>
                      <option value="7">7th Semester</option>
                      <option value="8">8th Semester</option>
                    </select>
                  </div>
                  
                  {/* Semester-wise SGPA for 7th/8th semester students */}
                  {parseInt(profileData.currentSemester) >= 7 && (
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Previous Semester SGPA Details</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                              Academic Performance Required
                            </h3>
                            <div className="mt-1 text-sm text-blue-700">
                              <p>Since you're in {profileData.currentSemester === '7' ? '7th' : '8th'} semester, please provide your SGPA for all previous semesters. Your CGPA will be calculated automatically.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {generateRequiredSemesters(profileData.currentSemester).map((semester) => {
                          const currentGrade = profileData.semesterGrades.find(sg => sg.semester === semester);
                          return (
                            <div key={semester}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {semester} SGPA *
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                max="10"
                                min="0"
                                value={currentGrade?.sgpa || ''}
                                onChange={(e) => updateSemesterGrade(semester, parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter SGPA"
                                required
                              />
                            </div>
                          );
                        })}
                      </div>
                      
                      {profileData.semesterGrades.length > 0 && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-green-800">
                                Calculated CGPA: {calculateCGPA().toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Regular CGPA input for students below 7th semester */}
                  {parseInt(profileData.currentSemester) < 7 && profileData.currentSemester && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CGPA *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        max="10"
                        min="0"
                        value={profileData.cgpa}
                        onChange={(e) => handleInputChange('cgpa', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your CGPA"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Projects</h2>
                
                {/* Skills Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add a skill"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Projects
                    </label>
                    <button
                      type="button"
                      onClick={addProject}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Project
                    </button>
                  </div>
                  
                  {profileData.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Project {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={project.title}
                          onChange={(e) => updateProject(index, 'title', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="GitHub URL"
                          value={project.github || ''}
                          onChange={(e) => updateProject(index, 'github', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <textarea
                        placeholder="Project Description"
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        rows={2}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Technologies (comma separated)"
                        value={project.technologies.join(', ')}
                        onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Upload
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                        }
                      }}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label 
                      htmlFor="resume-upload" 
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      {resumeUploadStatus === 'uploading' ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-blue-600">Uploading...</p>
                        </div>
                      ) : profileData.resumeFile ? (
                        <div className="text-center">
                          <p className="text-green-600 font-medium">✓ {profileData.resumeFile.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-gray-600">Click to upload your resume</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX formats supported</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {resumeUploadStatus === 'error' && (
                    <p className="text-red-600 text-sm mt-2">Failed to upload resume. Please try again.</p>
                  )}
                </div>

                {/* CMM URL Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CMM (Consolidated Marks Memo) Google Drive Link
                  </label>
                  <input
                    type="url"
                    value={profileData.marksMemoUrl}
                    onChange={(e) => setProfileData(prev => ({ ...prev, marksMemoUrl: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/your-file-id/view"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your Consolidated Marks Memo to Google Drive and share the link (set to "Anyone with the link can view")
                  </p>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements & Certifications</h2>
                
                {/* Achievements Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Achievements
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add an achievement"
                    />
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {profileData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">{achievement}</span>
                        <button
                          type="button"
                          onClick={() => removeAchievement(achievement)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Certifications
                    </label>
                    <button
                      type="button"
                      onClick={addCertification}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Certification
                    </button>
                  </div>
                  
                  {profileData.certifications.map((cert, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Certification {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Certification Name"
                          value={cert.name}
                          onChange={(e) => updateCertification(index, 'name', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Issuing Organization"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          placeholder="Issue Date"
                          value={cert.date}
                          onChange={(e) => updateCertification(index, 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Credential ID"
                          value={cert.credentialId || ''}
                          onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="url"
                        placeholder="Verification URL"
                        value={cert.url || ''}
                        onChange={(e) => updateCertification(index, 'url', e.target.value)}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep === 4 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isStepValid()}
                  className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
