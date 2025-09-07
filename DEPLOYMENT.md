# Deployment Guide

This guide will help you deploy the Smart Investment Portal to production.

## 🚀 Prerequisites

Before deploying, ensure you have:

1. **Supabase Project** - Database and authentication
2. **Resend Account** - Email service
3. **Domain** (optional) - Custom domain for production
4. **GitHub Repository** - Code repository

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

Create a `.env.production` file with production values:

```env
# Database (Production Supabase)
DATABASE_URL="postgresql://postgres:[PROD-PASSWORD]@db.[PROD-PROJECT-REF].supabase.co:5432/postgres"

# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL="https://[PROD-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[PROD-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[PROD-SERVICE-ROLE-KEY]"

# App (Production)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Email (Production)
RESEND_API_KEY="[PROD-RESEND-API-KEY]"
FROM_EMAIL="noreply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"
```

### 2. Database Setup

1. **Create Production Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project for production
   - Note the connection details

2. **Run Database Migrations**
   ```bash
   # Set production DATABASE_URL
   export DATABASE_URL="your-production-database-url"
   
   # Push schema to production
   pnpm db:push
   ```

3. **Create Admin User**
   - Sign up through your production app
   - Go to Supabase Dashboard > Table Editor > `users`
   - Change your user's `role` from `USER` to `ADMIN`

### 3. Email Configuration

1. **Set up Resend**
   - Verify your domain in Resend dashboard
   - Update `FROM_EMAIL` to use your verified domain
   - Test email sending

### 4. Supabase Configuration

1. **Authentication Settings**
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/auth/callback`
   - Email templates (optional)

2. **Storage Setup**
   - Create `user_documents` bucket
   - Set up RLS policies for user-specific access

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `apps/web` directory as root

2. **Configure Environment Variables**
   - Add all production environment variables
   - Set `NEXT_PUBLIC_APP_URL` to your domain

3. **Deploy**
   - Vercel will automatically deploy on push
   - Monitor deployment logs

4. **Custom Domain** (Optional)
   - Add your domain in Vercel dashboard
   - Update DNS records as instructed

### Option 2: Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the `apps/web` directory

2. **Add Database**
   - Add PostgreSQL service
   - Copy connection string to `DATABASE_URL`

3. **Configure Environment**
   - Add all environment variables
   - Set `NEXT_PUBLIC_APP_URL`

4. **Deploy**
   - Railway will build and deploy automatically

### Option 3: Self-Hosted (VPS)

1. **Server Setup**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install pnpm
   npm install -g pnpm
   
   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd smart-investment-portal
   pnpm install
   pnpm build
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env.production
   # Edit .env.production with production values
   ```

4. **Database Setup**
   ```bash
   export DATABASE_URL="your-production-database-url"
   pnpm db:push
   ```

5. **Start Application**
   ```bash
   # Using PM2
   pm2 start "pnpm start" --name "smart-investment-portal"
   pm2 save
   pm2 startup
   ```

6. **Nginx Configuration** (Optional)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Post-Deployment

### 1. Verify Deployment

1. **Test Core Features**
   - User registration/login
   - Property browsing
   - Admin dashboard access
   - Email functionality

2. **Check Database**
   - Verify all tables created
   - Test data insertion
   - Check user roles

3. **Monitor Performance**
   - Check response times
   - Monitor error logs
   - Set up monitoring (optional)

### 2. Security Checklist

- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting implemented (optional)

### 3. Backup Strategy

1. **Database Backups**
   - Enable Supabase automatic backups
   - Set up manual backup schedule

2. **Code Backups**
   - Regular Git pushes
   - Tag releases for rollback

## 📊 Monitoring & Maintenance

### 1. Application Monitoring

Consider setting up:
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics
- **Uptime Monitoring**: UptimeRobot
- **Performance**: Vercel Analytics

### 2. Regular Maintenance

- **Dependency Updates**: Monthly
- **Security Patches**: As needed
- **Database Optimization**: Quarterly
- **Backup Verification**: Weekly

### 3. Scaling Considerations

- **Database**: Supabase auto-scales
- **CDN**: Vercel provides global CDN
- **Caching**: Implement Redis for heavy queries
- **Load Balancing**: For high traffic

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check `DATABASE_URL` format
   - Verify Supabase project is active
   - Check network connectivity

2. **Authentication Issues**
   - Verify Supabase URL and keys
   - Check redirect URLs
   - Clear browser cache

3. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies installed
   - Check TypeScript errors

4. **Email Not Sending**
   - Verify Resend API key
   - Check domain verification
   - Review email templates

### Getting Help

1. Check application logs
2. Review Supabase logs
3. Check Vercel deployment logs
4. Create GitHub issue with details

## 🔄 Updates & Rollbacks

### Deploying Updates

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
pnpm install

# Build and deploy
pnpm build
# (Deployment platform will handle the rest)
```

### Rolling Back

1. **Vercel**: Use deployment history
2. **Railway**: Use deployment history
3. **Self-hosted**: 
   ```bash
   git checkout <previous-commit>
   pnpm build
   pm2 restart smart-investment-portal
   ```

---

## 📞 Support

For deployment issues:
1. Check this guide first
2. Review platform-specific documentation
3. Create GitHub issue with deployment logs
4. Contact platform support if needed

Remember to keep your production credentials secure and never commit them to version control!
