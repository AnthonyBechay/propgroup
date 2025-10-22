# PropGroup Monorepo Deployment Configuration

**All deployment configuration is in your repository - no dashboard configuration needed!**

---

## 🎯 Configuration Philosophy

- ✅ **Infrastructure as Code**: All config in Git
- ✅ **No Dashboard Clicks**: Everything defined in files
- ✅ **Reproducible**: Easy to redeploy or migrate
- ✅ **Version Controlled**: Track all deployment changes

---

## 📁 Deployment Configuration Files

### 1. Backend (Render) - `render.yaml`

**Location**: Root of repository

```yaml
# Render Blueprint for PropGroup Backend
version: "1"

services:
  - type: web
    name: propgroup
    runtime: node
    repo: https://github.com/AnthonyBechay/propgroup
    plan: free
    region: frankfurt
    buildCommand: cd apps/backend && chmod +x render-build.sh && ./render-build.sh
    startCommand: cd apps/backend && node src/index.js
    healthCheckPath: /api/health
    autoDeployTrigger: commit
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: propgroup-database
          property: connectionString
      - key: PORT
        value: 3001
      - key: FRONTEND_URL
        value: https://propgroup-web.vercel.app
      - key: BACKEND_URL
        value: https://propgroup.onrender.com
      - key: JWT_SECRET
        generateValue: true
      - key: SESSION_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 7d

databases:
  - name: propgroup-database
    databaseName: propgroup_database
    user: propgroup_database_user
    plan: free
    region: frankfurt
    ipAllowList:
      - source: 0.0.0.0/0
        description: everywhere
    postgresMajorVersion: "17"
```

**What it does:**
- Creates backend service in Frankfurt
- Links to existing database
- Auto-generates JWT/Session secrets
- Sets all environment variables
- Enables auto-deploy on push to master

---

### 2. Frontend (Vercel) - `vercel.json`

**Location**: Root of repository

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm run vercel-build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./apps/web ./packages/db ./packages/ui ./packages/config",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://propgroup.onrender.com/api"
  },
  "build": {
    "env": {
      "DATABASE_URL": "postgresql://placeholder:placeholder@localhost:5432/placeholder"
    }
  }
}
```

**What it does:**
- Uses monorepo build script
- Sets API URL automatically
- Provides placeholder DATABASE_URL for build
- Only rebuilds when relevant files change
- No dashboard configuration needed

---

### 3. Backend Build Script - `apps/backend/render-build.sh`

**Location**: `apps/backend/render-build.sh`

```bash
#!/bin/bash
set -e

echo "🚀 Starting Render build process..."

# We're already in apps/backend, navigate to workspace root
cd ../..

echo "📦 Installing dependencies from workspace root..."
pnpm install --frozen-lockfile

echo "🔧 Generating Prisma Client..."
cd packages/db
npx prisma generate

echo "🗄️  Running database migrations..."
npx prisma migrate deploy || {
  echo "⚠️  Migration failed. Attempting to resolve..."
  npx prisma migrate resolve --rolled-back 20251021000001_add_oauth_fields || true
  npx prisma migrate deploy
}

cd ../..

echo "✅ Build completed successfully!"
```

**What it does:**
- Installs all dependencies from workspace root
- Generates Prisma Client
- Runs database migrations
- Auto-fixes the stuck migration
- Works in monorepo structure

---

### 4. Frontend Build Script - `scripts/vercel-build-monorepo.js`

**Location**: `scripts/vercel-build-monorepo.js`

**What it does:**
- Builds all shared packages (config, db, ui)
- Generates Prisma Client with placeholder DB
- Builds Next.js application
- Handles monorepo dependencies
- Creates fallbacks for missing packages

---

## 🚀 How to Deploy

### Initial Setup (One Time)

#### Backend (Render):

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin master
   ```

2. **Go to Render Dashboard**: https://dashboard.render.com

3. **Create Blueprint**:
   - Click **New +** → **Blueprint**
   - Connect your GitHub repo
   - Render reads `render.yaml` automatically
   - Click **Apply**
   - Everything is configured from the file!

4. **No environment variable setup needed** - All in `render.yaml`!

#### Frontend (Vercel):

1. **Go to Vercel Dashboard**: https://vercel.com/new

2. **Import Repository**:
   - Select your GitHub repo
   - Vercel reads `vercel.json` automatically
   - Click **Deploy**
   - Everything is configured from the file!

3. **No environment variable setup needed** - All in `vercel.json`!

---

## 🔄 Continuous Deployment

