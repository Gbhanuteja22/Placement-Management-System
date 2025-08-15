import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '../../utils/toast';
import JobForm from '../../components/coordinator/JobForm';
import AddStudentForm from '../../components/coordinator/AddStudentForm';
import EditStudentForm from '../../components/coordinator/EditStudentForm';
import { coordinatorApi, exportApplicationsToCSV } from '../../services/coordinatorApi';
import { 
  GraduationCap, 
  Plus,
  Users,
  Briefcase,
  Calendar,
  Download,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  MapPin,
  DollarSign,
  Clock,
  RefreshCw
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  posted: string;
  description: string;
  requirements: string[];
  applicationDeadline: string;
  minCGPA: number;
  allowedBranches: string[];
  academicYear: string[];
  applicationsCount?: number;
  isActive: boolean;
}

interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  cgpa: number;
  branch: string;
  semester: string;
  jobId: string;
  jobTitle: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'selected';
  resumeUrl?: string;
  marksMemoUrl?: string;
}

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
}

interface CoordinatorInfo {
  name: string;
  email: string;
  designation: string;
  isMainCoordinator: boolean;
}

interface InstitutionInfo {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone?: string;
  website?: string;
}

export default function CoordinatorDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [coordinatorInfo, setCoordinatorInfo] = useState<CoordinatorInfo | null>(null);
  const [institutionInfo, setInstitutionInfo] = useState<InstitutionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentFilterBranch, setStudentFilterBranch] = useState('');
  const [studentFilterCGPA, setStudentFilterCGPA] = useState('');
  const [studentFilterStatus, setStudentFilterStatus] = useState('');
  const [studentFilterCompany, setStudentFilterCompany] = useState('');
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isCleaningDuplicates, setIsCleaningDuplicates] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showEditStudentForm, setShowEditStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    loadCoordinatorInfo();
  }, []);

  useEffect(() => {
    // Load data after coordinator info is available
    if (user?.id && institutionInfo?.id) {
      loadData();
    }
  }, [user?.id, institutionInfo?.id]);

  const loadCoordinatorInfo = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/institutions/verify-coordinator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.emailAddresses[0]?.emailAddress })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Coordinator info loaded:', data);
        setCoordinatorInfo(data.coordinatorInfo);
        setInstitutionInfo(data.institution);
      } else {
        toast.error('Failed to load coordinator information');
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading coordinator info:', error);
      toast.error('Failed to load coordinator information');
      navigate('/');
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (user?.id && institutionInfo?.id) {
        console.log('Loading data for coordinator:', user.id, 'institution:', institutionInfo.id);
        await Promise.all([
          loadJobs(),
          loadApplications(),
          loadStudents()
        ]);
      } else {
        console.log('Cannot load data - missing user ID or institution info:', { 
          userId: user?.id, 
          institutionId: institutionInfo?.id 
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      if (user?.id) {
        const jobsData = await coordinatorApi.getJobs(user.id);
        setJobs(jobsData);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      // Fallback to mock data if API fails
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Software Development Engineer',
          company: 'Microsoft',
          location: 'Hyderabad',
          salary: '₹18-22 LPA',
          type: 'Full-time',
          experience: '0-2 years',
          posted: '2 days ago',
          description: 'Join Microsoft as an SDE and work on cutting-edge technologies...',
          requirements: ['React.js', 'C#', '.NET', 'Azure'],
          applicationDeadline: '2025-08-20',
          minCGPA: 7.5,
          allowedBranches: ['CSE', 'IT', 'ECE'],
          academicYear: ['3rd Year', '4th Year'],
          applicationsCount: 15,
          isActive: true
        }
      ];
      setJobs(mockJobs);
    }
  };

  const loadApplications = async () => {
    try {
      if (user?.id) {
        console.log('Loading applications for coordinator:', user.id);
        const applicationsData = await coordinatorApi.getApplications(user.id);
        console.log('Applications loaded:', applicationsData);
        setApplications(applicationsData);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      // Remove mock data - show empty list if API fails
      setApplications([]);
      toast.error('Failed to load applications');
    }
  };

  const loadStudents = async () => {
    try {
      setIsLoadingStudents(true);
      if (user?.id && institutionInfo?.id) {
        console.log('Loading students for institution:', institutionInfo.id);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/coordinator/students/${institutionInfo.id}`);
        console.log('Students API response status:', response.status);
        
        if (response.ok) {
          const studentsData = await response.json();
          console.log('Received students data:', studentsData);
          setStudents(studentsData);

          // Check for duplicates and notify
          const duplicates = studentsData.filter((s: Student) => s.isDuplicate);
          if (duplicates.length > 0) {
            toast.error(`Found ${duplicates.length} students with duplicate roll numbers. Use the cleanup tool to fix this.`);
          }
          
          if (studentsData.length === 0) {
            console.log('No students found for this institution');
            toast.info('No students registered yet. Add students using the "Add Student" button.');
          } else {
            toast.success(`Loaded ${studentsData.length} students successfully`);
          }
        } else {
          const errorText = await response.text();
          console.error('Failed to load students:', response.status, errorText);
          setStudents([]);
          toast.error('Failed to load students data');
        }
      } else {
        console.log('Missing user ID or institution info:', { userId: user?.id, institutionId: institutionInfo?.id });
        setStudents([]);
        toast.error('User or institution information is missing');
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
      toast.error('Failed to load students. Please check your connection.');
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleCleanupDuplicates = async () => {
    if (!institutionInfo?.id) {
      toast.error('Institution information is missing');
      return;
    }

    try {
      setIsCleaningDuplicates(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/coordinator/cleanup-duplicates/${institutionInfo.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        await loadStudents(); // Reload students after cleanup
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to cleanup duplicates');
      }
    } catch (error) {
      console.error('Error cleaning up duplicates:', error);
      toast.error('Failed to cleanup duplicates. Please try again.');
    } finally {
      setIsCleaningDuplicates(false);
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobForm(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleJobSubmit = async (jobData: any) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const jobPayload = {
        ...jobData,
        postedBy: user.id
      };

      if (editingJob) {
        // Update existing job
        await coordinatorApi.updateJob(editingJob.id, jobPayload);
        await loadJobs(); // Reload jobs
      } else {
        // Create new job
        await coordinatorApi.createJob(jobPayload);
        await loadJobs(); // Reload jobs
      }
      setShowJobForm(false);
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await coordinatorApi.deleteJob(jobId);
        await loadJobs(); // Reload jobs
        toast.success('Job posting deleted successfully');
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job posting');
      }
    }
  };

  const handleApplicationStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      console.log('Updating application status:', { applicationId, newStatus, coordinatorId: user?.id });
      
      if (!user?.id) {
        toast.error('User not authenticated');
        return;
      }

      if (!applicationId) {
        toast.error('Application ID is missing');
        return;
      }

      // Show loading feedback
      toast.info('Updating application status...');

      // Fix the API call - it expects (applicationId, newStatus, coordinatorId)
      await coordinatorApi.updateApplicationStatus(applicationId, newStatus, user.id);
      
      // Reload applications to get fresh data
      await loadApplications(); 
      
      toast.success(`Application status updated to ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating status:', error);
      const errorMessage = error.message || 'Failed to update application status';
      toast.error(errorMessage);
      
      // Reload applications to reset any UI state
      await loadApplications();
    }
  };

  const handleDeleteApplication = async (applicationId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to delete the application from ${studentName}? This action cannot be undone.`)) {
      try {
        console.log('Deleting application:', { applicationId, studentName });
        
        // Show loading feedback
        toast.info('Deleting application...');

        await coordinatorApi.deleteApplication(applicationId);
        
        // Reload applications to get fresh data
        await loadApplications(); 
        
        toast.success(`Application from ${studentName} deleted successfully`);
      } catch (error: any) {
        console.error('Error deleting application:', error);
        const errorMessage = error.message || 'Failed to delete application';
        toast.error(errorMessage);
        
        // Reload applications to reset any UI state
        await loadApplications();
      }
    }
  };

  const exportApplicationsToExcel = async (jobId?: string) => {
    try {
      if (jobId) {
        // Export specific job applications using API
        const response = await fetch(`${import.meta.env.VITE_API_URL}/coordinator/jobs/${jobId}/applications/export`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Convert to CSV and download
          const csvContent = convertToCSV(data.data);
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `${data.jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Applications.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success(`Exported ${data.totalApplications} applications for ${data.jobTitle}`);
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to export applications');
        }
      } else {
        // Export all applications
        const dataToExport = applications;
        exportApplicationsToCSV(dataToExport, 'all_applications');
        toast.success('All applications exported successfully');
      }
    } catch (error) {
      console.error('Error exporting applications:', error);
      toast.error('Failed to export applications');
    }
  };

  // Helper function to convert JSON to CSV
  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowEditStudentForm(true);
  };

  const handleUpdateStudent = async (updatedStudentData: Partial<Student>) => {
    try {
      if (!editingStudent) return;

      console.log('Updating student:', { studentId: editingStudent.id, updatedData: updatedStudentData });
      
      // Show loading feedback
      toast.info('Updating student information...');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/coordinator/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update student');
      }

      const result = await response.json();
      console.log('Student updated successfully:', result);

      // Reload students to get fresh data
      await loadStudents();
      
      // Close the edit form
      setShowEditStudentForm(false);
      setEditingStudent(null);
      
      toast.success(`Student ${updatedStudentData.name || editingStudent.name} updated successfully`);
    } catch (error: any) {
      console.error('Error updating student:', error);
      const errorMessage = error.message || 'Failed to update student information';
      toast.error(errorMessage);
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to remove ${studentName} from the student list?`)) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/coordinator/students/${studentId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadStudents(); // Reload students list
          toast.success('Student removed successfully');
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to remove student');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Failed to remove student');
      }
    }
  };

  const handleViewResume = async (student: Student) => {
    try {
      if (!student.resumeUrl) {
        toast.info('No resume link provided by this student.');
        return;
      }

      console.log('Viewing resume for student:', student.name, 'URL:', student.resumeUrl);
      
      // If it's a Google Drive link or any HTTP URL, open directly
      if (student.resumeUrl.startsWith('http')) {
        window.open(student.resumeUrl, '_blank');
        toast.success('Opening resume in new tab');
        return;
      }
      
      // Legacy support for file-based resumes
      let finalUrl = student.resumeUrl;
      
      // If it's a relative URL starting with /uploads, make it absolute
      if (student.resumeUrl.startsWith('/uploads/')) {
        finalUrl = `http://localhost:3008${student.resumeUrl}`;
      }
      // If it's just a filename, construct the full path
      else {
        finalUrl = `http://localhost:3008/resumes/${student.resumeUrl}`;
      }
      
      console.log('Final resume URL:', finalUrl);
      
      // Test if the URL is accessible
      try {
        const response = await fetch(finalUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Resume not found (${response.status})`);
        }
        
        // Open in new tab if accessible
        window.open(finalUrl, '_blank');
        toast.success('Opening resume in new tab');
        
      } catch (fetchError) {
        console.error('Resume fetch test failed:', fetchError);
        toast.error('Resume link not accessible. Please ask student to update their resume link.');
      }
      
    } catch (error: any) {
      console.error('Error viewing resume:', error);
      toast.error('Failed to view resume: ' + (error.message || 'Unknown error'));
    }
  };

  const handleViewApplicationResume = async (resumeUrl: string) => {
    try {
      if (!resumeUrl) {
        toast.info('No resume available for this application.');
        return;
      }

      console.log('Viewing application resume, URL:', resumeUrl);
      
      // If it's a Google Drive link or any HTTP URL, open directly
      if (resumeUrl.startsWith('http')) {
        window.open(resumeUrl, '_blank');
        toast.success('Opening resume in new tab');
        return;
      }
      
      // Legacy support for file-based resumes
      let finalUrl = resumeUrl;
      
      // If it's a relative URL starting with /uploads, make it absolute
      if (resumeUrl.startsWith('/uploads/')) {
        finalUrl = `http://localhost:3008${resumeUrl}`;
      }
      // If it's just a filename, construct the full path
      else {
        finalUrl = `http://localhost:3008/resumes/${resumeUrl}`;
      }
      
      console.log('Final resume URL:', finalUrl);
      
      // Test if the URL is accessible
      try {
        const response = await fetch(finalUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Resume not found (${response.status})`);
        }
        
        // Open in new tab if accessible
        window.open(finalUrl, '_blank');
        toast.success('Opening resume in new tab');
        
      } catch (fetchError) {
        console.error('Resume fetch test failed:', fetchError);
        toast.error('Resume link not accessible. Please ask student to update their resume link.');
      }
      
    } catch (error: any) {
      console.error('Error viewing resume:', error);
      toast.error('Failed to view resume: ' + (error.message || 'Unknown error'));
    }
  };

  const handleViewApplicationCMM = async (cmmUrl: string) => {
    try {
      if (!cmmUrl) {
        toast.info('No CMM (Consolidated Marks Memo) available for this application.');
        return;
      }

      console.log('Viewing application CMM, URL:', cmmUrl);
      
      // If it's a Google Drive link or any HTTP URL, open directly
      if (cmmUrl.startsWith('http')) {
        window.open(cmmUrl, '_blank');
        toast.success('Opening CMM in new tab');
        return;
      }
      
      // Legacy support for file-based CMMs
      let finalUrl = cmmUrl;
      
      // If it's a relative URL starting with /uploads, make it absolute
      if (cmmUrl.startsWith('/uploads/')) {
        finalUrl = `http://localhost:3008${cmmUrl}`;
      }
      // If it's just a filename, construct the full path
      else {
        finalUrl = `http://localhost:3008/cmm/${cmmUrl}`;
      }
      
      console.log('Final CMM URL:', finalUrl);
      
      // Test if the URL is accessible
      try {
        const response = await fetch(finalUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`CMM not found (${response.status})`);
        }
        
        // Open in new tab if accessible
        window.open(finalUrl, '_blank');
        toast.success('Opening CMM in new tab');
        
      } catch (fetchError) {
        console.error('CMM fetch test failed:', fetchError);
        toast.error('CMM link not accessible. Please ask student to update their CMM link.');
      }
      
    } catch (error: any) {
      console.error('Error viewing CMM:', error);
      toast.error('Failed to view CMM: ' + (error.message || 'Unknown error'));
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Enhanced student filtering
  const filteredStudents = students.filter(student => {
    const matchesSearch = !studentSearchTerm || 
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearchTerm.toLowerCase());
    
    const matchesBranch = !studentFilterBranch || student.branch === studentFilterBranch;
    
    const matchesCGPA = !studentFilterCGPA || (() => {
      const cgpa = student.cgpa;
      switch (studentFilterCGPA) {
        case 'above_8': return cgpa >= 8.0;
        case '7_to_8': return cgpa >= 7.0 && cgpa < 8.0;
        case '6_to_7': return cgpa >= 6.0 && cgpa < 7.0;
        case 'below_6': return cgpa < 6.0;
        default: return true;
      }
    })();
    
    const matchesStatus = !studentFilterStatus || (() => {
      switch (studentFilterStatus) {
        case 'verified': return student.isVerified;
        case 'pending': return !student.isVerified;
        case 'with_applications': 
          return applications.some(app => app.rollNumber === student.rollNumber);
        case 'no_applications': 
          return !applications.some(app => app.rollNumber === student.rollNumber);
        default: return true;
      }
    })();
    
    const matchesCompany = !studentFilterCompany || (() => {
      if (studentFilterCompany === 'no_applications') {
        return !applications.some(app => app.rollNumber === student.rollNumber);
      }
      return applications.some(app => 
        app.rollNumber === student.rollNumber && 
        app.jobTitle.toLowerCase().includes(studentFilterCompany.toLowerCase())
      );
    })();
    
    return matchesSearch && matchesBranch && matchesCGPA && matchesStatus && matchesCompany;
  });

  // Get unique branches for filter dropdown
  const uniqueBranches = [...new Set(students.map(s => s.branch))].sort();
  
  // Get unique companies from applications for filter dropdown
  const uniqueCompanies = [...new Set(applications.map(app => {
    // Extract company name from job title
    const parts = app.jobTitle.split(' - ');
    return parts.length > 1 ? parts[1] : app.jobTitle;
  }))].sort();

  const stats = [
    { 
      title: 'Active Job Postings', 
      value: jobs.filter(job => job.isActive).length, 
      icon: <Briefcase className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Registered Students', 
      value: students.length, 
      icon: <Users className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Total Applications', 
      value: applications.length, 
      icon: <FileText className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      title: 'Students Selected', 
      value: applications.filter(app => app.status === 'selected').length, 
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">
                    {institutionInfo ? institutionInfo.name : 'PlacementPro'}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded w-fit">
                    Coordinator Portal
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {coordinatorInfo && (
                <div className="text-right hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{coordinatorInfo.name}</div>
                  <div className="text-xs text-gray-500">{coordinatorInfo.designation}</div>
                </div>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {institutionInfo ? institutionInfo.name : 'Coordinator Dashboard'}
              </h1>
              <div className="text-gray-600 mt-2">
                {institutionInfo ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {institutionInfo.city}, {institutionInfo.state}
                    </div>
                    {coordinatorInfo && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {coordinatorInfo.designation}
                      </div>
                    )}
                  </div>
                ) : (
                  'Manage job postings and track student applications'
                )}
              </div>
            </div>
            {institutionInfo && (
              <div className="hidden md:block text-right">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center text-blue-800">
                    <Building className="w-5 h-5 mr-2" />
                    <span className="font-medium">Institution Profile</span>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    {coordinatorInfo?.name} • {coordinatorInfo?.email}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: <Briefcase className="w-4 h-4" /> },
                { id: 'jobs', label: 'Job Postings', icon: <Building className="w-4 h-4" /> },
                { id: 'applications', label: 'Applications', icon: <FileText className="w-4 h-4" /> },
                { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Jobs */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Job Postings</h3>
                    <div className="space-y-3">
                      {jobs.slice(0, 3).map(job => (
                        <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{job.title}</h4>
                              <p className="text-sm text-gray-600">{job.company}</p>
                              <p className="text-xs text-gray-500 mt-1">{job.applicationsCount} applications</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {job.isActive ? 'Active' : 'Closed'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Applications */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                    <div className="space-y-3">
                      {applications.slice(0, 3).map(app => (
                        <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{app.studentName}</h4>
                              <p className="text-sm text-gray-600">{app.rollNumber} - {app.branch}</p>
                              <p className="text-xs text-gray-500 mt-1">CGPA: {app.cgpa}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                              app.status === 'selected' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Job Postings</h3>
                  <button
                    onClick={handleCreateJob}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Job Posting</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {jobs.map(job => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                          <p className="text-gray-600">{job.company} • {job.location}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{job.salary}</span>
                            <span>•</span>
                            <span>Closes: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{job.applicationsCount} applications</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => exportApplicationsToExcel(job.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Export applications"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditJob(job)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Min CGPA:</span>
                          <p className="font-medium">{job.minCGPA}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Branches:</span>
                          <p className="font-medium">{job.allowedBranches.join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Academic Year:</span>
                          <p className="font-medium">{job.academicYear.join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.isActive ? 'Active' : 'Closed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                  <button
                    onClick={() => exportApplicationsToExcel()}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export All</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search students, jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Applications Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredApplications.map(app => (
                          <tr key={app.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{app.studentName}</div>
                                <div className="text-sm text-gray-500">{app.rollNumber} - {app.branch}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{app.jobTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{app.cgpa}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{new Date(app.appliedDate).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={app.status}
                                onChange={(e) => handleApplicationStatusUpdate(app.id, e.target.value)}
                                className={`text-xs rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${
                                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                  app.status === 'shortlisted' ? 'bg-purple-100 text-purple-800' :
                                  app.status === 'selected' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="selected">Selected</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                {app.resumeUrl && (
                                  <button
                                    onClick={() => app.resumeUrl && handleViewApplicationResume(app.resumeUrl)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="View Resume"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
                                {app.marksMemoUrl && (
                                  <button
                                    onClick={() => app.marksMemoUrl && handleViewApplicationCMM(app.marksMemoUrl)}
                                    className="text-green-600 hover:text-green-900"
                                    title="View CMM (Consolidated Marks Memo)"
                                  >
                                    📄
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteApplication(app.id, app.studentName)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete Application"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Registered Students</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      Institution: {institutionInfo?.name || 'Loading...'} | 
                      Students found: {filteredStudents.length} of {students.length} |
                      Institution ID: {institutionInfo?.id || 'Not loaded'}
                      {students.filter(s => s.isDuplicate).length > 0 && (
                        <span className="text-red-600 ml-2">
                          • {students.filter(s => s.isDuplicate).length} duplicates found
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {students.filter(s => s.isDuplicate).length > 0 && (
                      <button
                        onClick={handleCleanupDuplicates}
                        disabled={isCleaningDuplicates}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${isCleaningDuplicates ? 'animate-spin' : ''}`} />
                        <span>{isCleaningDuplicates ? 'Cleaning...' : 'Fix Duplicates'}</span>
                      </button>
                    )}
                    <button
                      onClick={loadStudents}
                      disabled={isLoadingStudents}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingStudents ? 'animate-spin' : ''}`} />
                      <span>{isLoadingStudents ? 'Loading...' : 'Refresh Students'}</span>
                    </button>
                    <button
                      onClick={() => setShowAddStudentForm(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Student</span>
                    </button>
                  </div>
                </div>

                {/* Enhanced Students Search and Filters */}
                <div className="mb-6 space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search students by name, roll number, or email..."
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Filter Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Branch Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                      <select
                        value={studentFilterBranch}
                        onChange={(e) => setStudentFilterBranch(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Branches</option>
                        {uniqueBranches.map(branch => (
                          <option key={branch} value={branch}>{branch}</option>
                        ))}
                      </select>
                    </div>

                    {/* CGPA Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CGPA Range</label>
                      <select
                        value={studentFilterCGPA}
                        onChange={(e) => setStudentFilterCGPA(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All CGPA</option>
                        <option value="above_8">Above 8.0</option>
                        <option value="7_to_8">7.0 - 8.0</option>
                        <option value="6_to_7">6.0 - 7.0</option>
                        <option value="below_6">Below 6.0</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={studentFilterStatus}
                        onChange={(e) => setStudentFilterStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Status</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                        <option value="with_applications">With Applications</option>
                        <option value="no_applications">No Applications</option>
                      </select>
                    </div>

                    {/* Company/Application Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Applied to</label>
                      <select
                        value={studentFilterCompany}
                        onChange={(e) => setStudentFilterCompany(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Companies</option>
                        <option value="no_applications">No Applications</option>
                        {uniqueCompanies.map(company => (
                          <option key={company} value={company}>{company}</option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setStudentSearchTerm('');
                          setStudentFilterBranch('');
                          setStudentFilterCGPA('');
                          setStudentFilterStatus('');
                          setStudentFilterCompany('');
                        }}
                        className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>

                  {/* Filter Summary */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Showing {filteredStudents.length} of {students.length} students</span>
                    {(studentSearchTerm || studentFilterBranch || studentFilterCGPA || studentFilterStatus || studentFilterCompany) && (
                      <span className="text-blue-600">• Filters applied</span>
                    )}
                  </div>
                </div>

                {/* Students Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Info</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.map(student => {
                          // Get student's applications for this student
                          const studentApplications = applications.filter(app => app.rollNumber === student.rollNumber);
                          
                          return (
                          <tr key={student.id} className={`hover:bg-gray-50 ${student.isDuplicate ? 'bg-red-50 border-l-4 border-red-500' : ''}`}>
                            <td className="px-6 py-4">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-900">{student.name}</span>
                                  {student.isDuplicate && (
                                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                      Duplicate
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">{student.rollNumber}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                                {studentApplications.length > 0 && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    {studentApplications.length} application(s)
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm text-gray-900">{student.branch} - {student.semester}</div>
                                <div className="text-sm text-gray-500">CGPA: {student.cgpa}</div>
                                <div className="text-sm text-gray-500">
                                  {student.tenthPercentage && `10th: ${student.tenthPercentage}%`}
                                  {student.twelfthPercentage && ` | 12th: ${student.twelfthPercentage}%`}
                                </div>
                                {student.backlogs !== undefined && (
                                  <div className="text-sm text-gray-500">Backlogs: {student.backlogs}</div>
                                )}
                                {studentApplications.length > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Applied to: {studentApplications.map(app => {
                                      const jobParts = app.jobTitle.split(' - ');
                                      return jobParts.length > 1 ? jobParts[1] : app.jobTitle;
                                    }).join(', ')}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm text-gray-900">{student.phone}</div>
                                {student.parentName && (
                                  <div className="text-sm text-gray-500">Parent: {student.parentName}</div>
                                )}
                                {student.parentPhone && (
                                  <div className="text-sm text-gray-500">{student.parentPhone}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                student.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {student.isVerified ? 'Verified' : 'Pending'}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                Joined: {new Date(student.registeredDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                {student.resumeUrl && (
                                  <button
                                    onClick={() => handleViewResume(student)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="View Resume"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  className="text-gray-400 hover:text-blue-600"
                                  title="View Marks Memo"
                                  onClick={() => {
                                    if (student.marksMemoUrl) {
                                      window.open(student.marksMemoUrl, '_blank');
                                    } else {
                                      toast.error('No marks memo available for this student');
                                    }
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditStudent(student)}
                                  className="text-gray-400 hover:text-blue-600"
                                  title="Edit Student"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student.id, student.name)}
                                  className="text-gray-400 hover:text-red-600"
                                  title="Remove Student"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Form Modal */}
      <JobForm
        isOpen={showJobForm}
        onClose={() => setShowJobForm(false)}
        editingJob={editingJob}
        onSubmit={handleJobSubmit}
      />

      {/* Add Student Modal */}
      <AddStudentForm
        isOpen={showAddStudentForm}
        onClose={() => setShowAddStudentForm(false)}
        institutionId={institutionInfo?.id}
        onStudentAdded={loadStudents}
      />

      {/* Edit Student Modal */}
      <EditStudentForm
        isOpen={showEditStudentForm}
        onClose={() => setShowEditStudentForm(false)}
        student={editingStudent}
        onStudentUpdated={handleUpdateStudent}
      />
    </div>
  );
}
