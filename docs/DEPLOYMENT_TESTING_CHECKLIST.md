# ✅ Deployment Testing Checklist

Complete checklist to verify your PropGroup deployment is working correctly.

---

## 🎯 Pre-Deployment Verification

### Local Testing (Before Deploying)

Run these tests locally to ensure everything works:

#### 1. Backend Starts Successfully
```bash
cd apps/backend
pnpm run dev
```

**Expected Output:**
```
🚀 Server running on port 3001
🌍 Environment: development
🔗 Frontend URL: http://localhost:3000
```

#### 2. Frontend Starts Successfully
```bash
cd apps/web
pnpm run dev
```

**Expected Output:**
```
✓ Ready in 3.2s
○ Local:   http://localhost:3000
```

#### 3. Database Connection Works
```bash
cd packages/db
pnpm run db:studio
```

**Expected:** Prisma Studio opens in browser

---

## 🚀 Production Deployment Testing

### Backend (Render) Tests

#### 1. ✅ Health Check
**URL:** `https://your-backend.onrender.com/health`

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-10-21T16:00:00.000Z",
  "environment": "production"
}
```

**Status:** Pass ☐ / Fail ☐

---

#### 2. ✅ CORS Headers
**Test:** Visit your frontend, open browser console

**Expected:** No CORS errors when making API requests

**Status:** Pass ☐ / Fail ☐

---

#### 3. ✅ Database Connection
**Check:** Render logs show no database errors

**Expected Log:**
```
✅ Prisma client connected to database
```

**Status:** Pass ☐ / Fail ☐

---

### Frontend (Vercel) Tests

#### 1. ✅ Homepage Loads
**URL:** `https://your-app.vercel.app`

**Expected:** Homepage loads without errors

**Status:** Pass ☐ / Fail ☐

---

#### 2. ✅ API Connection
**Check:** Browser console, Network tab

**Expected:** API calls go to `https://your-backend.onrender.com/api`

**Status:** Pass ☐ / Fail ☐

---

## 🔐 Authentication Flow Tests

### Test 1: User Registration (Email/Password)

#### Step 1: Navigate to Signup
**URL:** `https://your-app.vercel.app/auth/signup`

**Expected:** Signup form appears

**Status:** Pass ☐ / Fail ☐

---

#### Step 2: Fill Form
**Test Data:**
```
Email: test@example.com
Password: TestPassword123!
First Name: Test
Last Name: User
```

**Action:** Click "Sign Up"

**Expected:**
- Loading indicator appears
- No console errors
- Request goes to `/api/auth/register`

**Status:** Pass ☐ / Fail ☐

---

#### Step 3: Registration Success
**Expected:**
- User is redirected to homepage or dashboard
- User is logged in (check nav bar for user info)
- No error messages

**Check Browser Console:**
```
Should see: API request successful
Should NOT see: ERR_CONNECTION_REFUSED, CORS errors
```

**Status:** Pass ☐ / Fail ☐

---

#### Step 4: Verify in Database
**Action:** Check Render PostgreSQL or Prisma Studio

**Expected:** New user exists with:
- Email: test@example.com
- Role: USER
- Provider: local
- Password: (hashed)

**Status:** Pass ☐ / Fail ☐

---

### Test 2: User Login (Email/Password)

#### Step 1: Logout (if logged in)
**Action:** Click logout in nav

**Expected:** Redirected to homepage, user no longer shown

**Status:** Pass ☐ / Fail ☐

---

#### Step 2: Navigate to Login
**URL:** `https://your-app.vercel.app/auth/login`

**Expected:** Login form appears

**Status:** Pass ☐ / Fail ☐

---

#### Step 3: Submit Login
**Test Data:**
```
Email: test@example.com
Password: TestPassword123!
```

**Action:** Click "Sign In"

**Expected:**
- Loading indicator
- Request to `/api/auth/login`
- No errors

**Status:** Pass ☐ / Fail ☐

---

#### Step 4: Login Success
**Expected:**
- User redirected to homepage/dashboard
- User info shown in nav
- JWT cookie set (check DevTools → Application → Cookies)

**Check Cookie:**
```
Name: token
Value: (JWT string)
HttpOnly: true
Secure: true (if production)
```

**Status:** Pass ☐ / Fail ☐

---

### Test 3: Admin Login

#### Step 1: Login as Admin
**Credentials:**
```
Email: admin@propgroup.com
Password: Admin123!
```

**Expected:** Redirected to `/admin` dashboard

**Status:** Pass ☐ / Fail ☐

---

#### Step 2: Verify Admin Access
**Check:**
- Can access `/admin` route
- Can see admin menu items
- Can view users, properties, etc.

**Status:** Pass ☐ / Fail ☐

---

### Test 4: Google OAuth (If Configured)

#### Step 1: Click Google Sign-In
**URL:** `https://your-app.vercel.app/auth/login`

**Action:** Click "Sign in with Google" button

**Expected:** Redirected to Google consent screen

**Status:** Pass ☐ / Fail ☐ / Not Configured ☐

---

#### Step 2: Approve Consent
**Action:** Click "Allow" on Google consent

**Expected:**
- Redirected back to your app
- URL contains `/auth/callback?success=true`

**Status:** Pass ☐ / Fail ☐ / Not Configured ☐

---

#### Step 3: OAuth Login Success
**Expected:**
- User logged in automatically
- User info shown in nav
- JWT cookie set

**Status:** Pass ☐ / Fail ☐ / Not Configured ☐

---

## 🏠 Feature Tests

### Test 5: Browse Properties

