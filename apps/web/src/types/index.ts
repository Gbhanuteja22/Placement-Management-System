// Core user types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile?: StudentProfile | CoordinatorProfile | AdminProfile;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  COORDINATOR = 'COORDINATOR',
  ADMIN = 'ADMIN',
}

export interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  department: string;
  batch: number;
  cgpa?: number;
  phone?: string;
  address?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  skills: string[];
  achievements: string[];
  isVerified: boolean;
  placementStatus: PlacementStatus;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoordinatorProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  department: string;
  phone?: string;
  officeLocation?: string;
  permissions: CoordinatorPermission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  isSuperAdmin: boolean;
  permissions: AdminPermission[];
  createdAt: Date;
  updatedAt: Date;
}

export enum PlacementStatus {
  NOT_PLACED = 'NOT_PLACED',
  PLACED = 'PLACED',
  HIGHER_STUDIES = 'HIGHER_STUDIES',
  ENTREPRENEUR = 'ENTREPRENEUR',
  NOT_INTERESTED = 'NOT_INTERESTED',
}

export enum CoordinatorPermission {
  MANAGE_DRIVES = 'MANAGE_DRIVES',
  MANAGE_STUDENTS = 'MANAGE_STUDENTS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_COMPANIES = 'MANAGE_COMPANIES',
  GENERATE_REPORTS = 'GENERATE_REPORTS',
}

export enum AdminPermission {
  FULL_ACCESS = 'FULL_ACCESS',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_SYSTEM = 'MANAGE_SYSTEM',
  VIEW_SYSTEM_LOGS = 'VIEW_SYSTEM_LOGS',
  MANAGE_COORDINATORS = 'MANAGE_COORDINATORS',
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
