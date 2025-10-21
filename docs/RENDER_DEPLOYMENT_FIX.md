# 🔧 Render Deployment - Migration Fix

You encountered a migration error on Render. Since this is a **new platform with no data**, here's the fastest fix.

---

## ✅ Recommended Fix: Reset Database

Since you don't have production data yet, this is the cleanest solution:

### Step 1: Delete Current Database

1. Go to **Render Dashboard** → **PostgreSQL**
2. Find your `propgroup-db` database
3. Click on it → **Settings** tab → **Danger Zone**
4. Click **"Delete Database"**
5. Confirm deletion

### Step 2: Create New Database

1. **Render Dashboard** → **New** → **PostgreSQL**
2. Fill in:
   ```
   Name: propgroup-db
   Database: propgroup
   User: propgroup_user
   Region: <same as your backend service>
   Plan: Free (or Starter)
   ```
3. Click **"Create Database"**
4. Wait 1-2 minutes for creation
5. **Copy the "Internal Database URL"** (it will look like):
   ```
   postgresql://propgroup_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com/propgroup
   ```

### Step 3: Update Backend Environment

1. Go to **Render Dashboard** → **Web Services** → **propgroup-backend**
2. Click **"Environment"** tab
3. Find `DATABASE_URL` variable
4. Click **Edit** → **Paste the new Internal Database URL**
5. Click **Save Changes**

### Step 4: Redeploy

1. Still in your backend service
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
3. Wait 5-10 minutes for deployment
4. Watch the logs for:
   ```
   ✅ Applying migration `20250120000001_init`
   ✅ Applying migration `20251021000001_add_oauth_fields`
   ✅ Server running on port 10000
   ```

### Step 5: Verify Deployment

1. Visit: `https://your-backend.onrender.com/health`
2. You should see:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-10-21T...",
     "environment": "production"
   }
   ```

---

## 🎯 What Fixed the Problem

The issue was:
- **Initial migration** (`20250120000001_init`) didn't create a `password` column
- **OAuth migration** (`20251021000001_add_oauth_fields`) tried to reference it
- Result: Migration failed with "column 'password' does not exist"

The fix:
- I updated the OAuth migration to **add the password column first**
- Then it adds OAuth fields (googleId, provider, avatar)
- Then it updates existing users

**File Updated:** `packages/db/prisma/migrations/20251021000001_add_oauth_fields/migration.sql`

```sql
-- Add password column FIRST
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" TEXT;

-- Then add OAuth fields
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "googleId" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" TEXT;

-- Create index
CREATE UNIQUE INDEX IF NOT EXISTS "users_googleId_key" ON "users"("googleId");

-- Update provider for existing users
UPDATE "users" SET "provider" = 'local' WHERE "provider" IS NULL AND "password" IS NOT NULL;
```

---

## 📋 Post-Deployment Checklist

After successful deployment:

- [ ] Health endpoint returns `{"status": "ok"}`
- [ ] No errors in Render logs
- [ ] Update `FRONTEND_URL` in Render with your Vercel URL (once frontend is deployed)
- [ ] Deploy frontend to Vercel
- [ ] Update `NEXT_PUBLIC_API_URL` in Vercel with Render backend URL
- [ ] Test the complete flow using [DEPLOYMENT_TESTING_CHECKLIST.md](./DEPLOYMENT_TESTING_CHECKLIST.md)

---

## 🔐 Complete Environment Variables for Render

Make sure all these are set in **Render → Environment**:

```bash
# Required (7)
DATABASE_URL=<internal-database-url-from-step-2>
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://propgroup-backend.onrender.com
JWT_SECRET=<generate-with-crypto>
SESSION_SECRET=<generate-with-crypto>

# Optional (3) - For Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://propgroup-backend.onrender.com/api/auth/google/callback
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run twice - once for JWT_SECRET, once for SESSION_SECRET.

---

## 🆘 If Deployment Still Fails

### Check Build Logs

Look for specific errors in **Render Logs**:

**Error: "prisma: command not found"**
- Solution: Prisma is in devDependencies, it should work
- If not, check `apps/backend/package.json` has prisma in devDependencies

**Error: "Cannot find module '@propgroup/db'"**
- Solution: Build script generates it
- Check build logs show "Prisma Client generated"
- Verify `render-build` script runs: `cd ../../packages/db && prisma generate && prisma migrate deploy`

**Error: "DATABASE_URL not set"**
- Solution: Add `DATABASE_URL` to Render environment variables
- Use Internal Database URL (not External!)

**Error: "Port already in use"**
- Solution: Render sets PORT automatically to 10000
- Don't hardcode port in code, use `process.env.PORT`

### Get Help

If you're still stuck:
1. Check [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - Complete variable guide
2. Check [RENDER_DASHBOARD_CONFIG.md](./RENDER_DASHBOARD_CONFIG.md) - Dashboard configuration
3. Check Render logs for specific error messages
4. Verify all environment variables are set correctly

---

## ✅ Success!

Once deployed successfully, your backend will:
- ✅ Run on Render with PostgreSQL database
- ✅ Have all migrations applied
- ✅ Be ready to accept requests from your Vercel frontend
- ✅ Support email/password and Google OAuth authentication
- ✅ Have super admin seeded: `admin@propgroup.com` / `Admin123!`

**Next:** Deploy your frontend to Vercel using [QUICKSTART.md](./QUICKSTART.md) - Step 3.

---

**Happy deploying! 🚀**
