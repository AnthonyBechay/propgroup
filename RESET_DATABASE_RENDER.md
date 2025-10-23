# Reset Database on Render - Complete Guide

## Error: `type "Country" already exists`

This means your Render database has old schema objects. Since you don't care about data, we'll **wipe it clean**.

---

## Solution: Reset the Database

### Option 1: Using Render Dashboard (EASIEST)

1. **Go to your Render Dashboard**
2. **Navigate to your PostgreSQL database**
3. **Click on "Shell" tab** (or "Connect")
4. **Run these commands:**

```sql
-- Drop EVERYTHING (enums, tables, extensions)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO your_database_user;
GRANT ALL ON SCHEMA public TO public;

-- Drop Prisma migration history
DROP TABLE IF EXISTS "_prisma_migrations";
```

5. **Exit the shell**
6. **Redeploy your application** (it will apply the clean migration)

---

### Option 2: Using psql from Local Machine

If you have `psql` installed:

```bash
# Get your DATABASE_URL from Render dashboard
# Then run:

psql "your_database_url_from_render" << EOF
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO your_database_user;
GRANT ALL ON SCHEMA public TO public;
DROP TABLE IF EXISTS "_prisma_migrations";
EOF
```

Replace `your_database_user` with your actual database username (usually shown in Render dashboard).

---

### Option 3: Manual SQL Cleanup

If the above doesn't work, drop items individually:

```sql
-- 1. Drop all tables
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS developers CASCADE;
DROP TABLE IF EXISTS location_guides CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS property_investment_data CASCADE;
DROP TABLE IF EXISTS favorite_properties CASCADE;
DROP TABLE IF EXISTS property_inquiries CASCADE;
DROP TABLE IF EXISTS user_owned_properties CASCADE;
DROP TABLE IF EXISTS admin_audit_logs CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS property_reservations CASCADE;
DROP TABLE IF EXISTS property_amenities CASCADE;
DROP TABLE IF EXISTS property_documents CASCADE;
DROP TABLE IF EXISTS membership_benefits CASCADE;
DROP TABLE IF EXISTS property_views CASCADE;
DROP TABLE IF EXISTS saved_searches CASCADE;
DROP TABLE IF EXISTS property_price_history CASCADE;
DROP TABLE IF EXISTS contact_requests CASCADE;
DROP TABLE IF EXISTS newsletter_subscriptions CASCADE;
DROP TABLE IF EXISTS user_portfolio_analytics CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS property_tags CASCADE;
DROP TABLE IF EXISTS property_offers CASCADE;
DROP TABLE IF EXISTS property_tours CASCADE;
DROP TABLE IF EXISTS property_comparisons CASCADE;
DROP TABLE IF EXISTS property_reviews CASCADE;
DROP TABLE IF EXISTS property_updates CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS maintenance_requests CASCADE;
DROP TABLE IF EXISTS marketing_campaigns CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS exchange_rates CASCADE;
DROP TABLE IF EXISTS legal_compliance CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS _prisma_migrations CASCADE;

-- 2. Drop all enums
DROP TYPE IF EXISTS "Country" CASCADE;
DROP TYPE IF EXISTS "PropertyStatus" CASCADE;
DROP TYPE IF EXISTS "PropertyAvailabilityStatus" CASCADE;
DROP TYPE IF EXISTS "PropertyVisibility" CASCADE;
DROP TYPE IF EXISTS "MembershipTier" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "ReservationStatus" CASCADE;
DROP TYPE IF EXISTS "PropertyType" CASCADE;
DROP TYPE IF EXISTS "FurnishingStatus" CASCADE;
DROP TYPE IF EXISTS "OwnershipType" CASCADE;
DROP TYPE IF EXISTS "DocumentType" CASCADE;
DROP TYPE IF EXISTS "InvestmentGoal" CASCADE;
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "OfferStatus" CASCADE;
DROP TYPE IF EXISTS "TourStatus" CASCADE;
DROP TYPE IF EXISTS "TourType" CASCADE;
DROP TYPE IF EXISTS "TransactionStatus" CASCADE;
DROP TYPE IF EXISTS "NotificationType" CASCADE;
DROP TYPE IF EXISTS "MaintenanceRequestStatus" CASCADE;
DROP TYPE IF EXISTS "MaintenanceRequestPriority" CASCADE;
DROP TYPE IF EXISTS "CampaignStatus" CASCADE;
DROP TYPE IF EXISTS "ReviewStatus" CASCADE;
```

---

## After Database Reset

### 1. Verify Database is Empty

```sql
-- Check no tables exist
\dt

-- Check no enums exist
\dT

-- Should return empty or just system tables
```

### 2. Redeploy on Render

Your build command will now work:
```bash
pnpm install && npx prisma generate --schema=packages/db/prisma/schema.prisma && npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma && pnpm build
```

The migration will apply successfully because the database is clean!

---

## Complete Step-by-Step for Render

### Step 1: Reset Database (Choose one method)

**Easiest - Render Shell:**
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO render;
GRANT ALL ON SCHEMA public TO public;
```

### Step 2: Manual Redeploy

After resetting database:
1. Go to your Render service dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Watch the logs - migration should apply successfully

### Step 3: Verify

After successful deployment:
```sql
-- Should show 44 tables
\dt

-- Should show 15+ enums
\dT

-- Should show 1 migration applied
SELECT * FROM "_prisma_migrations";
```

---

## Alternative: Delete & Recreate Database

If you want a completely fresh start:

### In Render Dashboard:

1. **Delete the old PostgreSQL database**
   - Go to PostgreSQL service
   - Settings → Delete

2. **Create new PostgreSQL database**
   - Click "New +"
   - Select "PostgreSQL"
   - Choose your plan
   - Create

3. **Update DATABASE_URL in your web service**
   - Go to your web service
   - Environment → DATABASE_URL
   - Paste new connection string from new database

4. **Redeploy**
   - Click "Manual Deploy"
   - Migration will apply to clean database

---

## Quick Copy-Paste Commands

### For Render Shell (Most Common):

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO render;
GRANT ALL ON SCHEMA public TO public;
```

Press Enter, then exit and redeploy.

---

## Troubleshooting

### Error: "must be owner of schema public"
**Solution:** Use superuser or database owner account in Render shell.

### Error: "permission denied"
**Solution:**
```sql
-- Grant permissions to your user first
GRANT ALL ON SCHEMA public TO your_username;
ALTER SCHEMA public OWNER TO your_username;
```

### Error: "cannot drop schema public because other objects depend on it"
**Solution:** Use `CASCADE` (already included in commands above)

---

## Expected Result After Fix

```
✅ Applying migration `20250120000002_init_complete_schema`
✅ The following migration(s) have been applied:

migrations/
  └─ 20250120000002_init_complete_schema/
      └─ migration.sql

✅ Build completed successfully 🎉
```

---

## Summary

1. **Access Render PostgreSQL Shell**
2. **Run:** `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
3. **Grant permissions:** `GRANT ALL ON SCHEMA public TO render;`
4. **Redeploy** your application
5. **Done!** Migration applies to clean database

**Time needed:** 2-3 minutes

---

**Status:** Ready to execute
**Risk:** None (you don't care about data)
**Downtime:** ~2 minutes during migration
