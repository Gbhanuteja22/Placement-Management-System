import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { FallbackDataService } from '../fallback-data.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Application.name, schema: ApplicationSchema }]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, FallbackDataService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
