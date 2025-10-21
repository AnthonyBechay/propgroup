# PropGroup Deployment Refactoring Summary

## Overview

This document summarizes all the changes made to transform PropGroup from a Supabase-dependent application to a fully independent stack with separate frontend (Vercel) and backend (Render) deployments.

---

## Major Changes

### 1. **Removed Supabase Dependencies**

#### Frontend (`apps/web/package.json`)
- ✅ Removed `@supabase/ssr`
- ✅ Removed `@supabase/supabase-js`

#### Impact
- All Supabase authentication and database calls removed
- Frontend now communicates exclusively with the Express backend via REST API

---

### 2. **Added Passport.js Authentication System**

#### New Dependencies (`apps/backend/package.json`)
```json
{
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "passport-local": "^1.0.0",
  "passport-jwt": "^4.0.1",
  "express-session": "^1.18.0",
  "cookie-parser": "^1.4.6",
  "connect-pg-simple": "^9.0.1",
  "@prisma/client": "^5.0.0"
}
```

#### New Files
- **`apps/backend/src/config/passport.js`**: Passport configuration with:
  - Local Strategy (email/password authentication)
  - Google OAuth Strategy (Sign in with Google)
  - User serialization/deserialization

#### Updated Files
- **`apps/backend/src/index.js`**:
  - Added session middleware
  - Added cookie-parser
  - Added Passport initialization
  - Improved CORS configuration for cross-origin requests
  - Added trust proxy for Render deployment

- **`apps/backend/src/routes/auth.js`**:
  - Updated login to use Passport Local Strategy
  - Added Google OAuth routes:
    - `GET /api/auth/google` - Initiates OAuth flow
    - `GET /api/auth/google/callback` - OAuth callback handler
  - Updated register to set `provider: 'local'`

---

### 3. **Database Schema Updates**

#### Prisma Schema Changes (`packages/db/prisma/schema.prisma`)

Added OAuth fields to User model:
```prisma
model User {
  // ... existing fields ...

  // OAuth provider data
  googleId        String?  @unique
  provider        String?  // 'local' or 'google'
  avatar          String?  // Profile picture URL

  // ... rest of fields ...
}
```

#### Migration Created
- **`packages/db/prisma/migrations/20251021000001_add_oauth_fields/migration.sql`**:
  - Adds `googleId`, `provider`, and `avatar` columns
  - Creates unique index on `googleId`
  - Updates existing users to have `provider = 'local'`

---

### 4. **Backend Deployment Configuration**

#### Updated Scripts (`apps/backend/package.json`)
```json
{
  "scripts": {
    "build": "prisma generate",
    "render-build": "pnpm install && prisma generate && prisma migrate deploy",
    "render-start": "node src/index.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy"
  }
}
```

#### Environment Variables (`apps/backend/.env.example`)
New comprehensive `.env.example` created with:
- Database configuration
- JWT and session secrets
- Google OAuth credentials
- Frontend/backend URLs
- Email service configuration (optional)

---

### 5. **Frontend Deployment Configuration**

#### API Client Updates (`apps/web/src/lib/api/client.ts`)
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '' // Use relative URLs in production if API_URL not set
    : 'http://localhost:3001/api');
```

#### Vercel Configuration (`vercel.json`)
```json
{
  "buildCommand": "pnpm run vercel-build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs"
}
```

#### Environment Variables (`apps/web/.env.example`)
Simplified to just:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

---

### 6. **Documentation**

#### New Files Created

1. **`RENDER_SETUP.md`** - Complete deployment guide including:
   - Database setup on Render
   - Backend deployment configuration
   - Frontend deployment on Vercel
   - Google OAuth setup instructions
   - Environment variable tables
   - Troubleshooting guide
   - Post-deployment checklist

2. **`apps/backend/.env.example`** - Backend environment template with detailed comments

3. **`apps/web/.env.example`** - Frontend environment template

4. **`.env.example`** (root) - Updated to point to app-specific examples

5. **`DEPLOYMENT_SUMMARY.md`** - This file

---

## Architecture

### Before
```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Supabase     │
│ (Auth + DB + API)│
└─────────────────┘
```

### After
```
┌─────────────────┐          ┌─────────────────┐
│   Next.js App   │  HTTP    │  Express API    │
│   (Vercel)      │ ←──────→ │   (Render)      │
└─────────────────┘          └────────┬────────┘
                                      │
                                      ↓
                             ┌─────────────────┐
                             │   PostgreSQL    │
                             │    (Render)     │
                             └─────────────────┘
