#!/bin/bash
# setup.sh — One-click setup for Leave Management System

echo "================================================"
echo "  🎓 Leave Management System — Setup Script"
echo "================================================"
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend && npm install
echo "✅ Backend dependencies installed!"
echo ""

# Seed demo users
echo "🌱 Seeding demo users..."
npm run seed
echo "✅ Demo users seeded!"
echo ""

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install
echo "✅ Frontend dependencies installed!"
echo ""

echo "================================================"
echo "✅ Setup complete! Now run:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "  Open browser: http://localhost:5173"
echo "================================================"
