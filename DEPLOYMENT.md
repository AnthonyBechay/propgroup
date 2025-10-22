# PropGroup Deployment Guide

This guide covers deploying the PropGroup application with backend on Render and frontend on Vercel.

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐
│                 │         │                  │
│  Vercel (Web)   │────────▶│  Render (API)    │
│  Next.js App    │   API   │  Express Backend │
│                 │         │                  │
└─────────────────┘         └──────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │                  │
                            │  PostgreSQL DB   │
                            │   (Render)       │
                            │                  │
                            └──────────────────┘
```

## Prerequisites

1. **Render Account**: Sign up at https://render.com
2. **Vercel Account**: Sign up at https://vercel.com
3. **GitHub Repository**: Your code must be in a Git repository
4. **Google OAuth** (Optional): Set up at https://console.cloud.google.com

---

## Part 1: Database Setup (Render)

### Step 1: Create PostgreSQL Database

✅ **ALREADY COMPLETED!**

Your database is already set up:
- **Name**: propgroup-db
- **Database**: propgroup_database
- **Region**: Frankfurt (EU Central)
- **Internal URL**: `postgresql://propgroup_database_user:N47ZWO9oy6BsGhYdZWd7tqBivUfgCYeh@dpg-d3ro26jipnbc73epphb0-a/propgroup_database`

This URL is already configured in `render.yaml`.

---

## Part 2: Backend Deployment (Render)

### Step 1: Fix the Failed Migration (IMPORTANT!)

The deployment is failing because of a stuck Prisma migration. Run this command locally:

```bash
# Navigate to the db package
cd packages/db

# Mark the failed migration as rolled back
npx prisma migrate resolve --rolled-back 20251021000001_add_oauth_fields

# If the database changes were actually applied, use this instead:
# npx prisma migrate resolve --applied 20251021000001_add_oauth_fields
```

**OR** use the provided script:

```bash
chmod +x fix-migration.sh
./fix-migration.sh
```

### Step 2: Deploy Backend to Render

#### Option A: Using Blueprint (Recommended) ✅

1. Push the updated code to GitHub:
   ```bash
   git add .
   git commit -m "Configure Render deployment with Frankfurt region"
   git push origin master
   ```

2. Go to Render Dashboard → **New** → **Blueprint**

3. Connect your repository

4. Render will auto-detect `render.yaml` and create services automatically:
   - Backend service in **Frankfurt (EU Central)** region
   - All environment variables pre-configured
   - Database URL already set

#### Option B: Manual Setup

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `propgroup-backend`
   - **Region**: **Frankfurt (EU Central)** ⚠️ IMPORTANT: Must match database region!
   - **Branch**: `master` (or `main`)
   - **Root Directory**: Leave empty (build commands include path)
   - **Runtime**: Node
   - **Build Command**: `cd apps/backend && pnpm install --frozen-lockfile && pnpm run render-build`
   - **Start Command**: `cd apps/backend && pnpm run render-start`
   - **Plan**: Starter ($7/month) or Free

### Step 3: Configure Backend Environment Variables

In Render Dashboard → Your Backend Service → **Environment**:

#### Required Variables:

```bash
# Database (Internal Database URL - Frankfurt region)
# ✅ ALREADY SET IN render.yaml - No need to add manually if using Blueprint
DATABASE_URL=postgresql://propgroup_database_user:N47ZWO9oy6BsGhYdZWd7tqBivUfgCYeh@dpg-d3ro26jipnbc73epphb0-a/propgroup_database

# Server
NODE_ENV=production
PORT=3001

# Frontend URL (you'll get this from Vercel later)
FRONTEND_URL=https://your-app.vercel.app

# Backend URL (Render provides this)
BACKEND_URL=https://your-backend.onrender.com

# Authentication - Generate secure secrets!
JWT_SECRET=<generate-random-64-char-string>
SESSION_SECRET=<generate-random-64-char-string>
```

**Generate Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Optional (for Google OAuth):

```bash
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
```

### Step 4: Deploy

1. Click **Create Web Service** (or **Deploy** if using Blueprint)
2. Render will:
   - Install dependencies
   - Generate Prisma Client
   - Run database migrations
   - Start the server
3. Wait for deployment to complete
4. **Save your backend URL**: `https://propgroup-backend.onrender.com`

---

## Part 3: Frontend Deployment (Vercel)

### Step 1: Connect Repository

1. Go to Vercel Dashboard → **Add New** → **Project**
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

### Step 2: Configure Build Settings

Vercel should auto-detect these from `vercel.json`:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (monorepo root)
- **Build Command**: `pnpm run vercel-build`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `pnpm install --frozen-lockfile`

### Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**:

#### Required:

```bash
# Backend API URL (from Render)
NEXT_PUBLIC_API_URL=https://propgroup-backend.onrender.com/api
```

#### Optional:

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Maps (for property location maps)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### Step 4: Deploy

1. Click **Deploy**
2. Vercel will:
   - Install dependencies
   - Build packages (db, ui, config)
   - Generate Prisma Client (with placeholder DATABASE_URL)
   - Build Next.js app
3. Wait for deployment
4. **Save your frontend URL**: `https://your-app.vercel.app`

### Step 5: Update Backend CORS

Go back to **Render** → Backend Service → **Environment** and update:

```bash
FRONTEND_URL=https://your-app.vercel.app
```

Then **Manual Deploy** → **Deploy latest commit**

---

## Part 4: Google OAuth Setup (Optional)

