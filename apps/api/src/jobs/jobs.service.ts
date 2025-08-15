import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Job, JobDocument } from './schemas/job.schema';
import { FallbackDataService, FallbackJob } from '../fallback-data.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    private readonly httpService: HttpService,
    private readonly fallbackDataService: FallbackDataService,
  ) {}

  async findAll(filters?: any): Promise<Job[] | FallbackJob[]> {
    try {
      const query = { active: true };
      
      if (filters?.location) {
        query['location'] = { $regex: filters.location, $options: 'i' };
      }
      
      if (filters?.minSalary) {
        query['minSalary'] = { $gte: parseInt(filters.minSalary) };
      }
      
      if (filters?.type) {
        query['type'] = filters.type;
      }
      
      if (filters?.isOnCampus !== undefined) {
        query['isOnCampus'] = filters.isOnCampus;
      }

      return await this.jobModel.find(query).sort({ createdAt: -1 }).exec();
    } catch (error) {
      this.logger.warn('Database not available, using fallback data', error.message);
      return this.fallbackDataService.getJobs(filters);
    }
  }

  async findById(id: string): Promise<Job | FallbackJob> {
    try {
      return await this.jobModel.findById(id).exec();
    } catch (error) {
      this.logger.warn('Database not available, using fallback data', error.message);
      return this.fallbackDataService.getJobById(id);
    }
  }

  async create(jobData: Partial<Job>): Promise<Job> {
    const createdJob = new this.jobModel(jobData);
    return createdJob.save();
  }

  async update(id: string, jobData: Partial<Job>): Promise<Job> {
    return this.jobModel.findByIdAndUpdate(id, jobData, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.jobModel.findByIdAndDelete(id).exec();
  }

  async syncExternalJobs(): Promise<void> {
    try {
      // Fetch from Adzuna API
      await this.fetchAdzunaJobs();
      
      // Fetch from RapidAPI
      await this.fetchRapidAPIJobs();
      
      this.logger.log('External jobs synced successfully');
    } catch (error) {
      this.logger.error('Failed to sync external jobs', error);
    }
  }

  private async fetchAdzunaJobs(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://api.adzuna.com/v1/api/jobs/in/search/1', {
          params: {
            app_id: process.env.ADZUNA_APP_ID,
            app_key: process.env.ADZUNA_API_KEY,
            results_per_page: 50,
            what: 'software developer',
            content_type: 'application/json',
          },
        })
      );

      const jobs = (response as any)?.data?.results;
      
      for (const jobData of jobs) {
        const existingJob = await this.jobModel.findOne({ 
          externalId: jobData.id.toString(),
          source: 'adzuna' 
        });

        if (!existingJob) {
          await this.create({
            title: jobData.title,
            company: jobData.company?.display_name || 'Company',
            location: `${jobData.location?.area?.[0] || 'India'}`,
            salary: jobData.salary_min ? `₹${Math.round(jobData.salary_min/100000)}-${Math.round(jobData.salary_max/100000)} LPA` : 'Competitive',
            type: jobData.contract_type || 'Full-time',
            experience: 'As per requirement',
            description: jobData.description?.substring(0, 500) || 'Job description not available',
            requirements: [],
            isOnCampus: false,
            applyUrl: jobData.redirect_url,
            source: 'adzuna',
            externalId: jobData.id.toString(),
            minSalary: jobData.salary_min ? Math.round(jobData.salary_min/100000) : 0,
            maxSalary: jobData.salary_max ? Math.round(jobData.salary_max/100000) : 0,
            category: jobData.category?.label || 'Technology',
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to fetch Adzuna jobs', error);
    }
  }

  private async fetchRapidAPIJobs(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://jsearch.p.rapidapi.com/search', {
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
          },
          params: {
            query: 'software developer in India',
            page: '1',
            num_pages: '1',
          },
        })
      );

      const jobs = (response as any)?.data?.data;
      
      for (const jobData of jobs) {
        const existingJob = await this.jobModel.findOne({ 
          externalId: jobData.job_id,
          source: 'rapidapi' 
        });

        if (!existingJob) {
          await this.create({
            title: jobData.job_title,
            company: jobData.employer_name,
            location: jobData.job_city || 'India',
            salary: jobData.job_salary || 'Competitive',
            type: jobData.job_employment_type || 'Full-time',
            experience: jobData.job_required_experience?.required_experience_in_months 
              ? `${Math.round(jobData.job_required_experience.required_experience_in_months / 12)} years`
              : 'As per requirement',
            description: jobData.job_description?.substring(0, 500) || 'Job description not available',
            requirements: jobData.job_required_skills || [],
            isOnCampus: false,
            applyUrl: jobData.job_apply_link,
            companyLogo: jobData.employer_logo,
            companyWebsite: jobData.employer_website,
            source: 'rapidapi',
            externalId: jobData.job_id,
            category: 'Technology',
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to fetch RapidAPI jobs', error);
    }
  }

  async getJobStats(): Promise<any> {
    try {
      const totalJobs = await this.jobModel.countDocuments({ active: true });
      const onCampusJobs = await this.jobModel.countDocuments({ active: true, isOnCampus: true });
      const externalJobs = await this.jobModel.countDocuments({ active: true, isOnCampus: false });
      const urgentJobs = await this.jobModel.countDocuments({ active: true, urgent: true });

      return {
        totalJobs,
        onCampusJobs,
        externalJobs,
        urgentJobs,
      };
    } catch (error) {
      this.logger.warn('Database not available, using fallback stats', error.message);
      return this.fallbackDataService.getJobStats();
    }
  }
}
