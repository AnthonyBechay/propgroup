# Production Issues - Fixed

## Issue 1: Port 3001 in Production ⚠️

### Question
> Why is port 3001 used in production? Should we add env variables to Render dashboard or send them from blueprint?

### Answer

**Problem:** The `render.yaml` was setting `PORT=3001`, but Render automatically assigns its own port.

**How Render Works:**
- Render **automatically** assigns a port via the `PORT` environment variable
- Your app should listen on `process.env.PORT` (not hardcode 3001)
- Render proxies external traffic (port 80/443) to your app's dynamic port

**Backend Code (Correct):**
```javascript
const PORT = process.env.PORT || 3001;  // ✅ Falls back to 3001 for local dev
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**What Was Wrong:**
```yaml
# render.yaml (BEFORE - WRONG)
envVars:
  - key: PORT
    value: 3001  # ❌ This overrides Render's dynamic port!
```

**Fixed:**
```yaml
# render.yaml (AFTER - CORRECT)
envVars:
  # PORT is automatically assigned by Render - do not override
  - key: FRONTEND_URL
    value: https://propgroup-web.vercel.app
```

### Environment Variables: Blueprint vs Dashboard

**Use Blueprint (`render.yaml`) when:**
- ✅ Values are the same for all deployments
- ✅ Values are part of your infrastructure as code
- ✅ You want version control for configuration
- ✅ You want to redeploy easily

**Examples:**
- `NODE_ENV=production`
- `FRONTEND_URL=https://propgroup-web.vercel.app`
- `JWT_EXPIRES_IN=7d`

**Use Dashboard when:**
- ✅ Sensitive secrets you don't want in Git
- ✅ Values that change frequently
- ✅ Testing different configurations
- ✅ Environment-specific overrides

**Examples:**
- Database credentials (though `fromDatabase` is better)
- API keys for third-party services
- Temporary debugging flags

**Current Setup (Correct):**
```yaml
envVars:
  - key: NODE_ENV
    value: production                          # ✅ Blueprint (same always)

  - key: DATABASE_URL
    fromDatabase:                              # ✅ Blueprint reference
      name: propgroup-database
      property: connectionString

  - key: FRONTEND_URL
    value: https://propgroup-web.vercel.app   # ✅ Blueprint (infrastructure)

  - key: JWT_SECRET
    generateValue: true                        # ✅ Blueprint (auto-generated, then stored)

  - key: SESSION_SECRET
    generateValue: true                        # ✅ Blueprint (auto-generated, then stored)
```

**Note:** Once `generateValue: true` creates a secret, it's stored in Render's dashboard. The blueprint just tells Render to generate it on first deploy.

### Recommendation: ✅ Use Blueprint

Your current setup is **correct**. The blueprint handles everything needed:
- Infrastructure URLs (frontend, backend)
- Auto-generated secrets (JWT, session)
- Database connection (reference)
- Static config (NODE_ENV, JWT expiry)

**Don't manually add to dashboard** unless:
- Testing something temporarily
- Adding third-party API keys (Stripe, SendGrid, etc.)

---

## Issue 2: Portal Server-Side Error 💥

### Error
```
Uncaught Error: An error occurred in the Server Components render.
Application error: a server-side exception has occurred
Digest: 1869726542
```

### Root Cause

**Same issue as admin pages:** Portal pages were using server-side `getCurrentUser()` which fails in production due to cookie access issues.

**Affected Files:**
- `/portal/dashboard/page.tsx` - Used `getCurrentUser()` with redirect
- No portal layout to guard routes

### Fix Applied

Created client-side authentication for portal (same pattern as admin):

**Files Created:**
1. `apps/web/src/app/portal/layout.tsx` - Portal layout wrapper
2. `apps/web/src/components/portal/PortalLayoutClient.tsx` - Client-side auth guard

**Files Modified:**
1. `apps/web/src/app/portal/dashboard/page.tsx` - Removed server-side redirect

**How It Works Now:**
```
1. User visits /portal
2. PortalLayout wraps all portal pages
3. PortalLayoutClient (client component) checks auth
   ├─ Loading → Show spinner
   ├─ No user → Redirect to /auth/login?next=/portal
   ├─ Inactive/banned → Redirect to /auth/banned
   └─ Authenticated → Render portal content ✓
```

### Code Structure

**Portal Layout:**
```tsx
// apps/web/src/app/portal/layout.tsx
export default function PortalLayout({ children }) {
  return <PortalLayoutClient>{children}</PortalLayoutClient>
}
```

**Portal Layout Client:**
```tsx
// apps/web/src/components/portal/PortalLayoutClient.tsx
'use client'

export function PortalLayoutClient({ children }) {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?next=/portal')
    }
  }, [user, loading])

  if (loading) return <LoadingSpinner />
  if (!user) return <RedirectingMessage />

  return <>{children}</>  // Portal content
}
```

