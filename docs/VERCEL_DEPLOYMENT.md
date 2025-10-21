# ▲ Vercel Deployment Guide

Complete guide for deploying PropGroup frontend to Vercel.

---

## 🎯 Prerequisites

Before deploying to Vercel:

- ✅ Backend deployed on Render and working
- ✅ Backend health endpoint accessible: `https://your-backend.onrender.com/health`
- ✅ Have your Render backend URL ready
- ✅ Code committed and pushed to GitHub

---

## 🚀 Quick Deploy (5 minutes)

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `propgroup` repository
5. Vercel will detect it as a monorepo

### Step 2: Configure Project Settings

**Framework Preset:** Next.js
**Root Directory:** `apps/web` ⚠️ **IMPORTANT**
**Build Command:** (leave default or use `npm run build`)
**Output Directory:** (leave default)
**Install Command:** (leave default)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

```bash
# Backend API URL (REQUIRED)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

**Replace** `your-backend.onrender.com` with your actual Render backend URL!

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 3-5 minutes for build
3. Once deployed, copy your Vercel URL (e.g., `propgroup-web.vercel.app`)

### Step 5: Update Render Backend

1. Go to **Render Dashboard** → Your backend service
2. **Environment** tab → Find `FRONTEND_URL`
3. Update to: `https://propgroup-web.vercel.app` (your actual Vercel URL)
4. **Save** (this will redeploy backend)

---

## 📋 Vercel Dashboard Settings

Here's exactly what to configure in Vercel Dashboard:

### General Settings

| Setting | Value |
|---------|-------|
| **Framework** | Next.js |
| **Root Directory** | `apps/web` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Node.js Version** | 20.x (recommended) |

### Environment Variables

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com/api` | Production, Preview, Development |

**Optional variables:**

| Key | Value | Purpose |
|-----|-------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIzaSy...` | Property maps |

---

## 🔧 Build Configuration

### Using the Monorepo Build Script

The project includes `scripts/vercel-build-monorepo.js` which:
1. Builds all workspace packages (`config`, `db`, `ui`)
2. Generates Prisma client
3. Builds the Next.js application
4. Ensures proper directory structure

**Vercel automatically uses:** `npm run vercel-build` from root `package.json`

This runs: `node scripts/vercel-build-monorepo.js`

### Manual Build (if needed)

If you prefer to use the standard Next.js build:

1. In Vercel → **Project Settings** → **Build & Development Settings**
2. **Root Directory:** `apps/web`
3. **Build Command:**
   ```bash
   cd ../.. && npm run build:packages && cd apps/web && npm run build
   ```

---

## ✅ Verification Checklist

After deployment, verify everything works:

### 1. Frontend Loads

- [ ] Visit `https://your-app.vercel.app`
- [ ] Homepage loads without errors
- [ ] No console errors in browser DevTools

### 2. API Connection

- [ ] Open browser DevTools → Network tab
- [ ] Navigate around the site
- [ ] API requests go to `https://your-backend.onrender.com/api`
- [ ] No CORS errors

### 3. Authentication Works

- [ ] Click "Sign Up" or "Login"
- [ ] Form appears correctly
- [ ] Submit login credentials
- [ ] No `ERR_CONNECTION_REFUSED` errors
- [ ] Successfully logs in or shows proper error

### 4. Properties Display

- [ ] Navigate to `/properties`
- [ ] Properties load and display
- [ ] Images load correctly
- [ ] Filters work

### 5. Protected Routes

- [ ] Try to access `/admin` without logging in
- [ ] Should redirect to login page
- [ ] After login, `/admin` should be accessible (for admin users)

---

## 🐛 Troubleshooting

### Issue: "ERR_CONNECTION_REFUSED" when logging in

**Cause:** Frontend trying to connect to localhost instead of production API

**Fix:**
1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Check `NEXT_PUBLIC_API_URL` is set correctly
3. Must include `/api` at the end
4. Redeploy: **Deployments** → **...** → **Redeploy**

### Issue: "CORS Error" in browser console

**Cause:** Backend not allowing requests from Vercel domain

**Fix:**
1. Go to Render → Your backend → **Environment**
2. Check `FRONTEND_URL` matches your Vercel URL exactly
3. No trailing slash: ✅ `https://propgroup-web.vercel.app` ❌ `https://propgroup-web.vercel.app/`
4. Save and wait for backend to redeploy

