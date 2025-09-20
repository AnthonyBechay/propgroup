# Super Admin Setup Guide

This guide shows you how to create your first super admin user following Supabase best practices.

## 🚀 Quick Setup (Recommended)

### Method 1: Using the Setup Script

1. **Set your email as an environment variable:**
   ```bash
   export SUPER_ADMIN_EMAIL="your-email@example.com"
   npm run setup:super-admin
   ```

2. **Or pass the email directly:**
   ```bash
   npm run setup:super-admin your-email@example.com
   ```

### Method 2: Using the Web Interface (Development Only)

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit the setup page:**
   ```
   http://localhost:3000/setup
   ```

3. **Enter your email and click "Create Super Admin"**

### Method 3: Using the API (Development Only)

```bash
curl -X POST http://localhost:3000/api/setup/create-super-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-setup-only" \
  -d '{"email": "your-email@example.com"}'
```

## 📋 Prerequisites

Make sure you have these environment variables set:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url

# Optional (for API method)
SETUP_SECRET=your_secret_key
```

## 🔐 After Creating the Super Admin

1. **Set your password:**
   - Go to your app's login page
   - Click "Forgot Password"
   - Enter your email
   - Set a new password

2. **Log in and access admin features:**
   - Visit `/admin` for the admin dashboard
   - Visit `/admin/users/manage` to manage other users

## 🛡️ Security Features

- **Automatic Sync**: User metadata is automatically synced between Supabase and your database
- **Role Management**: Super admins can promote/demote other users
- **Audit Logging**: All admin actions are logged
- **Ban System**: Users can be banned with reasons
- **Self-Protection**: Super admins cannot ban or demote themselves

## 🔧 Database Triggers

The setup includes Supabase triggers that automatically:
- Create users in your database when they sign up
- Update user roles when metadata changes
- Sync email verification status
- Maintain data consistency

## 🚨 Important Notes

- **Development Only**: The web setup page is only available in development mode
- **One-Time Use**: This is typically used once to create the initial super admin
- **Secure**: The API endpoint requires proper authentication in production
- **Backup**: Always backup your database before running setup scripts

## 🆘 Troubleshooting

### "User already exists" Error
- The user already exists in Supabase or your database
- The script will update their role to SUPER_ADMIN if needed

### "Supabase configuration missing" Error
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Verify the values are correct

### "Database connection failed" Error
- Check that `DATABASE_URL` is set correctly
- Ensure your database is running and accessible

### "Unauthorized" Error (API)
- In development: Use `Bearer dev-setup-only`
- In production: Set `SETUP_SECRET` environment variable and use that value

## 📚 Next Steps

After creating your super admin:

1. **Create other admins** using the admin panel at `/admin/users/manage`
2. **Set up your properties** using the property management interface
3. **Configure system settings** as needed
4. **Review audit logs** to monitor admin activity

## 🔒 Production Deployment

For production deployments:

1. **Use the setup script** with proper environment variables
2. **Remove or secure** the setup page and API endpoints
3. **Set strong passwords** for all admin accounts
4. **Enable email verification** in Supabase settings
5. **Monitor audit logs** regularly

---

**Need help?** Check the main README or contact your system administrator.
