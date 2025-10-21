# PropGroup Deployment Guide

Complete guide for deploying PropGroup to production using Vercel (frontend) and Render (backend + database).

## Architecture Overview

- **Frontend**: Next.js app deployed on Vercel
- **Backend**: Express.js API deployed on Render
- **Database**: PostgreSQL on Render
- **Authentication**: JWT + Passport.js (Local + Google OAuth)

---

## Part 1: Database Setup on Render

### 1.1 Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure database:
   - **Name**: `propgroup-db`
   - **Database**: `propgroup`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users
   - **Plan**: Free or Starter (depending on needs)
4. Click **"Create Database"**
5. Wait for database to be provisioned (~2-3 minutes)

### 1.2 Get Database Connection String

1. Once created, go to your database dashboard
2. Scroll to **"Connections"**
3. Copy the **"Internal Database URL"** (starts with `postgresql://`)
4. **IMPORTANT**: Save this URL - you'll need it for the backend setup

---

## Part 2: Backend Setup on Render

### 2.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your `propgroup` repository

### 2.2 Configure Web Service

Configure the following settings:

**Basic Settings:**
- **Name**: `propgroup-backend`
- **Region**: Same as your database
- **Branch**: `master` (or your main branch)
- **Root Directory**: `apps/backend`
- **Runtime**: `Node`
- **Build Command**: `pnpm run render-build`
- **Start Command**: `pnpm run render-start`

**Advanced Settings:**
- **Node Version**: `20` (or latest LTS)
- **Auto-Deploy**: `Yes` (optional)

### 2.3 Add Environment Variables

Click **"Environment"** tab and add these variables:

#### Required Variables:

```bash
# Database
DATABASE_URL=<paste-internal-database-url-from-step-1.2>

# Server
NODE_ENV=production
PORT=10000

# Frontend URL (temporary - will update after Vercel deployment)
FRONTEND_URL=http://localhost:3000

# Backend URL (update after service is created)
BACKEND_URL=https://propgroup-backend.onrender.com

# JWT Secret (generate new secure random string)
JWT_SECRET=<generate-using-command-below>

# Session Secret (generate new secure random string)
SESSION_SECRET=<generate-using-command-below>
```

**Generate secure secrets:**
```bash
# Run this locally to generate secrets:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Optional Variables (for Google OAuth):

```bash
# Google OAuth (optional - for "Sign in with Google")
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://propgroup-backend.onrender.com/api/auth/google/callback
```

### 2.4 Deploy Backend

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete (~5-10 minutes for first deploy)
4. Once deployed, copy your backend URL: `https://propgroup-backend.onrender.com`

### 2.5 Update FRONTEND_URL

1. Go back to your backend service
2. Navigate to **"Environment"** tab
3. Update `FRONTEND_URL` to your Vercel URL (after Part 3)
4. Save changes (will trigger auto-deploy)

---

## Part 3: Frontend Setup on Vercel

### 3.1 Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select `propgroup` repository

### 3.2 Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `apps/web`

**Build Settings:**
- Build Command: `pnpm run vercel-build` (from vercel.json)
- Output Directory: `.next` (auto-detected)
- Install Command: `pnpm install --frozen-lockfile` (from vercel.json)

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add:

#### Production Environment:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=https://propgroup-backend.onrender.com/api
```

#### Optional Variables:

```bash
# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### 3.4 Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (~3-5 minutes)
3. Once deployed, copy your Vercel URL: `https://your-app.vercel.app`

### 3.5 Update Backend FRONTEND_URL

1. Go back to Render backend service
2. Update `FRONTEND_URL` environment variable to your Vercel URL
3. Save (triggers redeploy)

---

## Part 4: Google OAuth Setup (Optional)

If you want "Sign in with Google" functionality:

### 4.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **"Google+ API"**
4. Go to **"Credentials"** → **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Configure OAuth consent screen:
   - **User Type**: External
   - **App name**: PropGroup
   - **Support email**: your-email@example.com
   - **Scopes**: email, profile
