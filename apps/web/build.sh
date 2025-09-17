#!/bin/bash
set -e

echo "🚀 Starting Vercel build process..."

# Go to project root
cd ../..

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building packages..."
npm run build:packages

echo "🌐 Building web application..."
cd apps/web
npm run build

echo "✅ Build completed successfully!"
