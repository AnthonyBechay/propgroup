# 🔧 Fix: Resend API Key Error on Vercel

## The Problem
The error `Missing API key. Pass it to the constructor new Resend("re_123")` happens because:
- Resend package is being initialized without checking if the API key exists
- The initialization happens during the build process when Next.js pre-renders pages

## The Solution

### Option 1: Make Resend Optional (Recommended)
Since you might not need email functionality immediately, make it optional:

1. **Don't add RESEND_API_KEY to Vercel yet** (unless you have a Resend account)
2. **Remove resend from dependencies temporarily:**

```bash
cd apps/web
npm uninstall resend
npm install
```

3. **Commit and push:**
```bash
git add .
git commit -m "Remove resend temporarily to fix build"
git push
```

### Option 2: Add a Valid Resend API Key
If you want email functionality:

1. **Sign up for Resend** (free tier available):
   - Go to [https://resend.com](https://resend.com)
   - Create an account
   - Get your API key from the dashboard

2. **Add to Vercel Environment Variables:**
   - Vercel Dashboard → Settings → Environment Variables
   - Add: `RESEND_API_KEY` = `re_your_actual_key_here`
   - Select all environments

3. **Redeploy**

### Option 3: Use a Different Email Service
If you prefer SendGrid or another service:

1. **Replace Resend with SendGrid:**
```bash
cd apps/web
npm uninstall resend
npm install @sendgrid/mail
```

2. **Update the email configuration** (already created in `src/lib/email.ts`)

## Quick Fix for Now

Since email isn't critical for your app to work, I recommend **Option 1** - removing Resend temporarily:

```bash
# Run these commands:
cd apps/web
npm uninstall resend @react-email/render
cd ../..
git add .
git commit -m "Remove email dependencies temporarily"
git push
```

## Environment Variables You Actually Need

For basic functionality, you only need:

```env
# These 3 are REQUIRED:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# This is OPTIONAL (only if using email):
RESEND_API_KEY=re_xxxxx  # Only add if you have a real key
```

## Why This Happens

The resend package tries to initialize immediately when imported, even during the build process. Since Vercel's build environment doesn't have your RESEND_API_KEY (unless you add it), the build fails.

## Permanent Solution

I've already created `apps/web/src/lib/email.ts` that handles this properly by:
- Only initializing Resend if the API key exists
- Providing a mock implementation if not configured
- Not failing the build if email isn't set up

But for this to work, we need to ensure nothing else is importing Resend directly.

## Next Steps

1. **Remove resend package temporarily** (Option 1)
2. **Deploy successfully** 
3. **Add email later** when you have a Resend API key

Your app will work perfectly without email for now. The contact form will still accept submissions, they just won't be emailed to you (you could save them to Supabase instead).
