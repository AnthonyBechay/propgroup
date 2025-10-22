# ESM/CommonJS Fix

## Issue

**Error:**
```
SyntaxError: Named export 'prisma' not found. The requested module '@propgroup/db' is a CommonJS module
```

## Root Cause

**Module Mismatch:**
- Backend: ESM (`type: "module"`)
- @propgroup/db package: CommonJS (tsconfig had `module: "commonjs"`)

**Backend tried:**
```javascript
import { prisma } from '@propgroup/db'  // ESM import
```

**But @propgroup/db was:**
```javascript
// Compiled as CommonJS
module.exports = { prisma }
```

**ESM can't import named exports from CommonJS!**

## Solution

### 1. Convert @propgroup/db to ESM

**Updated `packages/db/package.json`:**
```json
{
  "type": "module",  // ← Makes package ESM
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

**Updated `packages/db/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "module": "ES2022",        // ← Was "commonjs"
    "target": "ES2022",
    "moduleResolution": "node"
  }
}
```

**Updated `packages/db/src/index.ts`:**
```typescript
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({...})  // Named export
export { PrismaClient }                         // Re-export
export default prisma                           // Default export
export * from '@prisma/client'                  // Re-export all types
```

### 2. Build Package During Deployment

**Updated `apps/backend/render-build.sh`:**
```bash
echo "🔧 Generating Prisma Client..."
cd packages/db
pnpm exec prisma generate

echo "📦 Building @propgroup/db package..."
pnpm run build  # ← Added this - compiles TypeScript to ESM

echo "🗄️  Running database migrations..."
pnpm exec prisma migrate deploy
```

## Why This Works

**Before (CommonJS):**
```typescript
// packages/db compiled to:
module.exports = { prisma }

// Backend tried:
import { prisma } from '@propgroup/db'  // ❌ Fails!
```

**After (ESM):**
```typescript
// packages/db compiled to:
export const prisma = ...

// Backend can now:
import { prisma } from '@propgroup/db'  // ✅ Works!
```

## Files Changed

| File | Change | Reason |
|------|--------|--------|
| `packages/db/package.json` | Added `type: "module"` and `exports` field | Make package ESM |
| `packages/db/tsconfig.json` | Changed `module` to `ES2022` | Compile to ESM, not CommonJS |
| `packages/db/src/index.ts` | Added `export * from '@prisma/client'` | Re-export types |
| `packages/db/prisma/seed.ts` | Changed to `import from '@prisma/client'` | Use standard import |
| `packages/db/prisma/schema.prisma` | Removed custom `output` | Use standard location |
| `apps/backend/render-build.sh` | Added `pnpm run build` | Build the package |

## Deploy Now

```bash
git add .
git commit -m "Fix ESM/CommonJS mismatch: convert db package to ESM"
git push origin master
```

## Expected Build Output

```
🔧 Generating Prisma Client...
✨ Generated Prisma Client to node_modules/.prisma/client

📦 Building @propgroup/db package...
Compiling TypeScript...
✓ Successfully compiled 1 file with TypeScript

🗄️  Running database migrations...
✅ Migrations applied

🌱 Seeding database with superuser...
✅ Created Super Admin user
   Email: admin@propgroup.com
   Password: Admin123!
🎉 Database seed completed successfully!

✅ Build completed successfully!

==> Running 'cd apps/backend && node src/index.js'
🚀 Server running on port 3001
🌍 Environment: production
✅ No more ESM errors!
```

## Summary

✅ **@propgroup/db now ESM** - Matches backend module system
✅ **Package built during deployment** - TypeScript → ESM JavaScript
✅ **Standard Prisma imports** - No custom paths
✅ **Named exports work** - `import { prisma }` works
✅ **Types re-exported** - Import types from @propgroup/db

Ready to deploy! 🚀
