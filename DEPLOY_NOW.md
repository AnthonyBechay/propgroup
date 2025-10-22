# 🚀 Deploy PropGroup NOW - Step by Step

**Everything is configured and ready to deploy!**

Follow these exact steps to get your app live.

---

## ✅ Pre-Flight Checklist

- [x] Database created on Render (Frankfurt)
- [x] Database URL configured in `render.yaml`
- [x] Backend configured for Frankfurt region
- [x] Deployment scripts ready
- [x] Migration fix script ready
- [ ] Code pushed to GitHub ← **START HERE**

---

## Step 1: Fix Migration Locally (5 minutes)

The migration is currently stuck. Fix it before deploying:

```bash
# Navigate to your project
cd C:\Users\User\Desktop\development\propgroup

# Run the fix script
chmod +x fix-migration.sh
./fix-migration.sh

# Or manually:
cd packages/db
npx prisma migrate resolve --rolled-back 20251021000001_add_oauth_fields
npx prisma migrate deploy
cd ../..
```

**Expected output:**
```
✅ Migration issue resolved!
```

---

## Step 2: Push to GitHub (2 minutes)

```bash
# Add all changes
git add .

# Commit
git commit -m "Configure production deployment for Render (Frankfurt) + Vercel"

# Push
git push origin master
```

---

## Step 3: Deploy Backend to Render (10 minutes)

### Option A: Using Blueprint (Easiest) ⭐

1. **Go to Render Dashboard**: https://dashboard.render.com

2. **Click "New +"** → **"Blueprint"**

3. **Connect Repository**:
   - Select your GitHub account
   - Choose the `propgroup` repository
   - Click "Connect"

4. **Render Auto-Configures Everything**:
   - Detects `render.yaml`
   - Creates backend service
   - Sets region to Frankfurt
   - Configures all environment variables
   - Click **"Apply"**

5. **Wait for Deployment** (5-10 minutes):
   - Watch the build logs
   - Should see: "Generating Prisma client..."
   - Should see: "Running database migrations..."
   - Should see: "✅ Build completed successfully!"

6. **Get Your Backend URL**:
   - After deployment completes
   - Copy the URL: `https://propgroup-backend.onrender.com`
   - (Might be different if name was taken)

### Option B: Manual Setup

See [DEPLOYMENT.md](DEPLOYMENT.md) Part 2, Option B

---

## Step 4: Add Missing Environment Variables (2 minutes)

In Render Dashboard → **propgroup-backend** → **Environment**:

Click **"Add Environment Variable"** for each:

### 1. BACKEND_URL
```
Key: BACKEND_URL
Value: https://propgroup-backend.onrender.com
```
☝️ Use your actual Render URL from Step 3

### 2. FRONTEND_URL (Temporary)
```
Key: FRONTEND_URL
Value: https://temporary-placeholder.com
```
☝️ We'll update this after Vercel deployment

Click **"Save Changes"** → Backend will redeploy (takes ~2 minutes)

---

## Step 5: Test Backend (1 minute)

```bash
# Test health endpoint
curl https://propgroup-backend.onrender.com/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-22T...",
  "environment": "production",
  "database": "connected"
}
```

✅ If you see this, backend is working!

---

## Step 6: Deploy Frontend to Vercel (5 minutes)

1. **Go to Vercel**: https://vercel.com/new

2. **Import Git Repository**:
   - Click "Import Git Repository"
   - Select your `propgroup` repo
   - Click "Import"

3. **Configure Project** (Auto-detected from vercel.json):
   - Framework Preset: **Next.js** ✅
   - Root Directory: `./` ✅
   - Build Command: `pnpm run vercel-build` ✅
   - Output Directory: `apps/web/.next` ✅
   - Install Command: `pnpm install --frozen-lockfile` ✅

   Everything should be auto-filled. If not, check these values.

4. **Add Environment Variables**:

   Click **"Environment Variables"** → Add:

   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://propgroup-backend.onrender.com/api
   ```

   ☝️ Use your actual backend URL from Step 3, and add `/api` at the end

5. **Click "Deploy"**

6. **Wait for Build** (3-5 minutes):
   - Vercel will build packages
   - Generate Prisma Client
   - Build Next.js app
   - Deploy to CDN

7. **Get Your Frontend URL**:
   - After deployment completes
   - Copy the URL: `https://propgroup-xyz123.vercel.app`
   - (Your actual URL will be different)

---

## Step 7: Update Backend CORS (2 minutes)

Now that we have the frontend URL, update the backend:

1. **Go to Render Dashboard** → **propgroup-backend** → **Environment**

2. **Edit FRONTEND_URL**:
   - Click the pencil icon next to `FRONTEND_URL`
   - Change from: `https://temporary-placeholder.com`
   - Change to: `https://propgroup-xyz123.vercel.app`
   - ☝️ Use your actual Vercel URL (no trailing slash!)

3. **Click "Save Changes"**

4. Backend will redeploy automatically (~2 minutes)

---

## Step 8: Test Everything (2 minutes)

### Test Backend Health
```bash
curl https://propgroup-backend.onrender.com/api/health
```

Should return:
```json
{"status":"ok","timestamp":"...","environment":"production","database":"connected"}
```

### Test Frontend
Open in browser:
```
https://propgroup-xyz123.vercel.app
```

☝️ Use your actual Vercel URL

