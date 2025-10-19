# Authentication Flow Verification Guide

## Overview
This document outlines the complete authentication system and how to test all user flows.

## System Architecture

### Backend (Node.js + Express)
- **Location**: `apps/backend/src/routes/auth.js`
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Password Hashing**: bcryptjs (12 rounds)
- **Token Expiry**: 7 days (configurable via JWT_EXPIRES_IN)

### Frontend (Next.js + React)
- **Auth Context**: `apps/web/src/contexts/AuthContext.tsx`
- **API Client**: `apps/web/src/lib/api/client.ts`
- **RBAC**: `apps/web/src/lib/auth/rbac.ts`

## User Roles

1. **USER** (default)
   - Access to portal routes: /portal/*
   - Can view properties, use calculators, manage portfolio

2. **ADMIN**
   - Access to admin panel: /admin/*
   - Can manage properties, view analytics
   - Cannot manage other admins

3. **SUPER_ADMIN**
   - Full admin access: /admin/*
   - Can manage users including other admins: /admin/users/manage
   - Can invite new admins

## Authentication Endpoints

### 1. Register
- **Route**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "country": "USA",
    "investmentGoals": ["HIGH_ROI", "CAPITAL_GROWTH"]
  }
  ```
- **Response**: User object + JWT cookie set
- **UI**:
  - Modal: Click "Sign In" button → Click "Sign Up"
  - No dedicated signup page yet

### 2. Login
- **Route**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object + JWT cookie set
- **UI**:
  - Modal: Click "Sign In" button anywhere on site
  - Dedicated page: `/auth/login`

### 3. Get Current User
- **Route**: `GET /api/auth/me`
- **Headers**: Automatically includes JWT cookie
- **Response**: User object with role and permissions
- **UI**: Automatic on page load via AuthContext

### 4. Logout
- **Route**: `POST /api/auth/logout`
- **Response**: Clears JWT cookie
- **UI**: "Sign Out" button in navbar or admin sidebar

### 5. Update Profile
- **Route**: `PUT /api/auth/profile`
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "country": "USA",
    "investmentGoals": ["GOLDEN_VISA"]
  }
  ```
- **UI**: `/portal/settings`

### 6. Change Password
- **Route**: `PUT /api/auth/change-password`
- **Request Body**:
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword"
  }
  ```
- **UI**: `/portal/settings`

## Protected Routes

### User Portal Routes (Requires: USER role)
- `/portal/dashboard` - User dashboard
- `/portal/market-analysis` - Market analysis tools
- `/portal/calculator` - ROI calculator
- `/portal/portfolio` - User's property portfolio
- `/portal/favorites` - Saved properties
- `/portal/documents` - Document vault (placeholder)
- `/portal/settings` - Profile and password settings

**Protection**: Client-side via AuthContext (user check on mount)

### Admin Routes (Requires: ADMIN or SUPER_ADMIN role)
- `/admin` - Admin dashboard
- `/admin/properties` - Property management
- `/admin/analytics` - Analytics dashboard
- `/admin/documents` - Document management
- `/admin/settings` - System settings
- `/admin/users` - User list (view only)
- `/admin/ai-settings` - AI configuration

**Protection**: Server-side via `requireAdmin()` in layout

### Super Admin Routes (Requires: SUPER_ADMIN role)
- `/admin/users/manage` - User management (create, edit, ban, delete admins)

**Protection**: Server-side via `requireSuperAdmin()`

## Testing Checklist

### ✅ Registration Flow
1. [ ] Open homepage
2. [ ] Click "Sign In" button in navbar
3. [ ] Click "Don't have an account? Sign Up"
4. [ ] Fill in email and password (min 6 characters)
5. [ ] Submit form
6. [ ] Verify success message
7. [ ] Verify automatic login (navbar shows user info)
8. [ ] Verify redirect to homepage

### ✅ Login Flow (Regular User)
1. [ ] Navigate to `/auth/login`
2. [ ] Enter email and password
3. [ ] Submit form
4. [ ] Verify redirect based on role:
   - USER → Homepage or `?next=` parameter
   - ADMIN/SUPER_ADMIN → `/admin`
5. [ ] Verify navbar shows user menu

### ✅ Login Flow (Admin User)
1. [ ] Create admin user via backend or super admin
2. [ ] Navigate to `/auth/login`
3. [ ] Enter admin credentials
4. [ ] Verify redirect to `/admin`
5. [ ] Verify admin sidebar visible
6. [ ] Verify access to admin routes

### ✅ Protected Routes (Unauthenticated)
1. [ ] Try accessing `/admin` without login
2. [ ] Verify redirect to `/auth/login?next=/admin`
3. [ ] Try accessing `/portal/dashboard` without login
4. [ ] Verify appropriate redirect

### ✅ Protected Routes (Wrong Role)
1. [ ] Login as USER
2. [ ] Try accessing `/admin`
3. [ ] Verify redirect to `/unauthorized`
4. [ ] Login as ADMIN
5. [ ] Try accessing `/admin/users/manage`
6. [ ] Verify redirect to `/unauthorized`

### ✅ Logout Flow
1. [ ] Click user menu in navbar
2. [ ] Click "Sign Out"
3. [ ] Verify redirect to homepage
4. [ ] Verify navbar shows "Sign In" button
5. [ ] Verify cannot access protected routes

### ✅ Profile Update
1. [ ] Login as any user
2. [ ] Navigate to `/portal/settings`
3. [ ] Update first name, last name, phone
4. [ ] Submit form
5. [ ] Verify success message
6. [ ] Refresh page
7. [ ] Verify changes persisted

### ✅ Password Change
1. [ ] Login as any user
2. [ ] Navigate to `/portal/settings`
3. [ ] Enter current password
4. [ ] Enter new password (min 8 characters)
5. [ ] Confirm new password
6. [ ] Submit form
7. [ ] Verify success message
8. [ ] Logout
9. [ ] Login with new password
10. [ ] Verify successful login

### ✅ Session Persistence
1. [ ] Login to the application
2. [ ] Close browser
3. [ ] Reopen browser
4. [ ] Navigate to the site
5. [ ] Verify still logged in (JWT cookie valid for 7 days)

### ✅ AuthContext Integration
1. [ ] Open browser DevTools
2. [ ] Login to application
3. [ ] Check that `user` object is available in AuthContext
4. [ ] Navigate between pages
5. [ ] Verify AuthContext maintains state
6. [ ] Verify loading states work correctly

## Default Test Users

### Create via Backend Scripts
Run this in the backend:
```bash
cd apps/backend
node -e "
const { PrismaClient } = require('@propgroup/db');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createTestUsers() {
  // Regular user
  const hashedPassword = await bcrypt.hash('password123', 12);

  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      isActive: true
    }
  });

  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true
    }
  });

  // Super admin user
  await prisma.user.upsert({
    where: { email: 'superadmin@test.com' },
    update: {},
    create: {
      email: 'superadmin@test.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      isActive: true
    }
  });

  console.log('Test users created successfully!');
  await prisma.\$disconnect();
}

createTestUsers();
"
```

### Test Credentials
- **Regular User**: user@test.com / password123
- **Admin**: admin@test.com / password123
- **Super Admin**: superadmin@test.com / password123

## Known Issues / TODOs

1. **No Dedicated Signup Page**: Users can only register via modal. Consider adding `/auth/signup` page.

2. **No Email Verification**: Users can login immediately after registration without email verification.

3. **No Password Reset**: The login page has a "Forgot password" link but no implementation yet.

4. **Portal Routes**: No server-side protection. They rely on client-side AuthContext which can be bypassed. Consider adding middleware or layout protection.

5. **Document Storage**: Portal documents page is a placeholder - no backend storage implementation yet.

6. **Middleware Simplified**: Authentication middleware was simplified and doesn't perform JWT verification on server. Only client-side checks via AuthContext.

## Environment Variables Required

### Backend (.env)
```env
DATABASE_URL="your_database_url"
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

## Security Features

✅ **Implemented**:
- JWT tokens in HTTP-only cookies (prevents XSS)
- Password hashing with bcryptjs (12 rounds)
- Role-based access control (RBAC)
- Account ban/suspend functionality
- Admin action audit logging (backend)
- CORS protection
- Input validation with Zod

⚠️ **Missing**:
- CSRF protection
- Rate limiting on auth endpoints
- Email verification
- Password reset flow
- Two-factor authentication
- Server-side session validation in middleware
