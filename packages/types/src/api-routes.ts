// API Route Constants
export const API_ROUTES = {
  // Auth routes
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
  },
  
  // Student routes
  STUDENTS: {
    BASE: '/students',
    BY_ID: (id: string) => `/students/${id}`,
    PROFILE: (id: string) => `/students/${id}/profile`,
    SEM_RECORDS: (id: string) => `/students/${id}/sem-records`,
    CERTIFICATES: (id: string) => `/students/${id}/certificates`,
    RESUMES: (id: string) => `/students/${id}/resumes`,
    APPLICATIONS: (id: string) => `/students/${id}/applications`,
  },
  
  // Company routes
  COMPANIES: {
    BASE: '/companies',
    BY_ID: (id: string) => `/companies/${id}`,
    DRIVES: (id: string) => `/companies/${id}/drives`,
  },
  
  // Drive routes
  DRIVES: {
    BASE: '/drives',
    BY_ID: (id: string) => `/drives/${id}`,
    PUBLISH: (id: string) => `/drives/${id}/publish`,
    AUTO_MATCH: (id: string) => `/drives/${id}/auto-match`,
    APPLICANTS: (id: string) => `/drives/${id}/applicants`,
    ELIGIBILITY: (id: string) => `/drives/${id}/eligibility`,
  },
  
  // Application routes
  APPLICATIONS: {
    BASE: '/applications',
    BY_ID: (id: string) => `/applications/${id}`,
    MY: '/applications/my',
    WITHDRAW: (id: string) => `/applications/${id}/withdraw`,
    STATUS: (id: string) => `/applications/${id}/status`,
  },
  
  // Certificate routes
  CERTIFICATES: {
    BASE: '/certificates',
    BY_ID: (id: string) => `/certificates/${id}`,
    UPLOAD: '/certificates/upload',
    VERIFY: (id: string) => `/certificates/${id}/verify`,
  },
  
  // Resume routes
  RESUMES: {
    BASE: '/resumes',
    BY_ID: (id: string) => `/resumes/${id}`,
    GENERATE: '/resumes/generate',
    UPLOAD: '/resumes/upload',
    DOWNLOAD: (id: string) => `/resumes/${id}/download`,
    TEMPLATES: '/resumes/templates',
  },
  
  // AI routes
  AI: {
    RESUME_SCORE: '/ai/resume/score',
    RESUME_OPTIMIZE: '/ai/resume/optimize',
    JD_PARSE: '/ai/jd/parse',
    SKILL_ANALYSIS: '/ai/skills/analyze',
  },
  
  // Interview Experience routes
  INTERVIEWS: {
    BASE: '/interviews',
    BY_ID: (id: string) => `/interviews/${id}`,
    MODERATE: (id: string) => `/interviews/${id}/moderate`,
    VOTE: (id: string) => `/interviews/${id}/vote`,
  },
  
  // News routes
  NEWS: {
    BASE: '/news',
    BY_ID: (id: string) => `/news/${id}`,
    BOOKMARK: (id: string) => `/news/${id}/bookmark`,
    MY_BOOKMARKS: '/news/my-bookmarks',
  },
  
  // Hackathon routes
  HACKATHONS: {
    BASE: '/hackathons',
    BY_ID: (id: string) => `/hackathons/${id}`,
    BOOKMARK: (id: string) => `/hackathons/${id}/bookmark`,
    MY_BOOKMARKS: '/hackathons/my-bookmarks',
    REMINDER: (id: string) => `/hackathons/${id}/reminder`,
  },
  
  // Notification routes
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    READ: (id: string) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
    SETTINGS: '/notifications/settings',
  },
  
  // Gamification routes
  GAMIFICATION: {
    POINTS: '/gamification/points',
    BADGES: '/gamification/badges',
    MY_BADGES: '/gamification/my-badges',
    LEADERBOARD: '/gamification/leaderboard',
    EVENTS: '/gamification/events',
  },
  
  // Search routes
  SEARCH: {
    BASE: '/search',
    STUDENTS: '/search/students',
    DRIVES: '/search/drives',
    EXPERIENCES: '/search/experiences',
    NEWS: '/search/news',
    HACKATHONS: '/search/hackathons',
  },
  
  // Analytics routes
  ANALYTICS: {
    PLACEMENTS: '/analytics/placements',
    DRIVES: '/analytics/drives',
    STUDENTS: '/analytics/students',
    TRENDS: '/analytics/trends',
  },
  
  // Admin routes
  ADMIN: {
    USERS: '/admin/users',
    AUDIT_LOGS: '/admin/audit-logs',
    SYSTEM_STATS: '/admin/system-stats',
    BULK_IMPORT: '/admin/bulk-import',
    ANNOUNCEMENTS: '/admin/announcements',
  },
  
  // External API routes
  EXTERNAL: {
    LINKEDIN_JOBS: '/external/linkedin/jobs',
    JOB_PROVIDERS: '/external/jobs',
  },
  
  // File upload routes
  FILES: {
    UPLOAD: '/files/upload',
    SIGNED_URL: '/files/signed-url',
    DOWNLOAD: (id: string) => `/files/${id}`,
  },
  
  // Health check routes
  HEALTH: {
    CHECK: '/health',
    READY: '/health/ready',
    LIVE: '/health/live',
  },
} as const;

// WebSocket Events
export const WS_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  AUTHENTICATE: 'authenticate',
  
  // Real-time notifications
  NOTIFICATION: 'notification',
  DRIVE_PUBLISHED: 'drive_published',
  APPLICATION_STATUS_CHANGED: 'application_status_changed',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  
  // Live updates
  ONLINE_USERS: 'online_users',
  TYPING: 'typing',
  
  // Admin events
  USER_ACTIVITY: 'user_activity',
  SYSTEM_ALERT: 'system_alert',
} as const;

export type ApiRoute = typeof API_ROUTES;
export type WSEvent = typeof WS_EVENTS;
