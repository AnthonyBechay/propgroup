# PropGroup - Quick Start Guide

## 🎯 What You Need to Fill in Render Dashboard

When deploying the backend to Render, here's exactly what to fill in:

### 1. Create Web Service

| Field | Value |
|-------|-------|
| **Name** | `propgroup-backend` (or any name you prefer) |
| **Region** | Choose closest to your users |
| **Branch** | `master` |
| **Root Directory** | `apps/backend` |
| **Runtime** | `Node` |
| **Build Command** | `pnpm run render-build` |
| **Start Command** | `pnpm run render-start` |

### 2. Environment Variables (REQUIRED)

Click "Advanced" → "Add Environment Variable" and add these:

```bash
# Database (get this from your Render PostgreSQL dashboard)
DATABASE_URL=postgresql://user:password@host/database

# Server settings
NODE_ENV=production
PORT=10000

# URLs (update FRONTEND_URL after deploying to Vercel)
FRONTEND_URL=https://your-app-name.vercel.app
BACKEND_URL=https://propgroup-backend.onrender.com

# Security (generate random strings - see below)
JWT_SECRET=<paste-random-64-char-hex-here>
SESSION_SECRET=<paste-random-64-char-hex-here>
```

#### How to Generate Secrets

Run this command on your local machine:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run it twice to get two different secrets (one for JWT, one for SESSION).

### 3. Optional - Google OAuth

Only add these if you want "Sign in with Google":

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_CALLBACK_URL=https://propgroup-backend.onrender.com/api/auth/google/callback
```

Get these from [Google Cloud Console](https://console.cloud.google.com/).

---

## 🚀 What You Need to Fill in Vercel Dashboard

### 1. Project Settings

| Field | Value |
|-------|-------|
| **Framework** | Next.js (auto-detected) |
| **Root Directory** | `apps/web` |
| **Build Command** | Uses `vercel.json` (auto) |
| **Output Directory** | `.next` (auto-detected) |

### 2. Environment Variables

Production Environment:

```bash
NEXT_PUBLIC_API_URL=https://propgroup-backend.onrender.com/api
```

**Important**: Replace `propgroup-backend` with your actual Render backend URL!

---

## 📋 Deployment Checklist

### Step 1: Create Database
- [ ] Sign up/login to [Render](https://render.com)
- [ ] Create new PostgreSQL database
- [ ] Copy the "Internal Database URL"

### Step 2: Deploy Backend
- [ ] Create new Web Service on Render
- [ ] Connect your GitHub repository
- [ ] Fill in the fields from table above
- [ ] Add all environment variables
- [ ] Click "Create Web Service"
- [ ] Wait ~5-10 minutes for deployment
- [ ] Copy your backend URL (e.g., `https://propgroup-backend.onrender.com`)

### Step 3: Deploy Frontend
- [ ] Sign up/login to [Vercel](https://vercel.com)
- [ ] Import your GitHub repository
- [ ] Set Root Directory to `apps/web`
- [ ] Add environment variable: `NEXT_PUBLIC_API_URL`
- [ ] Click "Deploy"
- [ ] Wait ~3-5 minutes
- [ ] Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### Step 4: Update Backend
- [ ] Go back to Render backend
- [ ] Update `FRONTEND_URL` environment variable with your Vercel URL
- [ ] Save (will auto-redeploy)

### Step 5: Test
- [ ] Visit your Vercel URL
- [ ] Try to register a new account
- [ ] Try to login
- [ ] Browse properties
- [ ] Everything should work! 🎉

---

## ⚡ Super Fast Local Development

```bash
# 1. Clone and install
git clone <your-repo>
cd propgroup
pnpm install

# 2. Set up environment files
cd apps/backend
cp .env.example .env
# Edit .env - add your local PostgreSQL URL

cd ../web
cp .env.example .env.local
# Edit .env.local - set NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 3. Run migrations
cd ../../packages/db
pnpm run db:migrate

# 4. Start everything (from root)
cd ../..
pnpm run dev
```

Open http://localhost:3000 - Done! 🚀

---

## 🔑 First Admin User

After deployment, create your first admin:

### Option 1: Using Render Shell

1. Go to Render backend → Shell tab
2. Run:
```bash
npx prisma studio
```
3. Open Prisma Studio and manually create admin user

### Option 2: Using SQL

Connect to your database and run:

```sql
INSERT INTO users (
  id, email, password, role, "firstName", "lastName",
  provider, "isActive", "emailVerifiedAt", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'admin@yourdomain.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSWowQCm',
  'SUPER_ADMIN',
  'Admin', 'User', 'local', true, NOW(), NOW(), NOW()
);
```

Login: `admin@yourdomain.com` / `Admin123!`

**Change the password immediately after first login!**

---

## 🆘 Common Issues & Solutions

### Issue: "ERR_CONNECTION_REFUSED"
**Solution**: Update `NEXT_PUBLIC_API_URL` in Vercel to your Render backend URL

### Issue: "CORS Error"
**Solution**: Update `FRONTEND_URL` in Render to include your Vercel URL

### Issue: Backend won't start
**Solution**: Check `DATABASE_URL` is correct and database is accessible

### Issue: Frontend builds but crashes
**Solution**: Ensure `NEXT_PUBLIC_API_URL` is set in Vercel environment variables

### Issue: Can't login after deployment
**Solution**:
1. Check backend logs in Render
2. Verify `JWT_SECRET` and `SESSION_SECRET` are set
3. Make sure `FRONTEND_URL` and `BACKEND_URL` are correct

---

## 📞 Need More Help?

- **Full Deployment Guide**: See [RENDER_SETUP.md](./RENDER_SETUP.md)
- **Architecture & Changes**: See [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)
- **Complete Documentation**: See [README.md](./README.md)

---

## ⏱️ Estimated Time

- **First-time deployment**: 30-45 minutes
- **Subsequent deployments**: Auto-deploy on git push! ⚡

---

**You've got this! 💪**

If you follow this guide step-by-step, your PropGroup app will be live in under an hour!
