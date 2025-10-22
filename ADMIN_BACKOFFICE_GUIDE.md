# PropGroup Admin Back Office - Complete Guide

## Overview

The PropGroup admin back office provides comprehensive tools for **Super Admins** and **Admins** to manage all aspects of the platform, including properties, users, and system monitoring.

## Access Levels

### Role Hierarchy

```
SUPER_ADMIN (Highest Level)
  ├─ All ADMIN permissions
  ├─ User role management (promote/demote users)
  ├─ Ban/unban users (including admins)
  ├─ Delete users
  ├─ Create new super admins
  ├─ View audit logs
  └─ Invite new admins

ADMIN (Mid Level)
  ├─ View dashboard statistics
  ├─ Property management (create, edit, delete)
  ├─ View all users
  ├─ Ban/unban regular users only
  └─ View inquiries

USER (Basic Level)
  ├─ View properties
  ├─ Save favorites
  ├─ Submit inquiries
  └─ Manage own profile
```

## Admin Dashboard

**URL:** `/admin`

**Access:** ADMIN + SUPER_ADMIN

### Features:
- **Overview Statistics**
  - Total properties
  - Total users
  - Total favorites
  - Total inquiries

- **Recent Activity**
  - Last 5 properties added
  - Last 5 users registered

- **Quick Actions**
  - Seed database with sample data
  - View role badge (ADMIN/SUPER_ADMIN)

---

## Property Management

**URL:** `/admin/properties`

**Access:** ADMIN + SUPER_ADMIN

### Features:

#### 1. View All Properties
- Displays all properties in a sortable table
- Shows key information:
  - Title, price, currency
  - Location (country)
  - Status (OFF_PLAN, NEW_BUILD, RESALE)
  - Bedrooms, bathrooms, area
  - Developer information
  - Investment metrics (ROI, rental yield)
  - Engagement (favorites count, inquiries count)

#### 2. Create New Property
**Button:** "Add Property" (top right)

**Required Fields:**
- Title *
- Description * (min 10 characters)
- Price *
- Currency * (USD, EUR, GBP, AED)
- Bedrooms *
- Bathrooms *
- Area (m²) *
- Country * (Georgia, Cyprus, Greece, Lebanon)
- Status * (Off Plan, New Build, Resale)
- Golden Visa Eligible checkbox

**Optional Fields:**
- Property Type (Apartment, Villa, etc.)
- Location details
- Developer (select from existing)
- Location Guide (select from existing)
- **Investment Data:**
  - Expected ROI (%)
  - Rental Yield (%)
  - Capital Growth (%)
  - Min/Max Investment amounts
  - Payment Plan
  - Completion Date
- Amenities
- Nearby Facilities
- Property Images (URLs)

**Backend Route:** `POST /api/properties`

#### 3. Edit Property
**Action:** Click "Edit" in property actions menu

- Opens modal with all current property data pre-filled
- Same fields as Create Property
- Updates both property and investment data

**Backend Route:** `PUT /api/properties/:id`

#### 4. Delete Property
**Action:** Click "Delete" in property actions menu

- Confirms deletion with user
- Permanently removes property from database
- Also deletes associated investment data

**Backend Route:** `DELETE /api/properties/:id`

#### 5. View Property
**Action:** Click "View" in property actions menu

- Opens property detail page in new tab
- Shows full public-facing property listing

**Frontend Route:** `/property/:id`

---

## User Management

**URL:** `/admin/users`

**Access:** ADMIN + SUPER_ADMIN

### Features:

#### 1. View All Users
- Displays all registered users in a table
- Shows:
  - Email and user ID
  - Role badge (USER, ADMIN, SUPER_ADMIN)
  - Status (active, banned, inactive)
  - Last login date

**Backend Route:** `GET /api/users`

#### 2. Change User Role
**Component:** Role dropdown in Actions column

**Access:** SUPER_ADMIN only

- Select new role from dropdown (USER, ADMIN, SUPER_ADMIN)
- Confirmation dialog appears
- Cannot change own role
- Updates user role immediately

**Backend Route:** `PUT /api/users/:id/role`

**Permissions:**
- ✅ SUPER_ADMIN can change any user's role
- ❌ ADMIN cannot change roles
- ❌ Cannot change own role

#### 3. Ban/Unban Users
**Component:** Ban/Unban button in Actions column

**Access:** ADMIN + SUPER_ADMIN

**Ban User:**
- Prompts for ban reason
- Confirms action
- Sets user to inactive and records ban details
- User cannot login

**Unban User:**
- Confirms action
- Restores user to active status
- Clears ban information

**Backend Routes:**
- `POST /api/users/:id/ban`
- `POST /api/users/:id/unban`