### Test API Connection
1. Open frontend in browser
2. Open browser console (F12)
3. Go to Network tab
4. Navigate around the app
5. Should see API calls to your backend
6. Should **NOT** see CORS errors

---

## 🎉 You're Live!

### Your Deployment:

- ✅ **Database**: PostgreSQL on Render (Frankfurt)
- ✅ **Backend**: https://propgroup-backend.onrender.com
- ✅ **Frontend**: https://propgroup-xyz123.vercel.app

### Auto-Deployment Enabled:

- Push to `master` → Backend redeploys automatically on Render
- Push to `master` → Frontend redeploys automatically on Vercel
- Create PR → Vercel creates preview deployment

---

## 📊 Monitor Your Deployment

### Render (Backend)
- Dashboard: https://dashboard.render.com
- View logs in real-time
- See deployment history
- Monitor resource usage

### Vercel (Frontend)
- Dashboard: https://vercel.com/dashboard
- View deployment logs
- See analytics
- Monitor performance

---

## 🔧 Next Steps (Optional)

### 1. Set Up Custom Domain

**Frontend (Vercel):**
1. Go to Project Settings → Domains
2. Add your domain: `propgroup.com`
3. Update DNS records as instructed
4. Vercel handles SSL automatically

**Backend (Render):**
1. Go to Service Settings → Custom Domain
2. Add your domain: `api.propgroup.com`
3. Update DNS records as instructed
4. Update `BACKEND_URL` and `FRONTEND_URL` environment variables

### 2. Set Up Google OAuth

See [DEPLOYMENT.md](DEPLOYMENT.md) Part 4

### 3. Add More Environment Variables

**Email Service** (optional):
```bash
# Render Backend
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@propgroup.com
```

**Analytics** (optional):
```bash
# Vercel Frontend
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Set Up Monitoring

**Recommended Tools:**
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Plausible
- **Uptime Monitoring**: UptimeRobot, Better Uptime
- **Performance**: Vercel Analytics (built-in)

---

## 🆘 Troubleshooting

### Backend Deployment Failed

**Check Render logs for:**
- Migration errors → Run `fix-migration.sh` locally
- Missing environment variables → Check BACKEND_URL is set
- Build errors → Check build logs

### Frontend Deployment Failed

**Check Vercel logs for:**
- TypeScript errors → Run `pnpm run type-check` locally
- Build errors → Try `pnpm run clean && pnpm run build` locally
- Missing env vars → Check `NEXT_PUBLIC_API_URL` is set

### CORS Errors in Browser

**Fix:**
1. Check `FRONTEND_URL` in Render backend matches your Vercel URL **exactly**
2. Must include `https://` prefix
3. No trailing slash
4. Redeploy backend after updating

### API Calls Not Working

**Check:**
1. Backend is running: `curl https://your-backend.onrender.com/api/health`
2. Frontend has correct API URL: Check `NEXT_PUBLIC_API_URL` in Vercel
3. CORS is configured correctly (see above)

### Database Connection Failed

**Check:**
1. DATABASE_URL is correct in Render
2. Database is not paused (Free tier auto-pauses after inactivity)
3. Backend and database are in same region (Frankfurt)

---

## 📋 Deployment Summary

### What You Have:

```
┌─────────────────────────────────────────┐
│                                         │
│  Users                                  │
│                                         │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│                                         │
│  Vercel (Frankfurt CDN)                 │
│  Next.js Frontend                       │
│  https://propgroup-xyz.vercel.app       │
│                                         │
└───────────────┬─────────────────────────┘
                │
                │ HTTPS
                ▼
┌─────────────────────────────────────────┐
│                                         │
│  Render (Frankfurt)                     │
│  Express Backend                        │
│  https://propgroup-backend.onrender.com │
│                                         │
└───────────────┬─────────────────────────┘
                │
                │ Internal Network
                ▼
┌─────────────────────────────────────────┐
│                                         │
│  Render PostgreSQL (Frankfurt)          │
│  propgroup_database                     │
│                                         │
└─────────────────────────────────────────┘
```

### Regions:
- ✅ Database: **Frankfurt (EU Central)**
- ✅ Backend: **Frankfurt (EU Central)**
- ✅ Frontend: **Global CDN** (closest to user)

### Auto-Deployment:
- ✅ Push to GitHub → Automatic deployment
- ✅ No manual builds needed
- ✅ Preview deployments for PRs (Vercel)

---

## 🎓 Learn More

- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
- [ENV_VARIABLES.md](ENV_VARIABLES.md) - Environment variables reference
- [RENDER_ENV_VARS.md](RENDER_ENV_VARS.md) - Render-specific env vars
- [QUICK_START.md](QUICK_START.md) - Local development setup

---

## ✅ Deployment Checklist

- [ ] Step 1: Fix migration locally
- [ ] Step 2: Push to GitHub
- [ ] Step 3: Deploy backend to Render
- [ ] Step 4: Add environment variables
- [ ] Step 5: Test backend health endpoint
- [ ] Step 6: Deploy frontend to Vercel
- [ ] Step 7: Update backend CORS
- [ ] Step 8: Test everything

**Total time: ~30 minutes**

---

## 🚀 Ready to Deploy?

```bash
# Step 1: Fix migration
./fix-migration.sh

# Step 2: Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin master

# Step 3-8: Follow the guide above
```

**Let's go!** 🎉
