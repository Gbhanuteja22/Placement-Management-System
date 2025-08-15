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
   - Update the environment variables with your actual credentials:
   
   ```bash
   # Database - MongoDB Atlas connection string
   # Replace the placeholders below with your actual MongoDB Atlas credentials
   MONGODB_URI=mongodb+srv://[username]:[password]@[cluster-url]/placement_management?retryWrites=true&w=majority
   
   # External API Keys (optional for additional job alerts)
   # Get these from https://developer.adzuna.com/
   ADZUNA_APP_ID=[your_adzuna_app_id]
   ADZUNA_API_KEY=[your_adzuna_api_key]
   
   # Server Configuration
   PORT=3008
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

   **Important**: 
   - Replace `[username]`, `[password]`, `[cluster-url]` with your actual MongoDB Atlas credentials
   - Never commit your actual `.env` file to version control
   - Use the `.env.example` file as a template

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

- **Environment Variables**: All sensitive data is stored in environment variables
- **MongoDB Atlas**: Secure database connection with proper authentication
- **CORS Configuration**: Controlled API access from allowed origins
- **Secret Management**: Never commit `.env` files or credentials to version control
- **GitHub Security**: Repository includes secret scanning and security alerts

### 🚨 Security Best Practices

1. **Never commit sensitive data** like passwords, API keys, or connection strings
2. **Use strong passwords** for your MongoDB Atlas account
3. **Rotate credentials regularly** especially if you suspect they may be compromised
4. **Restrict MongoDB network access** to specific IP addresses when possible
5. **Monitor access logs** for suspicious activity
6. **Keep dependencies updated** to avoid security vulnerabilities

### 🔑 If Credentials Are Compromised

If you accidentally commit credentials or suspect they're compromised:

1. **Immediately rotate/change** all affected passwords and API keys
2. **Update your local `.env`** file with new credentials
3. **Check access logs** for unauthorized activity
4. **Consider using GitHub's secret scanning alerts** for early detection

## 🛠 Development

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Database**: MongoDB Atlas
- **Build Tool**: Turbo (monorepo)
