# PropGroup Infrastructure as Code

**Complete infrastructure configuration - Zero dashboard setup required!**

---

## 🎯 Infrastructure Philosophy

- ✅ **100% Infrastructure as Code**: Every setting in Git
- ✅ **Zero Dashboard Configuration**: No manual env var setup
- ✅ **Reproducible**: Delete and recreate anytime
- ✅ **Version Controlled**: Track all infrastructure changes
- ✅ **Team Ready**: Everyone has same config

---

## 📊 Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│  Users Worldwide                                         │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│  Vercel (Global CDN)                                     │
│  https://propgroup-web.vercel.app                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Next.js Frontend                                   │  │
│  │ Config: vercel.json                                │  │
│  │ • NEXT_PUBLIC_API_URL (runtime)                    │  │
│  │ • DATABASE_URL (build-time only)                   │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ HTTPS API Calls
                         ▼
┌──────────────────────────────────────────────────────────┐
│  Render (Frankfurt, EU Central)                          │
│  https://propgroup.onrender.com                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Express Backend API                                │  │
│  │ Config: render.yaml                                │  │
│  │ • DATABASE_URL (internal)                          │  │
│  │ • JWT_SECRET (auto-generated)                      │  │
│  │ • SESSION_SECRET (auto-generated)                  │  │
│  │ • FRONTEND_URL, BACKEND_URL                        │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ Internal Connection (dpg-xxx)
                         ▼
┌──────────────────────────────────────────────────────────┐
│  Render PostgreSQL (Frankfurt, EU Central)               │
│  Config: render.yaml (databases section)                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │ propgroup_database (PostgreSQL v17)                │  │
│  │ • Internal: dpg-xxx (Render services only)         │  │
│  │ • External: dpg-xxx.frankfurt-postgres.render.com  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Infrastructure Files

### 1. Backend + Database: `render.yaml`

**Location**: Root of repository

**Complete Configuration**:

```yaml
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

**What it defines**:
- ✅ Backend service configuration
- ✅ Database configuration
- ✅ All environment variables
- ✅ Build and start commands
- ✅ Health check endpoint
- ✅ Auto-deploy settings
- ✅ Region (Frankfurt)

---

### 2. Frontend: `vercel.json`

**Location**: Root of repository

**Complete Configuration**:

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
      "DATABASE_URL": "postgresql://propgroup_database_user:N47ZWO9oy6BsGhYdZWd7tqBivUfgCYeh@dpg-d3ro26jipnbc73epphb0-a.frankfurt-postgres.render.com/propgroup_database"
    }
  }
}
```

**What it defines**:
- ✅ Build configuration
- ✅ Output directory
- ✅ Runtime environment variables
- ✅ Build-time environment variables
- ✅ Smart rebuild rules
- ✅ Framework settings

---

## 🔑 Environment Variables Strategy

### Backend (Render)

| Variable | Type | Source | Purpose |
|----------|------|--------|---------|
| `NODE_ENV` | Static | `render.yaml` | Set to production |
| `DATABASE_URL` | Dynamic | Database link | Internal DB connection |
| `PORT` | Static | `render.yaml` | Server port (3001) |
| `FRONTEND_URL` | Static | `render.yaml` | CORS whitelist |
| `BACKEND_URL` | Static | `render.yaml` | OAuth callbacks |
| `JWT_SECRET` | Generated | `render.yaml` | Auth tokens |
| `SESSION_SECRET` | Generated | `render.yaml` | Session signing |
| `JWT_EXPIRES_IN` | Static | `render.yaml` | Token lifetime |

**How it works**:
```yaml
# Static value
- key: NODE_ENV
  value: production

# From database
- key: DATABASE_URL
  fromDatabase:
    name: propgroup-database
    property: connectionString

# Auto-generated (64-char random string)
- key: JWT_SECRET
  generateValue: true
```

### Frontend (Vercel)

| Variable | Type | When Available | Purpose |
|----------|------|----------------|---------|
| `NEXT_PUBLIC_API_URL` | Runtime | Browser + Build | API endpoint |
| `DATABASE_URL` | Build-only | Build only | Prisma codegen |

