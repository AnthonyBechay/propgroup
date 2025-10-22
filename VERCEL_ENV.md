# Vercel Environment Variables

Update your Vercel environment variables with the correct backend URL.

---

## 🔧 Required Environment Variable

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

### Update NEXT_PUBLIC_API_URL

**Current value** (if you set a temporary one):
```
NEXT_PUBLIC_API_URL=https://propgroup-backend.onrender.com/api
```

**Correct value** (based on your actual Render service name):
```
NEXT_PUBLIC_API_URL=https://propgroup.onrender.com/api
```

⚠️ **Note**: Your service name is `propgroup` (not `propgroup-backend`)

---

## 📋 How to Update

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click on your project (propgroup-web)
3. Go to **Settings** → **Environment Variables**
4. Find `NEXT_PUBLIC_API_URL`
5. Click **Edit**
6. Update to: `https://propgroup.onrender.com/api`
7. Click **Save**
8. **Redeploy** your frontend:
   - Go to **Deployments** tab
   - Click "..." on latest deployment → **Redeploy**

---

## ✅ Final Configuration

After update, your environment variable should be:

```bash
NEXT_PUBLIC_API_URL=https://propgroup.onrender.com/api
```

---

## 🔍 Verify

After redeploying:

1. Visit: https://propgroup-web.vercel.app
2. Open browser console (F12)
3. Go to Network tab
4. Navigate around the app
5. Should see API calls to: `https://propgroup.onrender.com/api/...`
6. Should **NOT** see any CORS errors

---

## Optional: Add for Production

```bash
# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

---

## Quick Reference

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://propgroup.onrender.com/api` |

**Remember**: Variables starting with `NEXT_PUBLIC_` are exposed to the browser.
