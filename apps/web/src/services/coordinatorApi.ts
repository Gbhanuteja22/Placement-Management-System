const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3008';

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
  postedBy: string;
}

interface ApplicationStatusUpdate {
  status: 'pending' | 'reviewed' | 'shortlisted' | 'selected' | 'rejected';
  notes?: string;
}

export const coordinatorApi = {
  // Job Management
  async getJobs(coordinatorId: string) {
    const response = await fetch(`${API_URL}/coordinator/${coordinatorId}/jobs`);
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return response.json();
  },

  async createJob(jobData: JobFormData) {
    const response = await fetch(`${API_URL}/coordinator/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    if (!response.ok) throw new Error('Failed to create job');
    return response.json();
  },

  async updateJob(jobId: string, jobData: Partial<JobFormData>) {
    const response = await fetch(`${API_URL}/coordinator/jobs/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    if (!response.ok) throw new Error('Failed to update job');
    return response.json();
  },

  async deleteJob(jobId: string) {
    const response = await fetch(`${API_URL}/coordinator/jobs/${jobId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete job');
    return response.json();
  },

  // Application Management
  async getApplications(coordinatorId: string) {
    const response = await fetch(`${API_URL}/coordinator/${coordinatorId}/applications`);
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  },

  async getJobApplications(jobId: string) {
    const response = await fetch(`${API_URL}/coordinator/jobs/${jobId}/applications`);
    if (!response.ok) throw new Error('Failed to fetch job applications');
    return response.json();
  },

  async updateApplicationStatus(applicationId: string, newStatus: string, coordinatorId?: string) {
    const response = await fetch(`${API_URL}/coordinator/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: newStatus,
        notes: `Status updated by coordinator ${coordinatorId || 'unknown'}` 
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update application status');
    }
    return response.json();
  },

  async deleteApplication(applicationId: string) {
    const response = await fetch(`${API_URL}/coordinator/applications/${applicationId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete application');
    }
    return response.json();
  },

  // Student Jobs (for reference)
  async getStudentJobs(filters?: { branch?: string; academicYear?: string; cgpa?: number }) {
    const params = new URLSearchParams();
    if (filters?.branch) params.append('branch', filters.branch);
    if (filters?.academicYear) params.append('academicYear', filters.academicYear);
    if (filters?.cgpa) params.append('cgpa', filters.cgpa.toString());

    const response = await fetch(`${API_URL}/student/jobs?${params}`);
    if (!response.ok) throw new Error('Failed to fetch student jobs');
    return response.json();
  },

  // Application Submission (for students)
  async applyToJob(jobId: string, studentId: string) {
    const response = await fetch(`${API_URL}/student/apply/${jobId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to apply to job');
    }
    return response.json();
  }
};

// Utility function to export applications to CSV
export const exportApplicationsToCSV = (applications: any[], filename: string = 'applications') => {
  const headers = [
    'Student Name',
    'Roll Number', 
    'Email',
    'CGPA',
    'Branch',
    'Semester',
    'Job Title',
    'Applied Date',
    'Status',
    'Resume URL',
    'CMM URL'
  ];

  const csvContent = [
    headers.join(','),
    ...applications.map(app => [
      `"${app.studentName || 'Unknown'}"`,
      `"${app.rollNumber || 'Unknown'}"`,
      `"${app.studentEmail || 'Unknown'}"`,
      app.cgpa || 0,
      `"${app.branch || 'Unknown'}"`,
      `"${app.semester || 'Unknown'}"`,
      `"${app.jobTitle || 'Unknown'}"`,
      new Date(app.appliedDate || app.createdAt).toLocaleDateString(),
      `"${app.status || 'pending'}"`,
      `"${app.resumeUrl || 'Not provided'}"`,
      `"${app.marksMemoUrl || 'Not provided'}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
