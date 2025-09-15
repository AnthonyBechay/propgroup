# PropGroup Scripts

This folder contains utility scripts for managing the PropGroup development environment.

## Main Scripts

### 🚀 start.js
Starts the development environment (Next.js and optionally Supabase)
```bash
node scripts/start.js
```

### 📦 setup.js
Initial setup - installs dependencies and configures environment
```bash
node scripts/setup.js
```

### 🔨 build.js
Builds all packages in the correct order
```bash
node scripts/build.js
```

### 🧹 clean.js
Removes node_modules, build artifacts, and temporary files
```bash
node scripts/clean.js
```

### 🏥 health-check.js
Checks the health of your development environment
```bash
node scripts/health-check.js
```

### 🔄 generate-types.js
Generates TypeScript types from Supabase schema
```bash
node scripts/generate-types.js
```

### 📝 create-migration.js
Creates a new database migration
```bash
node scripts/create-migration.js
```

## Quick Commands

From the project root, you can run:

```bash
# Start development
npm run dev

# Setup project
npm run setup

# Clean project
npm run clean

# Build packages
npm run build:packages
```

## Archived Scripts

Old and deprecated scripts have been moved to `_archive/` folder for reference.
