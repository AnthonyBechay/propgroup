# Environment Variables Reference

Quick reference for all environment variables needed for PropGroup deployment.

## Backend Environment Variables (Render)

### Copy this template to Render Dashboard → Environment:

```bash
# ====================================
# DATABASE (REQUIRED)
# ====================================
# Internal Database URL from Render (Frankfurt region)
DATABASE_URL=postgresql://propgroup_database_user:N47ZWO9oy6BsGhYdZWd7tqBivUfgCYeh@dpg-d3ro26jipnbc73epphb0-a/propgroup_database

# ====================================
# SERVER (REQUIRED)
# ====================================
NODE_ENV=production
PORT=3001

# ====================================
# URLS (REQUIRED)
# ====================================
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://propgroup-backend.onrender.com

# ====================================
# AUTHENTICATION (REQUIRED)
# ====================================
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-64-character-random-string-here
SESSION_SECRET=your-64-character-random-string-here
JWT_EXPIRES_IN=7d

# ====================================
# GOOGLE OAUTH (OPTIONAL)
# ====================================
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
GOOGLE_CALLBACK_URL=https://propgroup-backend.onrender.com/api/auth/google/callback
```

---

## Frontend Environment Variables (Vercel)

### Copy this to Vercel Dashboard → Settings → Environment Variables:

```bash
# ====================================
# API (REQUIRED)
# ====================================
NEXT_PUBLIC_API_URL=https://propgroup-backend.onrender.com/api

# ====================================
# ANALYTICS (OPTIONAL)
# ====================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ====================================
# MAPS (OPTIONAL)
# ====================================
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

---

## Generating Secrets

### Generate JWT_SECRET and SESSION_SECRET:

```bash
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Method 2: Using OpenSSL
openssl rand -hex 64

# Method 3: Using /dev/urandom (Linux/Mac)
head -c 64 /dev/urandom | base64
```

---

## Development Environment Variables

### Backend (.env in apps/backend/)

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/propgroup
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
JWT_SECRET=dev-secret-change-in-production
SESSION_SECRET=dev-secret-change-in-production
JWT_EXPIRES_IN=7d

# Optional
GOOGLE_CLIENT_ID=your-dev-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-dev-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

### Frontend (.env.local in apps/web/)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Environment Variable Checklist

### Before First Deployment:

#### Backend (Render)
- [ ] DATABASE_URL (from Render PostgreSQL)
- [ ] NODE_ENV=production
- [ ] PORT=3001
- [ ] FRONTEND_URL (temporary placeholder, update after Vercel deployment)
- [ ] BACKEND_URL (from Render service URL)
- [ ] JWT_SECRET (generate new random string)
- [ ] SESSION_SECRET (generate new random string)
- [ ] GOOGLE_CLIENT_ID (if using OAuth)
- [ ] GOOGLE_CLIENT_SECRET (if using OAuth)
- [ ] GOOGLE_CALLBACK_URL (if using OAuth)

#### Frontend (Vercel)
- [ ] NEXT_PUBLIC_API_URL (from Render backend URL)
- [ ] NEXT_PUBLIC_GA_MEASUREMENT_ID (optional)
- [ ] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (optional)

### After Frontend Deploys:

- [ ] Update FRONTEND_URL in Render backend
- [ ] Redeploy Render backend

---

## Security Notes

### DO:
✅ Generate new random secrets for production
✅ Use HTTPS URLs in production
✅ Keep secrets in environment variables, never in code
✅ Use different secrets for development and production
✅ Rotate secrets periodically

### DON'T:
❌ Commit .env files to Git
❌ Share secrets in chat, email, or documentation
❌ Use the same secrets across environments
❌ Use weak or predictable secrets
❌ Store secrets in frontend code

---

## Common Issues

### "CORS error" in browser console
**Fix**: Update `FRONTEND_URL` in Render backend to match your exact Vercel URL (including https://)

### "Database connection failed"
**Fix**: Use the **Internal Database URL** from Render PostgreSQL dashboard

### "Environment variable not defined"
**Fix**: Check that variables start with `NEXT_PUBLIC_` for frontend client-side access

### "JWT verification failed"
**Fix**: Ensure `JWT_SECRET` is the same across all backend instances

### Google OAuth redirect error
**Fix**: Ensure `GOOGLE_CALLBACK_URL` matches the authorized redirect URI in Google Console

---

## Verification Commands

### Test Backend
```bash
# Health check
curl https://propgroup-backend.onrender.com/api/health

# Should return:
# {"status":"ok","timestamp":"...","environment":"production","database":"connected"}
```

### Test Frontend
```bash
# Visit in browser
https://your-app.vercel.app

# Check console for API calls to backend
```

### Test Database Connection (from backend)
```bash
# SSH into Render backend or check logs
# Should see: "🚀 Server running on port 3001"
# Should NOT see database connection errors
```
