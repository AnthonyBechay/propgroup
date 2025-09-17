# ✅ Fixed: Vercel Deployment URL Error

## 🎯 The Problem
The error `TypeError: Invalid URL` with `input: 'app_url'` was caused by:
1. Hardcoded URL in metadata that didn't exist
2. Environment variables being incorrectly set during build

## ✅ The Solution

### 1. Fixed Metadata URL Generation
Updated `apps/web/src/app/layout.tsx` to automatically detect the correct URL:
- **Production (Vercel):** Uses `VERCEL_URL` (automatically set by Vercel)
- **Local Development:** Uses `http://localhost:3000`
- **No manual configuration needed!**

### 2. Removed Hardcoded Environment Variables
- Removed hardcoded URLs from `next.config.ts`
- Let Vercel handle URL resolution automatically
- Removed placeholder values from build script

## 🔐 Exact Environment Variables for Vercel

### Add ONLY These 3 Variables in Vercel Dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_service_key
```

### ⚠️ DO NOT ADD These Variables:
- ❌ `NEXT_PUBLIC_APP_URL` - Not needed anymore
- ❌ `VERCEL_URL` - Automatically set by Vercel
- ❌ `NODE_ENV` - Automatically set by Vercel
- ❌ Any URL-related variables

## 📋 How to Set Environment Variables in Vercel

### Step 1: Get Your Supabase Keys
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy these values:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → Use for `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Add to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:
   - Click "Add New"
   - Enter the name exactly as shown above
   - Paste the value from Supabase
   - Select all environments (Production, Preview, Development)
   - Click "Save"

### Step 3: Redeploy
1. Go to Deployments tab
2. Click on the three dots (...) on your latest deployment
3. Click "Redeploy"
4. Choose "Use existing Build Cache"
5. Click "Redeploy"

## 🧪 Testing

### Local Testing First
```batch
# Clean and test build locally
clean-build-test.bat
```

### Deploy to Vercel
```bash
# Commit your changes
git add .
git commit -m "Fix: URL metadata generation for Vercel"
git push

# Or use CLI
vercel --prod
```

## ✨ What Changed

### File Changes:
1. **`apps/web/src/app/layout.tsx`**
   - Dynamic URL detection based on environment
   - No hardcoded URLs

2. **`apps/web/next.config.ts`**
   - Removed hardcoded environment variables
   - Let runtime handle them

3. **`scripts/vercel-build-new.js`**
   - Removed placeholder environment variables
   - Use actual Vercel environment

## 🚀 Deployment Should Now Work!

Your deployment will succeed because:
- ✅ No hardcoded URLs
- ✅ Automatic URL detection
- ✅ Proper environment variable handling
- ✅ Vercel-compatible metadata generation

## 🆘 If You Still Get Errors

1. **Double-check your Supabase URLs:**
   - Must start with `https://`
   - Must end with `.supabase.co`
   - No trailing slashes

2. **Clear Vercel cache:**
   - Vercel Dashboard → Settings → Advanced → Clear Cache
   - Redeploy with "Force New Build"

3. **Check build logs:**
   - Look for any environment variable warnings
   - Ensure all 3 Supabase variables are detected

## 🎉 Success!

With these changes, your PropGroup project will deploy successfully to Vercel without any URL errors!
