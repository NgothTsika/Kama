#!/bin/bash

# 🚀 Kama Backend - Quick Start Script
# This script sets up the entire backend in one go

set -e  # Exit on error

echo "🎉 Welcome to Kama Backend Setup!"
echo "=================================="
echo ""

# Check Node.js
echo "✅ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi
echo "✓ Node.js $(node --version)"

# Check Yarn
echo "✅ Checking Yarn..."
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed. Please install Yarn."
    exit 1
fi
echo "✓ Yarn $(yarn --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
yarn install

# Check if .env exists
echo ""
echo "🔐 Configuring environment..."
if [ ! -f .env ]; then
    echo "ℹ️  Creating .env from template..."
    cp .env.template .env
    echo "⚠️  Please update .env with your database configuration"
    echo "📝 Edit .env and set DATABASE_URL"
    exit 1
else
    echo "✓ .env file exists"
fi

# Generate Prisma Client
echo ""
echo "🔧 Setting up Prisma..."
yarn generate

# Run migrations
echo ""
echo "📊 Running database migrations..."
yarn migrate:dev

# Seed database
echo ""
echo "🌱 Seeding database with initial data..."
yarn seed

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🚀 Next steps:"
echo "  1. Review and update .env if needed"
echo "  2. Start development server: yarn dev"
echo "  3. Visit: http://localhost:3000/api/health"
echo "  4. API Docs: See README.md"
echo ""
echo "📚 Documentation:"
echo "  - README.md     - API documentation"
echo "  - SETUP.md      - Detailed setup guide"
echo "  - BUILD.md      - Build summary"
echo ""
echo "💡 Common commands:"
echo "  yarn dev        - Start development server"
echo "  yarn build      - Build for production"
echo "  yarn studio     - Open Prisma Studio"
echo "  yarn seed       - Re-seed database"
echo ""
echo "Happy coding! 🎉"
