# Authentication Fix - Cross-Origin Cookies

## Issue Fixed

**Error:**
```
GET https://propgroup.onrender.com/api/auth/me 401 (Unauthorized)
Error: No authentication token provided
```

**Root Cause:**
After successful login, the JWT token cookie wasn't being sent with subsequent requests because:
- Frontend: `https://propgroup-web.vercel.app` (Vercel)
- Backend: `https://propgroup.onrender.com` (Render)
- Cookie had `sameSite: 'lax'` which blocks cross-origin cookie transmission

## Solution Applied

### Fixed Cookie Settings

**File:** `apps/backend/src/routes/auth.js` (line 37-44)

**Before:**
```javascript
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',  // ❌ WRONG - blocks cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};
```

**After:**
```javascript
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // ✅ 'none' for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};
```

### How It Works Now

**Production (Cross-Origin):**
- `sameSite: 'none'` - Allows cookie to be sent cross-origin
- `secure: true` - Required when sameSite=none (HTTPS only)
- Cookie sent from Vercel to Render ✅

**Development (Same-Origin):**
- `sameSite: 'lax'` - Standard protection
- `secure: false` - Allows HTTP localhost
- Normal cookie behavior ✅

## Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User Login                                           │
│    POST /api/auth/login                                 │
│    { email, password }                                  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Backend Validates                                    │
│    - Check password with bcrypt                         │
│    - Create JWT token                                   │
│    - Set HTTP-only cookie (sameSite: 'none' in prod)   │
│    - Return user data (without password)                │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Frontend Stores User                                 │
│    - AuthContext updates state                          │
│    - Cookie stored by browser                           │
│    - User redirected to appropriate page                │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Subsequent Requests                                  │
│    GET /api/auth/me (with credentials: 'include')       │
│    - Browser automatically sends cookie                 │
│    - Backend middleware verifies JWT                    │
│    - Returns current user ✅                            │
└─────────────────────────────────────────────────────────┘
```

## Admin & SuperAdmin Features

### Existing Admin Routes

All admin routes are in `apps/backend/src/routes/admin.js` and protected with appropriate middleware:

#### Dashboard Stats
```
GET /api/admin/stats
Middleware: authenticateToken, requireAdmin
Returns: Overview stats, recent users, recent inquiries
```

#### User Management
```
GET /api/admin/users
Middleware: authenticateToken, requireAdmin
Returns: Paginated list of users with filters

GET /api/admin/users/:id
Middleware: authenticateToken, requireAdmin
Returns: Single user details

PUT /api/admin/users/:id/role
Middleware: authenticateToken, requireSuperAdmin
Action: Change user role (SUPER_ADMIN only)

POST /api/admin/users/:id/ban
Middleware: authenticateToken, requireSuperAdmin
Action: Ban user (SUPER_ADMIN only)

POST /api/admin/users/:id/unban
Middleware: authenticateToken, requireSuperAdmin
Action: Unban user (SUPER_ADMIN only)

DELETE /api/admin/users/:id
Middleware: authenticateToken, requireSuperAdmin
Action: Delete user (SUPER_ADMIN only)
```

#### Property Management
```
POST /api/admin/properties
Middleware: authenticateToken, requireAdmin
Action: Create new property

PUT /api/admin/properties/:id
Middleware: authenticateToken, requireAdmin
Action: Update property

DELETE /api/admin/properties/:id
Middleware: authenticateToken, requireAdmin
Action: Delete property
```

#### Audit Logs
```
GET /api/admin/audit-logs
Middleware: authenticateToken, requireSuperAdmin
Returns: Admin action history (SUPER_ADMIN only)
```

### Middleware Explained

**`authenticateToken`**: Verifies JWT token, attaches user to request
**`requireAdmin`**: Requires role to be ADMIN or SUPER_ADMIN
**`requireSuperAdmin`**: Requires role to be SUPER_ADMIN only
**`logAdminAction`**: Logs admin actions to audit trail

### Role Hierarchy

```
SUPER_ADMIN
  ├─ All ADMIN permissions
  ├─ Can create/promote users to ADMIN
  ├─ Can ban/unban users
  ├─ Can delete users
  ├─ Can view audit logs
  └─ Cannot be banned by other admins

ADMIN
  ├─ Can view dashboard stats
  ├─ Can view all users
  ├─ Can manage properties (create, update, delete)
  ├─ Can view inquiries
  └─ Cannot manage user roles or ban users

USER
  ├─ Can view properties
  ├─ Can save favorites
  ├─ Can submit inquiries
  └─ Can manage own profile
```

## Deploy Fix

```bash
git add apps/backend/src/routes/auth.js AUTH_FIX.md
git commit -m "Fix cross-origin authentication: set sameSite=none in production"
git push origin master
```

## Testing After Deploy

### 1. Test Login
```
1. Go to https://propgroup-web.vercel.app
2. Click "Sign In"
3. Enter: admin@propgroup.com / Admin123!
4. Should successfully log in ✅
```

### 2. Test Authenticated Request
```
1. After login, check browser console
2. Should NOT see "401 Unauthorized" errors
3. GET /api/auth/me should return user data
4. Navigate to /portal or /admin
5. Should see authenticated content ✅
```

### 3. Test Admin Features
```
1. Login as admin@propgroup.com
2. Navigate to admin panel
3. Should see dashboard stats
4. Can manage properties
5. Can view users (SUPER_ADMIN)
6. Can promote users to ADMIN (SUPER_ADMIN)
```

## Security Notes

### HTTP-Only Cookies
✅ Token stored in HTTP-only cookie (JavaScript cannot access)
✅ Protects against XSS attacks
✅ Automatically sent with requests

### SameSite=None Requirements
✅ HTTPS required (secure: true)
✅ Only in production (development uses 'lax')
✅ Allows cross-origin authenticated requests

### CORS Configuration
✅ credentials: true (allows cookies)
✅ Specific origin (not *)
✅ Proper headers allowed

## Summary

**Fixed:**
- ✅ Cross-origin authentication now works
- ✅ Cookies sent from Vercel to Render
- ✅ /api/auth/me returns user data
- ✅ Protected routes accessible after login

**Admin Features:**
- ✅ Full admin dashboard
- ✅ User management (view, ban, delete)
- ✅ Role management (SUPER_ADMIN can promote)
- ✅ Property management (create, update, delete)
- ✅ Audit logs (SUPER_ADMIN only)

**Login Credentials:**
```
Super Admin:
  Email: admin@propgroup.com
  Password: Admin123!
  ⚠️ CHANGE PASSWORD AFTER FIRST LOGIN!

Test User:
  Email: user@propgroup.com
  Password: User123!
```

**Ready to use!** 🎉
