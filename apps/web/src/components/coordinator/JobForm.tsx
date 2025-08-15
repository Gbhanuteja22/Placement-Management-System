import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from '../../utils/toast';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  applicationDeadline: string;
  minCGPA: number;
  allowedBranches: string[];
  academicYear: string[];
  maxApplications?: number;
  isActive: boolean;
}

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingJob?: any;
  onSubmit: (data: JobFormData) => Promise<void>;
}

const BRANCHES = [
  'CSE', 'CSM', 'CSD', 'CSB', 'IT', 'ECE', 'Mechanical', 'Mechatronics', 
  'AIML', 'AIDS (Data Science)', 'Civil', 'EEE', 'Chemical', 'Biotechnology', 
  'Aerospace', 'Automobile', 'Mining', 'Metallurgy', 'Textile', 'Food Technology'
];
const ACADEMIC_YEARS = ['3rd Year', '4th Year', 'All Years'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];

export default function JobForm({ isOpen, onClose, editingJob, onSubmit }: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: editingJob?.title || '',
    company: editingJob?.company || '',
    location: editingJob?.location || '',
    salaryMin: editingJob?.salary?.split('-')[0]?.replace('₹', '').replace(' LPA', '') || '',
    salaryMax: editingJob?.salary?.split('-')[1]?.replace('₹', '').replace(' LPA', '') || '',
    type: editingJob?.type || 'Full-time',
    experience: editingJob?.experience || '0-1 years',
    description: editingJob?.description || '',
    requirements: editingJob?.requirements || [''],
    applicationDeadline: editingJob?.applicationDeadline || '',
    minCGPA: editingJob?.minCGPA || 6.0,
    allowedBranches: editingJob?.allowedBranches || [],
    academicYear: editingJob?.academicYear || [],
    maxApplications: editingJob?.maxApplications || undefined,
    isActive: editingJob?.isActive !== undefined ? editingJob.isActive : true
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof JobFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, requirements: newRequirements }));
    }
  };

  const toggleBranch = (branch: string) => {
    const isSelected = formData.allowedBranches.includes(branch);
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        allowedBranches: prev.allowedBranches.filter(b => b !== branch)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        allowedBranches: [...prev.allowedBranches, branch]
      }));
    }
  };

  const toggleAcademicYear = (year: string) => {
    const isSelected = formData.academicYear.includes(year);
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        academicYear: prev.academicYear.filter(y => y !== year)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        academicYear: [...prev.academicYear, year]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.allowedBranches.length === 0) {
      toast.error('Please select at least one allowed branch');
      return;
    }

    if (formData.academicYear.length === 0) {
      toast.error('Please select at least one academic year');
      return;
    }

    if (formData.requirements.some(req => !req.trim())) {
      toast.error('Please fill in all requirements or remove empty ones');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      toast.success(editingJob ? 'Job updated successfully' : 'Job created successfully');
    } catch (error) {
      toast.error('Failed to save job posting');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Software Development Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Microsoft"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Hyderabad"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {JOB_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range (LPA)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Min salary"
                min="0"
                step="0.1"
              />
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Max salary"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Experience and Application Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Required
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 0-2 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline *
              </label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum CGPA
              </label>
              <input
                type="number"
                value={formData.minCGPA}
                onChange={(e) => handleInputChange('minCGPA', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="10"
                step="0.1"
                placeholder="e.g., 7.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Applications (Optional)
              </label>
              <input
                type="number"
                value={formData.maxApplications || ''}
                onChange={(e) => handleInputChange('maxApplications', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>

          {/* Allowed Branches */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed Branches *
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {BRANCHES.map(branch => (
                <label key={branch} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowedBranches.includes(branch)}
                    onChange={() => toggleBranch(branch)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{branch}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ACADEMIC_YEARS.map(year => (
                <label key={year} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.academicYear.includes(year)}
                    onChange={() => toggleAcademicYear(year)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{year}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements/Skills *
            </label>
            <div className="space-y-2">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., React.js, Node.js, Python"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Requirement</span>
              </button>
            </div>
          </div>

          {/* Job Status */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Job is active and accepting applications</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
