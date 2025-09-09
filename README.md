# PropGroup - Real Estate Investment Platform

## 🏗️ Architecture Overview

PropGroup is a modern real estate investment platform built with:

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Mobile**: Capacitor for iOS/Android native apps
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Infrastructure**: Vercel (Frontend) + Supabase Cloud (Backend)
- **Package Manager**: npm workspaces (monorepo)

## 📁 Project Structure

```
propgroup/
├── apps/
│   ├── web/                 # Next.js web application
│   └── mobile-capacitor/     # Capacitor mobile app
├── packages/
│   ├── supabase/            # Shared Supabase client & utilities
│   ├── ui/                  # Shared UI components
│   └── config/              # Shared configuration
├── supabase/
│   ├── migrations/          # Database migrations
│   ├── functions/           # Edge functions
│   ├── seed.sql            # Seed data
│   └── config.toml         # Supabase configuration
├── scripts/                 # Utility scripts
└── package.json            # Root monorepo configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Supabase account (free tier available)
- Vercel account (for deployment)

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd propgroup

# Run the setup wizard
npm run setup:wizard

# Or manual setup
cp .env.example .env.local
npm install
npm run supabase:setup
```

### Development

```bash
# Start all services
npm run dev

# Start specific services
npm run supabase:start    # Start local Supabase
npm run dev:web           # Start web app only
npm run dev:mobile        # Start mobile app

# Health check
npm run health            # Check all services status
```

## 🗄️ Database Management

### Migrations

```bash
# Create a new migration
npm run migration:new

# Run migrations locally
npm run supabase:reset    # Reset and re-run all migrations
npm run supabase:push     # Push changes to remote

# Generate TypeScript types
npm run types:generate
```

### Database Schema

Key tables:
- `profiles` - User profiles and roles
- `properties` - Real estate listings
- `property_analytics` - Tracking and metrics
- `transactions` - Purchase/sale records
- `favorites` - User saved properties
- `inquiries` - Lead management
- `appointments` - Property viewings
- `notifications` - User notifications

## 🔐 Authentication

Supabase Auth supports:
- Email/Password authentication
- OAuth providers (Google, GitHub, Facebook)
- Magic links
- Phone authentication (SMS)

### User Roles

- `admin` - Full system access
- `agent` - Property management
- `investor` - Investment tools access
- `client` - Standard user
- `viewer` - Read-only access

## 📡 API Endpoints

### REST API (Auto-generated)

```
GET    /rest/v1/properties
POST   /rest/v1/properties
PATCH  /rest/v1/properties?id=eq.{id}
DELETE /rest/v1/properties?id=eq.{id}
```

### Edge Functions

```
POST /functions/v1/property-search    # Advanced search
POST /functions/v1/analytics-track    # Event tracking
```

### Next.js API Routes

```
/api/properties/*         # Property operations
/api/auth/*              # Authentication
/api/upload/*            # File uploads
/api/cron/*              # Scheduled tasks
```

## 🚢 Deployment

### Vercel Deployment

```bash
# Deploy to production
npm run deploy:web

# Deploy preview
npm run deploy:preview
```

### Supabase Deployment

```bash
# Link to remote project
npm run supabase:link

# Deploy database changes
npm run supabase:push

# Deploy edge functions
npm run supabase:functions:deploy
```

## 📊 Monitoring

```bash
# Check logs
npm run supabase:logs         # Edge function logs
vercel logs                    # Application logs

# Database monitoring
# Use Supabase Dashboard for:
# - Query performance
# - Storage usage
# - Auth metrics
# - Real-time connections
```

## 🧪 Testing

```bash
# Run tests
npm test                # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## 🛠️ Utility Scripts

```bash
npm run clean          # Clean all build artifacts
npm run format         # Format code with Prettier
npm run lint           # Lint code
npm run type-check     # TypeScript validation
npm run health         # Health check all services
```

## 📱 Mobile Development

```bash
# Sync web code to mobile
npm run mobile:sync

# Run on iOS
npm run mobile:ios

# Run on Android
npm run mobile:android
```

## 🔒 Security

- Row Level Security (RLS) on all tables
- JWT-based authentication
- API rate limiting
- CORS configuration
- Environment variable protection

## 📝 Environment Variables

Required variables in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Application
NEXT_PUBLIC_APP_URL=

# Optional services
SENDGRID_API_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/schema.md)

## 🆘 Troubleshooting

### Common Issues

**Database connection failed**
```bash
npm run health          # Check service status
npm run supabase:start  # Restart local Supabase
```

**Types out of sync**
```bash
npm run types:generate  # Regenerate TypeScript types
```

**Migration errors**
```bash
npm run supabase:reset  # Reset database
```

## 📄 License

[Your License]

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com)
- [Capacitor](https://capacitorjs.com)
