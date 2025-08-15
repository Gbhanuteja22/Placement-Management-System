import { Injectable, Logger } from '@nestjs/common';

export interface FallbackJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  postedDate: Date;
  isOnCampus?: boolean;
  urgent?: boolean;
  rating?: number;
  employees?: string;
  minCGPA?: number;
  allowedBranches?: string[];
  academicYear?: string[];
  applicationDeadline?: string;
}

export interface FallbackApplication {
  id: string;
  jobId: string;
  userId: string;
  status: string;
  appliedDate: Date;
  jobTitle?: string;
  company?: string;
  location?: string;
  salary?: string;
}

@Injectable()
export class FallbackDataService {
  private readonly logger = new Logger(FallbackDataService.name);

  private sampleJobs: FallbackJob[] = [
    {
      id: 'job-1',
      title: 'Software Development Engineer',
      company: 'Microsoft',
      location: 'Hyderabad',
      salary: '₹18-22 LPA',
      type: 'Full-time',
      experience: '0-2 years',
      description: 'Join Microsoft as an SDE and work on cutting-edge cloud technologies. Build scalable solutions that impact millions of users worldwide.',
      requirements: ['React.js', 'C#', '.NET', 'Azure', 'JavaScript', 'TypeScript'],
      postedDate: new Date('2025-08-13'),
      isOnCampus: true,
      urgent: true,
      rating: 4.8,
      employees: '10,000+',
      minCGPA: 7.5,
      allowedBranches: ['CSE', 'IT', 'ECE'],
      academicYear: ['3rd Year', '4th Year'],
      applicationDeadline: '2025-08-20'
    },
    {
      id: 'job-2',
      title: 'Data Analyst',
      company: 'Infosys',
      location: 'Bangalore',
      salary: '₹6-8 LPA',
      type: 'Full-time',
      experience: '0-1 years',
      description: 'Analyze complex data sets to provide actionable business insights. Work with cutting-edge analytics tools and machine learning models.',
      requirements: ['Python', 'SQL', 'Tableau', 'Excel', 'Power BI', 'R'],
      postedDate: new Date('2025-08-12'),
      isOnCampus: true,
      urgent: false,
      rating: 4.2,
      employees: '50,000+',
      minCGPA: 6.5,
      allowedBranches: ['CSE', 'IT', 'ECE', 'EEE'],
      academicYear: ['4th Year'],
      applicationDeadline: '2025-08-25'
    },
    {
      id: 'job-3',
      title: 'Frontend Developer',
      company: 'Swiggy',
      location: 'Hyderabad',
      salary: '₹8-12 LPA',
      type: 'Full-time',
      experience: '1-3 years',
      description: 'Build amazing user experiences for millions of food lovers. Work with modern React ecosystem and cutting-edge frontend technologies.',
      requirements: ['React.js', 'TypeScript', 'CSS', 'Redux', 'Next.js', 'Tailwind CSS'],
      postedDate: new Date('2025-08-11'),
      isOnCampus: false,
      urgent: false,
      rating: 4.3,
      employees: '5,000+',
    },
    {
      id: 'job-4',
      title: 'Backend Engineer',
      company: 'Zomato',
      location: 'Gurugram',
      salary: '₹10-15 LPA',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Scale backend systems to serve millions of food orders daily. Work with microservices architecture and cloud-native technologies.',
      requirements: ['Node.js', 'MongoDB', 'AWS', 'Microservices', 'Docker', 'Kubernetes'],
      postedDate: new Date('2025-08-07'),
      isOnCampus: false,
      urgent: false,
      rating: 4.1,
      employees: '3,000+',
    },
    {
      id: 'job-5',
      title: 'DevOps Engineer',
      company: 'Paytm',
      location: 'Noida',
      salary: '₹12-18 LPA',
      type: 'Full-time',
      experience: '2-5 years',
      description: 'Manage CI/CD pipelines and cloud infrastructure for one of India\'s largest fintech companies.',
      requirements: ['AWS', 'Kubernetes', 'Docker', 'Jenkins', 'Terraform', 'Python'],
      postedDate: new Date('2025-08-09'),
      isOnCampus: false,
      urgent: true,
      rating: 4.4,
      employees: '8,000+',
    },
    {
      id: 'job-6',
      title: 'Full Stack Developer',
      company: 'Flipkart',
      location: 'Bangalore',
      salary: '₹14-20 LPA',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Work on India\'s largest e-commerce platform. Build features that serve hundreds of millions of customers.',
      requirements: ['React.js', 'Node.js', 'Java', 'Spring Boot', 'MongoDB', 'Redis'],
      postedDate: new Date('2025-08-10'),
      isOnCampus: true,
      urgent: false,
      rating: 4.5,
      employees: '15,000+',
      minCGPA: 7.0,
      allowedBranches: ['CSE', 'IT'],
      academicYear: ['3rd Year', '4th Year'],
      applicationDeadline: '2025-08-22'
    }
  ];