**Permissions:**
- ✅ ADMIN can ban/unban regular users
- ✅ SUPER_ADMIN can ban/unban anyone (including admins)
- ❌ ADMIN cannot ban other admins
- ❌ Cannot ban yourself

#### 4. Delete User
**Component:** Delete button in Actions column

**Access:** SUPER_ADMIN only

- Confirms deletion with warning
- Permanently deletes user from database
- Cannot be undone
- Cannot delete yourself

**Backend Route:** `DELETE /api/users/:id`

#### 5. Invite Admin
**Component:** Invite form at top right

**Access:** SUPER_ADMIN only

**Process:**
1. Enter email address
2. Select role (ADMIN or SUPER_ADMIN)
3. Submit invitation
4. User account created with invited role
5. User needs to set password on first login

**Backend Route:** `POST /api/users/invite`

---

## Backend API Reference

### Property Endpoints

```
GET    /api/properties              - List all properties (public)
GET    /api/properties/:id          - Get single property (public)
POST   /api/properties              - Create property (ADMIN+)
PUT    /api/properties/:id          - Update property (ADMIN+)
DELETE /api/properties/:id          - Delete property (ADMIN+)
```

### User Management Endpoints

```
GET    /api/users                   - List all users (ADMIN+)
GET    /api/users/:id               - Get single user (ADMIN+)
PUT    /api/users/:id/role          - Update user role (SUPER_ADMIN)
POST   /api/users/:id/ban           - Ban user (ADMIN+)
POST   /api/users/:id/unban         - Unban user (ADMIN+)
DELETE /api/users/:id               - Delete user (SUPER_ADMIN)
POST   /api/users/invite            - Invite admin (SUPER_ADMIN)
```

### Admin Dashboard Endpoints

```
GET    /api/admin/stats             - Dashboard statistics (ADMIN+)
GET    /api/admin/audit-logs        - Audit trail (ADMIN+)
POST   /api/admin/create-super-admin - Create super admin (SUPER_ADMIN)
GET    /api/admin/health            - System health check (ADMIN+)
```

---

## Authentication & Security

### Login Credentials

**Super Admin (Default):**
```
Email: admin@propgroup.com
Password: Admin123!
```

⚠️ **IMPORTANT:** Change the default password immediately after first login!

### Security Features

1. **HTTP-Only Cookies**
   - JWT tokens stored in secure HTTP-only cookies
   - Protected against XSS attacks
   - Automatically included with requests

2. **Cross-Origin Support**
   - `sameSite: 'none'` in production for Vercel → Render
   - `sameSite: 'lax'` in development for localhost
   - Requires HTTPS in production

3. **Role-Based Access Control (RBAC)**
   - Middleware checks user role on protected routes
   - `requireAdmin` - Requires ADMIN or SUPER_ADMIN
   - `requireSuperAdmin` - Requires SUPER_ADMIN only
   - `authenticateToken` - Verifies JWT token

4. **Audit Logging**
   - All admin actions logged to database
   - Includes action type, target, admin ID, and metadata
   - View logs at `/api/admin/audit-logs`

---

## Frontend Components

### Admin Layout
**Path:** `apps/web/src/app/(admin)/layout.tsx`
- Wraps all admin pages
- Includes admin sidebar navigation
- Checks authentication/authorization

### Property Management
**Page:** `apps/web/src/app/(admin)/admin/properties/page.tsx`

**Components:**
- `PropertyTable` - Displays all properties with actions
- `CreatePropertyModal` - Form to create new property
- `EditPropertyModal` - Form to edit existing property

### User Management
**Page:** `apps/web/src/app/(admin)/admin/users/page.tsx`

**Components:**
- `UsersManagementClient` - Main user management interface
  - UserRow - Individual user row with actions
  - RoleSelectButton - Role change dropdown
  - BanButton - Ban/unban toggle
  - DeleteButton - Delete user
  - InviteUserButton - Invite admin form

### Admin Dashboard
**Page:** `apps/web/src/app/(admin)/admin/page.tsx`
- Overview statistics cards
- Recent properties list
- Recent users list
- Seed data button

---

## Workflow Examples

### 1. Creating a New Property

```
1. Navigate to /admin/properties
2. Click "Add Property" button
3. Fill in required fields:
   - Title: "Luxury 2BR Apartment in Tbilisi"
   - Description: "Modern apartment with city views..."
   - Price: 150000
   - Currency: USD
   - Bedrooms: 2
   - Bathrooms: 2
   - Area: 85
   - Country: GEORGIA
   - Status: NEW_BUILD
4. Optional: Add investment data (ROI, yield, etc.)
5. Optional: Add property images (URLs)
6. Click "Create Property"
7. Property appears in table immediately
```

