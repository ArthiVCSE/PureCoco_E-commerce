#!/bin/bash

# PureCoco E-Commerce Quick Setup Script

echo "🥥 PureCoco E-Commerce Setup"
echo "================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Please install Node.js 16+${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node -v)"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB not found locally. Using MongoDB Atlas instead.${NC}"
fi

echo ""
echo -e "${BLUE}📦 Installing Backend Dependencies...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}✗ Failed to install backend dependencies${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📦 Installing Frontend Dependencies...${NC}"
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Copy backend/.env.example to backend/.env and add your variables:"
echo "   cp backend/.env.example backend/.env"
echo ""
echo "2. Start MongoDB (if local):"
echo "   mongod"
echo ""
echo "3. Seed the database:"
echo "   cd backend && npm run seed"
echo ""
echo "4. Start the backend:"
echo "   npm run dev"
echo ""
echo "5. In another terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "📡 Backend:  http://localhost:5000"
echo ""
echo "📧 Demo User: demo@purecoco.com / demo1234"
echo "👨‍💼 Admin:     admin@purecoco.com / admin1234"
