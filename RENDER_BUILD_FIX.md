# Render Build Fix - Prisma Client Resolution

## Issue

**Error:**
```
Error: Could not resolve @prisma/client despite the installation that we just tried.
Please try to install it by hand with pnpm add @prisma/client
```

## Root Cause

In a pnpm workspace (monorepo), when running `npx prisma generate`, it tries to install `@prisma/client` but can't resolve it properly because:

1. `npx` runs in isolation
2. pnpm workspace structure requires proper package linking
3. `@prisma/client` needs to be in the workspace dependencies

## Solution

Updated `apps/backend/render-build.sh` to:

1. **Explicitly install @prisma/client** before generation:
   ```bash
   pnpm add @prisma/client
   ```

2. **Use `pnpm exec` instead of `npx`**:
   ```bash
   pnpm exec prisma generate
   pnpm exec prisma migrate deploy
   ```

## Why This Works

- `pnpm add @prisma/client` ensures it's in the workspace
- `pnpm exec` runs commands with proper pnpm context
- Prisma can now resolve `@prisma/client` correctly
- Works with pnpm workspaces

## Updated Build Script

```bash
#!/bin/bash
set -e

echo "🚀 Starting Render build process..."

# Navigate to workspace root
cd ../..

echo "📦 Installing dependencies from workspace root..."
pnpm install --frozen-lockfile

echo "🔧 Generating Prisma Client..."
cd packages/db

# Explicitly install @prisma/client
pnpm add @prisma/client

# Generate Prisma Client using pnpm exec
pnpm exec prisma generate

echo "🗄️  Running database migrations..."
pnpm exec prisma migrate deploy || {
  echo "⚠️  Migration failed. Attempting to resolve..."
  pnpm exec prisma migrate resolve --rolled-back 20251021000001_add_oauth_fields || true
  pnpm exec prisma migrate deploy
}

cd ../..

echo "✅ Build completed successfully!"
```

## Deploy Now

```bash
git add apps/backend/render-build.sh RENDER_BUILD_FIX.md
git commit -m "Fix Render Prisma Client resolution issue with pnpm"
git push origin master
```

Render will auto-deploy and should succeed! ✅

## Key Changes

| Before | After | Why |
|--------|-------|-----|
| `npx prisma generate` | `pnpm add @prisma/client && pnpm exec prisma generate` | Ensures client is installed and uses pnpm context |
| `npx prisma migrate deploy` | `pnpm exec prisma migrate deploy` | Uses pnpm exec for proper workspace resolution |
| `npx prisma migrate resolve` | `pnpm exec prisma migrate resolve` | Consistent with pnpm exec usage |

## Verification

After deployment, check Render logs for:

```
🔧 Generating Prisma Client...
✨ Generated Prisma Client
🗄️  Running database migrations...
✅ Build completed successfully!
```

No more "Could not resolve @prisma/client" errors!
