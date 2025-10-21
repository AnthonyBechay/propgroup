# PropGroup - Real Estate Investment Platform

A comprehensive real estate investment platform with property browsing, user authentication, admin dashboard, and portfolio management.

## 🚀 Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/web/.env.example apps/web/.env.local
# Edit the .env files with your database credentials

# 3. Run database migrations and seed
cd packages/db
pnpm run db:migrate
pnpm run db:seed

# 4. Start development servers
cd ../..
pnpm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

**Default Login:**
- Admin: `admin@propgroup.com` / `Admin123!`
- User: `user@propgroup.com` / `User123!`

## 📁 Project Structure

```
propgroup/
├── apps/
│   ├── backend/              # Express.js API
│   └── web/                  # Next.js frontend
├── packages/
│   ├── db/                   # Prisma schema & client
│   ├── ui/                   # Shared UI components
│   └── config/               # Shared configuration
├── docs/                     # Complete documentation
└── scripts/                  # Build & development scripts
```

## 🏗️ Tech Stack

- **Frontend:** Next.js 15 (React 19), TypeScript, Tailwind CSS
- **Backend:** Express.js, Passport.js (Local + Google OAuth)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT tokens in HTTP-only cookies
- **Deployment:** Vercel (frontend) + Render (backend + database)

## ✨ Features

### For Users
- Browse properties across 4 countries (Georgia, Cyprus, Greece, Lebanon)
- Filter by price, location, bedrooms, status
- Save favorite properties
- Submit inquiries
- Manage property portfolio
- Google Sign-in or email/password authentication

### For Admins
- Full property management (CRUD)
- User management
- View all inquiries
- Admin invitation system

### For Super Admins
- All admin features
- Role management
- Ban/unban users
- Complete audit trail

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) folder:

- **[QUICKSTART.md](./docs/QUICKSTART.md)** - Deploy in 30 minutes
- **[RENDER_SETUP.md](./docs/RENDER_SETUP.md)** - Complete deployment guide
- **[USER_CYCLE_COMPLETE.md](./docs/USER_CYCLE_COMPLETE.md)** - User workflows & features
- **[LOGIN_FLOW_VERIFICATION.md](./docs/LOGIN_FLOW_VERIFICATION.md)** - Authentication details
- **[DEPLOYMENT_SUMMARY.md](./docs/DEPLOYMENT_SUMMARY.md)** - Architecture & changes

[**→ View all documentation**](./docs/README.md)

## 🚢 Deployment

### Quick Deploy (30 minutes)

1. **Create PostgreSQL** on Render
2. **Deploy Backend** to Render
3. **Deploy Frontend** to Vercel
4. **Configure** environment variables

[**→ Follow the Quickstart Guide**](./docs/QUICKSTART.md)

### Required Environment Variables

**Backend (Render):**
```bash
DATABASE_URL=<from-render-postgresql>
JWT_SECRET=<random-64-char-hex>
SESSION_SECRET=<random-64-char-hex>
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-backend.onrender.com
NODE_ENV=production
```

**Frontend (Vercel):**
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

[**→ See detailed deployment guide**](./docs/RENDER_SETUP.md)

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start both frontend and backend
pnpm dev:backend      # Start backend only
pnpm dev:web          # Start frontend only

# Building
pnpm build            # Build all packages and apps
pnpm build:packages   # Build workspace packages only

# Database
pnpm --filter @propgroup/db db:migrate    # Run migrations
pnpm --filter @propgroup/db db:seed       # Seed database
pnpm --filter @propgroup/db db:studio     # Open Prisma Studio

# Testing
pnpm test             # Run tests
pnpm type-check       # TypeScript type checking
pnpm lint             # Lint code
```

## 🔐 Authentication

PropGroup supports two authentication methods:

1. **Email/Password** - Traditional authentication with bcrypt hashing
2. **Google OAuth** - Sign in with Google (optional)

All authentication is handled via JWT tokens stored in HTTP-only cookies for security.

## 🗄️ Database

The application uses PostgreSQL with Prisma ORM. Key models:

- **User** - User accounts (USER, ADMIN, SUPER_ADMIN roles)
- **Property** - Real estate listings
- **FavoriteProperty** - User saved properties
- **PropertyInquiry** - User inquiries
- **UserOwnedProperty** - User portfolio
- **AdminAuditLog** - Admin action tracking

[See complete schema](./packages/db/prisma/schema.prisma)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

- **Documentation**: [docs/](./docs)
- **Quick Start**: [QUICKSTART.md](./docs/QUICKSTART.md)
- **Deployment Help**: [RENDER_SETUP.md](./docs/RENDER_SETUP.md)

---

**Built with ❤️ using Next.js, Express, Prisma, and PostgreSQL**
