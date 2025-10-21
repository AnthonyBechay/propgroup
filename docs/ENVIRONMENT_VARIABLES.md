# 🔐 Environment Variables - Complete Guide

This guide shows **exactly** what environment variables you need for local development, Render (backend), and Vercel (frontend).

---

## 📍 Quick Reference

| Environment | File Location | Variables Count |
|------------|---------------|-----------------|
| **Local Backend** | `apps/backend/.env` | 7 required |
| **Local Frontend** | `apps/web/.env.local` | 1 required |
| **Render (Production Backend)** | Render Dashboard → Environment | 7 required, 3 optional |
| **Vercel (Production Frontend)** | Vercel Dashboard → Environment Variables | 1 required |

---

## 🏠 Local Development

### Backend: `apps/backend/.env`

**Create this file** if it doesn't exist:

```bash
# ====================================
# PROPGROUP BACKEND - LOCAL DEVELOPMENT
# ====================================

# Database (Local PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/propgroup"

# Server Configuration
NODE_ENV="development"
PORT=3001

# URLs (Local)
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:3001"

# Authentication Secrets (Development only - DO NOT use in production!)
JWT_SECRET="dev-jwt-secret-change-in-production"
JWT_EXPIRES_IN="7d"
SESSION_SECRET="dev-session-secret-change-in-production"

# ====================================
# OPTIONAL: Google OAuth (Leave empty if not testing OAuth locally)
# ====================================
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"
```

### Frontend: `apps/web/.env.local`

**Create this file** if it doesn't exist:

```bash
# ====================================
# PROPGROUP FRONTEND - LOCAL DEVELOPMENT
# ====================================

# Backend API URL (Local)
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

---

## ☁️ Render (Production Backend)

Go to **Render Dashboard → Your Web Service → Environment** and add these variables:

### Required Variables (7)

```bash
# 1. Database URL
DATABASE_URL
<paste-your-render-postgresql-internal-database-url>
# Example: postgresql://propgroup_user:abc123@dpg-xxxxx-a.oregon-postgres.render.com/propgroup_db

# 2. Node Environment
NODE_ENV
production

# 3. Port (Render sets this automatically, but good to have)
PORT
10000

# 4. Frontend URL (Your Vercel deployment URL)
FRONTEND_URL
https://propgroup-web.vercel.app
# IMPORTANT: Replace with YOUR actual Vercel URL (no trailing slash!)

# 5. Backend URL (Your Render service URL)
BACKEND_URL
https://propgroup-backend.onrender.com
# IMPORTANT: Replace with YOUR actual Render URL (no trailing slash!)

# 6. JWT Secret (Generate with crypto - see below)
JWT_SECRET
<paste-random-64-char-hex-string>

# 7. Session Secret (Generate with crypto - see below)
SESSION_SECRET
<paste-random-64-char-hex-string>
```

### Optional Variables (for Google OAuth)

```bash
# 8. Google OAuth Client ID
GOOGLE_CLIENT_ID
123456789-abcdefghijk.apps.googleusercontent.com

# 9. Google OAuth Client Secret
GOOGLE_CLIENT_SECRET
GOCSPX-your-secret-here

# 10. Google OAuth Callback URL
GOOGLE_CALLBACK_URL
https://propgroup-backend.onrender.com/api/auth/google/callback
# IMPORTANT: Replace with YOUR actual Render URL + /api/auth/google/callback
```

### 🔑 How to Generate Secrets

Run this command **twice** on your local machine:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**First output** → Use for `JWT_SECRET`
**Second output** → Use for `SESSION_SECRET`

**Example output:**
```
a1b2c3d4e5f6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8
```

---

## ▲ Vercel (Production Frontend)

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add:

### Required Variable (1)

```bash
# Backend API URL
NEXT_PUBLIC_API_URL
https://propgroup-backend.onrender.com/api
```

**IMPORTANT Notes:**
- Replace `propgroup-backend.onrender.com` with YOUR actual Render backend URL
- Must include `/api` at the end
- No trailing slash after `/api`

### Optional Variables

```bash
# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID
G-XXXXXXXXXX

