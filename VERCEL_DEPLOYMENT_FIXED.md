# Vercel Deployment Configuration - Fixed

## Overview
This document outlines the fixed deployment configuration for the PropGroup monorepo on Vercel.

## Key Fixes Applied

### 1. Prisma Client Generation
- **Issue**: Prisma client was trying to import from `./generated/schema` but was configured to output to `../dist/generated`
- **Fix**: Updated Prisma schema to generate client in `../src/generated` and fixed import paths

### 2. Build Process
- **Issue**: Build scripts were not generating Prisma client before TypeScript compilation
- **Fix**: Added Prisma generation to build scripts in multiple places:
  - `packages/db/package.json`: Added `prisma generate` to build and postinstall scripts
  - `scripts/build-packages.js`: Added Prisma generation for db package
  - `scripts/vercel-build-monorepo.js`: Added Prisma generation for db package

### 3. Environment Variables
- **Issue**: DATABASE_URL not available during Prisma generation on Vercel
- **Fix**: 
  - Created `scripts/setup-vercel-env.js` to write .env file for Prisma
  - Updated `vercel.json` to include environment variable mappings
  - Added environment setup step to build process

### 4. Removed Conflicting Configuration
- **Issue**: Duplicate vercel.json in apps/web conflicting with root configuration
- **Fix**: Removed apps/web/vercel.json to use root configuration

## Required Environment Variables on Vercel

Make sure these environment variables are set in your Vercel project settings:

```
DATABASE_URL         # PostgreSQL connection string
DIRECT_URL          # Direct PostgreSQL connection (for migrations)
SUPABASE_SERVICE_ROLE_KEY
SENDGRID_API_KEY
NEXT_PUBLIC_GA_MEASUREMENT_ID
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Project Structure

```
propgroup/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── config/           # Shared configuration
│   ├── db/              # Prisma database schema and client
│   ├── supabase/        # Supabase client and types
│   └── ui/              # Shared UI components
├── scripts/
│   ├── build-packages.js         # Build all packages
│   ├── setup-vercel-env.js      # Setup env for Vercel
│   └── vercel-build-monorepo.js # Main Vercel build script
├── package.json         # Root package.json with workspaces
└── vercel.json         # Vercel configuration

```

## Build Process Flow

1. **Environment Setup** (Vercel only)
   - `scripts/setup-vercel-env.js` creates .env file with DATABASE_URL

2. **Install Dependencies**
   - `npm install` at root level

3. **Build Packages**
   - For each package (config, db, supabase, ui):
     - Generate Prisma client (db package only)
     - Compile TypeScript to JavaScript
     - Create fallbacks if build fails

4. **Build Next.js App**
   - `npm run build` in apps/web
   - Uses Turbopack for faster builds

## Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
cd packages/db && npx prisma generate

# Run development server
npm run dev
```

## Deployment Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## Troubleshooting

### Issue: Cannot find module './generated/schema'
**Solution**: Run `cd packages/db && npx prisma generate` to generate the Prisma client

### Issue: DATABASE_URL not found
**Solution**: Ensure DATABASE_URL is set in Vercel environment variables

### Issue: Build fails on Vercel
**Solution**: Check the build logs and ensure all environment variables are set

## Files Modified

1. `packages/db/src/index.ts` - Fixed import path for Prisma client
2. `packages/db/prisma/schema.prisma` - Updated output path for generated client
3. `packages/db/package.json` - Added prisma generate to build and postinstall
4. `packages/db/tsconfig.json` - Set strict to false for generated types
5. `apps/web/package.json` - Simplified build command
6. `scripts/build-packages.js` - Added Prisma generation
7. `scripts/vercel-build-monorepo.js` - Added Prisma generation and env setup
8. `scripts/setup-vercel-env.js` - Created new file for env setup
9. `vercel.json` - Added environment variable mappings
10. Removed `apps/web/vercel.json` - Eliminated conflicting configuration

## Next Steps

1. Commit all changes to your repository
2. Push to your Git repository connected to Vercel
3. Vercel will automatically trigger a new deployment
4. Monitor the build logs to ensure successful deployment

## Contact

For issues or questions, check the build logs on Vercel dashboard or review the error messages in the deployment output.