  private sampleApplications: FallbackApplication[] = [
    {
      id: 'app-1',
      jobId: 'job-1',
      userId: 'user-demo',
      status: 'under_review',
      appliedDate: new Date('2025-08-10'),
      jobTitle: 'Software Development Engineer',
      company: 'Microsoft',
      location: 'Hyderabad',
      salary: '₹18-22 LPA'
    },
    {
      id: 'app-2',
      jobId: 'job-3',
      userId: 'user-demo',
      status: 'applied',
      appliedDate: new Date('2025-08-12'),
      jobTitle: 'Frontend Developer',
      company: 'Swiggy',
      location: 'Hyderabad',
      salary: '₹8-12 LPA'
    }
  ];

  getJobs(filters?: any): FallbackJob[] {
    this.logger.warn('Using fallback job data - database not connected');
    
    let jobs = [...this.sampleJobs];

    // Apply filters if provided
    if (filters) {
      if (filters.location) {
        jobs = jobs.filter(job => 
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.company) {
        jobs = jobs.filter(job => 
          job.company.toLowerCase().includes(filters.company.toLowerCase())
        );
      }
      if (filters.title) {
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(filters.title.toLowerCase())
        );
      }
      if (filters.isOnCampus !== undefined) {
        jobs = jobs.filter(job => job.isOnCampus === filters.isOnCampus);
      }
    }

    return jobs;
  }

  getJobById(id: string): FallbackJob | null {
    this.logger.warn('Using fallback job data - database not connected');
    return this.sampleJobs.find(job => job.id === id) || null;
  }

  getApplicationsByUserId(userId: string): FallbackApplication[] {
    this.logger.warn('Using fallback application data - database not connected');
    return this.sampleApplications.filter(app => app.userId === userId);
  }

  createApplication(applicationData: Partial<FallbackApplication>): FallbackApplication {
    this.logger.warn('Using fallback application data - database not connected');
    
    const newApplication: FallbackApplication = {
      id: `app-${Date.now()}`,
      jobId: applicationData.jobId || '',
      userId: applicationData.userId || '',
      status: 'applied',
      appliedDate: new Date(),
      ...applicationData
    };

    // Find job details to populate application
    const job = this.getJobById(newApplication.jobId);
    if (job) {
      newApplication.jobTitle = job.title;
      newApplication.company = job.company;
      newApplication.location = job.location;
      newApplication.salary = job.salary;
    }

    this.sampleApplications.push(newApplication);
    return newApplication;
  }

  updateApplicationStatus(id: string, status: string): FallbackApplication | null {
    this.logger.warn('Using fallback application data - database not connected');
    
    const application = this.sampleApplications.find(app => app.id === id);
    if (application) {
      application.status = status;
      return application;
    }
    return null;
  }

  getJobStats(): any {
    this.logger.warn('Using fallback job statistics - database not connected');
    
    const jobs = this.sampleJobs;
    return {
      total: jobs.length,
      onCampus: jobs.filter(job => job.isOnCampus).length,
      external: jobs.filter(job => !job.isOnCampus).length,
      urgent: jobs.filter(job => job.urgent).length,
      byLocation: this.groupBy(jobs, 'location'),
      byCompany: this.groupBy(jobs, 'company'),
      recentJobs: jobs.slice(0, 5)
    };
  }

  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((result, item) => {
      const group = item[key];
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }
}
