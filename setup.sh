#!/bin/bash

# Carbon Fighters - Quick Setup Script
# This script helps you get started with the project in seconds

set -e  # Exit on error

echo "🌱 Carbon Fighters - Quick Setup"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "📖 Please install Docker first:"
    echo "   Windows/Mac: https://www.docker.com/products/docker-desktop/"
    echo "   Linux: sudo apt install docker.io docker-compose"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running!"
    echo "🔧 Please start Docker Desktop and try again"
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Setup backend .env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env from .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ backend/.env created"
else
    echo "✅ backend/.env already exists"
fi

echo ""
echo "🐳 Starting PostgreSQL databases with Docker..."
docker-compose up -d

echo ""
echo "⏳ Waiting for databases to be ready..."
sleep 5

# Check if databases are healthy
if docker-compose ps | grep -q "carbonfighters-db.*Up"; then
    echo "✅ Development database is running (port 5432)"
else
    echo "⚠️  Development database may not be ready yet"
fi

if docker-compose ps | grep -q "carbonfighters-db-test.*Up"; then
    echo "✅ Test database is running (port 5433)"
else
    echo "⚠️  Test database may not be ready yet"
fi

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "🎉 Setup complete! You're ready to go!"
echo ""
echo "📝 Next steps:"
echo "   1. Start the backend:  cd backend && npm run dev"
echo "   2. Start the frontend: cd frontend && npm run dev"
echo "   3. Open your browser:  http://localhost:5173"
echo ""
echo "🔧 Useful commands:"
echo "   • View databases:      docker-compose ps"
echo "   • Stop databases:      docker-compose stop"
echo "   • View logs:           docker logs carbonfighters-db"
echo "   • Connect to DB:       docker exec -it carbonfighters-db psql -U carbonfighters_user -d carbonfighters"
echo ""
