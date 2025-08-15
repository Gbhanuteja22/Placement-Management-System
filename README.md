# Placement Management System

A comprehensive placement management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gbhanuteja22/Placement-Pro.git
   cd Placement-Pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   **Backend (.env)**
   - Navigate to `apps/api/`
   - Copy `.env.example` to `.env`
   - Update the environment variables:
   
   ```bash
   # Database - MongoDB Atlas connection string
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/placement_management?retryWrites=true&w=majority
   
   # External API Keys (optional for additional job alerts)
   ADZUNA_APP_ID=your_adzuna_app_id
   ADZUNA_API_KEY=your_adzuna_api_key
   
   # Server Configuration
   PORT=3008
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3008

## 📁 Project Structure

```
├── apps/
│   ├── api/          # Backend API server
│   └── web/          # Frontend React application
├── packages/
│   ├── ui/           # Shared UI components
│   └── types/        # Shared TypeScript types
└── ...
```

## 🔧 Features

- **Student Management**: Complete student profile management with academic tracking
- **Job Portal**: Job posting and application management
- **Coordinator Dashboard**: Administrative interface for placement officers
- **Document Management**: Resume and CMM (Consolidated Marks Memo) handling
- **Application Tracking**: Real-time application status tracking
- **Export Functionality**: Export applicant data with document links

## 🔒 Security

- Environment variables for sensitive data
- MongoDB Atlas with proper authentication
- CORS configuration for secure API access

## 🛠 Development

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Database**: MongoDB Atlas
- **Build Tool**: Turbo (monorepo)
