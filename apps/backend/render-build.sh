#!/bin/bash
set -e

echo "🚀 Starting Render build process..."

# We're already in apps/backend, navigate to workspace root
cd ../..

echo "📦 Installing dependencies from workspace root..."
pnpm install --frozen-lockfile

echo "🔧 Generating Prisma Client..."
cd packages/db
npx prisma generate

echo "🗄️  Running database migrations..."
# Check if migration table exists and handle failed migrations
npx prisma migrate deploy || {
  echo "⚠️  Migration failed. Attempting to resolve..."

  # Mark the failed migration as rolled back and retry
  npx prisma migrate resolve --rolled-back 20251021000001_add_oauth_fields || true

  # Try migration again
  npx prisma migrate deploy
}

cd ../..

echo "✅ Build completed successfully!"
echo "📍 Current directory: $(pwd)"
echo "📂 Backend location: apps/backend"
