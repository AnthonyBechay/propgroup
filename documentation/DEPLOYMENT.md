# Vercel Deployment Guide

## Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

### Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## Deployment Settings

In Vercel Dashboard:
- **Root Directory**: Leave empty (Vercel uses `apps/web`)
- **Framework**: Next.js (auto-detected)
- **Build & Output Settings**: Handled by vercel.json

## Deploy

Push to Git and Vercel auto-deploys:
```bash
git add .
git commit -m "your changes"
git push
```

## Build Process

1. Vercel installs dependencies from root
2. Builds packages (config, db, ui, supabase)
3. Builds Next.js app in apps/web
4. Deploys from apps/web/.next

## Troubleshooting

If build fails:
1. Check environment variables are set
2. Clear Vercel cache (Settings → Advanced → Clear Cache)
3. Redeploy with "Force New Build"