### Issue: Build fails with "Cannot find module '@propgroup/db'"

**Cause:** Workspace packages not built before Next.js build

**Fix:**
1. Verify Vercel is using `apps/web` as root directory
2. Check build command includes workspace package build
3. Or use the monorepo build script: `npm run vercel-build`

### Issue: Build fails with "Cannot find module './setup-vercel-env.js'"

**Cause:** Old script reference removed during cleanup

**Fix:** ✅ Already fixed! The script has been updated to remove this reference.

### Issue: Environment variables not working

**Cause:** Variables only available after rebuild

**Fix:**
1. After adding/changing environment variables in Vercel
2. Go to **Deployments** tab
3. Click **...** on latest deployment
4. Click **Redeploy**
5. Wait for build to complete

### Issue: 404 on all routes except homepage

**Cause:** Output directory misconfigured

**Fix:**
1. Vercel → Settings → Build & Development Settings
2. **Output Directory:** Leave as default (`.next`)
3. Do NOT set custom output directory
4. Redeploy

---

## 🔄 Updating Deployment

### When You Push Code Changes

Vercel will **automatically deploy** if you have auto-deployment enabled (default).

### Manual Redeploy

1. Vercel Dashboard → Your Project
2. **Deployments** tab
3. Click **...** on the deployment you want to redeploy
4. Click **Redeploy**

### Rolling Back

1. **Deployments** tab
2. Find a previous successful deployment
3. Click **...** → **Promote to Production**

---

## 🌍 Custom Domain (Optional)

### Add Custom Domain

1. Vercel → Your Project → **Settings** → **Domains**
2. Click **Add**
3. Enter your domain: `propgroup.com`
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

### Update Backend FRONTEND_URL

After adding custom domain:

1. Render → Backend → Environment
2. Update `FRONTEND_URL` to: `https://propgroup.com`
3. Save

---

## 📊 Environment Variables Summary

### Production (Vercel)

**Required:**
```bash
NEXT_PUBLIC_API_URL=https://propgroup-backend.onrender.com/api
```

**Optional:**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### Preview/Development

Same variables as production, or you can set different values for testing.

---

## 🔗 Important URLs

**After Deployment:**

- Your Vercel App: `https://propgroup-web.vercel.app` (or custom domain)
- Render Backend: `https://propgroup-backend.onrender.com`
- Backend Health: `https://propgroup-backend.onrender.com/health`

**Dashboards:**

- Vercel: [vercel.com/dashboard](https://vercel.com/dashboard)
- Render: [dashboard.render.com](https://dashboard.render.com)

---

## 📝 Complete Deployment Checklist

Use this for every deployment:

### Pre-Deployment
- [ ] Backend deployed on Render
- [ ] Backend health endpoint returns `{"status": "ok"}`
- [ ] Code committed and pushed to GitHub
- [ ] Have backend URL ready

### Vercel Configuration
- [ ] Root directory set to `apps/web`
- [ ] Framework set to Next.js
- [ ] `NEXT_PUBLIC_API_URL` environment variable added
- [ ] Environment variable includes `/api` at the end

### Post-Deployment
- [ ] Frontend loads at Vercel URL
- [ ] No console errors
- [ ] No CORS errors
- [ ] Can navigate all pages
- [ ] Login/signup works
- [ ] Properties display correctly
- [ ] Backend `FRONTEND_URL` updated to Vercel URL

### Testing
- [ ] Run through [DEPLOYMENT_TESTING_CHECKLIST.md](./DEPLOYMENT_TESTING_CHECKLIST.md)
- [ ] Test user registration
- [ ] Test user login
- [ ] Test admin login
- [ ] Test property browsing
- [ ] Test favorites (logged in users)

---

## 🎉 Success!

Your PropGroup frontend is now live on Vercel!

**Next Steps:**
1. Test the complete user flow
2. Set up custom domain (optional)
3. Configure Google OAuth (optional)
4. Set up analytics (optional)

**Documentation:**
- [DEPLOYMENT_TESTING_CHECKLIST.md](./DEPLOYMENT_TESTING_CHECKLIST.md) - Complete testing
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - All environment variables
- [RENDER_DEPLOYMENT_FIX.md](./RENDER_DEPLOYMENT_FIX.md) - Backend troubleshooting

---

**Happy deploying! 🚀**
