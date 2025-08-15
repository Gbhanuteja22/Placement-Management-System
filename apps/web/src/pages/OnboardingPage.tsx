import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Upload,
  Plus,
  X,
  Check
} from 'lucide-react';

interface FormData {
  name: string;
  rollNumber: string;
  age: string;
  address: string;
  collegeEmail: string;
  personalEmail: string;
  collegeName: string;
  academicYear: string;
  mobileNumber: string;
  cgpa: string;
  resumeUrl: string;
  marksMemoUrl: string;
  projects: Array<{
    title: string;
    description: string;
    technologies: string;
    github: string;
    demo: string;
  }>;
  skills: string[];
  achievements: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId: string;
    url: string;
  }>;
}

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    rollNumber: '',
    age: '',
    address: '',
    collegeEmail: '',
    personalEmail: '',
    collegeName: 'Mahatma Gandhi Institute of Technology',
    academicYear: '',
    mobileNumber: '',
    cgpa: '',
    resumeUrl: '',
    marksMemoUrl: '',
    projects: [{ title: '', description: '', technologies: '', github: '', demo: '' }],
    skills: [],
    achievements: [],
    certifications: [{ name: '', issuer: '', date: '', credentialId: '', url: '' }]
  });

  useEffect(() => {
    if (isLoaded && user) {
      // Pre-fill email from Clerk
      setFormData(prev => ({
        ...prev,
        collegeEmail: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || ''
      }));
    }
  }, [isLoaded, user]);

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.rollNumber && formData.age && formData.address;
      case 2:
        return formData.collegeEmail && formData.personalEmail && formData.mobileNumber;
      case 3:
        return formData.academicYear && formData.cgpa && formData.resumeUrl && formData.marksMemoUrl;
      case 4:
        return formData.skills.length > 0;
      default:
        return true;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateGoogleDriveUrl = (url: string) => {
    const googleDrivePattern = /^https:\/\/drive\.google\.com\/(file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/;
    return googleDrivePattern.test(url);
  };

  const handleUrlChange = (field: 'resumeUrl' | 'marksMemoUrl', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (value && !validateGoogleDriveUrl(value)) {
      toast.error(`Please enter a valid Google Drive URL for ${field === 'resumeUrl' ? 'resume' : 'marks memo'}`);
    }
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', technologies: '', github: '', demo: '' }]
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (achievement: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a !== achievement)
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', date: '', credentialId: '', url: '' }]
    }));
  };

  const updateCertification = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Validate Google Drive URLs
    if (!validateGoogleDriveUrl(formData.resumeUrl)) {
      toast.error('Please provide a valid Google Drive URL for your resume');
      return;
    }

    if (!validateGoogleDriveUrl(formData.marksMemoUrl)) {
      toast.error('Please provide a valid Google Drive URL for your marks memo');
      return;
    }

    setIsSubmitting(true);
    try {
      // Parse the name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const profileData = {
        clerkUserId: user.id,
        email: formData.collegeEmail,
        firstName,
        lastName,
        rollNumber: formData.rollNumber,
        age: parseInt(formData.age),
        address: formData.address,
        collegeEmail: formData.collegeEmail,
        personalEmail: formData.personalEmail,
        collegeName: formData.collegeName,
        academicYear: formData.academicYear,
        mobileNumber: formData.mobileNumber,
        cgpa: parseFloat(formData.cgpa),
        resumeUrl: formData.resumeUrl,
        marksMemoUrl: formData.marksMemoUrl,
        skills: formData.skills,
        projects: formData.projects.filter(p => p.title.trim()), // Only include projects with titles
        achievements: formData.achievements,
        certifications: formData.certifications.filter(c => c.name.trim()), // Only include certifications with names
        isOnboardingComplete: true
      };

      console.log('Saving profile data:', profileData);
      
      // Make API call to save the profile
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        toast.success('Profile created successfully!');
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        if (response.status === 409 && errorData.error?.includes('Roll number')) {
          toast.error('This roll number is already registered by another student. Please check your roll number.');
        } else {
          throw new Error(errorData.error || 'Failed to create profile');
        }
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
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
              <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
            </div>
            <p className="text-gray-600">Let's set up your placement profile to get started</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {stepTitles.map((title, index) => (
                <div key={index} className="flex-1 text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                    step > index + 1 ? 'bg-green-500 text-white' :
                    step === index + 1 ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {step > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <p className={`text-xs ${step === index + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                    {title}
                  </p>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / stepTitles.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
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
                      value={formData.rollNumber}
                      onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 21R11A0501"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your age"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Address *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your complete address"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      College Email *
                    </label>
                    <input
                      type="email"
                      value={formData.collegeEmail}
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
                      value={formData.personalEmail}
                      onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your personal email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      College Name
                    </label>
                    <input
                      type="text"
                      value={formData.collegeName}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Academic Year *
                    </label>
                    <select
                      value={formData.academicYear}
                      onChange={(e) => handleInputChange('academicYear', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Academic Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Award className="h-4 w-4 inline mr-2" />
                      CGPA *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.cgpa}
                      onChange={(e) => handleInputChange('cgpa', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your CGPA"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Upload className="h-4 w-4 inline mr-2" />
                      Resume Google Drive URL *
                    </label>
                    <input
                      type="url"
                      value={formData.resumeUrl}
                      onChange={(e) => handleUrlChange('resumeUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload your resume to Google Drive and paste the shareable link here
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Upload className="h-4 w-4 inline mr-2" />
                      Consolidated Marks Memo Google Drive URL *
                    </label>
                    <input
                      type="url"
                      value={formData.marksMemoUrl}
                      onChange={(e) => handleUrlChange('marksMemoUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload your consolidated marks memo to Google Drive and paste the shareable link here
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Projects</h2>
                
                {/* Skills Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills *</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter a skill"
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Projects Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Projects</label>
                    <button
                      onClick={addProject}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <Plus className="h-4 w-4 inline mr-1" />
                      Add Project
                    </button>
                  </div>
                  {formData.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
                        {index > 0 && (
                          <button
                            onClick={() => removeProject(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updateProject(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Project Title"
                        />
                        <input
                          type="text"
                          value={project.technologies}
                          onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Technologies (comma separated)"
                        />
                        <textarea
                          value={project.description}
                          onChange={(e) => updateProject(index, 'description', e.target.value)}
                          className="md:col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Project Description"
                          rows={2}
                        />
                        <input
                          type="url"
                          value={project.github}
                          onChange={(e) => updateProject(index, 'github', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="GitHub URL (optional)"
                        />
                        <input
                          type="url"
                          value={project.demo}
                          onChange={(e) => updateProject(index, 'demo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Demo URL (optional)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements & Certifications</h2>
                
                {/* Achievements Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                  <div className="space-y-2 mb-3">
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        <span className="text-sm">{achievement}</span>
                        <button
                          onClick={() => removeAchievement(achievement)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter an achievement"
                    />
                    <button
                      onClick={addAchievement}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Certifications Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Certifications</label>
                    <button
                      onClick={addCertification}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <Plus className="h-4 w-4 inline mr-1" />
                      Add Certification
                    </button>
                  </div>
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Certification {index + 1}</h4>
                        {index > 0 && (
                          <button
                            onClick={() => removeCertification(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCertification(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Certification Name"
                        />
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Issuing Organization"
                        />
                        <input
                          type="date"
                          value={cert.date}
                          onChange={(e) => updateCertification(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={cert.credentialId}
                          onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Credential ID (optional)"
                        />
                        <input
                          type="url"
                          value={cert.url}
                          onChange={(e) => updateCertification(index, 'url', e.target.value)}
                          className="md:col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Certification URL (optional)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {step === stepTitles.length ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
                </button>
              ) : (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!validateStep(step)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