```

---

## Authentication Flow

### Normal Sign Up/Login (Email/Password)
1. User submits credentials to frontend
2. Frontend calls `/api/auth/register` or `/api/auth/login`
3. Backend validates with Passport Local Strategy
4. Backend creates JWT token and sets HTTP-only cookie
5. User authenticated

### Google OAuth Flow
1. User clicks "Sign in with Google" on frontend
2. Frontend redirects to backend `/api/auth/google`
3. Backend redirects to Google OAuth consent screen
4. User approves, Google redirects to `/api/auth/google/callback`
5. Backend:
   - Finds or creates user
   - Links Google ID to user account
   - Creates JWT token and sets cookie
   - Redirects to frontend `/auth/callback?success=true`
6. Frontend detects success and logs user in

---

## Environment Variables Reference

### Render Backend

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `10000` |
| `FRONTEND_URL` | Vercel URL(s) | `https://app.vercel.app` |
| `BACKEND_URL` | Render URL | `https://app.onrender.com` |
| `JWT_SECRET` | JWT signing key | Random 64-char hex |
| `SESSION_SECRET` | Session encryption key | Random 64-char hex |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | From Google Console |
| `GOOGLE_CALLBACK_URL` | OAuth callback | `${BACKEND_URL}/api/auth/google/callback` |

### Vercel Frontend

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://app.onrender.com/api` |

---

## Deployment Steps

### Quick Reference

1. **Create PostgreSQL on Render**
   - Get `DATABASE_URL`

2. **Deploy Backend to Render**
   - Configure build/start commands
   - Add all environment variables
   - Wait for deployment

3. **Deploy Frontend to Vercel**
   - Set `NEXT_PUBLIC_API_URL`
   - Deploy

4. **Update Backend `FRONTEND_URL`**
   - Use Vercel URL
   - Redeploy backend

5. **(Optional) Configure Google OAuth**
   - Create OAuth app in Google Console
   - Add credentials to backend

See **RENDER_SETUP.md** for detailed instructions.

---

## Breaking Changes

### For Existing Users
- All user sessions will be invalidated (different auth system)
- Users will need to log in again
- Users who signed up with Supabase can still log in with same email/password
- Migration script preserves all user data

### For Developers
- Must set `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Must set all backend environment variables in Render
- Local development requires both backend and frontend running
- Database schema has new fields (run migration)

---

## Testing Checklist

### Local Development
- [ ] Backend starts without errors (`pnpm run dev:backend`)
- [ ] Frontend starts without errors (`pnpm run dev:web`)
- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Can view properties
- [ ] Admin dashboard accessible

### Production
- [ ] Backend health check passes (`/health`)
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Google OAuth works (if configured)
- [ ] Properties load correctly
- [ ] Admin dashboard accessible
- [ ] Database migrations applied

---

## Troubleshooting

### "ERR_CONNECTION_REFUSED" on login
**Cause**: Frontend trying to connect to localhost instead of production backend

**Solution**:
1. Go to Vercel dashboard
2. Environment Variables
3. Set `NEXT_PUBLIC_API_URL` to your Render backend URL
4. Redeploy frontend

### "CORS error" in browser console
**Cause**: Backend CORS not configured for your frontend URL

**Solution**:
1. Go to Render backend dashboard
2. Environment Variables
3. Update `FRONTEND_URL` to include your Vercel URL
4. Redeploy backend

### Google OAuth fails
**Cause**: Redirect URI mismatch

**Solution**:
1. Google Cloud Console → Credentials
2. Edit OAuth client
3. Ensure redirect URI matches exactly: `https://your-backend.onrender.com/api/auth/google/callback`
4. Save and retry

### Database migrations not applied
**Cause**: Migration didn't run during deployment

**Solution**:
1. Render dashboard → Shell
2. Run: `npx prisma migrate deploy`

---

## Files Modified

### Backend
- `apps/backend/package.json` - Added dependencies and scripts
- `apps/backend/src/index.js` - Added Passport and session middleware
- `apps/backend/src/routes/auth.js` - Added OAuth routes
- `apps/backend/src/config/passport.js` - **NEW** Passport configuration

### Frontend
- `apps/web/package.json` - Removed Supabase dependencies
- `apps/web/src/lib/api/client.ts` - Updated API URL logic

### Database
- `packages/db/prisma/schema.prisma` - Added OAuth fields
- `packages/db/prisma/migrations/20251021000001_add_oauth_fields/` - **NEW** Migration

### Configuration
- `vercel.json` - Updated build configuration
- `.env.example` - Updated with new structure
- `apps/backend/.env.example` - **NEW** Backend environment template
- `apps/web/.env.example` - **NEW** Frontend environment template

### Documentation
- `RENDER_SETUP.md` - **NEW** Complete deployment guide
- `DEPLOYMENT_SUMMARY.md` - **NEW** This file

---

## Next Steps

1. ✅ Deploy database on Render
2. ✅ Deploy backend on Render
3. ✅ Deploy frontend on Vercel
4. ✅ Configure environment variables
5. ✅ Test authentication
6. ⚠️ (Optional) Set up Google OAuth
7. ⚠️ (Optional) Configure custom domain
8. ⚠️ (Optional) Set up monitoring/logging
9. ⚠️ Create first super admin user
10. ⚠️ Test all features end-to-end

---

## Support

For deployment issues, refer to:
- **RENDER_SETUP.md** - Step-by-step deployment guide
- Render documentation: https://render.com/docs
- Vercel documentation: https://vercel.com/docs
- Passport.js documentation: http://www.passportjs.org/

---

**Status**: ✅ All refactoring complete and ready for deployment!

**Estimated Deployment Time**: 30-45 minutes (excluding Google OAuth setup)
