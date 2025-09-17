# Development Scripts

## Available Scripts

### Development
```bash
# Start development server
start.bat          # Windows
start.sh          # Unix/Mac

# Or use npm
npm run dev:web
```

### Testing Build
```bash
# Test production build locally
test-local-build.bat

# Or manually from apps/web
npm run build:test
```

### Quick Start
```bash
# Quick project setup
quick-start.bat
```

### Fresh Install
```bash
# Clean install of all dependencies
fresh-install.bat
```

## NPM Scripts

### From root directory:
- `npm run dev:web` - Start Next.js development server
- `npm run build` - Build all packages and web app
- `npm run build:packages` - Build only packages

### From apps/web directory:
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run build:test` - Clean build test
- `npm run build:clean` - Full clean build with packages
- `npm start` - Start production server

## Deployment
Push to Git and Vercel auto-deploys:
```bash
git add .
git commit -m "your changes"
git push
```
