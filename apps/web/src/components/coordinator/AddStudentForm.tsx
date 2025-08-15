import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import { toast } from '../../utils/toast';

interface AddStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  institutionId?: string;
  onStudentAdded: () => void;
}

const BRANCH_OPTIONS = [
  'CSE', 'CSM', 'CSD', 'CSB', 'IT', 'ECE', 'Mechanical', 'Mechatronics', 
  'AIML', 'AIDS (Data Science)', 'Civil', 'EEE', 'Chemical', 'Biotechnology', 
  'Aerospace', 'Automobile', 'Mining', 'Metallurgy', 'Textile', 'Food Technology'
];

const SEMESTER_OPTIONS = [
  '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
  '5th Semester', '6th Semester', '7th Semester', '8th Semester'
];

interface Project {
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
}

export default function AddStudentForm({ isOpen, onClose, institutionId, onStudentAdded }: AddStudentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    rollNumber: '',
    branch: '',
    semester: '',
    cgpa: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    
    // Academic Information
    academicStartYear: new Date().getFullYear() - 2,
    academicEndYear: new Date().getFullYear() + 2,
    tenthPercentage: '',
    twelfthPercentage: '',
    diplomaPercentage: '',
    backlogs: '0',
    
    // Family Information
    parentName: '',
    parentPhone: '',
    
    // Additional Information
    personalEmail: '',
    mobileNumber: '',
    skills: [] as string[],
    achievements: [] as string[]
  });
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const steps = [
    { title: 'Basic Information', description: 'Personal and contact details' },
    { title: 'Academic Information', description: 'Educational background' },
    { title: 'Projects & Skills', description: 'Technical experience' },
    { title: 'Certifications & Resume', description: 'Additional qualifications' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!institutionId) {
      toast.error('Institution ID not found');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formPayload = new FormData();
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formPayload.append(key, JSON.stringify(value));
        } else {
          formPayload.append(key, String(value));
        }
      });
      
      formPayload.append('institutionId', institutionId);
      
      // Add resume URL if provided
      if (resumeUrl) {
        formPayload.append('resumeUrl', resumeUrl);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/coordinator/students`, {
        method: 'POST',
        body: formPayload
      });

      if (response.ok) {
        toast.success('Student added successfully');
        onStudentAdded();
        onClose();
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      // Basic Information
      name: '',
      email: '',
      rollNumber: '',
      branch: '',
      semester: '',
      cgpa: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      
      // Academic Information
      academicStartYear: new Date().getFullYear() - 2,
      academicEndYear: new Date().getFullYear() + 2,
      tenthPercentage: '',
      twelfthPercentage: '',
      diplomaPercentage: '',
      backlogs: '0',
      
      // Family Information
      parentName: '',
      parentPhone: '',
      
      // Additional Information
      personalEmail: '',
      mobileNumber: '',
      skills: [] as string[],
      achievements: [] as string[]
    });
    setProjects([]);
    setCertifications([]);
    setResumeUrl('');
    setCurrentStep(0);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Add New Student
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h4 className="text-md font-medium text-gray-900 border-b pb-2">Personal Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="student@institution.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-6">
                  <h4 className="text-md font-medium text-gray-900 border-b pb-2">Academic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 20CS01001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch *
                    </label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Branch</option>
                      {BRANCH_OPTIONS.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Semester *
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Semester</option>
                      {SEMESTER_OPTIONS.map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current CGPA *
                    </label>
                    <input
                      type="number"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleChange}
                      required
                      min="0"
                      max="10"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 8.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        10th Percentage
                      </label>
                      <input
                        type="number"
                        name="tenthPercentage"
                        value={formData.tenthPercentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 85.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        12th Percentage
                      </label>
                      <input
                        type="number"
                        name="twelfthPercentage"
                        value={formData.twelfthPercentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 88.2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diploma Percentage (if applicable)
                      </label>
                      <input
                        type="number"
                        name="diplomaPercentage"
                        value={formData.diplomaPercentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 85.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Backlogs
                      </label>
                      <input
                        type="number"
                        name="backlogs"
                        value={formData.backlogs}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div className="mt-6 space-y-6">
                <h4 className="text-md font-medium text-gray-900 border-b pb-2">Parent/Guardian Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent/Guardian Name
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter parent/guardian name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent/Guardian Phone
                    </label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="mt-6 space-y-4">
                <h4 className="text-md font-medium text-gray-900 border-b pb-2">Resume</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume Google Drive Link
                  </label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/your-file-id/view"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Make sure your Google Drive link is set to "Anyone with the link can view"
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Adding Student...' : 'Add Student'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
