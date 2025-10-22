#!/bin/bash
set -e

echo "🚀 Starting Render build process..."

# Navigate to the workspace root
cd ../..

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔧 Generating Prisma Client..."
cd packages/db
pnpm run db:generate

echo "🗄️  Running database migrations..."
# Check if migration table exists and handle failed migrations
pnpm run db:migrate:deploy || {
  echo "⚠️  Migration failed. Attempting to resolve..."

  # Mark the failed migration as rolled back and retry
  npx prisma migrate resolve --rolled-back 20251021000001_add_oauth_fields || true

  # Try migration again
  pnpm run db:migrate:deploy
}

echo "✅ Build completed successfully!"
