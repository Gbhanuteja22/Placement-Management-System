import { Controller, Get, Post, Put, Body, Param, Query, Logger } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from './schemas/application.schema';

@Controller('applications')
export class ApplicationsController {
  private readonly logger = new Logger(ApplicationsController.name);

  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<any[]> {
    this.logger.log(`Fetching applications for user: ${userId}`);
    return this.applicationsService.findByUserId(userId);
  }

  @Get('user/:userId/stats')
  async getStats(@Param('userId') userId: string): Promise<any> {
    return this.applicationsService.getApplicationStats(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Application> {
    return this.applicationsService.findById(id);
  }

  @Post()
  async create(@Body() applicationData: Partial<Application>): Promise<any> {
    this.logger.log(`Creating new application for job: ${applicationData.jobTitle}`);
    return this.applicationsService.create(applicationData);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string, 
    @Body() statusData: { status: string; notes?: string }
  ): Promise<Application> {
    return this.applicationsService.updateStatus(id, statusData.status, statusData.notes);
  }

  @Put(':id/interview')
  async updateInterviewDetails(
    @Param('id') id: string,
    @Body() interviewData: {
      interviewDate?: Date;
      interviewMode?: string;
      interviewLocation?: string;
    }
  ): Promise<Application> {
    return this.applicationsService.updateInterviewDetails(id, interviewData);
  }
}