# Google Maps API (optional - for property maps)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
AIzaSy...
```

---

## 📋 Complete Checklist

### ✅ Local Development Setup

- [ ] Created `apps/backend/.env` with 7 variables
- [ ] Created `apps/web/.env.local` with 1 variable
- [ ] Updated `DATABASE_URL` with your local PostgreSQL credentials
- [ ] Run `pnpm install` from root
- [ ] Run `cd packages/db && pnpm run db:migrate`
- [ ] Run `cd packages/db && pnpm run db:seed`
- [ ] Run `pnpm run dev` from root
- [ ] Backend accessible at http://localhost:3001/health
- [ ] Frontend accessible at http://localhost:3000

### ✅ Render Backend Setup

- [ ] Created PostgreSQL database on Render
- [ ] Copied Internal Database URL
- [ ] Created Web Service on Render
- [ ] Set Root Directory: `apps/backend`
- [ ] Set Build Command: `npm run render-build`
- [ ] Set Start Command: `npm run render-start`
- [ ] Added all 7 required environment variables
- [ ] Generated JWT_SECRET with crypto command
- [ ] Generated SESSION_SECRET with crypto command
- [ ] Replaced `FRONTEND_URL` with actual Vercel URL (after frontend deployment)
- [ ] Replaced `BACKEND_URL` with actual Render URL
- [ ] (Optional) Added Google OAuth variables
- [ ] Deployed successfully
- [ ] Health endpoint working: https://your-backend.onrender.com/health

### ✅ Vercel Frontend Setup

- [ ] Created project on Vercel
- [ ] Connected GitHub repository
- [ ] Set Root Directory: `apps/web`
- [ ] Added `NEXT_PUBLIC_API_URL` environment variable
- [ ] Replaced URL with actual Render backend URL + `/api`
- [ ] Deployed successfully
- [ ] Website accessible at https://your-app.vercel.app
- [ ] No CORS errors in browser console
- [ ] Can register new account
- [ ] Can login successfully

---

## 🔧 Troubleshooting

### Issue: "ERR_CONNECTION_REFUSED" on login

**Cause:** Frontend can't connect to backend API
**Fix:** Check `NEXT_PUBLIC_API_URL` in Vercel points to correct Render URL

### Issue: "CORS Error" in browser console

**Cause:** Backend doesn't allow requests from your frontend domain
**Fix:** Update `FRONTEND_URL` in Render to match your Vercel URL exactly (no trailing slash)

### Issue: "Unauthorized" or "Invalid token"

**Cause:** JWT secrets mismatch or not set
**Fix:** Verify `JWT_SECRET` and `SESSION_SECRET` are set in Render environment

### Issue: Database connection fails on Render

**Cause:** Wrong `DATABASE_URL` or database not accessible
**Fix:**
1. Go to Render PostgreSQL dashboard
2. Copy the **Internal Database URL** (not External!)
3. Update `DATABASE_URL` in Render Web Service environment
4. Redeploy

### Issue: Google OAuth fails

**Cause:** Redirect URI mismatch or credentials wrong
**Fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to Credentials → Your OAuth 2.0 Client
3. Verify "Authorized redirect URIs" includes exactly: `https://your-backend.onrender.com/api/auth/google/callback`
4. Update `GOOGLE_CALLBACK_URL` in Render to match exactly

### Issue: Migration fails with "column doesn't exist"

**Cause:** Database migrations out of sync
**Fix:** See [Migration Fix Guide](./RENDER_DASHBOARD_CONFIG.md) - Common Issues section

---

## 📊 Variable Summary Table

| Variable | Local Backend | Render Backend | Local Frontend | Vercel Frontend |
|----------|---------------|----------------|----------------|-----------------|
| `DATABASE_URL` | ✅ localhost | ✅ Render PostgreSQL | ❌ | ❌ |
| `NODE_ENV` | ✅ development | ✅ production | ❌ Auto | ❌ Auto |
| `PORT` | ✅ 3001 | ✅ 10000 | ❌ | ❌ |
| `FRONTEND_URL` | ✅ localhost:3000 | ✅ Vercel URL | ❌ | ❌ |
| `BACKEND_URL` | ✅ localhost:3001 | ✅ Render URL | ❌ | ❌ |
| `JWT_SECRET` | ✅ dev-secret | ✅ Generated | ❌ | ❌ |
| `SESSION_SECRET` | ✅ dev-secret | ✅ Generated | ❌ | ❌ |
| `NEXT_PUBLIC_API_URL` | ❌ | ❌ | ✅ localhost:3001/api | ✅ Render URL/api |
| `GOOGLE_CLIENT_ID` | 🔶 Optional | 🔶 Optional | ❌ | ❌ |
| `GOOGLE_CLIENT_SECRET` | 🔶 Optional | 🔶 Optional | ❌ | ❌ |
| `GOOGLE_CALLBACK_URL` | 🔶 Optional | 🔶 Optional | ❌ | ❌ |

**Legend:**
- ✅ Required
- 🔶 Optional
- ❌ Not needed

---

## 🎯 Copy-Paste Quick Start

### For Render Dashboard

**Service Configuration:**
```
Name: propgroup-backend
Root Directory: apps/backend
Build Command: npm run render-build
Start Command: npm run render-start
Runtime: Node
Node Version: 20
```

**Environment Variables** (paste one by one):
```
DATABASE_URL=<from-render-postgresql>
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://propgroup-backend.onrender.com
JWT_SECRET=<run-crypto-command>
SESSION_SECRET=<run-crypto-command>
```

### For Vercel Dashboard

**Project Settings:**
```
Framework Preset: Next.js
Root Directory: apps/web
Build Command: (leave default)
Output Directory: (leave default)
Install Command: (leave default)
```

**Environment Variable:**
```
NEXT_PUBLIC_API_URL=https://propgroup-backend.onrender.com/api
```

---

## 🚀 Next Steps

1. **Local Development** → [00_START_HERE.md](./00_START_HERE.md) - Path 1
2. **Production Deployment** → [QUICKSTART.md](./QUICKSTART.md)
3. **Testing Deployment** → [DEPLOYMENT_TESTING_CHECKLIST.md](./DEPLOYMENT_TESTING_CHECKLIST.md)

---

**All environment variables documented! 🎉**
