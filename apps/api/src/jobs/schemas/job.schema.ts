import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  salary: string;

  @Prop({ required: true })
  type: string; // Full-time, Part-time, Internship

  @Prop({ required: true })
  experience: string;

  @Prop({ required: true })
  description: string;

  @Prop([String])
  requirements: string[];

  @Prop({ required: true })
  isOnCampus: boolean;

  @Prop()
  companyLogo?: string;

  @Prop()
  companyWebsite?: string;

  @Prop()
  applyUrl?: string;

  @Prop({ default: false })
  urgent: boolean;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  deadline?: Date;

  @Prop({ default: 0 })
  rating: number;

  @Prop()
  employees?: string;

  @Prop()
  benefits?: string[];

  // External job data from APIs
  @Prop()
  externalId?: string;

  @Prop()
  source?: string; // 'adzuna', 'rapidapi', 'manual'

  @Prop()
  category?: string;

  @Prop()
  minSalary?: number;

  @Prop()
  maxSalary?: number;
}

export const JobSchema = SchemaFactory.createForClass(Job);
