# Authentication Redirect Loop - Fixed

## 🔍 Root Cause

The redirect loop between `/auth/login` and `/admin` was caused by:

1. **Server/Client State Mismatch**: Admin layout uses server-side `getCurrentUser()` while login page uses client-side `AuthContext`
2. **Network Issues**: If the backend API is slow or unreachable, `getCurrentUser()` returns `null`
3. **Cookie Configuration**: Cross-origin cookies need special configuration in production
4. **Race Conditions**: Multiple redirects happening simultaneously

## ✅ Fixes Applied

### 1. Enhanced Middleware (`apps/web/src/middleware.ts`)
- Added explicit login page handling to prevent loops
- Changed redirect from `/` to `/auth/login` with `next` parameter
- Better error logging with `[Middleware]` prefix

### 2. Improved Admin Layout (`apps/web/src/app/(admin)/layout.tsx`)
- Added banned account check before role check
- Better error handling flow
- Prevents unauthorized access more reliably

### 3. Login Page Protection (`apps/web/src/app/auth/login/page.tsx`)
- Added banned account detection
- Prevents redirect if account is inactive
- Handles edge cases better

### 4. Better Error Logging

**API Client** (`apps/web/src/lib/api/client.ts`):
- Detailed error messages with `[API]` prefix
- Network error detection
- Status code logging

**RBAC Helper** (`apps/web/src/lib/auth/rbac.ts`):
- Network error detection with `[rbac]` prefix
- Helps identify when backend is unreachable

### 5. Backend Cookie Fix (`apps/backend/src/routes/auth.js`)
- Logout now clears cookie with same options as when set
- Ensures proper cookie removal in production

### 6. Debug Page (`apps/web/src/app/auth/debug`)
- Visit `https://propgroup-web.vercel.app/auth/debug` to diagnose issues
- Shows auth state, environment config, and API connectivity
- Helps identify configuration problems

## 🚀 Deployment Checklist

### Vercel Environment Variables (Frontend)

```bash
NEXT_PUBLIC_API_URL=https://propgroup.onrender.com/api
```

**CRITICAL**: Must end with `/api` (no trailing slash)

### Render Environment Variables (Backend)

```bash
FRONTEND_URL=https://propgroup-web.vercel.app
NODE_ENV=production
JWT_SECRET=your-secret-key-here
```

**CRITICAL**: `FRONTEND_URL` must match your Vercel deployment URL exactly

### After Deployment

1. **Clear Browser Cookies**
   - Go to Application → Cookies in DevTools
   - Delete all cookies for both domains
   - This removes stale/invalid tokens

2. **Test Login Flow**
   ```
   1. Visit https://propgroup-web.vercel.app/auth/login
   2. Login with admin credentials
   3. Should redirect to /admin WITHOUT loop
   4. Refresh /admin page - should stay on /admin
   ```

3. **Check Debug Page**
   ```
   Visit: https://propgroup-web.vercel.app/auth/debug

   Verify:
   - ✓ User Loaded: Yes
   - ✓ Role: ADMIN or SUPER_ADMIN
   - ✓ Active: Yes
   - ✓ API URL: Shows backend URL
   - ✓ Test API: Success
   ```

4. **Check Browser Console**
   - Should NOT see repeated redirects
   - Should NOT see CORS errors
   - Should NOT see 401 errors after login

## 🐛 Troubleshooting

### Issue: Still Getting Redirect Loop

**Symptoms**: URL keeps switching between `/auth/login?next=/admin` and `/admin`

**Solutions**:
1. Check backend is running: `https://propgroup.onrender.com/health`
2. Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
3. Clear browser cookies and try again
4. Check browser console for errors
5. Visit `/auth/debug` to see auth state

### Issue: User is Null After Login

**Symptoms**: Login succeeds but `getCurrentUser()` returns null

**Solutions**:
1. Check `NEXT_PUBLIC_API_URL` environment variable
2. Verify backend `FRONTEND_URL` includes your Vercel URL
3. Check CORS configuration in backend
4. Ensure backend is running and healthy

### Issue: CORS Errors

**Symptoms**: Browser console shows "blocked by CORS policy"

**Solutions**:
1. Add Vercel URL to backend `FRONTEND_URL` environment variable
2. Ensure backend CORS config includes `credentials: true`
3. Check backend uses `sameSite: 'none'` in production
4. Verify backend is served over HTTPS (Render does this automatically)

### Issue: Cookies Not Being Sent

**Symptoms**: API calls don't include authentication token

**Solutions**:
1. Verify backend sets cookies with:
   - `httpOnly: true`
   - `secure: true` (in production)
   - `sameSite: 'none'` (in production)
2. Check frontend sends `credentials: 'include'` (already configured)
3. Ensure both frontend and backend are HTTPS
4. Clear cookies and login again

## 📊 How to Verify Fix

### Method 1: Browser DevTools

1. Open DevTools → Network tab
2. Login as admin
3. Watch for these requests:
   ```
   POST /api/auth/login → 200 OK (sets cookie)
   GET /admin → 200 OK (no redirect)
   GET /api/auth/me → 200 OK (returns user)
   ```

### Method 2: Debug Page

1. Visit `/auth/debug`
2. All checks should be green:
   - User Loaded: Yes
   - Active: Yes
   - API Test: Success

### Method 3: Manual Testing

```bash
# Test 1: Login
curl -X POST https://propgroup.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@propgroup.com","password":"Admin123!"}' \
  -c cookies.txt -v

# Test 2: Get Current User
curl https://propgroup.onrender.com/api/auth/me \
  -b cookies.txt -v

# Should return user data with 200 OK
```

## 🔐 Security Notes

All authentication uses:
- ✅ HTTP-only cookies (prevents XSS attacks)
- ✅ Secure cookies in production (HTTPS only)
- ✅ SameSite cookies (prevents CSRF attacks)
- ✅ JWT with 7-day expiration
- ✅ bcrypt password hashing (12 rounds)
- ✅ Server-side validation on every request

## 📝 Redeploy Instructions

### Frontend (Vercel)

```bash
git add .
git commit -m "fix: resolve auth redirect loop"
git push origin master
```

Vercel auto-deploys on push to master.

### Backend (Render)

Render auto-deploys on push to master.

**Manual redeploy:**
1. Go to Render dashboard
2. Select `propgroup` service
3. Click "Manual Deploy" → "Deploy latest commit"

## 🎯 Expected Behavior After Fix

### Scenario 1: Logged Out User Visits /admin
```
1. User visits /admin
2. Middleware sees no token → redirects to /auth/login?next=/admin
3. User logs in
4. Login page redirects to /admin
5. Admin layout validates user → shows dashboard
✓ NO LOOP
```

### Scenario 2: Logged In Admin Visits /login
```
1. User visits /auth/login
2. AuthContext detects user is already logged in
3. Login page redirects to /admin
4. Admin layout validates user → shows dashboard
✓ NO LOOP
```

### Scenario 3: Logged In Admin Refreshes /admin
```
1. User refreshes /admin page
2. Middleware sees token → allows access
3. Admin layout calls getCurrentUser() → returns user
4. Dashboard renders
✓ NO LOOP, NO REDIRECT
```

## ✅ Validation Complete

The fixes have been applied and tested. After redeployment:

1. Clear browser cookies
2. Test all scenarios above
3. Check `/auth/debug` page
4. Monitor for any console errors

If issues persist, check the Troubleshooting section or examine the logs:
- Vercel: https://vercel.com/dashboard → Your Project → Logs
- Render: https://dashboard.render.com → Your Service → Logs
