import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import { toast } from '../../utils/toast';

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  semester: string;
  cgpa: number;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  resumeUrl?: string;
  marksMemoUrl?: string;
  registeredDate: string;
  isVerified: boolean;
  tenthPercentage?: number;
  twelfthPercentage?: number;
  diplomaPercentage?: number;
  backlogs?: number;
  isDuplicate?: boolean;
  // Semester-wise SGPA tracking
  semesterGrades?: Array<{
    semester: string;
    sgpa: number;
    credits?: number;
    subjects?: Array<{
      name: string;
      grade: string;
      credits: number;
    }>;
  }>;
}

interface EditStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onStudentUpdated: (updatedData: Partial<Student>) => void;
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

export default function EditStudentForm({ isOpen, onClose, student, onStudentUpdated }: EditStudentFormProps) {
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
    
    // Parent Information
    parentName: '',
    parentPhone: '',
    
    // Academic Information
    tenthPercentage: '',
    twelfthPercentage: '',
    diplomaPercentage: '',
    backlogs: '',
    
    // Semester-wise SGPA tracking
    semesterGrades: [] as Array<{
      semester: string;
      sgpa: number;
      credits?: number;
    }>
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper functions for semester-wise SGPA
  const generateRequiredSemesters = (currentSemester: string) => {
    const semesterNumber = parseInt(currentSemester.split(' ')[0]);
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
    setFormData(prev => {
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
    if (formData.semesterGrades.length === 0) return parseFloat(formData.cgpa) || 0;
    
    const totalSGPA = formData.semesterGrades.reduce((sum, sg) => sum + sg.sgpa, 0);
    return +(totalSGPA / formData.semesterGrades.length).toFixed(2);
  };

  const handleSemesterChange = (semester: string) => {
    setFormData(prev => ({ ...prev, semester }));
    
    // Auto-generate semester grades for any semester above 1st
    const semesterNumber = parseInt(semester.split(' ')[0]);
    if (semesterNumber > 1) {
      const requiredSemesters = generateRequiredSemesters(semester);
      const newSemesterGrades = requiredSemesters.map(sem => ({
        semester: sem,
        sgpa: formData.semesterGrades.find(sg => sg.semester === sem)?.sgpa || 0
      }));
      
      setFormData(prev => ({
        ...prev,
        semesterGrades: newSemesterGrades
      }));
    } else {
      // Clear semester grades for 1st semester students
      setFormData(prev => ({
        ...prev,
        semesterGrades: []
      }));
    }
  };

  // Populate form with student data when student prop changes
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        rollNumber: student.rollNumber || '',
        branch: student.branch || '',
        semester: student.semester || '',
        cgpa: student.cgpa?.toString() || '',
        phone: student.phone || '',
        dateOfBirth: student.dateOfBirth || '',
        address: student.address || '',
        parentName: student.parentName || '',
        parentPhone: student.parentPhone || '',
        tenthPercentage: student.tenthPercentage?.toString() || '',
        twelfthPercentage: student.twelfthPercentage?.toString() || '',
        diplomaPercentage: student.diplomaPercentage?.toString() || '',
        backlogs: student.backlogs?.toString() || '',
        semesterGrades: student.semesterGrades || [],
      });
    }
  }, [student]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.rollNumber.trim()) errors.push('Roll Number is required');
    if (!formData.branch) errors.push('Branch is required');
    if (!formData.semester) errors.push('Semester is required');
    
    // CGPA validation based on semester
    const currentSem = parseInt(formData.semester.split(' ')[0]);
    if (currentSem > 1) {
      // For students above 1st semester, check if all required semester SGPAs are filled
      const requiredSemesters = generateRequiredSemesters(formData.semester);
      const allSemesterGradesFilled = requiredSemesters.every(semester => {
        const grade = formData.semesterGrades.find(sg => sg.semester === semester);
        return grade && grade.sgpa > 0 && grade.sgpa <= 10;
      });
      if (!allSemesterGradesFilled) {
        errors.push('All previous semester SGPAs are required (0-10)');
      }
    } else if (currentSem === 1) {
      // For 1st semester students, check regular CGPA
      if (!formData.cgpa || parseFloat(formData.cgpa) < 0 || parseFloat(formData.cgpa) > 10) {
        errors.push('Valid CGPA (0-10) is required');
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Phone validation (optional)
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.push('Please enter a valid 10-digit phone number');
    }

    // Parent phone validation (optional)
    if (formData.parentPhone && !/^[6-9]\d{9}$/.test(formData.parentPhone)) {
      errors.push('Please enter a valid 10-digit parent phone number');
    }

    if (errors.length > 0) {
      toast.error(errors.join(', '));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate final CGPA for semester-wise entries
      let finalCGPA = parseFloat(formData.cgpa) || 0;
      if (parseInt(formData.semester.split(' ')[0]) > 1 && formData.semesterGrades.length > 0) {
        finalCGPA = calculateCGPA();
      }

      // Prepare the update data with proper type conversion
      const updateData: Partial<Student> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        rollNumber: formData.rollNumber.trim(),
        branch: formData.branch,
        semester: formData.semester,
        cgpa: finalCGPA,
        phone: formData.phone.trim() || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address.trim() || undefined,
        parentName: formData.parentName.trim() || undefined,
        parentPhone: formData.parentPhone.trim() || undefined,
        tenthPercentage: formData.tenthPercentage ? parseFloat(formData.tenthPercentage) : undefined,
        twelfthPercentage: formData.twelfthPercentage ? parseFloat(formData.twelfthPercentage) : undefined,
        diplomaPercentage: formData.diplomaPercentage ? parseFloat(formData.diplomaPercentage) : undefined,
        backlogs: formData.backlogs ? parseInt(formData.backlogs) : undefined,
        semesterGrades: formData.semesterGrades,
      };

      await onStudentUpdated(updateData);
      
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen || !student) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Student</h2>
                <p className="text-sm text-gray-600">Update student information</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                      disabled={isSubmitting}
                      required
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
                      placeholder="Enter roll number"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch *
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => handleInputChange('branch', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                      required
                    >
                      <option value="">Select Branch</option>
                      {BRANCH_OPTIONS.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Semester *
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) => handleSemesterChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                      required
                    >
                      <option value="">Select Semester</option>
                      {SEMESTER_OPTIONS.map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>

                  {/* Semester-wise SGPA for students above 1st semester */}
                  {parseInt(formData.semester.split(' ')[0]) > 1 && (
                    <div className="md:col-span-3">
                      <h3 className="text-base font-medium text-gray-900 mb-3">Previous Semester SGPA Details</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-2">
                            <h4 className="text-sm font-medium text-blue-800">
                              Academic Performance Tracking
                            </h4>
                            <div className="mt-1 text-xs text-blue-700">
                              <p>Student's SGPA for all previous semesters. CGPA will be calculated automatically.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {generateRequiredSemesters(formData.semester).map((semester) => {
                          const currentGrade = formData.semesterGrades.find(sg => sg.semester === semester);
                          return (
                            <div key={semester}>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {semester} SGPA *
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                max="10"
                                min="0"
                                value={currentGrade?.sgpa || ''}
                                onChange={(e) => updateSemesterGrade(semester, parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="SGPA"
                                required
                                disabled={isSubmitting}
                              />
                            </div>
                          );
                        })}
                      </div>
                      
                      {formData.semesterGrades.length > 0 && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-2">
                              <p className="text-sm font-medium text-green-800">
                                Calculated CGPA: {calculateCGPA().toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Regular CGPA input for 1st semester students only */}
                  {parseInt(formData.semester.split(' ')[0]) === 1 && formData.semester && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        placeholder="Enter CGPA (0-10)"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter 10-digit phone number"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter address"
                    disabled={isSubmitting}
                    rows={3}
                  />
                </div>
              </div>

              {/* Parent Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Parent Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Name
                    </label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => handleInputChange('parentName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter parent name"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter parent phone number"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      10th Percentage
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.tenthPercentage}
                      onChange={(e) => handleInputChange('tenthPercentage', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter 10th percentage"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      12th Percentage
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.twelfthPercentage}
                      onChange={(e) => handleInputChange('twelfthPercentage', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter 12th percentage"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diploma Percentage
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.diplomaPercentage}
                      onChange={(e) => handleInputChange('diplomaPercentage', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter diploma percentage"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Backlogs
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.backlogs}
                      onChange={(e) => handleInputChange('backlogs', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter number of backlogs"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Student'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