**How it works**:
```json
{
  "env": {
    // Available at runtime (browser)
    "NEXT_PUBLIC_API_URL": "https://propgroup.onrender.com/api"
  },
  "build": {
    "env": {
      // Only available during build
      "DATABASE_URL": "postgresql://..."
    }
  }
}
```

---

## 🔐 Database URLs Explained

### Two Different URLs for Different Purposes

#### **Internal URL** (Backend uses this)
```
postgresql://propgroup_database_user:N47ZWO9oy6BsGhYdZWd7tqBivUfgCYeh@dpg-d3ro26jipnbc73epphb0-a/propgroup_database
```

- ✅ Only accessible from Render services
- ✅ Faster (internal network)
- ✅ More secure (not exposed to internet)
- ✅ Used by backend at runtime
- ✅ Auto-configured via `fromDatabase` in render.yaml

#### **External URL** (Vercel uses this)
```
postgresql://propgroup_database_user:N47ZWO9oy6BsGhYdZWd7tqBivUfgCYeh@dpg-d3ro26jipnbc73epphb0-a.frankfurt-postgres.render.com/propgroup_database
```

- ✅ Accessible from anywhere
- ✅ Used by Vercel during build only
- ✅ Never used at runtime by frontend
- ✅ Only for Prisma Client generation
- ✅ Hardcoded in vercel.json

**Why Frontend Needs DATABASE_URL**:
```javascript
// During Vercel build, Prisma generates TypeScript types:
// packages/db/prisma/schema.prisma → packages/db/dist/index.d.ts

// Frontend imports these types (NOT the database itself):
import { User, Property } from '@propgroup/db'

// At runtime, frontend NEVER connects to database
// All database queries go through backend API
```

---

## 🚀 Deployment Process

### Initial Setup (One Time)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Complete infrastructure configuration"
git push origin master
```

#### Step 2: Deploy Backend (Render)
1. Go to: https://dashboard.render.com
2. Click **New +** → **Blueprint**
3. Connect your repo
4. Render reads `render.yaml`
5. Click **Apply**
6. **Done!** All env vars configured from file

#### Step 3: Deploy Frontend (Vercel)
1. Go to: https://vercel.com/new
2. Import your repo
3. Vercel reads `vercel.json`
4. Click **Deploy**
5. **Done!** All env vars configured from file

### Continuous Deployment

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin master

# Automatic deployments:
# ✅ Render deploys backend (reads render.yaml)
# ✅ Vercel deploys frontend (reads vercel.json)
# ✅ Zero manual steps
```

---

## 📝 Updating Infrastructure

### Change Backend Configuration

**Example: Add Google OAuth**

Edit `render.yaml`:
```yaml
envVars:
  # ... existing vars ...
  - key: GOOGLE_CLIENT_ID
    value: your-client-id.apps.googleusercontent.com
  - key: GOOGLE_CLIENT_SECRET
    value: GOCSPX-your-client-secret
  - key: GOOGLE_CALLBACK_URL
    value: https://propgroup.onrender.com/api/auth/google/callback
```

Commit and push:
```bash
git add render.yaml
git commit -m "Add Google OAuth configuration"
git push
# Render auto-deploys with new config
```

### Change Frontend Configuration

**Example: Add Google Analytics**

Edit `vercel.json`:
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://propgroup.onrender.com/api",
    "NEXT_PUBLIC_GA_MEASUREMENT_ID": "G-XXXXXXXXXX"
  }
}
```

Commit and push:
```bash
git add vercel.json
git commit -m "Add Google Analytics"
git push
# Vercel auto-deploys with new config
```

---

## 🔍 Configuration Verification

### Verify render.yaml

```bash
# Check syntax
cat render.yaml

# Verify DATABASE_URL uses fromDatabase
grep -A 3 "DATABASE_URL" render.yaml
# Should show:
#   - key: DATABASE_URL
#     fromDatabase:
#       name: propgroup-database
#       property: connectionString

# Verify auto-generated secrets
grep "generateValue" render.yaml
# Should show JWT_SECRET and SESSION_SECRET
```

### Verify vercel.json

```bash
# Check syntax
cat vercel.json

# Verify API URL
grep "NEXT_PUBLIC_API_URL" vercel.json
# Should show: "NEXT_PUBLIC_API_URL": "https://propgroup.onrender.com/api"

