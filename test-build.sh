#!/bin/bash

echo "🧹 Cleaning build artifacts..."
rm -rf apps/web/.next
rm -rf packages/*/dist

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building packages..."
npm run build:packages

echo "🌐 Building Next.js app..."
cd apps/web
npm run build

echo "✅ Build test completed!"
echo ""
echo "To start the production server locally:"
echo "  cd apps/web && npm start"
