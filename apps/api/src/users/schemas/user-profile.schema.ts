import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserProfileDocument = UserProfile & Document;

@Schema({ timestamps: true })
export class UserProfile {
  @Prop({ required: true, unique: true })
  clerkUserId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  rollNumber: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  collegeEmail: string;

  @Prop({ required: true })
  personalEmail: string;

  @Prop({ required: true })
  collegeName: string;

  @Prop({ required: true })
  academicStartYear: string;

  @Prop({ required: true })
  academicEndYear: string;

  @Prop({ required: true })
  currentSemester: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop({ required: true })
  cgpa: number;

  @Prop()
  resumeUrl?: string;

  @Prop([String])
  skills?: string[];

  @Prop([{
    title: String,
    description: String,
    technologies: [String],
    github: String,
    demo: String
  }])
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    github?: string;
    demo?: string;
  }>;

  @Prop([{
    name: String,
    issuer: String,
    date: Date,
    credentialId: String,
    url: String,
    mediaUrl: String
  }])
  certifications?: Array<{
    name: string;
    issuer: string;
    date: Date;
    credentialId?: string;
    url?: string;
    mediaUrl?: string;
  }>;

  @Prop([String])
  achievements?: string[];

  @Prop()
  linkedinUrl?: string;

  @Prop()
  githubUrl?: string;

  @Prop()
  portfolioUrl?: string;

  @Prop({ default: false })
  isOnboardingComplete: boolean;

  @Prop({ default: true })
  isEligibleForPlacements: boolean;

  @Prop()
  profilePicture?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  gender?: string;

  // Placement preferences
  @Prop([String])
  preferredLocations?: string[];

  @Prop([String])
  preferredCompanyTypes?: string[]; // Startup, MNC, Product, Service

  @Prop()
  expectedSalary?: string;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
