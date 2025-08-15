# PlacementPro - Placement Management System
> **🚧 Currently in Progress** - This project is actively being developed and improved.
A modern placement management platform built with React, Node.js, and MongoDB.
## Features
- Student profile management and onboarding
- Placement coordinator dashboard
- User authentication with Clerk
- MongoDB Atlas integration
- Real-time profile creation and updates
## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB Atlas
- **Authentication**: Clerk
- **Development**: Hot reload, TypeScript support
## Quick Start
### Prerequisites
- Node.js 20+
- npm 10+
### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd PlacementManagementSystem
```
2. Install dependencies
```bash
npm install
```
3. Start the application
```bash
# Automated start (recommended)
.\start.ps1
# Or manual start
cd apps\api && node simple-server.js
cd apps\web && npm run dev
```
4. Access the application
- Frontend: http://localhost:3000
- API: http://localhost:3008
## Project Structure
```
PlacementManagementSystem/
├── apps/
│   ├── api/
│   │   └── simple-server.js    # Express API server
│   └── web/                    # React frontend
├── packages/                   # Shared packages
├── start.ps1                   # Auto-start script
├── check-status.ps1           # Status checker
└── run.txt                    # Setup guide
```
## Development
### Available Scripts
```bash
# Start all services
.\start.ps1
# Check system status
.\check-status.ps1
# Development commands
npm run dev         # Start development servers
npm run build       # Build for production
npm run lint        # Lint code
npm run typecheck   # Type checking
```
### API Endpoints
- `GET /health` - Server health check
- `GET /db-test/status` - Database status
- `POST /users/profile` - Create/update profile
- `GET /users/profile/:id` - Get user profile
- `GET /users/profile/:id/check-onboarding` - Check onboarding status
### Environment Configuration
The application is pre-configured with:
- MongoDB Atlas connection
- Clerk authentication
- CORS enabled for development
- Profile management endpoints
## Features
### Student Portal
- Complete profile onboarding
- Academic information management
- Skills and project tracking
- Certification uploads
- Achievement records
### Authentication
- Clerk integration
- Automatic redirects after signup/signin
- Profile completion tracking
- Secure user management
### Database
- MongoDB Atlas cloud database
- User profile storage
- Real-time data synchronization
- Automatic backups
## Support
For issues or questions:
1. Check `.\check-status.ps1` for system status
2. Review `run.txt` for detailed setup instructions
3. Restart services with `.\start.ps1`
## License
Private Project - All Rights Reserved
# Placement-Pro
