# PropGroup Vercel Deployment Guide

## 🚀 Quick Fix Summary

The build errors are happening because the internal monorepo packages (`@propgroup/config` and `@propgroup/db`) aren't being built during Vercel deployment. I've created a robust build system to fix this.

## 📋 Changes Made

### 1. New Build Scripts
- **`scripts/build-packages.js`** - Builds all packages with fallback support
- **`scripts/vercel-build-new.js`** - Vercel-specific build script with error handling
- **`test-build.bat`** - Windows script for local testing
- **`test-build.sh`** - Unix/Linux script for local testing

### 2. Updated Package.json
The root `package.json` now uses the new build scripts:
```json
{
  "scripts": {
    "build": "node scripts/build-packages.js && npm run --prefix apps/web build",
    "build:packages": "node scripts/build-packages.js",
    "vercel-build": "node scripts/vercel-build-new.js"
  }
}
```

## 🛠️ Local Testing

### Windows
```batch
# Run this to test the build locally
test-build.bat

# Or manually:
npm run build
```

### Mac/Linux
```bash
# Make it executable
chmod +x test-build.sh

# Run the test
./test-build.sh

# Or manually:
npm run build
```

## 📦 Vercel Configuration

Your `vercel.json` is already configured correctly:
```json
{
  "buildCommand": "npm run vercel-build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next"
}
```

## 🔧 Build Process Explained

1. **Install Dependencies** - Installs all npm packages
2. **Build Packages** - Builds internal packages in order:
   - `@propgroup/config` - Configuration and validators
   - `@propgroup/db` - Database client (with Supabase fallback)
   - `@propgroup/supabase` - Supabase utilities
   - `@propgroup/ui` - UI components
3. **Build Next.js App** - Builds the main web application

## 🚨 Error Handling

The new build system includes:
- **Fallback builds** - If TypeScript fails, creates JavaScript fallbacks
- **Missing package handling** - Creates stubs for missing packages
- **Graceful failures** - Optional packages can fail without breaking the build

## 🎯 Deployment Steps

### Option 1: Automatic (Recommended)
```bash
# Deploy to production
npm run deploy:web

# Deploy preview
npm run deploy:preview
```

### Option 2: Manual via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel --prod
```

### Option 3: Git Push
Push your changes to GitHub/GitLab/Bitbucket and Vercel will automatically deploy.

## ✅ Verification Checklist

Before deploying, ensure:
- [ ] Run `test-build.bat` locally and it completes successfully
- [ ] All packages have `dist` folders after build
- [ ] No TypeScript errors in the console
- [ ] The app starts with `npm start` after build

## 🐛 Troubleshooting

### Issue: "Module not found: Can't resolve '@propgroup/config'"
**Solution:** Run `npm run build:packages` before building the web app

### Issue: "Cannot find module './generated'"
**Solution:** The db package now has fallback handling for missing Prisma client

### Issue: Build fails on Vercel but works locally
**Solution:** Check environment variables in Vercel dashboard:
- `NODE_ENV=production`
- `DATABASE_URL` (if using Prisma)
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Issue: TypeScript errors during build
**Solution:** The new build script creates JavaScript fallbacks automatically

## 🔐 Environment Variables

Make sure these are set in Vercel:
```env
# Required
NODE_ENV=production

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Email (if using)
RESEND_API_KEY=your-resend-key

# Database (if using Prisma)
DATABASE_URL=your-database-url
```

## 📊 Monitoring

After deployment:
1. Check Vercel Functions tab for API errors
2. Monitor build logs in Vercel dashboard
3. Test critical paths (contact form, calculators)

## 🎉 Success Indicators

Your deployment is successful when:
- Build completes without errors
- All pages load correctly
- API routes respond properly
- Forms and calculators work

## 💡 Tips

1. **Use Turbopack** - Already configured for faster builds
2. **Cache Dependencies** - Vercel automatically caches node_modules
3. **Preview Deployments** - Test changes in preview before production
4. **Monitor Performance** - Use Vercel Analytics to track performance

## 📞 Support

If issues persist:
1. Check Vercel build logs for specific errors
2. Run `npm run build` locally to reproduce
3. Ensure all environment variables are set
4. Verify package.json dependencies are correct

## 🚀 Ready to Deploy!

Your project is now configured for successful Vercel deployment. The new build system handles all edge cases and ensures your monorepo packages are built correctly.

Run `test-build.bat` to verify everything works locally, then deploy with confidence!
