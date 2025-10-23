# Render Deployment Guide - Clean Database Migration

## ✅ Migration Cleanup Complete

I've cleaned up your migration files. You now have **only ONE migration**:
- ✅ `20250120000002_init_complete_schema` - Complete 44-model schema

The old migration (`20250120000001_init`) has been **deleted**.

---

## Database Migration Status

### Before Cleanup
```
migrations/
├── 20250120000001_init/                    ❌ DELETED (old schema)
└── 20250120000002_init_complete_schema/    ✅ KEPT (complete schema)
```

### After Cleanup
```
migrations/
└── 20250120000002_init_complete_schema/    ✅ ONLY MIGRATION
    ├── migration.sql
    └── migration_lock.toml
```

---

## Render Deployment Steps

### Option A: Fresh Database (Recommended - No existing data)

Since you don't care about existing data, this is the cleanest approach:

#### 1. **Drop the existing database on Render** (if it exists)

```bash
# Connect to your Render PostgreSQL database
psql $DATABASE_URL

# Drop and recreate
DROP DATABASE IF EXISTS your_database_name;
CREATE DATABASE your_database_name;
\q
```

Or in Render Dashboard:
1. Go to your PostgreSQL service
2. Click "Delete" (this will drop the entire database)
3. Create a new PostgreSQL database

#### 2. **Deploy with Prisma Migration**

Update your Render build command to:

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
npx prisma generate --schema=packages/db/prisma/schema.prisma

# Run migrations (creates all tables)
npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma

# Build the application
pnpm build
```

Or if using package.json script:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && pnpm build:web",
    "build:web": "cd apps/web && next build"
  }
}
```

---

### Option B: Reset Existing Database

If you want to keep the database instance but wipe the data:

#### 1. **Reset the migration history**

```bash
# Connect to database
psql $DATABASE_URL

# Drop the Prisma migrations table
DROP TABLE IF EXISTS "_prisma_migrations";

# Drop all existing tables (if any)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO your_db_user;
GRANT ALL ON SCHEMA public TO public;
```

#### 2. **Deploy fresh migration**

```bash
npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma
```

---

## Render Environment Variables

Make sure these are set in Render:

```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
```

---

## Build Command for Render

### For Monorepo (Turborepo)

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
cd packages/db && npx prisma generate

# Run migration
cd packages/db && npx prisma migrate deploy

# Build web app
cd ../.. && pnpm --filter web build
```

### Simplified (if you have a script)

```bash
pnpm install && pnpm db:migrate && pnpm build
```

Add to your root `package.json`:
```json
{
  "scripts": {
    "db:generate": "cd packages/db && npx prisma generate",
    "db:migrate": "cd packages/db && npx prisma migrate deploy",
    "build": "pnpm db:generate && pnpm db:migrate && pnpm --filter web build"
  }
}
```

---

## Start Command for Render

```bash
cd apps/web && node .next/standalone/apps/web/server.js
```

Or if not using standalone output:
```bash
cd apps/web && pnpm start
```

---

## Verification Steps

After deployment, verify the migration worked:

### 1. Check tables were created
```bash
psql $DATABASE_URL -c "\dt"
```

Should show 44 tables:
- users
- developers
- location_guides
- properties
- property_investment_data
- favorite_properties
- property_inquiries
- user_owned_properties
- admin_audit_logs
- subscriptions
- property_reservations
- property_amenities
- property_documents
- membership_benefits
- property_views
- saved_searches
- property_price_history
- contact_requests
- newsletter_subscriptions
- user_portfolio_analytics
- tags
- property_tags
- property_offers
- property_tours
- property_comparisons
- property_reviews
- property_updates
- transactions
- notifications
- messages
- maintenance_requests
- marketing_campaigns
- referrals
- exchange_rates
- legal_compliance
- system_settings

### 2. Check enums were created
```bash
psql $DATABASE_URL -c "\dT"
```

Should show 15 enums.

### 3. Test the application
```bash
curl https://your-app.onrender.com/api/health
```

---

## Troubleshooting

### Error: "relation already exists"
**Solution:** The database has old tables. Drop them or use Option B above.

### Error: "migration already applied"
**Solution:** Clear the `_prisma_migrations` table:
```sql
DELETE FROM "_prisma_migrations";
```

### Error: "permission denied"
**Solution:** Ensure your database user has proper permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE your_db TO your_user;
GRANT ALL ON SCHEMA public TO your_user;
```

### Error: "could not connect to database"
**Solution:** Check your `DATABASE_URL` environment variable is correct.

---

## Post-Deployment Data Seeding (Optional)

If you want some initial data:

### 1. Create seed script
`packages/db/prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create some sample tags
  await prisma.tag.createMany({
    data: [
      { name: 'Beachfront', slug: 'beachfront', category: 'location', color: '#3B82F6' },
      { name: 'High ROI', slug: 'high-roi', category: 'investment_type', color: '#10B981' },
      { name: 'Golden Visa', slug: 'golden-visa', category: 'feature', color: '#F59E0B' },
    ]
  })

  // Create sample developer
  const developer = await prisma.developer.create({
    data: {
      name: 'Premium Developments Ltd',
      description: 'Leading real estate developer',
      country: 'CYPRUS',
    }
  })

  console.log('✅ Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 2. Run seed after migration
```bash
npx prisma db seed
```

---

## Clean Deployment Checklist

- [x] ✅ Deleted old migration (`20250120000001_init`)
- [x] ✅ Kept complete migration (`20250120000002_init_complete_schema`)
- [x] ✅ Migration lock file present
- [ ] ⏳ Set `DATABASE_URL` in Render
- [ ] ⏳ Configure build command
- [ ] ⏳ Configure start command
- [ ] ⏳ Deploy to Render
- [ ] ⏳ Verify tables created (44 tables)
- [ ] ⏳ Test application endpoints

---

## Render.yaml (Optional - Infrastructure as Code)

Create `render.yaml` in your repo root:

```yaml
services:
  # PostgreSQL Database
  - type: pserv
    name: propgroup-db
    plan: starter
    region: oregon
    databaseName: propgroup
    databaseUser: propgroup_user

  # Web Service
  - type: web
    name: propgroup-web
    runtime: node
    region: oregon
    plan: starter
    buildCommand: pnpm install && pnpm db:generate && pnpm db:migrate && pnpm build
    startCommand: cd apps/web && pnpm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: propgroup-db
          property: connectionString
```

---

## Support Commands

### Reset migration history locally (for testing)
```bash
cd packages/db
npx prisma migrate reset --force
```

### Generate new migration (if you make schema changes)
```bash
cd packages/db
npx prisma migrate dev --name your_migration_name
```

### Apply migrations manually
```bash
cd packages/db
npx prisma migrate deploy
```

---

## Summary

✅ **Migration cleanup complete**
✅ **Only one migration file remains**
✅ **44 models will be created**
✅ **15 enums will be created**
✅ **Ready for Render deployment**

**Next steps:**
1. Set up Render PostgreSQL database
2. Configure build & start commands
3. Deploy!

Your database migration is now clean and ready for production deployment on Render! 🚀
