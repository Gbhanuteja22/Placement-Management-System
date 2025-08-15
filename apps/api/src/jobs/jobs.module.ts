import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { Job, JobSchema } from './schemas/job.schema';
import { HttpModule } from '@nestjs/axios';
import { FallbackDataService } from '../fallback-data.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    HttpModule,
  ],
  controllers: [JobsController],
  providers: [JobsService, FallbackDataService],
  exports: [JobsService],
})
export class JobsModule {}