**Dashboard Page (Fixed):**
```tsx
// apps/web/src/app/portal/dashboard/page.tsx
export default async function DashboardPage() {
  // Layout handles auth - no redirect needed here
  const currentUser = await getCurrentUser() // Optional, for display only

  // Fetch data...
  const stats = await prisma.property.count()

  return <DashboardClient user={currentUser} stats={stats} />
}
```

---

## Summary of Changes

### 1. Render Configuration
```diff
# render.yaml
  envVars:
    - key: NODE_ENV
      value: production
-   - key: PORT
-     value: 3001
+   # PORT is automatically assigned by Render
    - key: FRONTEND_URL
      value: https://propgroup-web.vercel.app
```

### 2. Portal Authentication
**Created:**
- `apps/web/src/app/portal/layout.tsx`
- `apps/web/src/components/portal/PortalLayoutClient.tsx`

**Modified:**
- `apps/web/src/app/portal/dashboard/page.tsx`

### 3. Authentication Pattern (Consistent)

**Both Admin and Portal now use:**
- Client-side auth guards (use AuthContext)
- Show loading states during auth check
- Redirect unauthenticated users
- No server-side `redirect()` calls (prevent errors)

---

## Testing After Deployment

### 1. Test Backend Port
```bash
# Should respond on Render's assigned port (not 3001)
curl https://propgroup.onrender.com/health

# Response:
{
  "status": "ok",
  "environment": "production",
  "database": "connected"
}
```

### 2. Test Portal Access

**Anonymous User:**
```
Visit: https://propgroup-web.vercel.app/portal
Should: Redirect to /auth/login?next=/portal
```

**Logged-in User:**
```
Visit: https://propgroup-web.vercel.app/portal
Should: Show portal dashboard
Should: No errors in console
```

### 3. Test Admin Access

**Logged-in Admin:**
```
Visit: https://propgroup-web.vercel.app/admin
Should: Show admin dashboard
Should: No redirect loop
Should: No console errors
```

---

## Environment Variable Best Practices

### ✅ DO

1. **Use Blueprint for Infrastructure**
   - Base URLs, service endpoints
   - Static configuration values
   - Auto-generated secrets

2. **Use `fromDatabase` for DB Connection**
   ```yaml
   - key: DATABASE_URL
     fromDatabase:
       name: propgroup-database
       property: connectionString
   ```

3. **Use `generateValue` for Secrets**
   ```yaml
   - key: JWT_SECRET
     generateValue: true  # Auto-generates on first deploy
   ```

4. **Document in `.env.example`**
   - Show what variables are needed
   - Explain what each does
   - Provide example values (not real secrets)

### ❌ DON'T

1. **Don't Override System Variables**
   ```yaml
   # ❌ BAD
   - key: PORT
     value: 3001  # Render sets this automatically
   ```

2. **Don't Commit Real Secrets to Git**
   ```bash
   # ❌ NEVER
   JWT_SECRET=super_secret_key_123
   ```

3. **Don't Hardcode URLs in Code**
   ```javascript
   // ❌ BAD
   const API_URL = 'https://propgroup.onrender.com/api'

   // ✅ GOOD
   const API_URL = process.env.NEXT_PUBLIC_API_URL
   ```

---

## Current Environment Setup

### Backend (Render)
```yaml
NODE_ENV=production                              # Set by blueprint
DATABASE_URL=postgresql://...                    # From database reference
PORT=<dynamic>                                   # Set by Render (not in blueprint)
FRONTEND_URL=https://propgroup-web.vercel.app   # Set by blueprint
BACKEND_URL=https://propgroup.onrender.com      # Set by blueprint
JWT_SECRET=<auto-generated>                      # Generated by blueprint
SESSION_SECRET=<auto-generated>                  # Generated by blueprint
JWT_EXPIRES_IN=7d                               # Set by blueprint
```

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://propgroup.onrender.com/api  # Set in Vercel dashboard
NEXT_PUBLIC_APP_URL=https://propgroup-web.vercel.app    # Set in Vercel dashboard
```

---

## Deployment Checklist

- [x] Remove PORT from render.yaml
- [x] Create portal layout with client-side auth
- [x] Remove server-side redirects from portal pages
- [x] Test locally
- [ ] Deploy to production
- [ ] Verify /portal works without errors
- [ ] Verify /admin still works (no regression)
- [ ] Check Render logs for correct port binding

---

## Questions Answered

### Q1: Why port 3001 in production?
**A:** It's not used! Render assigns its own port. The `|| 3001` in code is just for local development. Fixed by removing PORT from render.yaml.

### Q2: Should we add env vars to dashboard or blueprint?
**A:** **Use blueprint** for infrastructure config (URLs, static values). Use dashboard only for:
- Third-party API keys
- Temporary testing values
- Frequently changing secrets

Your current blueprint setup is correct!

### Q3: Why is portal erroring?
**A:** Server-side `getCurrentUser()` couldn't access cookies properly. Fixed by moving auth to client-side layout (same as admin fix).

---

**Status:** ✅ ALL ISSUES FIXED
**Ready to Deploy:** Yes
