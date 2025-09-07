# Smart Investment Portal

A comprehensive real estate investment platform built with Next.js, Supabase, and Prisma. This monorepo contains a web application, shared packages, and admin dashboard for managing real estate investments.

## 🏗️ Architecture

This is a pnpm monorepo with the following structure:

```
smart-investment-portal/
├── apps/
│   └── web/                 # Next.js web application
├── packages/
│   ├── config/             # Shared configuration and utilities
│   ├── db/                 # Prisma database schema and client
│   └── ui/                 # Shared UI components
└── package.json            # Root package.json with workspace scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Supabase account
- Resend account (for email)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd smart-investment-portal
pnpm install
```

### 2. Environment Setup

Copy the environment template and fill in your values:

```bash
cp env.example .env
```

Required environment variables:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="[RESEND-API-KEY]"
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Open Prisma Studio
pnpm db:studio
```

### 4. Start Development

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 📋 Available Scripts

### Development
- `pnpm dev` - Start development server
- `pnpm setup:dev` - Full setup + dev server

### Building
- `pnpm build` - Build all packages and web app
- `pnpm build:packages` - Build shared packages only
- `pnpm build:web` - Build web app with packages

### Database
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Create and run migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:reset` - Reset database (⚠️ destructive)

### Testing
- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage

### Code Quality
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier

### Utilities
- `pnpm clean` - Clean all build artifacts
- `pnpm clean:install` - Clean + fresh install
- `pnpm setup` - Install + generate + push schema

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

### 2. Configure Database

1. Copy your PostgreSQL connection string from Supabase
2. Add it to your `.env` file as `DATABASE_URL`
3. Run `pnpm db:push` to create tables

### 3. Set Up Authentication

1. In Supabase Dashboard > Authentication > Settings
2. Configure your site URL: `http://localhost:3000`
3. Add redirect URLs for production

### 4. Create Admin User

After setting up the database, you'll need to manually promote a user to admin:

1. Sign up through the app
2. Go to Supabase Dashboard > Table Editor > `users`
3. Find your user and change `role` from `USER` to `ADMIN`

## 📧 Email Setup (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add it to your `.env` file as `RESEND_API_KEY`
4. Verify your domain (for production)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment

```bash
# Build the application
pnpm build

# Run database migrations
pnpm db:migrate:deploy

# Start production server
pnpm start
```

## 🏗️ Project Structure

### Apps

#### `/apps/web`
- Next.js 15 with App Router
- TypeScript + Tailwind CSS
- Supabase authentication
- Server and client components

### Packages

#### `/packages/config`
- Shared constants and enums
- Zod validation schemas
- Investment calculation utilities
- Type definitions

#### `/packages/db`
- Prisma schema
- Database client
- Migrations
- Seed scripts

#### `/packages/ui`
- Shared React components
- Reusable UI elements
- Property cards and forms

## 🔐 Authentication & Authorization

- **Supabase Auth** for user management
- **Role-based access** (USER/ADMIN)
- **Protected routes** with middleware
- **Server-side auth** in components

## 📊 Features

### Public Features
- Property browsing and search
- Investment calculator
- Contact forms
- User registration/login

### User Portal
- Personal dashboard
- Property favorites
- Portfolio tracking
- Performance simulation
- Document vault
- Settings management

### Admin Dashboard
- Property management (CRUD)
- User management
- Analytics and statistics
- Role management

## 🧪 Testing

The project uses Vitest for testing:

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter config test

# Run tests in watch mode
pnpm test:watch
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with details

## 🔄 Updates

To update dependencies:

```bash
# Update all dependencies
pnpm update

# Update specific package
pnpm --filter web update [package-name]
```

---

Built with ❤️ using Next.js, Supabase, and Prisma.