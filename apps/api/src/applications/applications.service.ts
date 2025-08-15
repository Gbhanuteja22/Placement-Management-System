import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { FallbackDataService, FallbackApplication } from '../fallback-data.service';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    private readonly fallbackDataService: FallbackDataService,
  ) {}

  async findByUserId(userId: string): Promise<Application[] | FallbackApplication[]> {
    try {
      return await this.applicationModel.find({ userId }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      this.logger.warn('Database not available, using fallback data', error.message);
      return this.fallbackDataService.getApplicationsByUserId(userId);
    }
  }

  async findById(id: string): Promise<Application> {
    return this.applicationModel.findById(id).exec();
  }

  async create(applicationData: Partial<Application>): Promise<Application | FallbackApplication> {
    try {
      const createdApplication = new this.applicationModel({
        ...applicationData,
        appliedDate: new Date(),
        status: 'applied',
        statusHistory: [{
          status: 'applied',
          date: new Date(),
          notes: 'Application submitted'
        }]
      });
      return await createdApplication.save();
    } catch (error) {
      this.logger.warn('Database not available, using fallback data', error.message);
      return this.fallbackDataService.createApplication(applicationData as Partial<FallbackApplication>);
    }
  }

  async updateStatus(id: string, status: string, notes?: string): Promise<Application> {
    const application = await this.applicationModel.findById(id);
    
    if (application) {
      application.status = status;
      application.statusHistory.push({
        status,
        date: new Date(),
        notes
      });
      
      return application.save();
    }
    
    throw new Error('Application not found');
  }

  async updateInterviewDetails(id: string, interviewData: {
    interviewDate?: Date;
    interviewMode?: string;
    interviewLocation?: string;
  }): Promise<Application> {
    return this.applicationModel.findByIdAndUpdate(
      id, 
      { 
        ...interviewData,
        status: 'Interview Scheduled'
      }, 
      { new: true }
    ).exec();
  }

  async getApplicationStats(userId: string): Promise<any> {
    const applications = await this.applicationModel.find({ userId });
    
    const stats = {
      total: applications.length,
      applied: applications.filter(app => app.status === 'Applied').length,
      underReview: applications.filter(app => app.status === 'Under Review').length,
      interviewScheduled: applications.filter(app => app.status === 'Interview Scheduled').length,
      accepted: applications.filter(app => app.status === 'Accepted').length,
      rejected: applications.filter(app => app.status === 'Rejected').length,
    };
    
    return stats;
  }
}
