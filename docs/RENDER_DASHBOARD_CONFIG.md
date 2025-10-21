# 🎯 Render Dashboard Configuration - Exact Values

## What to Enter in Render Dashboard

### Creating the Backend Web Service

#### Basic Settings
| Field | Exact Value |
|-------|-------------|
| **Name** | `propgroup-backend` (or your choice) |
| **Region** | Select closest to your users |
| **Branch** | `master` |
| **Root Directory** | `apps/backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm run render-build` |
| **Start Command** | `npm run render-start` |

#### Advanced Settings
| Field | Value |
|-------|-------|
| **Node Version** | `20` |
| **Auto-Deploy** | `Yes` (recommended) |

---

## Environment Variables to Add

Click **"Environment"** tab and add these one by one:

### Required Variables

```bash
# 1. Database URL
DATABASE_URL
<paste your Render PostgreSQL Internal Database URL>

# 2. Node Environment
NODE_ENV
production

# 3. Port (Render sets this automatically, but good to have)
PORT
10000

# 4. Frontend URL (update after Vercel deployment)
FRONTEND_URL
http://localhost:3000

# 5. Backend URL (your Render service URL)
BACKEND_URL
https://propgroup-backend.onrender.com

# 6. JWT Secret (generate with command below)
JWT_SECRET
<paste random 64-char hex string>

# 7. Session Secret (generate with command below)
SESSION_SECRET
<paste random 64-char hex string>
```

### Optional Variables (for Google OAuth)

```bash
# Google OAuth Client ID
GOOGLE_CLIENT_ID
your-client-id.apps.googleusercontent.com

# Google OAuth Client Secret
GOOGLE_CLIENT_SECRET
GOCSPX-your-secret-here

# Google OAuth Callback URL
GOOGLE_CALLBACK_URL
https://propgroup-backend.onrender.com/api/auth/google/callback
```

---

## How to Generate Secrets

Run this command **twice** on your local machine:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**First run** → Use for `JWT_SECRET`
**Second run** → Use for `SESSION_SECRET`

Example output:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4
```

---

## Complete Step-by-Step

### Step 1: Create PostgreSQL Database
1. Render Dashboard → New → PostgreSQL
2. Name: `propgroup-db`
3. Region: Same as where you'll deploy backend
4. Plan: Free or Starter
5. Create Database
6. **Copy the "Internal Database URL"** (starts with `postgresql://`)

### Step 2: Create Web Service
1. Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Select `propgroup` repo

### Step 3: Configure Service
Fill in the table values from above:

```
Name: propgroup-backend
Region: <same as database>
Branch: master
Root Directory: apps/backend
Runtime: Node
Build Command: npm run render-build
Start Command: npm run render-start
```

### Step 4: Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add each variable from the table above. The form will look like:

```
Key: DATABASE_URL
Value: postgresql://username:password@host/database
```

Repeat for all 7 required variables (+ 3 optional for Google OAuth).

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for first deployment
3. Check logs to verify success
4. Copy your backend URL: `https://propgroup-backend.onrender.com`

### Step 6: Update Frontend URL
1. Go back to Environment tab
2. Update `FRONTEND_URL` with your Vercel URL (after you deploy frontend)
3. Save (will trigger redeploy)

---

## Render Scripts Explained

### What's in `apps/backend/package.json`:

```json
{
  "scripts": {
    "render-build": "cd ../../packages/db && prisma generate && prisma migrate deploy",
    "render-start": "node src/index.js"
  }
}
```

### What They Do:

**`render-build`** (runs during deployment):
1. `cd ../../packages/db` - Navigate to db package
2. `prisma generate` - Generate Prisma client
3. `prisma migrate deploy` - Run database migrations

**`render-start`** (runs to start server):
1. `node src/index.js` - Start Express server

---

## Verifying Deployment

### 1. Check Build Logs
In Render dashboard, click on your service → "Logs"

Look for:
```
✅ Prisma client generated
✅ Migrations applied
✅ Server running on port 10000
```

### 2. Test Health Endpoint
Visit: `https://your-backend.onrender.com/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "environment": "production"
}
```

### 3. Check Environment Variables
In Render → Environment tab

Verify all 7+ variables are set correctly.

---

## Common Issues

### Issue: Build fails with "prisma: command not found"
**Solution**: Prisma is in devDependencies. It should work, but if not, add to dependencies:
```bash
"dependencies": {
  "prisma": "^5.0.0"
}
```

### Issue: "Cannot find module '@propgroup/db'"
**Solution**: The build script generates it. Check build logs for errors.

### Issue: Database migrations fail
**Solution**:
1. Check `DATABASE_URL` is correct
2. Verify database exists and is accessible
3. Check migrations exist in `packages/db/prisma/migrations/`

### Issue: Server starts but crashes
**Solution**:
1. Check `JWT_SECRET` and `SESSION_SECRET` are set
2. Check `FRONTEND_URL` doesn't have trailing slash
3. Review server logs for specific error

---

## Quick Copy-Paste Checklist

Use this when configuring Render:

**Service Configuration:**
```
Root Directory: apps/backend
Build Command: npm run render-build
Start Command: npm run render-start
```

**Essential Environment Variables:**
```
DATABASE_URL=<from-render-postgresql>
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://propgroup-backend.onrender.com
JWT_SECRET=<generate-with-crypto>
SESSION_SECRET=<generate-with-crypto>
```

**Generate Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## After Deployment

### Update Vercel
Add to Vercel environment variables:
```
NEXT_PUBLIC_API_URL=https://propgroup-backend.onrender.com/api
```

### Update Render
Update `FRONTEND_URL` in Render to your Vercel URL.

### Test Everything
1. Visit `https://your-backend.onrender.com/health`
2. Visit `https://your-app.vercel.app`
3. Try to register a new account
4. Try to login
5. Browse properties
6. Add a favorite

---

## 🎉 You're Done!

Your backend is deployed on Render with:
- ✅ PostgreSQL database
- ✅ Prisma migrations applied
- ✅ Express server running
- ✅ Authentication configured
- ✅ All environment variables set

**Next:** Deploy frontend to Vercel!

See: [QUICKSTART.md](./QUICKSTART.md) for frontend deployment.
