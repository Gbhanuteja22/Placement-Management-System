# Environment Setup Script for Placement Management System (PowerShell)

Write-Host "🚀 Setting up Placement Management System..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js v16 or higher." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Set up environment files
Write-Host "⚙️ Setting up environment files..." -ForegroundColor Yellow

# Backend .env setup
$envPath = "apps/api/.env"
$envExamplePath = "apps/api/.env.example"

if (-not (Test-Path $envPath)) {
    if (Test-Path $envExamplePath) {
        Copy-Item $envExamplePath $envPath
        Write-Host "📝 Created apps/api/.env from template" -ForegroundColor Green
        Write-Host "⚠️  Please update the MONGODB_URI and other credentials in apps/api/.env" -ForegroundColor Yellow
    } else {
        Write-Host "❌ .env.example not found in apps/api/" -ForegroundColor Red
    }
} else {
    Write-Host "✅ apps/api/.env already exists" -ForegroundColor Green
}

# Frontend .env setup (if needed)
$frontendEnvPath = "apps/web/.env.local"
if (-not (Test-Path $frontendEnvPath)) {
    "VITE_API_URL=http://localhost:3008" | Out-File -FilePath $frontendEnvPath -Encoding UTF8
    Write-Host "📝 Created apps/web/.env.local" -ForegroundColor Green
} else {
    Write-Host "✅ apps/web/.env.local already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update apps/api/.env with your MongoDB URI and API keys" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start the development servers" -ForegroundColor White
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important: Never commit .env files to git!" -ForegroundColor Yellow
