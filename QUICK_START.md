# PropGroup Quick Start Guide

Get PropGroup up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- pnpm 9.15.0 installed (`npm install -g pnpm@9.15.0`)
- PostgreSQL database (local or Render)
- Git

---

## Local Development Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd propgroup
pnpm install
```

### 2. Set Up Database

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL if not already installed
# Create database
createdb propgroup

# Set environment variable
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/propgroup"
```

#### Option B: Use Render PostgreSQL

1. Create free PostgreSQL on Render: https://render.com
2. Copy the Internal Database URL
3. Set environment variable:

```bash
export DATABASE_URL="postgresql://user:pass@host/propgroup_database"
```

### 3. Configure Environment Variables

#### Backend (`apps/backend/.env`)

```bash
# Copy example
cp apps/backend/.env.example apps/backend/.env

# Edit apps/backend/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/propgroup
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
JWT_SECRET=dev-secret-change-in-production
SESSION_SECRET=dev-secret-change-in-production
```

#### Frontend (`apps/web/.env.local`)

```bash
# Create apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Run Database Migrations

```bash
cd packages/db
pnpm run db:migrate
cd ../..
```

### 5. Build Packages

```bash
pnpm run build:packages
```

### 6. Start Development Servers

```bash
pnpm run dev
```

This starts:
- Backend API: http://localhost:3001
- Frontend: http://localhost:3000

**Done!** Visit http://localhost:3000

---

## Production Deployment

### Quick Deploy to Render + Vercel

#### 1. Deploy Database (Render)

1. Go to https://render.com/dashboard
2. New → PostgreSQL
3. Name: `propgroup-db`
4. Plan: Starter ($7/mo) or Free
5. Create → Save the Internal Database URL

#### 2. Deploy Backend (Render)

1. New → Web Service
2. Connect your GitHub repo
3. Settings:
   - Name: `propgroup-backend`
   - Root Directory: `apps/backend`
   - Build Command: `pnpm install --frozen-lockfile && pnpm run render-build`
   - Start Command: `pnpm run render-start`
4. Add Environment Variables:
   ```
   DATABASE_URL=<from step 1>
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=<will update after Vercel>
   BACKEND_URL=<your-render-url>.onrender.com
   JWT_SECRET=<generate random>
   SESSION_SECRET=<generate random>
   ```
5. Create Web Service
6. **Save backend URL**: `https://propgroup-backend.onrender.com`

#### 3. Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. New Project → Import your repo
3. Settings (auto-detected from vercel.json):
   - Build Command: `pnpm run vercel-build`
   - Output Directory: `apps/web/.next`
   - Install Command: `pnpm install --frozen-lockfile`
4. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://propgroup-backend.onrender.com/api
   ```
5. Deploy
6. **Save frontend URL**: `https://your-app.vercel.app`

#### 4. Update Backend CORS

1. Go back to Render → Backend → Environment
2. Update `FRONTEND_URL=https://your-app.vercel.app`
3. Manual Deploy → Deploy latest commit

**Done!** Visit your Vercel URL.

---

## Fixing the Migration Error

If you see the migration error from the original issue:

```bash
# Run locally
cd packages/db
npx prisma migrate resolve --rolled-back 20251021000001_add_oauth_fields
npx prisma migrate deploy
```

Or use the provided script:

```bash
chmod +x fix-migration.sh
./fix-migration.sh
```

Then redeploy backend on Render.

---

## Project Structure

```
propgroup/
├── apps/
│   ├── backend/          # Express API (Render)
│   │   ├── src/
│   │   │   ├── index.js        # Main server
│   │   │   ├── routes/         # API routes
│   │   │   └── config/         # Auth config
│   │   └── package.json
│   │
│   └── web/              # Next.js Frontend (Vercel)
│       ├── src/
│       │   ├── app/            # App router
│       │   ├── components/     # React components
│       │   └── lib/            # Utilities
│       └── package.json
│
├── packages/
│   ├── db/               # Prisma schema & client
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── package.json
│   │
│   ├── ui/               # Shared UI components
│   └── config/           # Shared configuration
│
├── scripts/              # Build & dev scripts
├── render.yaml           # Render deployment config
├── vercel.json           # Vercel deployment config
└── package.json          # Root workspace config
```

---

## Key Commands

```bash
# Development
pnpm run dev              # Start both servers
pnpm run dev:backend      # Backend only
pnpm run dev:frontend     # Frontend only

# Building
pnpm run build            # Build everything
pnpm run build:packages   # Build shared packages only

# Database
cd packages/db
pnpm run db:migrate       # Run migrations (dev)
pnpm run db:generate      # Generate Prisma Client
pnpm run db:seed          # Seed database
pnpm run db:studio        # Open Prisma Studio

# Cleaning
pnpm run clean            # Remove all build artifacts
```

---

## Common Issues

### Backend won't start

**Check:**
- DATABASE_URL is set and correct
- PostgreSQL is running
- Migrations have been run: `cd packages/db && pnpm run db:migrate`

### Frontend can't connect to backend

**Check:**
- Backend is running on port 3001
- NEXT_PUBLIC_API_URL is set correctly
- CORS is configured: FRONTEND_URL in backend .env

### "Module not found" errors

**Fix:**
```bash
pnpm run build:packages
```

### Prisma Client errors

**Fix:**
```bash
cd packages/db
pnpm run db:generate
```

---

## Environment Variables Summary

### Backend (Required)
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - Random 64-char string
- `SESSION_SECRET` - Random 64-char string
- `FRONTEND_URL` - Frontend URL for CORS
- `BACKEND_URL` - Backend URL for OAuth

### Frontend (Required)
- `NEXT_PUBLIC_API_URL` - Backend API URL

See [ENV_VARIABLES.md](ENV_VARIABLES.md) for complete reference.

---

## Next Steps

1. **Read the docs:**
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
   - [ENV_VARIABLES.md](ENV_VARIABLES.md) - All environment variables
   - [scripts/README.md](scripts/README.md) - Build scripts explained

2. **Set up Google OAuth** (optional):
   - See DEPLOYMENT.md → Part 4

3. **Customize:**
   - Update branding in `apps/web/src/`
   - Add your domain in Render and Vercel
   - Configure email service (optional)

4. **Monitor:**
   - Check Render logs for backend
   - Check Vercel logs for frontend
   - Set up error tracking (Sentry, etc.)

---

## Getting Help

- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment steps
- Check [ENV_VARIABLES.md](ENV_VARIABLES.md) for environment setup
- Check logs in Render and Vercel dashboards
- GitHub Issues: Report bugs and ask questions

---

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Express, Node.js, Passport.js (JWT + OAuth)
- **Database**: PostgreSQL, Prisma ORM
- **Deployment**: Vercel (frontend), Render (backend + database)
- **Monorepo**: pnpm workspaces

---

**Ready to build?** 🚀

```bash
pnpm run dev
```

Then visit http://localhost:3000
