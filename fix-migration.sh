#!/bin/bash
# Script to fix the failed migration on Render
# Run this manually if the migration is stuck

echo "🔧 Fixing failed Prisma migration..."

cd packages/db

# Option 1: Mark the migration as rolled back
echo "Marking migration as rolled back..."
npx prisma migrate resolve --rolled-back 20251021000001_add_oauth_fields

# Option 2: If the migration actually applied, mark it as applied
# Uncomment this if the database changes were actually applied:
# npx prisma migrate resolve --applied 20251021000001_add_oauth_fields

# Then deploy migrations
echo "Deploying migrations..."
npx prisma migrate deploy

echo "✅ Migration issue resolved!"
