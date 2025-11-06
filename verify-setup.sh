#!/bin/bash

# ==================================
# CarbonFighters - Quick Setup Check
# ==================================
# This script helps verify your setup is correct

echo "🔍 CarbonFighters Setup Verification"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Check 1: Docker installed
echo "1. Checking Docker installation..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker is installed${NC}"
    docker --version
else
    echo -e "${RED}❌ Docker is NOT installed${NC}"
    echo "   Install from: https://www.docker.com/products/docker-desktop/"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 2: Docker running
echo "2. Checking if Docker is running..."
if docker info &> /dev/null; then
    echo -e "${GREEN}✅ Docker daemon is running${NC}"
else
    echo -e "${RED}❌ Docker is not running${NC}"
    echo "   Solution: Open Docker Desktop and wait for it to start"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 3: .env file exists
echo "3. Checking backend/.env file..."
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ backend/.env exists${NC}"
    
    # Check if it has correct values
    if grep -q "DB_USER=carbonfighters_user" backend/.env; then
        echo -e "${GREEN}✅ .env has correct Docker credentials${NC}"
    else
        echo -e "${RED}❌ .env has incorrect credentials${NC}"
        echo "   Solution: Run 'cd backend && cp .env.example .env'"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}❌ backend/.env does NOT exist${NC}"
    echo "   Solution: Run 'cd backend && cp .env.example .env'"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 4: .env.test file exists
echo "4. Checking backend/.env.test file..."
if [ -f "backend/.env.test" ]; then
    echo -e "${GREEN}✅ backend/.env.test exists${NC}"
    
    # Check if it has correct values
    if grep -q "DB_USER=carbonfighters_user" backend/.env.test; then
        echo -e "${GREEN}✅ .env.test has correct Docker credentials${NC}"
    else
        echo -e "${RED}❌ .env.test has incorrect credentials${NC}"
        echo "   Solution: Run 'cd backend && cp .env.example .env.test'"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}❌ backend/.env.test does NOT exist${NC}"
    echo "   Solution: Run 'cd backend && cp .env.example .env.test'"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 5: Docker containers
echo "5. Checking Docker containers..."
if docker-compose ps | grep -q "carbonfighters-db"; then
    if docker-compose ps | grep "carbonfighters-db" | grep -q "Up"; then
        echo -e "${GREEN}✅ Docker containers are running${NC}"
        docker-compose ps
    else
        echo -e "${YELLOW}⚠️  Docker containers exist but are not running${NC}"
        echo "   Solution: Run 'docker-compose start'"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}❌ Docker containers don't exist${NC}"
    echo "   Solution: Run 'docker-compose up -d'"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 6: Node modules
echo "6. Checking dependencies..."
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Backend dependencies not installed${NC}"
    echo "   Solution: Run 'cd backend && npm install'"
    ERRORS=$((ERRORS + 1))
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed${NC}"
    echo "   Solution: Run 'cd frontend && npm install'"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Summary
echo "====================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! You're ready to code!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start backend:  cd backend && npm run dev"
    echo "  2. Start frontend: cd frontend && npm run dev"
    echo "  3. Open browser:   http://localhost:5173"
else
    echo -e "${RED}❌ Found $ERRORS issue(s) - Please fix them above${NC}"
    echo ""
    echo "Need help? Read:"
    echo "  - TEAM_ONBOARDING.md (English)"
    echo "  - QUICK_START.md (Portuguese)"
fi
echo "====================================="