After initial setup:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin master
```

**What happens:**
- ✅ Render auto-deploys backend (reads render.yaml)
- ✅ Vercel auto-deploys frontend (reads vercel.json)
- ✅ No manual steps needed
- ✅ All config from repository

---

## 🏗️ Monorepo Build Process

### Backend Build Flow:

```
1. Render runs: cd apps/backend && chmod +x render-build.sh && ./render-build.sh
2. Script navigates to workspace root: cd ../..
3. Install all dependencies: pnpm install --frozen-lockfile
4. Generate Prisma Client: cd packages/db && npx prisma generate
5. Run migrations: npx prisma migrate deploy
6. Handle stuck migration automatically
7. Return to root: cd ../..
8. Render runs: cd apps/backend && node src/index.js
```

### Frontend Build Flow:

```
1. Vercel runs: pnpm install --frozen-lockfile
2. Vercel runs: pnpm run vercel-build
3. Script: scripts/vercel-build-monorepo.js
4. Build packages: config → db → ui
5. Generate Prisma Client (with placeholder DB from vercel.json)
6. Build Next.js: apps/web
7. Output to: apps/web/.next
8. Deploy to CDN
```

---

## 🔧 Environment Variables

### Backend (All in render.yaml)

| Variable | Source | Description |
|----------|--------|-------------|
| `NODE_ENV` | Hardcoded | `production` |
| `DATABASE_URL` | From database | Auto-linked |
| `PORT` | Hardcoded | `3001` |
| `FRONTEND_URL` | Hardcoded | Vercel URL |
| `BACKEND_URL` | Hardcoded | Render URL |
| `JWT_SECRET` | Auto-generated | Random string |
| `SESSION_SECRET` | Auto-generated | Random string |
| `JWT_EXPIRES_IN` | Hardcoded | `7d` |

**To add Google OAuth:**
Add to `render.yaml`:
```yaml
      - key: GOOGLE_CLIENT_ID
        value: your-client-id.apps.googleusercontent.com
      - key: GOOGLE_CLIENT_SECRET
        value: GOCSPX-your-secret
      - key: GOOGLE_CALLBACK_URL
        value: https://propgroup.onrender.com/api/auth/google/callback
```

### Frontend (All in vercel.json)

| Variable | Source | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_API_URL` | Hardcoded | Backend API URL |
| `DATABASE_URL` | Hardcoded (placeholder) | For Prisma build only |

**To add Google Analytics:**
Add to `vercel.json`:
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://propgroup.onrender.com/api",
    "NEXT_PUBLIC_GA_MEASUREMENT_ID": "G-XXXXXXXXXX"
  }
}
```

---

## 📝 Updating Configuration

### Change Backend Settings:

1. Edit `render.yaml`
2. Commit and push
3. Render auto-updates

**Example - Change region:**
```yaml
region: oregon  # Change from frankfurt
```

**Example - Add environment variable:**
```yaml
envVars:
  - key: MY_NEW_VAR
    value: my-value
```

### Change Frontend Settings:

1. Edit `vercel.json`
2. Commit and push
3. Vercel auto-updates

**Example - Change API URL:**
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://new-backend-url.com/api"
  }
}
```

---

## 🎯 Benefits of This Setup

✅ **Infrastructure as Code**
- All config in Git
- Easy to review changes
- Version controlled

✅ **Reproducible**
- Can recreate entire deployment from repo
- Easy to migrate to different providers
- No "click memory" needed

✅ **Team Friendly**
- Everyone sees config in code
- PR reviews include infrastructure changes
- No secret dashboard settings

✅ **No Manual Steps**
- Push code → Auto-deploy
- No dashboard configuration
- No environment variable clicking

✅ **Monorepo Optimized**
- Smart build scripts
- Only rebuilds what changed (Vercel)
- Shared package handling

---

## 🔍 Troubleshooting

### Backend Build Fails

**Check `render.yaml`:**
```yaml
buildCommand: cd apps/backend && chmod +x render-build.sh && ./render-build.sh
startCommand: cd apps/backend && node src/index.js
```

**Check Render logs for:**
- `pnpm install` errors
- `npx prisma generate` errors
- Migration errors

**Fix:**
- Ensure `pnpm-lock.yaml` is committed
- Run migration fix script locally first
- Check DATABASE_URL is accessible

### Frontend Build Fails

**Check `vercel.json`:**
```json
{
  "buildCommand": "pnpm run vercel-build",
  "outputDirectory": "apps/web/.next"
}
```

**Check Vercel logs for:**
- Package build errors
- TypeScript errors
- Missing dependencies

**Fix:**
- Run `pnpm run vercel-build` locally
- Check `scripts/vercel-build-monorepo.js`
- Ensure placeholder DATABASE_URL is set

### Environment Variables Not Working

**Backend:**
- Check `render.yaml` has the variable
- Commit and push changes
- Redeploy service

**Frontend:**
- Check `vercel.json` has the variable
- Must start with `NEXT_PUBLIC_` for client-side
- Commit and push changes
- Redeploy

---

## 📚 Configuration File Reference

| File | Purpose | Platform |
|------|---------|----------|
| `render.yaml` | Backend deployment config | Render |
| `vercel.json` | Frontend deployment config | Vercel |
| `apps/backend/render-build.sh` | Backend build script | Render |
| `scripts/vercel-build-monorepo.js` | Frontend build script | Vercel |
| `package.json` | Workspace config | Both |
| `pnpm-workspace.yaml` | Monorepo structure | Both |

---

## 🚀 Quick Reference

### Deploy Backend
```bash
git add render.yaml apps/backend/
git commit -m "Update backend config"
git push
# Render auto-deploys
```

### Deploy Frontend
```bash
git add vercel.json apps/web/
git commit -m "Update frontend config"
git push
# Vercel auto-deploys
```

### Add Environment Variable (Backend)
```yaml
# In render.yaml
envVars:
  - key: NEW_VAR
    value: new-value
```

### Add Environment Variable (Frontend)
```json
// In vercel.json
{
  "env": {
    "NEXT_PUBLIC_NEW_VAR": "new-value"
  }
}
```

---

## ✨ Summary

Your PropGroup monorepo is configured with:

- ✅ All deployment config in repository
- ✅ No dashboard configuration needed
- ✅ Auto-deployment on push
- ✅ Infrastructure as Code
- ✅ Monorepo-optimized builds
- ✅ Environment variables in config files
- ✅ Reproducible deployments

**Push to deploy!** 🚀
