#!/bin/bash

echo "Building PropGroup database package..."

# Navigate to db package
cd packages/db

# Generate Prisma client
echo "Generating Prisma client..."
npm run db:generate

# Build TypeScript
echo "Building TypeScript..."
npm run build

echo "Database package build complete!"
