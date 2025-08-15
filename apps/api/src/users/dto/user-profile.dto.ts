import { IsString, IsEmail, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateUserProfileDto {
  @IsString()
  clerkUserId: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  rollNumber: string;

  @IsNumber()
  age: number;

  @IsString()
  address: string;

  @IsEmail()
  collegeEmail: string;

  @IsEmail()
  personalEmail: string;

  @IsString()
  collegeName: string;

  @IsString()
  academicStartYear: string;

  @IsString()
  academicEndYear: string;

  @IsString()
  currentSemester: string;

  @IsString()
  mobileNumber: string;

  @IsNumber()
  cgpa: number;

  @IsOptional()
  @IsArray()
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    github?: string;
    demo?: string;
  }>;

  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @IsArray()
  certifications?: Array<{
    name: string;
    issuer: string;
    date: Date;
    credentialId?: string;
    url?: string;
    mediaUrl?: string;
  }>;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsArray()
  achievements?: string[];
}

export class UpdateUserProfileDto {
  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  academicStartYear?: string;

  @IsOptional()
  @IsString()
  academicEndYear?: string;

  @IsOptional()
  @IsString()
  currentSemester?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsOptional()
  @IsNumber()
  cgpa?: number;

  @IsOptional()
  @IsArray()
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    github?: string;
    demo?: string;
  }>;

  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @IsArray()
  certifications?: Array<{
    name: string;
    issuer: string;
    date: Date;
    credentialId?: string;
    url?: string;
    mediaUrl?: string;
  }>;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsArray()
  achievements?: string[];
}
