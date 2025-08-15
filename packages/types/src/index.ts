import { z } from 'zod';

// User Roles
export enum UserRole {
  STUDENT = 'STUDENT',
  COORDINATOR = 'COORDINATOR',
  ADMIN = 'ADMIN',
}

// Application Status
export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  TEST_SCHEDULED = 'TEST_SCHEDULED',
  TEST_COMPLETED = 'TEST_COMPLETED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',
  SELECTED = 'SELECTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

// Drive Status
export enum DriveStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  APPLICATIONS_OPEN = 'APPLICATIONS_OPEN',
  APPLICATIONS_CLOSED = 'APPLICATIONS_CLOSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Notification Types
export enum NotificationType {
  DRIVE_PUBLISHED = 'DRIVE_PUBLISHED',
  APPLICATION_STATUS_CHANGED = 'APPLICATION_STATUS_CHANGED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  DEADLINE_REMINDER = 'DEADLINE_REMINDER',
  POINTS_EARNED = 'POINTS_EARNED',
  BADGE_EARNED = 'BADGE_EARNED',
  NEWS_ITEM = 'NEWS_ITEM',
  HACKATHON_REMINDER = 'HACKATHON_REMINDER',
  GENERAL_ANNOUNCEMENT = 'GENERAL_ANNOUNCEMENT',
}

// Gamification Event Types
export enum GamificationEventType {
  PROFILE_COMPLETED = 'PROFILE_COMPLETED',
  FIRST_APPLICATION = 'FIRST_APPLICATION',
  MOCK_TEST_COMPLETED = 'MOCK_TEST_COMPLETED',
  INTERVIEW_EXPERIENCE_SHARED = 'INTERVIEW_EXPERIENCE_SHARED',
  CERTIFICATE_UPLOADED = 'CERTIFICATE_UPLOADED',
  RESUME_GENERATED = 'RESUME_GENERATED',
  AI_OPTIMIZATION_USED = 'AI_OPTIMIZATION_USED',
}

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  role: z.nativeEnum(UserRole),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Student Profile Schemas
export const studentProfileSchema = z.object({
  rollNo: z.string().min(1, 'Roll number is required'),
  branch: z.string().min(1, 'Branch is required'),
  graduationYear: z.number().int().min(2020).max(2030),
  cgpa: z.number().min(0).max(10),
  backlogCount: z.number().int().min(0).default(0),
  skills: z.array(z.string()).default([]),
  links: z.record(z.string()).default({}),
});

export const semesterRecordSchema = z.object({
  semNumber: z.number().int().min(1).max(8),
  sgpa: z.number().min(0).max(10),
  marks: z.record(z.number()),
  backlogs: z.record(z.boolean()).default({}),
});

// Company & Drive Schemas
export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  sectors: z.array(z.string()).default([]),
});

export const eligibilityCriteriaSchema = z.object({
  branches: z.array(z.string()).min(1, 'At least one branch must be selected'),
  minCGPA: z.number().min(0).max(10),
  maxBacklogs: z.number().int().min(0),
  graduationYears: z.array(z.number()).min(1),
  requiredSkills: z.array(z.string()).default([]),
  minSemesterGPA: z.record(z.number()).optional(),
});

export const driveSchema = z.object({
  companyId: z.string().uuid(),
  role: z.string().min(1, 'Role is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  ctc: z.string().min(1, 'CTC is required'),
  startAt: z.date(),
  endAt: z.date(),
  testAt: z.date().optional(),
  interviewAt: z.date().optional(),
  attachments: z.array(z.string()).default([]),
  eligibility: eligibilityCriteriaSchema,
}).refine((data) => data.endAt > data.startAt, {
  message: "End date must be after start date",
  path: ["endAt"],
});

// Application Schema
export const applicationSchema = z.object({
  driveId: z.string().uuid(),
  resumeId: z.string().uuid(),
  notes: z.string().optional(),
});

// Certificate Schema
export const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  org: z.string().min(1, 'Organization is required'),
  issuedOn: z.date(),
  tags: z.array(z.string()).default([]),
});

// Resume Schema
export const resumeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  template: z.string().default('default'),
  generatedFromProfile: z.boolean().default(false),
});

// Interview Experience Schema
export const interviewExperienceSchema = z.object({
  companyId: z.string().uuid(),
  role: z.string().min(1, 'Role is required'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  rounds: z.array(z.object({
    type: z.string(),
    description: z.string(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    questions: z.array(z.string()).optional(),
  })),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  tags: z.array(z.string()).default([]),
});

// AI Resume Optimization Schema
export const aiResumeOptimizationSchema = z.object({
  resumeText: z.string().min(100, 'Resume content too short'),
  jobDescription: z.string().min(100, 'Job description too short'),
  targetRole: z.string().optional(),
});

// News & Hackathon Schemas
export const newsItemSchema = z.object({
  source: z.string(),
  title: z.string(),
  url: z.string().url(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.date(),
});

export const hackathonSchema = z.object({
  source: z.string(),
  title: z.string(),
  url: z.string().url(),
  prize: z.string().optional(),
  deadline: z.date(),
  tags: z.array(z.string()).default([]),
});

// Notification Schema
export const notificationSchema = z.object({
  type: z.nativeEnum(NotificationType),
  payload: z.record(z.any()),
});

// Search Schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  type: z.enum(['students', 'drives', 'experiences', 'news', 'hackathons']).optional(),
  filters: z.record(z.any()).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// Type exports for TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
export type SemesterRecordInput = z.infer<typeof semesterRecordSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
export type EligibilityCriteria = z.infer<typeof eligibilityCriteriaSchema>;
export type DriveInput = z.infer<typeof driveSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
export type ResumeInput = z.infer<typeof resumeSchema>;
export type InterviewExperienceInput = z.infer<typeof interviewExperienceSchema>;
export type AIResumeOptimizationInput = z.infer<typeof aiResumeOptimizationSchema>;
export type NewsItemInput = z.infer<typeof newsItemSchema>;
export type HackathonInput = z.infer<typeof hackathonSchema>;
export type NotificationInput = z.infer<typeof notificationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone: string;
  avatarUrl?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student extends User {
  rollNo: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  backlogCount: number;
  skills: string[];
  links: Record<string, string>;
}

// JWT Payload
export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// AI Response Types
export interface AIResumeOptimizationResponse {
  score: number;
  issues: string[];
  improvements: Array<{
    section: string;
    original: string;
    improved: string;
    reason: string;
  }>;
  skillGaps: string[];
  tailoredSummary?: string;
}

// Gamification Types
export interface GamificationEvent {
  id: string;
  userId: string;
  type: GamificationEventType;
  points: number;
  meta: Record<string, any>;
  createdAt: Date;
}

export interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  pointsThreshold: number;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  badge: Badge;
  awardedAt: Date;
}

// Analytics Types
export interface PlacementAnalytics {
  totalStudents: number;
  placedStudents: number;
  averageCTC: number;
  topCompanies: Array<{
    name: string;
    offers: number;
    avgCTC: number;
  }>;
  branchWiseStats: Array<{
    branch: string;
    totalStudents: number;
    placedStudents: number;
    placementPercentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    applications: number;
    offers: number;
  }>;
}

export * from './api-routes';
