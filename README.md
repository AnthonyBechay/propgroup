# PropGroup - Real Estate Investment Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase account

### Installation
```bash
npm install
```

### Development
```bash
npm run dev:web
```

### Build & Test
```bash
# Test build locally
test-local-build.bat

# Or manually
cd apps/web
npm run build
```

## 📁 Project Structure

```
propgroup/
├── apps/
│   └── web/            # Next.js application
├── packages/
│   ├── config/        # Shared configuration
│   ├── db/           # Database client
│   ├── supabase/     # Supabase utilities
│   └── ui/           # UI components
└── documentation/     # Project documentation
```

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## 📦 Deployment

The project is configured for Vercel deployment. Push to your Git repository and Vercel will automatically deploy.

## 📚 Documentation

See the `/documentation` folder for detailed guides.
