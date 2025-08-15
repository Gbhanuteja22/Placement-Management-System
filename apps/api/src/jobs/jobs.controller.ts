import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './schemas/job.schema';

@Controller('jobs')
export class JobsController {
  private readonly logger = new Logger(JobsController.name);

  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(@Query() filters: any): Promise<any[]> {
    this.logger.log(`Fetching jobs with filters: ${JSON.stringify(filters)}`);
    return this.jobsService.findAll(filters);
  }

  @Get('stats')
  async getStats(): Promise<any> {
    return this.jobsService.getJobStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.jobsService.findById(id);
  }

  @Post()
  async create(@Body() jobData: Partial<Job>): Promise<Job> {
    this.logger.log(`Creating new job: ${jobData.title}`);
    return this.jobsService.create(jobData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() jobData: Partial<Job>): Promise<Job> {
    return this.jobsService.update(id, jobData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.jobsService.delete(id);
  }

  @Post('sync-external')
  async syncExternalJobs(): Promise<{ message: string }> {
    this.logger.log('Starting external job sync...');
    await this.jobsService.syncExternalJobs();
    return { message: 'External jobs sync initiated' };
  }
}
