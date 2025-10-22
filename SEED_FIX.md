# Seed Script Fix

## Issue

**Error:**
```
Error: Cannot find module '../dist/generated'
Require stack:
- /opt/render/project/src/packages/db/prisma/seed.ts
```

## Root Cause

The seed script was importing from a custom Prisma output location:
```typescript
import { PrismaClient } from '../dist/generated'  // ❌ Wrong path
```

But Prisma schema was generating to:
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../dist"                             // Generates to ../dist
}
```

Mismatch between:
- Seed expected: `../dist/generated`
- Prisma outputs to: `../dist`

## Solution

### 1. Use Standard Prisma Client Import

**Updated `packages/db/prisma/seed.ts`:**

```typescript
// Before:
import { PrismaClient } from '../dist/generated'
import { Country, PropertyStatus, InvestmentGoal, Role } from '../dist/generated'

// After:
import { PrismaClient } from '@prisma/client'
import { Country, PropertyStatus, InvestmentGoal, Role } from '@prisma/client'
```

### 2. Use Standard Prisma Output Location

**Updated `packages/db/prisma/schema.prisma`:**

```prisma
# Before:
generator client {
  provider = "prisma-client-js"
  output   = "../dist"
}

# After (standard location):
generator client {
  provider = "prisma-client-js"
  # No custom output - uses default node_modules/.prisma/client
}
```

## Why This Works

**Standard Prisma Workflow:**
```
prisma generate
  ↓
Generates to: node_modules/.prisma/client
  ↓
Import: from '@prisma/client'
  ↓
Works everywhere (backend, seed scripts, etc.)
```

**Benefits:**
✅ No custom paths to maintain
✅ Works in monorepo with pnpm
✅ Standard Prisma behavior
✅ Seed script works in any environment
✅ No dist folder confusion

## Deploy Now

```bash
git add packages/db/prisma/seed.ts packages/db/prisma/schema.prisma SEED_FIX.md
git commit -m "Fix seed script: use standard @prisma/client import"
git push origin master
```

## Expected Output After Fix

```
🌱 Seeding database with superuser...
🌱 Starting database seed...
✅ Created Super Admin user
   Email: admin@propgroup.com
   Password: Admin123!
   ⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN!

✅ Created 3 developers
✅ Created 3 location guides
✅ Created 6 properties with investment data
✅ Created Test User
   Email: user@propgroup.com
   Password: User123!
✅ Added 2 favorite properties for test user
✅ Created sample inquiry

🎉 Database seed completed successfully!

📝 You can now login with:
   Admin: admin@propgroup.com / Admin123!
   User:  user@propgroup.com / User123!

✅ Build completed successfully!
```

## Files Changed

| File | Change | Reason |
|------|--------|--------|
| `packages/db/prisma/seed.ts` | Use `@prisma/client` import | Standard Prisma import |
| `packages/db/prisma/schema.prisma` | Remove custom output path | Use default location |

## Verification

After deployment:
1. Check Render logs for successful seed
2. Try logging in: `admin@propgroup.com` / `Admin123!`
3. Change password immediately!

## Summary

✅ **Fixed seed import** - Use standard `@prisma/client`
✅ **Removed custom output** - Use default Prisma location
✅ **Seed will work** - No more module not found errors

The build shows "Build successful 🎉" but seed failed. This fix ensures seed completes successfully!
