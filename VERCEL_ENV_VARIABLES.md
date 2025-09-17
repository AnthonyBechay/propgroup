# 🔐 Vercel Environment Variables Setup

## Required Environment Variables for Vercel

Add these in your Vercel Dashboard → Settings → Environment Variables

### 🔴 CRITICAL - Required for Build

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_service_key
```

### 🟡 OPTIONAL - For Additional Features

```env
# Email Service (if using contact forms)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Database (only if using Prisma with external database)
DATABASE_URL=postgresql://user:password@host:port/database

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Maps (optional) 
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### 🟢 AUTO-SET by Vercel (DO NOT ADD MANUALLY)

These are automatically set by Vercel:

```env
# These are set automatically - DO NOT add them manually
VERCEL=1
VERCEL_ENV=production|preview|development
VERCEL_URL=your-deployment-url.vercel.app
NODE_ENV=production
```

## 📋 Step-by-Step Setup in Vercel Dashboard

### 1. Go to Vercel Dashboard
- Navigate to your project
- Click on "Settings" tab
- Select "Environment Variables" from the left sidebar

### 2. Add Supabase Variables (REQUIRED)

#### NEXT_PUBLIC_SUPABASE_URL
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Your Supabase project URL (e.g., `https://abcdefghijk.supabase.co`)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- Get from: Supabase Dashboard → Settings → API → Project URL

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Your Supabase anon/public key
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- Get from: Supabase Dashboard → Settings → API → Project API keys → anon public

#### SUPABASE_SERVICE_ROLE_KEY
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Your Supabase service role key (keep this secret!)
- **Environment:** ✅ Production, ✅ Preview, ❌ Development
- Get from: Supabase Dashboard → Settings → API → Project API keys → service_role

### 3. Add Optional Variables (if needed)

#### RESEND_API_KEY (for email)
- **Name:** `RESEND_API_KEY`
- **Value:** Your Resend API key
- **Environment:** ✅ Production, ✅ Preview, ❌ Development
- Get from: https://resend.com/api-keys

## ⚠️ Important Notes

### DO NOT Add These Variables:
- `NEXT_PUBLIC_APP_URL` - Not needed, Vercel handles this
- `VERCEL_URL` - Automatically set by Vercel
- `NODE_ENV` - Automatically set by Vercel

### URL Handling:
- For metadata/SEO: The app automatically uses `VERCEL_URL` in production
- For local development: Uses `http://localhost:3000`
- No manual URL configuration needed!

## 🧪 Testing Your Environment Variables

After adding variables in Vercel:

1. **Trigger a redeploy:**
   ```bash
   vercel --prod --force
   ```

2. **Check build logs:**
   - Go to Vercel Dashboard → Functions tab
   - Check for any environment variable errors

3. **Test your app:**
   - Visit your deployed URL
   - Open browser console (F12)
   - Check for any missing variable errors

## 🚨 Common Issues & Solutions

### Issue: "Invalid URL" error during build
**Solution:** Don't set `NEXT_PUBLIC_APP_URL`. The app uses Vercel's automatic `VERCEL_URL`.

### Issue: "Supabase URL not found"
**Solution:** Ensure `NEXT_PUBLIC_SUPABASE_URL` starts with `https://` and ends with `.supabase.co`

### Issue: "Authentication failed"
**Solution:** Check that `SUPABASE_SERVICE_ROLE_KEY` is set in Production environment only.

## ✅ Minimal Working Setup

For a basic deployment, you only need these 3 variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
```

That's it! The app handles everything else automatically.

## 🔄 After Adding Variables

1. Go to Vercel Dashboard
2. Click "Redeploy" on your latest deployment
3. Select "Redeploy with existing Build Cache" 
4. Wait for deployment to complete
5. Your app should now work! 🎉