#### Step 1: View Properties
**URL:** `https://your-app.vercel.app/properties`

**Expected:**
- List of properties appears
- 6 seeded properties visible
- Images load correctly

**Status:** Pass ☐ / Fail ☐

---

#### Step 2: Filter Properties
**Action:** Use filters (country, price, bedrooms)

**Expected:**
- Filters work correctly
- Results update

**Status:** Pass ☐ / Fail ☐

---

### Test 6: Favorite Properties (Requires Login)

#### Step 1: Login
**Credentials:** Use test account from Test 1

**Status:** Pass ☐ / Fail ☐

---

#### Step 2: Add to Favorites
**Action:**
1. Browse to any property detail page
2. Click heart icon

**Expected:**
- Heart icon fills in
- "Added to favorites" message
- Request to `/api/favorites/{propertyId}`

**Status:** Pass ☐ / Fail ☐

---

#### Step 3: View Favorites
**URL:** `https://your-app.vercel.app/portal/favorites`

**Expected:**
- Favorited property appears in list
- Can remove from favorites

**Status:** Pass ☐ / Fail ☐

---

#### Step 4: Remove from Favorites
**Action:** Click filled heart icon

**Expected:**
- Heart empties
- Property removed from favorites list
- Request to `DELETE /api/favorites/{propertyId}`

**Status:** Pass ☐ / Fail ☐

---

### Test 7: Submit Inquiry

#### Step 1: Navigate to Property
**Action:** Click any property

**Expected:** Property detail page opens

**Status:** Pass ☐ / Fail ☐

---

#### Step 2: Fill Inquiry Form
**Test Data:**
```
Name: Test User
Email: test@example.com
Phone: +1234567890
Message: I'm interested in this property
```

**Action:** Submit inquiry

**Expected:**
- Success message
- Request to `/api/inquiries`
- No errors

**Status:** Pass ☐ / Fail ☐

---

### Test 8: Admin Property Management

#### Step 1: Login as Admin
**Credentials:**
```
Email: admin@propgroup.com
Password: Admin123!
```

**Status:** Pass ☐ / Fail ☐

---

#### Step 2: Create Property
**URL:** `https://your-app.vercel.app/admin/properties/new`

**Action:** Fill form and create property

**Expected:**
- Property created successfully
- Appears in properties list
- Request to `POST /api/properties`

**Status:** Pass ☐ / Fail ☐

---

#### Step 3: Edit Property
**Action:** Edit the created property

**Expected:**
- Form pre-filled
- Updates save correctly
- Request to `PUT /api/properties/{id}`

**Status:** Pass ☐ / Fail ☐

---

#### Step 4: Delete Property
**Action:** Delete the created property

**Expected:**
- Confirmation dialog
- Property deleted
- Request to `DELETE /api/properties/{id}`

**Status:** Pass ☐ / Fail ☐

---

## 🛡️ Security Tests

### Test 9: Protected Routes

#### Step 1: Logout
**Action:** Ensure logged out

**Status:** Pass ☐ / Fail ☐

---

#### Step 2: Try to Access Protected Pages
**URLs to Test:**
```
/admin
/portal/favorites
/admin/properties
```

**Expected:** Redirected to `/auth/login`

**Status:** Pass ☐ / Fail ☐

---

### Test 10: API Authentication

#### Step 1: Try API Without Auth
**Test:** In browser console:
```javascript
fetch('https://your-backend.onrender.com/api/favorites')
  .then(r => r.json())
  .then(console.log)
```

**Expected:**
```json
{
  "error": "Unauthorized",
  "message": "No authentication token provided"
}
```

**Status:** Pass ☐ / Fail ☐

---

## 📊 Final Checklist

### Backend (Render)
- [ ] Health endpoint works
- [ ] Database connected
- [ ] Migrations applied
- [ ] All environment variables set
- [ ] No errors in logs

### Frontend (Vercel)
- [ ] Homepage loads
- [ ] API URL configured correctly
- [ ] No CORS errors
- [ ] No console errors

### Authentication
- [ ] User can register with email/password
- [ ] User can login with email/password
- [ ] Admin can login
- [ ] Google OAuth works (if configured)
- [ ] Logout works
- [ ] Protected routes require login

### Features
- [ ] Properties display correctly
- [ ] Filters work
- [ ] Favorites add/remove works
- [ ] Inquiries submit successfully
- [ ] Admin can create properties
- [ ] Admin can edit properties
- [ ] Admin can delete properties

### Security
- [ ] Passwords are hashed
- [ ] JWT tokens in HTTP-only cookies
- [ ] Protected routes redirect to login
- [ ] API rejects unauthorized requests
- [ ] CORS configured correctly

---

## 🎉 Success Criteria

**Your deployment is successful if:**
- ✅ All Backend tests pass
- ✅ All Frontend tests pass
- ✅ All Authentication tests pass
- ✅ At least 80% of Feature tests pass
- ✅ All Security tests pass

---

## 🆘 If Tests Fail

### Common Issues

**ERR_CONNECTION_REFUSED**
→ `NEXT_PUBLIC_API_URL` not set in Vercel

**CORS Error**
→ `FRONTEND_URL` not set correctly in Render

**Login fails**
→ Check JWT_SECRET and SESSION_SECRET are set

**Database errors**
→ Verify DATABASE_URL and migrations applied

**Google OAuth fails**
→ Check redirect URIs match exactly

### Detailed Troubleshooting
See [RENDER_SETUP.md](./RENDER_SETUP.md) - Part 6: Verification & Testing

---

**Use this checklist every time you deploy! 📝**
