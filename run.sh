#!/bin/bash

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing root dependencies..."
  npm install
fi

if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

# Check if MongoDB is running
echo "Checking MongoDB connection..."
cd backend
if [ ! -f ".env" ]; then
  echo "Creating .env file..."
  echo "PORT=12001" > .env
  echo "MONGO_URI=mongodb://localhost:27017/pos_system" >> .env
  echo "JWT_SECRET=posSystemSecretKey123" >> .env
  echo "NODE_ENV=development" >> .env
fi

# Start the application
cd ..
echo "Starting the POS System..."
npm start