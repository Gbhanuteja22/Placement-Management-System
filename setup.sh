#!/bin/bash
# Environment Setup Script for Placement Management System

echo "🚀 Setting up Placement Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment files
echo "⚙️ Setting up environment files..."

# Backend .env setup
if [ ! -f "apps/api/.env" ]; then
    if [ -f "apps/api/.env.example" ]; then
        cp apps/api/.env.example apps/api/.env
        echo "📝 Created apps/api/.env from template"
        echo "⚠️  Please update the MONGODB_URI and other credentials in apps/api/.env"
    else
        echo "❌ .env.example not found in apps/api/"
    fi
else
    echo "✅ apps/api/.env already exists"
fi

# Frontend .env setup (if needed)
if [ ! -f "apps/web/.env.local" ]; then
    echo "VITE_API_URL=http://localhost:3008" > apps/web/.env.local
    echo "📝 Created apps/web/.env.local"
else
    echo "✅ apps/web/.env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update apps/api/.env with your MongoDB URI and API keys"
echo "2. Run 'npm run dev' to start the development servers"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "⚠️  Important: Never commit .env files to git!"
