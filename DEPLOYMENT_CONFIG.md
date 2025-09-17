# DEPLOYMENT CONFIGURATION GUIDE

## Supabase Email Validation URL Fix

When deploying to production (Vercel), you need to update the following:

### 1. Update Environment Variables in Vercel

In your Vercel dashboard, you ONLY need these environment variables:

```env
# NO NEED FOR NEXT_PUBLIC_APP_URL - Vercel auto-detects it!

# Supabase Production Keys (from your Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Database URL for production
DATABASE_URL=your-production-database-url
```

**Why no NEXT_PUBLIC_APP_URL?** 
- The app uses `window.location.origin` which auto-detects the correct domain
- Vercel provides `VERCEL_URL` automatically for server-side code
- This works automatically with preview deployments and custom domains!

### 2. Configure Supabase Auth Settings

1. Go to your Supabase Dashboard
2. Navigate to Authentication → URL Configuration
3. Update the following URLs:

- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs**: 
  - `https://your-domain.vercel.app/auth/callback`
  - `https://your-domain.vercel.app`
  - `http://localhost:3000/auth/callback` (for local development)

### 3. Email Templates in Supabase

1. Go to Authentication → Email Templates
2. For each template (Confirm signup, Reset password, etc.), ensure the URLs use:
   - `{{ .SiteURL }}` instead of hardcoded localhost URLs
   - Example: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`

### 4. Update AuthModal.tsx (if needed)

The code already uses `window.location.origin` which will automatically use the correct domain:

```typescript
options: {
  emailRedirectTo: `${window.location.origin}/auth/callback`,
}
```

### 5. NO .env.production file needed!

Since the app auto-detects URLs, you don't need a `.env.production` file. Just configure the environment variables directly in Vercel's dashboard.

## Deployment Steps

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy
5. Update Supabase Auth settings with production URLs
6. Test email validation flow

## Important Notes

- Never commit `.env.local` or any file with real API keys
- Always use environment variables for sensitive data
- Test the email flow after deployment to ensure URLs are correct
- Keep development and production environments separate
