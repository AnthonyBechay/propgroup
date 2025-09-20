# PropGroup Backend API

A Node.js/Express backend API for the PropGroup real estate platform, replacing Supabase with a self-hosted solution.

## Features

- **JWT Authentication** with secure httpOnly cookies
- **User Management** with role-based access control (USER, ADMIN, SUPER_ADMIN)
- **Property Management** with full CRUD operations
- **Favorites System** for users to save properties
- **Inquiry System** for property inquiries
- **Portfolio Management** for user-owned properties
- **Admin Dashboard** with comprehensive statistics
- **Audit Logging** for all admin actions
- **CORS Support** for frontend integration

## Tech Stack

- **Node.js** with Express.js
- **Prisma** with PostgreSQL
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Zod** for validation
- **CORS** for cross-origin requests

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Copy `env.example` to `.env` and configure:
   ```bash
   cp env.example .env
   ```

   Required environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `JWT_EXPIRES_IN`: Token expiration (default: 7d)
   - `PORT`: Server port (default: 3001)
   - `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)

3. **Database Setup:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed database with sample data
   npm run db:seed
   ```

4. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Properties
- `GET /api/properties` - Get all properties (public)
- `GET /api/properties/:id` - Get single property (public)
- `POST /api/properties` - Create property (admin)
- `PUT /api/properties/:id` - Update property (admin)
- `DELETE /api/properties/:id` - Delete property (admin)

### Favorites
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites/:propertyId` - Add to favorites
- `DELETE /api/favorites/:propertyId` - Remove from favorites
- `GET /api/favorites/check/:propertyId` - Check if favorited

### Inquiries
- `POST /api/inquiries` - Create inquiry (public)
- `GET /api/inquiries/my` - Get user's inquiries
- `GET /api/inquiries` - Get all inquiries (admin)
- `GET /api/inquiries/:id` - Get single inquiry (admin)
- `DELETE /api/inquiries/:id` - Delete inquiry (admin)

### Portfolio
- `GET /api/portfolio` - Get user's portfolio
- `POST /api/portfolio` - Add property to portfolio
- `PUT /api/portfolio/:id` - Update owned property
- `DELETE /api/portfolio/:id` - Remove from portfolio
- `GET /api/portfolio/stats` - Get portfolio statistics

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id/role` - Update user role (super admin)
- `POST /api/users/:id/ban` - Ban user (admin)
- `POST /api/users/:id/unban` - Unban user (admin)
- `DELETE /api/users/:id` - Delete user (super admin)
- `POST /api/users/invite` - Invite admin (super admin)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/audit-logs` - Get audit logs
- `POST /api/admin/create-super-admin` - Create super admin
- `GET /api/admin/health` - System health check

## Authentication

The API uses JWT tokens stored in httpOnly cookies for security. Include the cookie in requests or use the Authorization header:

```javascript
// Using fetch with cookies (automatic)
fetch('/api/properties')

// Using fetch with Authorization header
fetch('/api/properties', {
  headers: {
    'Authorization': 'Bearer <token>'
  }
})
```

## Database

The backend uses the existing Prisma schema from `packages/db`. The User model has been updated to include a `password` field for JWT authentication.

## Deployment

This backend is designed to run on Render with a PostgreSQL database. Make sure to:

1. Set all required environment variables
2. Run database migrations
3. Seed the database with initial data
4. Configure CORS for your frontend domain

## Migration from Supabase

This backend replaces all Supabase functionality:

- **Auth**: Supabase Auth → JWT with bcrypt
- **Database**: Supabase DB → Prisma with PostgreSQL
- **Storage**: Supabase Storage → File system (can be extended to S3)
- **Real-time**: Supabase Realtime → WebSocket (can be added if needed)

The frontend will need to be updated to use these new endpoints instead of Supabase client calls.
