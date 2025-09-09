# PropGroup - Backend Infrastructure & Deployment Guide

## Overview

PropGroup is a comprehensive real estate investment platform built as a monorepo with the following architecture:

- **Frontend**: Next.js web application
- **Mobile**: Capacitor for iOS/Android apps
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Deployment**: Vercel (Frontend) + Supabase Cloud (Backend)

## Project Structure

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
└── package.json            # Root monorepo configuration
```

## Tech Stack

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (Email/Password, OAuth providers)
- **Storage**: Supabase Storage (for images and documents)
- **Edge Functions**: Deno-based serverless functions
- **Real-time**: PostgreSQL real-time subscriptions
- **API**: RESTful API via Supabase client + Custom Edge Functions

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React + TypeScript
- **State Management**: React hooks + Supabase real-time
- **Styling**: Tailwind CSS
- **Mobile**: Capacitor for cross-platform apps

## Database Schema

### Core Tables
- `profiles` - User profiles with roles (admin, agent, client, investor)
- `properties` - Property listings with full details
- `property_analytics` - View counts, favorites, inquiries tracking
- `favorites` - User saved properties
- `inquiries` - Property inquiries and leads
- `transactions` - Purchase/sale/rental transactions
- `documents` - Property and transaction documents
- `appointments` - Property viewing appointments
- `notifications` - User notifications
- `search_history` - User search tracking

### Key Features
- Row Level Security (RLS) policies for data protection
- PostGIS extension for location-based searches
- Real-time updates via PostgreSQL subscriptions
- Automatic timestamp management
- Full-text search capabilities

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### 2. Local Development Setup

```bash
# Clone the repository
git clone [repository-url]
cd propgroup

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure environment variables in .env.local
# - Add your Supabase URL and keys
# - Configure OAuth providers (optional)
# - Set up other services as needed

# Start Supabase locally (optional)
npx supabase start

# Run database migrations
npx supabase db push

# Seed the database (optional)
npx supabase db seed

# Start development server
npm run dev
```

### 3. Supabase Setup

1. **Create a new Supabase project**
   - Go to https://supabase.com
   - Create a new project
   - Note your project URL and anon key

2. **Run migrations**
   ```bash
   # Link to your Supabase project
   npx supabase link --project-ref [your-project-ref]
   
   # Push migrations to Supabase
   npx supabase db push
   ```

3. **Configure Storage Buckets**
   Create the following buckets in Supabase Dashboard:
   - `property-images` (public)
   - `documents` (private)
   - `user-avatars` (public)
   - `company-assets` (public)

4. **Deploy Edge Functions**
   ```bash
   # Deploy all functions
   npx supabase functions deploy
   
   # Or deploy specific function
   npx supabase functions deploy property-search
   npx supabase functions deploy analytics-track
   ```

5. **Configure Authentication**
   - Enable Email/Password authentication
   - Configure OAuth providers (Google, GitHub, etc.)
   - Set up email templates
   - Configure redirect URLs

### 4. Vercel Deployment

1. **Connect GitHub repository to Vercel**
   - Import your repository in Vercel
   - Select the monorepo root

2. **Configure build settings**
   - Framework Preset: None
   - Build Command: `npm run build`
   - Output Directory: `apps/web/.next`
   - Install Command: `npm install`

3. **Set environment variables in Vercel**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   NEXT_PUBLIC_APP_URL
   # Add other variables as needed
   ```

4. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod
   
   # Deploy to preview
   vercel
   ```

## API Endpoints

### Supabase Tables (Auto-generated REST API)
- `GET /rest/v1/properties` - List properties
- `GET /rest/v1/properties?id=eq.{id}` - Get property by ID
- `POST /rest/v1/properties` - Create property
- `PATCH /rest/v1/properties?id=eq.{id}` - Update property
- `DELETE /rest/v1/properties?id=eq.{id}` - Delete property

### Edge Functions
- `POST /functions/v1/property-search` - Advanced property search
- `POST /functions/v1/analytics-track` - Track user interactions

### Next.js API Routes
- `/api/properties` - Property CRUD operations
- `/api/auth/*` - Authentication endpoints
- `/api/upload` - File upload handling
- `/api/cron/*` - Scheduled tasks

## Security

### Row Level Security (RLS)
All tables have RLS policies configured:
- Public read access for properties
- User-specific access for personal data
- Role-based access for admin operations

### Authentication
- JWT-based authentication via Supabase Auth
- Session management with refresh tokens
- OAuth integration for social logins

### API Security
- API key authentication for edge functions
- CORS configuration for allowed origins
- Rate limiting on sensitive endpoints

## Monitoring & Analytics

### Database Monitoring
- Use Supabase Dashboard for query performance
- Monitor slow queries and optimize indexes
- Track storage usage

### Application Monitoring
- Vercel Analytics for performance metrics
- Google Analytics for user behavior
- Custom analytics via property_analytics table

### Error Tracking
- Vercel logs for application errors
- Supabase logs for database errors
- Edge function logs in Supabase Dashboard

## Maintenance

### Database Maintenance
```bash
# Create a new migration
npx supabase migration new [migration_name]

# Run migrations locally
npx supabase db reset

# Push to production
npx supabase db push
```

### Backup Strategy
- Automatic daily backups via Supabase
- Point-in-time recovery available
- Export data via Supabase Dashboard

### Updates
```bash
# Update dependencies
npm update

# Update Supabase CLI
npm install -g supabase@latest

# Update database types
npx supabase gen types typescript --project-id [project-id] > packages/supabase/src/types/database.ts
```

## Troubleshooting

### Common Issues

1. **Database connection issues**
   - Check Supabase project status
   - Verify environment variables
   - Check RLS policies

2. **Authentication errors**
   - Verify Supabase Auth configuration
   - Check redirect URLs
   - Validate JWT tokens

3. **Storage upload failures**
   - Check bucket permissions
   - Verify file size limits
   - Ensure proper CORS configuration

4. **Edge function errors**
   - Check function logs in Supabase
   - Verify environment variables
   - Test locally with `supabase functions serve`

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Check Vercel documentation: https://vercel.com/docs
3. Review project issues on GitHub
4. Contact development team

## License

[Your License Here]