# Verify build DATABASE_URL
grep -A 1 "build" vercel.json
# Should show external DATABASE_URL
```

---

## 🆘 Troubleshooting

### Backend: Missing Environment Variables

**Problem**: Variable not available in backend

**Solution**: Check `render.yaml`
```yaml
envVars:
  - key: YOUR_VAR
    value: your-value
```

Then commit and push to redeploy.

### Frontend: Environment Variable Not Working

**Problem**: Variable undefined in browser

**Check**:
1. Variable must start with `NEXT_PUBLIC_` for browser access
2. Must be in `env` section (not `build.env`)
3. Must commit and redeploy

```json
{
  "env": {
    "NEXT_PUBLIC_YOUR_VAR": "value"  // ✅ Browser accessible
  },
  "build": {
    "env": {
      "YOUR_VAR": "value"  // ❌ Build-time only, not in browser
    }
  }
}
```

### Prisma Generation Fails on Vercel

**Problem**: `Error: P1001: Can't reach database server`

**Solution**: Check `vercel.json` has external DATABASE_URL
```json
{
  "build": {
    "env": {
      "DATABASE_URL": "postgresql://...frankfurt-postgres.render.com/..."
    }
  }
}
```

Must use **external** URL (with `.frankfurt-postgres.render.com`), not internal.

---

## ✅ Infrastructure Checklist

### Before First Deployment:

#### render.yaml
- [ ] Service name matches your repo
- [ ] Region set to `frankfurt`
- [ ] Build command includes path to script
- [ ] DATABASE_URL uses `fromDatabase`
- [ ] JWT_SECRET has `generateValue: true`
- [ ] SESSION_SECRET has `generateValue: true`
- [ ] FRONTEND_URL matches Vercel URL
- [ ] Database section defines PostgreSQL v17

#### vercel.json
- [ ] Build command: `pnpm run vercel-build`
- [ ] Output directory: `apps/web/.next`
- [ ] `NEXT_PUBLIC_API_URL` set
- [ ] Build `DATABASE_URL` is **external** URL
- [ ] Ignore command configured

#### Repository
- [ ] `render.yaml` committed
- [ ] `vercel.json` committed
- [ ] `apps/backend/render-build.sh` executable
- [ ] `pnpm-lock.yaml` committed
- [ ] No `.env` files committed (only `.env.example`)

---

## 📊 Infrastructure Benefits

| Benefit | Traditional Approach | IaC Approach (Ours) |
|---------|---------------------|---------------------|
| **Setup Time** | 30-60 min clicking | 5 min (just connect repo) |
| **Environment Variables** | Add 10+ vars manually | All in config files |
| **Reproducibility** | Document steps, hope for best | Git clone → Deploy |
| **Team Onboarding** | Share dashboard access, explain | Read config files |
| **Change Tracking** | Hope someone documented | Git history |
| **Disaster Recovery** | Reconstruct from memory | Redeploy from repo |
| **Multi-Environment** | Duplicate manual steps | Copy config, change values |

---

## 🎯 Summary

Your PropGroup infrastructure is:

✅ **100% Code-Based**
- `render.yaml` - Complete backend + database config
- `vercel.json` - Complete frontend config
- Zero dashboard setup needed

✅ **Version Controlled**
- All changes tracked in Git
- PR reviews include infrastructure
- Easy rollback

✅ **Reproducible**
- Delete everything → Reconnect repos → Back online
- Same config every time
- No manual steps

✅ **Team Ready**
- Everyone has same config
- No secret dashboard knowledge
- Self-documenting

✅ **Secure**
- Secrets auto-generated by platforms
- Database URLs environment-specific
- Internal URLs for backend (faster, safer)
- External URLs only where needed (Vercel build)

---

## 🚀 Quick Reference

```bash
# Deploy everything
git add render.yaml vercel.json
git commit -m "Update infrastructure"
git push origin master

# Add backend env var
# Edit render.yaml → commit → push

# Add frontend env var
# Edit vercel.json → commit → push

# View current config
cat render.yaml
cat vercel.json

# Verify configuration
grep -A 3 "DATABASE_URL" render.yaml
grep "NEXT_PUBLIC_API_URL" vercel.json
```

---

**Your infrastructure is now fully code-based and version controlled!** 🎉

Push to deploy! 🚀
