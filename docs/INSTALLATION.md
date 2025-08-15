# Installation Guide

This guide will walk you through setting up the Placement Management Platform from scratch.

## Prerequisites

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **Node.js**: Version 20.0.0 or higher
- **npm**: Version 10.0.0 or higher
- **Docker**: Version 20.10+ with Docker Compose
- **Git**: Latest version

### Required Services
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)
- MinIO or AWS S3 account
- Gemini Pro API key (for AI features)

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd PlacementManagementSystem
```

## Step 2: Install Dependencies

Install all dependencies for the monorepo:

```bash
npm install
```

This will install dependencies for all workspaces (apps and packages).

## Step 3: Environment Configuration

### Backend Configuration

Copy the example environment file:
```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env` with your configurations:

```env
# Database
DATABASE_URL="postgresql://placement_user:placement_pass@localhost:5432/placement_db?schema=public"

# JWT Secrets (Generate strong secrets in production)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"

# Redis
REDIS_URL="redis://localhost:6379"

# AWS S3 / MinIO
AWS_ACCESS_KEY_ID="minio_access_key"
AWS_SECRET_ACCESS_KEY="minio_secret_key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="placement-files"
S3_ENDPOINT="http://localhost:9000"  # MinIO endpoint
S3_FORCE_PATH_STYLE="true"

# Email Configuration (Postmark)
POSTMARK_API_TOKEN="your-postmark-api-token"
FROM_EMAIL="noreply@yourcompany.com"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Services
GEMINI_API_KEY="your-gemini-api-key"

# External APIs
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
NEWS_API_KEY="your-news-api-key"

# Application Settings
NODE_ENV="development"
PORT="3001"
CORS_ORIGIN="http://localhost:3000"
```

### Frontend Configuration

Create `apps/web/.env.local`:

```env
# API Configuration
VITE_API_URL=http://localhost:3001

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_LINKEDIN_INTEGRATION=true

# Analytics (Optional)
VITE_GA_TRACKING_ID=your-google-analytics-id
```

## Step 4: Database Setup

### Option A: Using Docker (Recommended)

Start the development environment with Docker:

```bash
npm run docker:dev
```

This will start:
- PostgreSQL database
- Redis cache
- MinIO object storage
- Prometheus metrics
- Grafana dashboards
- Jaeger tracing

### Option B: Local Installation

#### Install PostgreSQL

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer and follow setup wizard
3. Create database and user:

```sql
CREATE DATABASE placement_db;
CREATE USER placement_user WITH ENCRYPTED PASSWORD 'placement_pass';
GRANT ALL PRIVILEGES ON DATABASE placement_db TO placement_user;
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb placement_db
createuser -P placement_user
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-contrib
sudo -u postgres createdb placement_db
sudo -u postgres createuser -P placement_user
```

#### Install Redis

**Windows:**
1. Enable WSL2 and install Redis in Linux subsystem
2. Or use Redis for Windows (unofficial)

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## Step 5: Database Migration

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

## Step 6: External Service Setup

### Gemini Pro API

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to your `.env` file: `GEMINI_API_KEY=your-api-key`

### Postmark (Email Service)

1. Sign up at [Postmark](https://postmarkapp.com/)
2. Create a server
3. Get your API token
4. Add to `.env`: `POSTMARK_API_TOKEN=your-token`

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:3000`, `http://localhost:3001`
6. Add to `.env` files

### LinkedIn API (Optional)

1. Create app at [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Get client ID and secret
3. Add to `.env`

### News API (Optional)

1. Sign up at [News API](https://newsapi.org/)
2. Get your API key
3. Add to `.env`: `NEWS_API_KEY=your-key`

## Step 7: Start Development

Start all development servers:

```bash
npm run dev
```

This will start:
- Frontend at http://localhost:3000
- Backend API at http://localhost:3001
- API documentation at http://localhost:3001/api/docs

## Step 8: Verify Installation

### Check Services

1. **Database**: Visit http://localhost:3001/health
2. **Frontend**: Visit http://localhost:3000
3. **API Docs**: Visit http://localhost:3001/api/docs

### Test Basic Functionality

1. Register a new student account
2. Complete profile setup
3. Browse available drives
4. Generate a resume
5. Apply to a drive

## Step 9: Development Tools

### Prisma Studio

Access database GUI:
```bash
npm run db:studio
```

### Monitoring Tools

If using Docker development environment:
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Jaeger**: http://localhost:16686
- **MinIO Console**: http://localhost:9001

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill processes on ports
npx kill-port 3000 3001

# Or use different ports in .env files
```

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
# Windows
net start postgresql-x64-15

# macOS/Linux
brew services list | grep postgresql
sudo systemctl status postgresql
```

#### Permission Errors
```bash
# Fix npm permissions (Unix-like systems)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### Docker Issues
```bash
# Reset Docker environment
docker-compose -f docker/docker-compose.dev.yml down -v
docker system prune -f
npm run docker:dev
```

### Getting Help

1. Check logs: `docker logs <container-name>`
2. Review environment variables
3. Ensure all required services are running
4. Check network connectivity
5. Verify API keys and credentials

## Next Steps

1. **Read the Documentation**: Review [README.md](../README.md)
2. **Explore Features**: Try different user roles and features
3. **Development**: Start building new features
4. **Testing**: Run test suites: `npm test`
5. **Deployment**: Review deployment guide for production setup

## Production Deployment

For production deployment:

1. Review security configurations
2. Use strong secrets and passwords
3. Configure proper SSL certificates
4. Set up monitoring and logging
5. Configure backup strategies
6. Review the Terraform configurations in `infra/`

See the deployment documentation for detailed production setup instructions.
