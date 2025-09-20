# Production Migration Guide for PropGroup

## Prerequisites
- Supabase account with a project created
- Vercel account
- GitHub repository connected to Vercel

## Step 1: Set Up Supabase Production Database

### 1.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Note down your project credentials:
   - Project URL: `https://YOUR_PROJECT_ID.supabase.co`
   - Anon Key: `eyJhbGciOiJI...` (public key)
   - Service Role Key: `eyJhbGciOiJI...` (secret key)
   - Database URL: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 1.2 Apply Database Migrations

From your local development environment:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Apply migrations to production
supabase db push

# OR if you prefer using the migration files directly:
supabase migration up
```

## Step 2: Configure Vercel Environment Variables

### 2.1 Required Environment Variables

In your Vercel project dashboard (Settings → Environment Variables), add:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database URL (REQUIRED for Prisma)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1

# Direct Database URL (for migrations)
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 2.2 Optional Environment Variables

```env
# Email Service (if using)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Analytics (if using)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Maps (if using)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...

# Payment Processing (if using)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
```

## Step 3: Configure Supabase Auth

### 3.1 Update Authentication Settings

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update the following:

**Site URL**: 
- Production: `https://your-domain.vercel.app` or `https://yourdomain.com`

**Redirect URLs** (add all):
- `https://your-domain.vercel.app/auth/callback`
- `https://your-domain.vercel.app`
- `https://yourdomain.com/auth/callback` (if using custom domain)
- `https://yourdomain.com` (if using custom domain)
- `http://localhost:3000/auth/callback` (keep for local development)

### 3.2 Configure Email Templates

1. Go to Authentication → Email Templates
2. For each template, ensure URLs use dynamic variables:
   - Confirm signup: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`
   - Reset password: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`
   - Magic Link: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink`

## Step 4: Update Prisma Schema for Production

### 4.1 Update schema.prisma for Connection Pooling

In `packages/db/prisma/schema.prisma`, update the datasource:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

This allows Prisma to use connection pooling via PgBouncer for queries and direct connection for migrations.

## Step 5: Deploy to Vercel

### 5.1 Initial Deployment

```bash
# Ensure you're on the main branch
git checkout main

# Push to GitHub
git push origin main

# Vercel will automatically deploy
```

### 5.2 Build Configuration in Vercel

Ensure your build settings in Vercel are:
- Build Command: `npm run build` or `turbo run build`
- Output Directory: `apps/web/.next`
- Install Command: `npm install`

### 5.3 Post-Deployment Database Setup

After first deployment, run migrations:

```bash
# From your local machine with production DATABASE_URL
npx prisma migrate deploy --schema=./packages/db/prisma/schema.prisma
```

OR use Supabase CLI:

```bash
supabase db push
```

## Step 6: Verify Deployment

### 6.1 Test Critical Features
1. Visit your production URL
2. Test user registration (check email delivery)
3. Test login/logout
4. Test database operations (create, read, update, delete)
5. Check admin panel access

### 6.2 Monitor Logs
- Check Vercel Functions logs for any errors
- Check Supabase logs for database queries
- Monitor browser console for client-side errors

## Step 7: Troubleshooting Common Issues

### Issue: "Using fallback PrismaClient"
**Solution**: Ensure DATABASE_URL is properly set in Vercel environment variables

### Issue: Build fails with "Cannot find module '@prisma/client'"
**Solution**: Add this to your `package.json` build script:
```json
"build": "cd packages/db && npx prisma generate && cd ../../ && next build"
```

### Issue: "Invalid `prisma` invocation" in production
**Solution**: Ensure Prisma client is generated during build:
```json
// In apps/web/package.json
"scripts": {
  "build": "prisma generate --schema=../../packages/db/prisma/schema.prisma && next build"
}
```

### Issue: Connection pooling errors
**Solution**: Use PgBouncer connection string with proper parameters:
```
DATABASE_URL=postgresql://...supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

## Step 8: Production Checklist

- [ ] Supabase project created and configured
- [ ] All environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Authentication URLs configured in Supabase
- [ ] Email templates using dynamic URLs
- [ ] Prisma client generated during build
- [ ] Connection pooling configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] Monitoring and logging set up

## Additional Notes

### For Prisma with Supabase:
1. Use Transaction Mode pooling in Supabase
2. Use `?pgbouncer=true&connection_limit=1` in DATABASE_URL
3. Use DIRECT_URL for migrations only

### For Development vs Production:
- Development: Use direct connection without pooling
- Production: Use pooled connection for queries, direct for migrations

### Security Considerations:
- Never expose SERVICE_ROLE_KEY in client-side code
- Use Row Level Security (RLS) in Supabase
- Implement proper RBAC as per your schema
- Regular security audits of exposed endpoints

## Support Resources
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
