# Role-Based Access Control (RBAC) Implementation

## 🛡️ User Roles Hierarchy

### 1. **USER** (Default Role)
- Browse properties
- Create inquiries
- Save favorite properties
- Manage their portfolio
- Update their profile

### 2. **ADMIN** 
- All USER permissions
- Create, edit, delete properties
- View all property inquiries
- View user statistics
- Access admin dashboard
- Cannot manage other users

### 3. **SUPER_ADMIN**
- All ADMIN permissions
- Manage all users (promote/demote/ban)
- Manage other admins
- View audit logs
- Send admin invitations
- Delete users permanently
- Full system access

## 🔐 Security Features

### Authentication Flow
1. **Sign Up**: Users register as regular users by default
2. **Email Verification**: Email must be verified for certain actions
3. **Role Assignment**: Only super admins can promote users
4. **Session Management**: Automatic session refresh in middleware

### Ban System
- Admins can ban regular users
- Only super admins can ban other admins
- Banned users see a dedicated page explaining the ban
- Ban includes reason and timestamp
- Unbanning restores full access

### Audit Logging
All admin actions are logged:
- User role changes
- Ban/unban actions  
- Property management
- User deletions
- Admin invitations

## 📁 Project Structure

```
apps/web/src/
├── lib/
│   ├── auth/
│   │   └── rbac.ts              # Role checking functions
│   └── supabase/
│       ├── client.ts             # Client-side Supabase
│       └── server.ts             # Server-side Supabase
├── middleware.ts                 # Route protection
├── actions/
│   ├── user-actions.ts          # User management actions
│   └── property-actions.ts      # Property management
├── app/
│   ├── (admin)/                 # Admin layout group
│   │   └── admin/
│   │       ├── page.tsx         # Admin dashboard
│   │       ├── properties/      # Property management
│   │       └── users/
│   │           ├── page.tsx     # User list (admins)
│   │           └── manage/      # Super admin only
│   │               └── page.tsx
│   ├── portal/                  # User dashboard
│   ├── auth/
│   │   ├── login/
│   │   ├── banned/              # Banned user page
│   │   └── callback/
│   └── unauthorized/            # Access denied page
└── components/
    └── admin/
        ├── UserManagementTable.tsx
        └── InviteAdminModal.tsx
```

## 🚀 Setup Instructions

### 1. Database Migration
Run the Prisma migration to add new fields:
```bash
cd packages/db
npx prisma migrate dev --name add_rbac_system
```

### 2. Supabase Setup
Apply RLS policies in Supabase SQL editor:
```sql
-- Run the contents of:
-- supabase/migrations/20240101000001_rbac_policies.sql
```

### 3. Create Initial Super Admin
In Supabase SQL editor, promote your admin user:
```sql
UPDATE users 
SET role = 'SUPER_ADMIN' 
WHERE email = 'your-email@example.com';
```

### 4. Environment Variables
Ensure these are set in Vercel:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
DATABASE_URL=your-database-url
```

## 🎯 Usage Examples

### Check User Role in Server Components
```typescript
import { getCurrentUser, isAdmin, isSuperAdmin } from '@/lib/auth/rbac'

export default async function AdminPage() {
  const user = await getCurrentUser()
  
  if (!user || !isAdmin()) {
    redirect('/unauthorized')
  }
  
  // Admin content here
}
```

### Protect API Routes
```typescript
import { requireAdmin } from '@/lib/auth/rbac'

export async function POST(request: Request) {
  const user = await requireAdmin()
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Admin-only API logic
}
```

### User Management Actions
```typescript
import { updateUserRole, banUser, unbanUser } from '@/actions/user-actions'

// Promote user to admin (requires super admin)
await updateUserRole(userId, 'ADMIN')

// Ban a user (requires admin)
await banUser(userId, 'Violation of terms')

// Unban a user (requires admin)
await unbanUser(userId)
```

## 🔒 Security Best Practices

1. **Never trust client-side role checks** - Always verify on server
2. **Use middleware for route protection** - Blocks access before page loads
3. **Log all administrative actions** - Maintains audit trail
4. **Implement rate limiting** - Prevent brute force attempts
5. **Regular permission audits** - Review admin list periodically

## 📊 Admin Dashboard Features

### Super Admin Dashboard (`/admin/users/manage`)
- View all users with their roles
- Promote/demote users
- Ban/unban functionality
- View admin activity logs
- Send admin invitations
- Delete users

### Regular Admin Dashboard (`/admin`)
- Manage properties
- View property inquiries
- See user statistics
- Cannot modify user roles

## 🐛 Troubleshooting

### User can't access admin panel
1. Check user role in database
2. Verify `is_active = true` and `banned_at IS NULL`
3. Clear browser cookies and re-login

### Middleware redirecting incorrectly
1. Check middleware.ts matcher config
2. Verify Supabase session is valid
3. Check RLS policies in Supabase

### Role changes not reflecting
1. User needs to log out and back in
2. Clear Next.js cache: `rm -rf .next`
3. Check database directly for role value

## 🎨 UI Components

### Role Badges
- USER: Gray badge
- ADMIN: Blue badge with shield icon
- SUPER_ADMIN: Purple badge with shield icon

### Status Indicators
- Active: Green check
- Banned: Red ban icon
- Inactive: Yellow warning
- Verified: Green verified badge

## 📝 Future Enhancements

1. **Two-factor authentication** for admins
2. **Role-specific permissions** (granular control)
3. **Temporary bans** with auto-expiry
4. **IP-based access control** for admins
5. **Admin activity dashboard** with charts
6. **Email notifications** for role changes
7. **Bulk user operations** for super admins
8. **Custom roles** creation

## 🚨 Important Security Notes

1. **First Super Admin**: Must be set manually in database
2. **Self-Protection**: Users cannot modify their own roles or ban themselves
3. **Cascade Protection**: Super admins cannot be deleted while active
4. **Audit Trail**: Admin actions cannot be deleted or modified
5. **Session Security**: Sessions expire and require re-authentication

## 📧 Email Templates (TODO)

Set up these email templates in Supabase:
1. Admin invitation email
2. Role promotion notification
3. Account banned notification
4. Account unbanned notification

## 🔗 Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