6. Create OAuth Client ID:
   - **Application type**: Web application
   - **Name**: PropGroup Backend
   - **Authorized JavaScript origins**:
     - `https://your-frontend.vercel.app`
   - **Authorized redirect URIs**:
     - `https://propgroup-backend.onrender.com/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret**

### 4.2 Update Backend Environment Variables

1. Go to Render backend service → Environment
2. Add/update:
   ```bash
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=https://propgroup-backend.onrender.com/api/auth/google/callback
   ```
3. Save and wait for redeploy

---

## Part 5: Database Migrations

### 5.1 Run Migrations on Render

Migrations run automatically during deployment via `render-build` script.

If you need to run migrations manually:

1. Go to Render backend service
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

### 5.2 Create Super Admin (Optional)

To create the first admin user:

1. Use Render Shell or connect to your database
2. Run this SQL query:

```sql
INSERT INTO users (
  id,
  email,
  password,
  role,
  "firstName",
  "lastName",
  provider,
  "isActive",
  "emailVerifiedAt",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'admin@propgroup.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSWowQCm', -- password: Admin123!
  'SUPER_ADMIN',
  'Super',
  'Admin',
  'local',
  true,
  NOW(),
  NOW(),
  NOW()
);
```

**Important**: Change the password immediately after first login!

---

## Part 6: Verification & Testing

### 6.1 Test Backend Health

Visit: `https://propgroup-backend.onrender.com/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "environment": "production"
}
```

### 6.2 Test Frontend

1. Visit your Vercel URL
2. Try to register a new account
3. Try to login with email/password
4. (If configured) Try "Sign in with Google"
5. Test property browsing
6. Test admin dashboard (if super admin created)

### 6.3 Common Issues

**Issue**: Backend deployment fails
- **Solution**: Check that `DATABASE_URL` is set correctly
- **Solution**: Verify Prisma schema has no errors
- **Solution**: Check build logs in Render

**Issue**: Frontend can't connect to backend
- **Solution**: Verify `NEXT_PUBLIC_API_URL` in Vercel
- **Solution**: Check CORS settings in backend
- **Solution**: Verify backend is running (check health endpoint)

**Issue**: Google OAuth fails
- **Solution**: Verify redirect URIs match exactly in Google Console
- **Solution**: Check `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- **Solution**: Ensure OAuth consent screen is published

**Issue**: "ERR_CONNECTION_REFUSED" on login
- **Solution**: Update `NEXT_PUBLIC_API_URL` in Vercel to your Render backend URL
- **Solution**: Verify backend is deployed and running

---

## Part 7: Post-Deployment Checklist

- [ ] Backend is deployed and health check passes
- [ ] Frontend is deployed and accessible
- [ ] Can register new users
- [ ] Can login with email/password
- [ ] Google OAuth works (if configured)
- [ ] Properties are displayed correctly
- [ ] Admin dashboard accessible
- [ ] Database migrations applied
- [ ] Environment variables are secure (no defaults in production)
- [ ] CORS configured correctly
- [ ] SSL/HTTPS working on both frontend and backend

---

## Part 8: Render Dashboard Configuration

### What to Fill in Render Dashboard

When creating the **Web Service** for the backend:

| Field | Value |
|-------|-------|
| Name | `propgroup-backend` |
| Region | Same as database |
| Branch | `master` |
| Root Directory | `apps/backend` |
| Build Command | `pnpm run render-build` |
| Start Command | `pnpm run render-start` |
| Environment | `Node` |
| Node Version | `20` |
| Health Check Path | `/health` |

### Environment Variables Table

| Variable | Example Value | Required |
|----------|---------------|----------|
| `DATABASE_URL` | `postgresql://user:pass@...` | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `PORT` | `10000` | ✅ Yes |
| `FRONTEND_URL` | `https://your-app.vercel.app` | ✅ Yes |
| `BACKEND_URL` | `https://propgroup-backend.onrender.com` | ✅ Yes |
| `JWT_SECRET` | `<random-64-char-hex>` | ✅ Yes |
| `SESSION_SECRET` | `<random-64-char-hex>` | ✅ Yes |
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | ⚠️ Optional |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx` | ⚠️ Optional |
| `GOOGLE_CALLBACK_URL` | `https://...onrender.com/api/auth/google/callback` | ⚠️ Optional |

---

## Support

If you encounter issues:

1. Check the deployment logs in Render/Vercel
2. Verify all environment variables are set correctly
3. Test the health endpoint
4. Check browser console for errors
5. Review backend logs in Render

---

## Local Development

To run locally after deployment:

1. Copy environment files:
   ```bash
   cd apps/backend
   cp .env.example .env
   # Edit .env with local PostgreSQL credentials

   cd ../web
   cp .env.example .env.local
   # Set NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run migrations:
   ```bash
   cd packages/db
   pnpm run db:migrate
   ```

4. Start development:
   ```bash
   # From root directory
   pnpm run dev
   ```

Frontend: http://localhost:3000
Backend: http://localhost:3001

---

**Congratulations! Your PropGroup application is now deployed! 🎉**
