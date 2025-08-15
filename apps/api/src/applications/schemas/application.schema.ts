import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ required: true })
  userId: string; // Clerk user ID

  @Prop({ required: true })
  jobId: string; // Reference to Job

  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  status: string; // Applied, Under Review, Interview Scheduled, Rejected, Accepted

  @Prop()
  appliedDate: Date;

  @Prop()
  resumeUrl?: string;

  @Prop()
  coverLetter?: string;

  @Prop()
  interviewDate?: Date;

  @Prop()
  interviewMode?: string; // Online, Offline

  @Prop()
  interviewLocation?: string;

  @Prop()
  notes?: string;

  @Prop()
  salary?: string;

  @Prop()
  location?: string;

  @Prop({ default: false })
  isOnCampus: boolean;

  // Status history
  @Prop([{
    status: String,
    date: Date,
    notes: String
  }])
  statusHistory?: Array<{
    status: string;
    date: Date;
    notes?: string;
  }>;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
