# QUICK FIX - Render Database Error

## The Error
```
ERROR: type "Country" already exists
```

## The Fix (2 Minutes)

### Step 1: Open Render Database Shell
1. Go to https://dashboard.render.com
2. Click on your **PostgreSQL** database
3. Click **"Shell"** tab

### Step 2: Copy & Paste This
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO render;
GRANT ALL ON SCHEMA public TO public;
```

### Step 3: Redeploy
1. Go to your **Web Service**
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. ✅ Migration will work!

---

## That's It! 🎉

Your database is now clean and the migration will apply successfully.

---

## Why This Works

- `DROP SCHEMA public CASCADE` → Deletes all tables, enums, everything
- `CREATE SCHEMA public` → Creates fresh empty schema
- Migration applies to clean database → Success!

---

## If You Get Permission Error

Use this instead:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

---

## Alternative: Use SQL File

In Render Shell, you can also paste the content of `reset-render-db.sql`:

```bash
# If you have psql locally:
psql YOUR_DATABASE_URL < reset-render-db.sql
```

---

**Time:** 2 minutes
**Risk:** None (fresh start)
**Data Loss:** All (you don't care)
**Result:** Clean deployment ✅
