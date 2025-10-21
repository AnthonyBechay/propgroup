# 🔄 Render Database Reset - Quick Guide

**Use this when:** Migration fails and you need a fresh start (no production data)

---

## ✅ Quick Checklist

### 1️⃣ Delete Failed Database
- [ ] Go to [Render Dashboard](https://dashboard.render.com/)
- [ ] Click **PostgreSQL** (left sidebar)
- [ ] Click on your database (e.g., `propgroup-db`)
- [ ] Click **Settings** tab
- [ ] Scroll to **Danger Zone**
- [ ] Click **"Delete Database"**
- [ ] Confirm by typing database name
- [ ] Click **Delete**

### 2️⃣ Create New Database
- [ ] Click **"New +"** (top right)
- [ ] Select **PostgreSQL**
- [ ] Name: `propgroup-db`
- [ ] Database: `propgroup`
- [ ] User: `propgroup_user`
- [ ] Region: **SAME AS BACKEND** (important!)
- [ ] Plan: **Free** or **Starter**
- [ ] Click **"Create Database"**
- [ ] Wait 1-2 minutes

### 3️⃣ Copy Database URL
- [ ] Look for **"Internal Database URL"** (NOT External!)
- [ ] Click **Copy** button
- [ ] Save it temporarily (you'll paste it in next step)
- [ ] Format: `postgresql://user:password@host/database`

### 4️⃣ Update Backend Environment
- [ ] Go to **Web Services** (left sidebar)
- [ ] Click your backend (`propgroup-backend`)
- [ ] Click **Environment** tab
- [ ] Find `DATABASE_URL` variable
- [ ] Click **pencil icon** to edit
- [ ] **Paste new Internal Database URL**
- [ ] Click **"Save Changes"**

### 5️⃣ Deploy
- [ ] Render will auto-deploy after saving
- [ ] OR click **"Manual Deploy"** → **"Clear build cache & deploy"**
- [ ] Wait 5-10 minutes

### 6️⃣ Monitor Logs
- [ ] Click **Logs** tab
- [ ] Look for:
  ```
  ✅ Applying migration `20250120000001_init`
  ✅ Applying migration `20251021000001_add_oauth_fields`
  ✅ Server running on port 10000
  ```

### 7️⃣ Verify
- [ ] Visit: `https://your-backend.onrender.com/health`
- [ ] Should see: `{"status": "ok", ...}`

---

## 🎯 What This Does

**Before:**
- Database stuck with failed migration
- Can't apply new migrations
- Build fails repeatedly

**After:**
- Fresh database with no migration history
- Migrations apply cleanly
- Backend starts successfully
- Super admin seeded: `admin@propgroup.com` / `Admin123!`

---

## ⏱️ Time Required

- Delete database: **30 seconds**
- Create new database: **2 minutes**
- Update environment: **30 seconds**
- Deployment: **5-10 minutes**

**Total: ~10 minutes**

---

## 🔐 Environment Variables Needed

After database reset, verify these are set in **Render → Environment**:

```bash
DATABASE_URL=<new-internal-database-url>
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://propgroup-backend.onrender.com
JWT_SECRET=<generate-with-crypto>
SESSION_SECRET=<generate-with-crypto>
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📋 Post-Reset Checklist

After successful deployment:

- [ ] Health endpoint returns `{"status": "ok"}`
- [ ] No errors in Render logs
- [ ] Database has all tables (check in Render PostgreSQL dashboard)
- [ ] Can connect to Render PostgreSQL via SQL client (optional)
- [ ] Update `FRONTEND_URL` with Vercel URL (once frontend deployed)

---

## 🆘 Common Issues

### Issue: "Database still in failed state"

**Cause:** Old database wasn't fully deleted

**Fix:**
1. Render Dashboard → PostgreSQL
2. Verify database is actually deleted
3. Create new one with **different name** (e.g., `propgroup-db-v2`)

### Issue: "Cannot connect to database"

**Cause:** Wrong URL copied (External instead of Internal)

**Fix:**
1. Render Dashboard → PostgreSQL → Your database
2. Look for **"Internal Database URL"** section
3. Copy that URL (NOT the External one)
4. Update `DATABASE_URL` in backend environment

### Issue: "Migrations still failing"

**Cause:** Code not updated in GitHub

**Fix:**
1. Verify migration file is correct locally
2. Check: `packages/db/prisma/migrations/20251021000001_add_oauth_fields/migration.sql`
3. Should have `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" TEXT;` at line 3
4. If missing, commit and push:
   ```bash
   git add .
   git commit -m "Fix OAuth migration - add password column first"
   git push
   ```
5. Render will auto-deploy with updated code

---

## ✅ Success Indicators

You'll know it worked when you see:

**In Render Logs:**
```
Running migrations...
Applying migration `20250120000001_init`
The following migration(s) have been applied:

migrations/
  └─ 20250120000001_init/
      └─ migration.sql

Applying migration `20251021000001_add_oauth_fields`
The following migration(s) have been applied:

migrations/
  └─ 20251021000001_add_oauth_fields/
      └─ migration.sql

✅ Database migrations completed!
🚀 Server running on port 10000
```

**In Browser (Health Endpoint):**
```json
{
  "status": "ok",
  "timestamp": "2024-10-21T16:30:00.000Z",
  "environment": "production"
}
```

---

## 🚀 Next Steps

After backend is live:

1. **Deploy Frontend to Vercel**
   - See: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

2. **Update Backend FRONTEND_URL**
   - After Vercel deployment, update `FRONTEND_URL` in Render

3. **Test Complete Flow**
   - Use: [DEPLOYMENT_TESTING_CHECKLIST.md](./DEPLOYMENT_TESTING_CHECKLIST.md)

---

**Database reset complete! Your backend will now deploy successfully! 🎉**
