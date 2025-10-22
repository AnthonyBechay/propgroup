#!/bin/bash
set -e

echo "🚀 Starting Render build process..."

# We're already in apps/backend, navigate to workspace root
cd ../..

echo "📦 Installing dependencies from workspace root..."
# Install with --prod=false to include devDependencies (needed for build tools)
NODE_ENV=development pnpm install --frozen-lockfile

echo "🔧 Generating Prisma Client..."
cd packages/db
pnpm exec prisma generate

echo "📦 Building @propgroup/db package..."
pnpm run build

echo "🗄️  Running database migrations..."
pnpm exec prisma migrate deploy

echo "🌱 Seeding database with superuser..."
pnpm exec tsx prisma/seed.ts || echo "⚠️  Seed failed or already exists, continuing..."

cd ../..

echo "✅ Build completed successfully!"
echo "📍 Current directory: $(pwd)"
echo "📂 Backend location: apps/backend"