### Step 1: Create Google OAuth App

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable **Google+ API** or **Google Identity**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - **Application type**: Web application
   - **Authorized JavaScript origins**:
     - `https://your-app.vercel.app`
     - `http://localhost:3000` (for development)
   - **Authorized redirect URIs**:
     - `https://propgroup-backend.onrender.com/api/auth/google/callback`
     - `http://localhost:3001/api/auth/google/callback` (for development)

### Step 2: Add to Render Environment

Add these to Render backend:

```bash
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_CALLBACK_URL=https://propgroup-backend.onrender.com/api/auth/google/callback
```

Deploy the backend again.

---

## Environment Variables Summary

### Backend (Render)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `NODE_ENV` | ✅ Yes | Environment | `production` |
| `PORT` | ✅ Yes | Server port | `3001` |
| `FRONTEND_URL` | ✅ Yes | Vercel frontend URL | `https://app.vercel.app` |
| `BACKEND_URL` | ✅ Yes | Render backend URL | `https://api.onrender.com` |
| `JWT_SECRET` | ✅ Yes | JWT signing key | (64-char random string) |
| `SESSION_SECRET` | ✅ Yes | Session signing key | (64-char random string) |
| `GOOGLE_CLIENT_ID` | ❌ No | OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | ❌ No | OAuth client secret | `GOCSPX-xxx` |
| `GOOGLE_CALLBACK_URL` | ❌ No | OAuth callback | `https://api.onrender.com/api/auth/google/callback` |

### Frontend (Vercel)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Backend API URL | `https://api.onrender.com/api` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ❌ No | Google Analytics | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ❌ No | Google Maps API | `AIzaSy...` |

---

## Testing the Deployment

### 1. Check Backend Health

```bash
curl https://propgroup-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-22T...",
  "environment": "production",
  "database": "connected"
}
```

### 2. Check Frontend

Visit: `https://your-app.vercel.app`

### 3. Test API Connection

Open browser console on frontend and check Network tab for API calls to your backend.

---

## Troubleshooting

### Backend Issues

**Migration Failed:**
```bash
# Run locally to fix
cd packages/db
npx prisma migrate resolve --rolled-back 20251021000001_add_oauth_fields
npx prisma migrate deploy
```

**Database Connection Error:**
- Verify `DATABASE_URL` is the **Internal Database URL** from Render
- Check database is in the same region as backend
- Ensure database is not paused (Free tier pauses after inactivity)

**Build Failed:**
- Check build logs in Render Dashboard
- Verify `pnpm-lock.yaml` is committed
- Ensure all dependencies are listed in `package.json`

### Frontend Issues

**API Calls Failing (CORS):**
- Verify `FRONTEND_URL` in Render backend matches your Vercel URL exactly
- Check browser console for CORS errors
- Redeploy backend after updating `FRONTEND_URL`

**Build Failed:**
- Check build logs in Vercel Dashboard
- Verify `DATABASE_URL` is NOT required for frontend build (Prisma uses placeholder)
- Clear Vercel build cache and redeploy

**Environment Variables Not Working:**
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding environment variables

---

## Post-Deployment

### 1. Set Up Custom Domain (Optional)

**Backend (Render):**
- Go to Service → Settings → Custom Domain
- Add your API domain (e.g., `api.yourdomain.com`)
- Update DNS records as instructed

**Frontend (Vercel):**
- Go to Project → Settings → Domains
- Add your domain (e.g., `yourdomain.com`)
- Update DNS records as instructed

### 2. Enable Auto-Deploy

Both Render and Vercel support auto-deployment:
- **Render**: Auto-deploys on push to `master`
- **Vercel**: Auto-deploys on push to `master` (production) and creates preview deployments for PRs

### 3. Monitor Your Apps

**Render:**
- Dashboard shows logs, metrics, and deployment history
- Set up alerts for downtime

**Vercel:**
- Dashboard shows analytics, logs, and deployment history
- Automatically monitors performance

### 4. Database Backups

Render Starter plan includes:
- Daily automated backups (retained for 7 days)
- Manual backups anytime

---

## Local Development

### Backend

```bash
# Set up local database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/propgroup

# Install dependencies
pnpm install

# Run migrations
cd packages/db
pnpm run db:migrate

# Start backend
cd ../../apps/backend
pnpm run dev
```

### Frontend

```bash
# Set environment variable
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Start frontend
cd apps/web
pnpm run dev
```

---

## Continuous Deployment

Push to GitHub triggers:
1. **Vercel**: Builds and deploys frontend automatically
2. **Render**: Builds and deploys backend automatically

### Branch Strategy

- `master/main`: Production deployments
- Feature branches: Vercel creates preview deployments
- Render can be configured for preview environments

---

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate secrets regularly** - Update `JWT_SECRET` and `SESSION_SECRET` periodically
3. **Use HTTPS only** - Both Render and Vercel provide SSL automatically
4. **Monitor logs** - Check for suspicious activity
5. **Keep dependencies updated** - Run `pnpm update` regularly
6. **Enable 2FA** - On GitHub, Render, and Vercel accounts

---

## Cost Breakdown

### Minimum (Free Tier)
- **Render DB**: $0 (Free tier, 90 days)
- **Render Backend**: $0 (Free tier, but spins down after inactivity)
- **Vercel Frontend**: $0 (Hobby tier)
- **Total**: $0/month

### Recommended (Production)
- **Render DB**: $7/month (Starter)
- **Render Backend**: $7/month (Starter)
- **Vercel Frontend**: $0-20/month (Hobby/Pro)
- **Total**: $14-34/month

---

## Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs

For issues with this project, check the logs in Render and Vercel dashboards.