**API Call:**
```json
POST /api/properties
{
  "title": "Luxury 2BR Apartment in Tbilisi",
  "description": "Modern apartment with city views...",
  "price": 150000,
  "currency": "USD",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 85,
  "country": "GEORGIA",
  "status": "NEW_BUILD",
  "isGoldenVisaEligible": false,
  "images": ["https://..."],
  "expectedROI": 12.5,
  "rentalYield": 8.2
}
```

### 2. Promoting a User to Admin

```
1. Navigate to /admin/users
2. Find the user in the table
3. Click the role dropdown (currently shows "USER")
4. Select "ADMIN"
5. Confirm the role change
6. User is now an admin
```

**API Call:**
```json
PUT /api/users/{userId}/role
{
  "role": "ADMIN"
}
```

### 3. Banning a User

```
1. Navigate to /admin/users
2. Find the user in the table
3. Click "Ban" button
4. Enter ban reason in prompt: "Violation of terms"
5. Confirm ban action
6. User status changes to "banned"
7. User cannot login
```

**API Call:**
```json
POST /api/users/{userId}/ban
{
  "reason": "Violation of terms"
}
```

### 4. Inviting a New Admin

```
1. Navigate to /admin/users
2. Find invite form at top right
3. Enter email: "newadmin@propgroup.com"
4. Select role: "ADMIN"
5. Click "Invite"
6. New admin account created
7. User needs to set password on first login
```

**API Call:**
```json
POST /api/users/invite
{
  "email": "newadmin@propgroup.com",
  "role": "ADMIN"
}
```

---

## Troubleshooting

### Common Issues

#### 1. Cannot Access Admin Panel
**Symptoms:** Redirected to login or unauthorized page

**Solutions:**
- Verify you're logged in
- Check your role (must be ADMIN or SUPER_ADMIN)
- Clear cookies and login again
- Check browser console for auth errors

#### 2. API Returns 401 Unauthorized
**Symptoms:** Actions fail with "No authentication token provided"

**Solutions:**
- Cookies may be blocked - check browser settings
- Token expired - login again
- Cross-origin cookie issue - verify CORS settings
- Check `NEXT_PUBLIC_API_URL` environment variable

#### 3. Cannot Edit/Delete Properties
**Symptoms:** Edit/delete buttons don't work

**Solutions:**
- Check you have ADMIN or SUPER_ADMIN role
- Verify backend is running
- Check browser console for JavaScript errors
- Ensure `process.env.NEXT_PUBLIC_API_URL` is set correctly

#### 4. User Management Actions Fail
**Symptoms:** Role changes, bans, deletes fail

**Solutions:**
- SUPER_ADMIN required for some actions
- Cannot modify your own account
- Check backend logs for detailed error
- Verify user ID is correct

---

## Deployment Checklist

### Before Going Live

- [ ] Change default super admin password
- [ ] Create additional super admin accounts (backup)
- [ ] Test all admin features in production
- [ ] Verify CORS settings for production URLs
- [ ] Ensure `sameSite: 'none'` is set in production
- [ ] Check audit logs are recording actions
- [ ] Test role permissions thoroughly
- [ ] Verify property create/edit/delete works
- [ ] Test user management features
- [ ] Check dashboard statistics are accurate

### Environment Variables Required

**Frontend (Vercel):**
```env
NEXT_PUBLIC_API_URL=https://propgroup.onrender.com/api
DATABASE_URL=postgresql://...
```

**Backend (Render):**
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
PORT=3001
FRONTEND_URL=https://propgroup-web.vercel.app
BACKEND_URL=https://propgroup.onrender.com
JWT_SECRET=(auto-generated)
SESSION_SECRET=(auto-generated)
JWT_EXPIRES_IN=7d
```

---

## Support & Maintenance

### Regular Tasks

1. **Monitor Audit Logs** - Review admin actions regularly
2. **User Management** - Remove inactive or banned users
3. **Property Updates** - Keep property listings current
4. **Database Backups** - Regular backups (handled by Render)
5. **Security Updates** - Keep dependencies updated

### Monitoring

- Check `/api/admin/health` for system status
- Monitor `/api/admin/stats` for platform growth
- Review `/api/admin/audit-logs` for security

---

## Summary

The PropGroup admin back office provides complete control over:

✅ **Property Management**
- Create, edit, delete properties
- Manage investment data and images
- Track engagement (favorites, inquiries)

✅ **User Management**
- View all users
- Change roles (SUPER_ADMIN only)
- Ban/unban users
- Delete users (SUPER_ADMIN only)
- Invite new admins (SUPER_ADMIN only)

✅ **System Monitoring**
- Dashboard statistics
- Audit logs
- System health checks

**All features are production-ready and fully functional!** 🎉
