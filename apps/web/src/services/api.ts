import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Jobs API
export const jobsApi = {
  getAll: (filters?: any) => apiClient.get('/jobs', { params: filters }),
  getById: (id: string) => apiClient.get(`/jobs/${id}`),
  create: (jobData: any) => apiClient.post('/jobs', jobData),
  update: (id: string, jobData: any) => apiClient.put(`/jobs/${id}`, jobData),
  delete: (id: string) => apiClient.delete(`/jobs/${id}`),
  getStats: () => apiClient.get('/jobs/stats'),
  syncExternal: () => apiClient.post('/jobs/sync-external'),
};

// Applications API
export const applicationsApi = {
  getByUserId: (userId: string) => apiClient.get(`/student/${userId}/applications`),
  getStats: (userId: string) => apiClient.get(`/applications/user/${userId}/stats`),
  create: (applicationData: any) => apiClient.post(`/student/apply/${applicationData.jobId}`, {
    studentId: applicationData.userId
  }),
  updateStatus: (id: string, status: string, notes?: string) => 
    apiClient.put(`/coordinator/applications/${id}/status`, { status, notes }),
  updateInterview: (id: string, interviewData: any) => 
    apiClient.put(`/applications/${id}/interview`, interviewData),
};

// User Profile API
export const userApi = {
  getProfile: (clerkUserId: string) => apiClient.get(`/users/profile/${clerkUserId}`),
  updateProfile: (clerkUserId: string, profileData: any) => 
    apiClient.put(`/users/profile/${clerkUserId}`, profileData),
  createProfile: (profileData: any) => apiClient.post('/users/profile', profileData),
};

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('clerk-auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
