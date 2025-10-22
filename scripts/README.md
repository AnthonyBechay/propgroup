# PropGroup Scripts

Automated scripts for building, cleaning, and managing the PropGroup monorepo.

## Quick Reference

```bash
# Development
pnpm run dev              # Start both backend and frontend
pnpm run dev:backend      # Start backend only
pnpm run dev:frontend     # Start frontend only

# Building
pnpm run build            # Build all packages and applications
pnpm run build:packages   # Build shared packages only
pnpm run build:web        # Build frontend for production
pnpm run build:backend    # Build backend for production

# Cleaning
pnpm run clean            # Clean all build artifacts and node_modules

# Setup
pnpm run setup            # Initial project setup

# Deployment
pnpm run vercel-build     # Build for Vercel deployment (frontend)
```

---

## Available Scripts

### 📦 Development Scripts

#### `start.js`
Starts both backend and frontend development servers concurrently.
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

```bash
pnpm run dev
```

#### `start-backend.js`
Starts only the backend API server with hot reload.

```bash
pnpm run dev:backend
```

#### `start-frontend.js`
Starts only the frontend Next.js dev server.

```bash
pnpm run dev:frontend
```

---

### 🔨 Build Scripts

#### `build.js`
Master build script that builds everything in the correct order:
1. Builds all shared packages (config, db, ui)
2. Builds applications (backend check, web build)

```bash
pnpm run build
```

#### `build-packages.js`
Builds only the shared packages (config, db, ui).

```bash
pnpm run build:packages
```

#### `vercel-build-monorepo.js`
Vercel-specific build script optimized for monorepo deployment.

```bash
pnpm run vercel-build
```

Features:
- Smart fallback for missing packages
- Placeholder database URL for frontend builds
- Vercel-optimized output directory handling

---

### 🧹 Utility Scripts

#### `clean.js`
Removes all build artifacts, node_modules, and temporary files.

```bash
pnpm run clean
```

#### `setup.js`
Initial project setup script.

```bash
pnpm run setup
```

---

## Build Strategy

### Development Workflow

```
1. Clone repo
2. pnpm install
3. pnpm run build:packages   # Build shared packages
4. pnpm run dev              # Start development servers
```

### Production Build Workflow

```
1. pnpm run clean            # Clean everything
2. pnpm install              # Fresh install
3. pnpm run build            # Build everything
4. Deploy
```

### Monorepo Build Order

```
packages/config     # First (no dependencies)
    ↓
packages/db         # Second (needs config)
    ↓
packages/ui         # Third (needs config, db)
    ↓
apps/backend        # Uses: db, config
apps/web            # Uses: db, config, ui
```

---

## Deployment Scripts

### Backend (Render)

Located in `apps/backend/`:

```bash
# Build script (runs on Render)
pnpm run render-build

# Start script (runs on Render)
pnpm run render-start
```

See: [DEPLOYMENT.md](../DEPLOYMENT.md)

### Frontend (Vercel)

```bash
# Build script (runs on Vercel)
pnpm run vercel-build
```

See: [DEPLOYMENT.md](../DEPLOYMENT.md)

---

## Troubleshooting

### "Module not found" errors

```bash
pnpm run build:packages
```

### Prisma Client errors

```bash
cd packages/db
pnpm run db:generate
```

### Build cache issues

```bash
pnpm run clean
pnpm install
pnpm run build
```

---

## Related Documentation

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Full deployment guide
- [ENV_VARIABLES.md](../ENV_VARIABLES.md) - Environment variables
- [README.md](../README.md) - Project overview
