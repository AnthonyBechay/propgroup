# 🎯 START HERE - PropGroup Complete Guide

Welcome to PropGroup! This guide will get you up and running in minutes.

## 🚀 What is PropGroup?

A **complete real estate investment platform** with:
- Property browsing & filtering
- User authentication (Email + Google OAuth)
- Favorites & portfolio management
- Admin dashboard for property management
- Super admin for user management

## ⚡ Quick Start (Choose Your Path)

### Path 1: Just Want to Test Locally? (5 minutes)

```bash
# 1. Install
pnpm install

# 2. Setup environment
cp apps/backend/.env.example apps/backend/.env
cp apps/web/.env.example apps/web/.env.local
# Edit with your PostgreSQL credentials

# 3. Database
cd packages/db
pnpm run db:migrate
pnpm run db:seed

# 4. Run
cd ../..
pnpm run dev
```

**Login:**
- Admin: `admin@propgroup.com` / `Admin123!`
- User: `user@propgroup.com` / `User123!`

### Path 2: Want to Deploy to Production? (30 minutes)

→ **[Follow QUICKSTART.md](./QUICKSTART.md)**

### Path 3: Want to Understand Everything? (1 hour)

→ **[Read RENDER_SETUP.md](./RENDER_SETUP.md)**

---

## 📚 Documentation Map

### Essential Reads
1. **[README.md](../README.md)** - Project overview (5 min read)
2. **[QUICKSTART.md](./QUICKSTART.md)** - Deploy in 30 minutes
3. **[USER_CYCLE_COMPLETE.md](./USER_CYCLE_COMPLETE.md)** - See what users can do

### Deep Dives
- **[RENDER_SETUP.md](./RENDER_SETUP.md)** - Complete deployment guide
- **[LOGIN_FLOW_VERIFICATION.md](./LOGIN_FLOW_VERIFICATION.md)** - Authentication internals
- **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** - Technical architecture

### Reference
- **[FINAL_VERIFICATION.md](./FINAL_VERIFICATION.md)** - All components verified
- **[CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md)** - Project structure

---

## 🎯 Common Tasks

### I want to...

**...deploy to production**
→ [QUICKSTART.md](./QUICKSTART.md)

**...understand the login system**
→ [LOGIN_FLOW_VERIFICATION.md](./LOGIN_FLOW_VERIFICATION.md)

**...see all user features**
→ [USER_CYCLE_COMPLETE.md](./USER_CYCLE_COMPLETE.md)

**...understand the architecture**
→ [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

**...troubleshoot deployment**
→ [RENDER_SETUP.md](./RENDER_SETUP.md) - Troubleshooting section

**...add a new feature**
→ [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - Files Modified section

---

## 🏗️ Project Structure

```
propgroup/
├── apps/
│   ├── backend/         # Express API (Render)
│   └── web/             # Next.js frontend (Vercel)
├── packages/
│   ├── db/              # Prisma + PostgreSQL
│   ├── ui/              # Shared components
│   └── config/          # Shared config
├── docs/                # YOU ARE HERE 📍
│   ├── 00_START_HERE.md        # This file
│   ├── QUICKSTART.md           # Fast deploy
│   ├── RENDER_SETUP.md         # Full deploy
│   ├── USER_CYCLE_COMPLETE.md  # Features
│   └── ...more guides
└── README.md            # Main overview
```

---

## ✅ Pre-flight Checklist

Before deploying, make sure you have:

- [ ] PostgreSQL database URL
- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Render account (for backend)
- [ ] Vercel account (for frontend)
- [ ] 30 minutes of time

---

## 🆘 Need Help?

### Common Issues

**"ERR_CONNECTION_REFUSED" on login**
→ Set `NEXT_PUBLIC_API_URL` in Vercel to your Render backend URL

**"Database doesn't exist"**
→ Run `pnpm run db:migrate` in `packages/db`

**"Cannot find module '@propgroup/db'"**
→ Run `pnpm install` from root

**Google OAuth not working**
→ Check redirect URIs match exactly in Google Console

### More Help

- **Quick fixes**: [QUICKSTART.md](./QUICKSTART.md) - Common Issues section
- **Detailed troubleshooting**: [RENDER_SETUP.md](./RENDER_SETUP.md) - Part 6
- **All solutions**: [FINAL_VERIFICATION.md](./FINAL_VERIFICATION.md)

---

## 🎉 Ready?

Choose your path and let's go! 🚀

- **Want to test locally?** → Follow "Path 1" above
- **Want to deploy?** → Open [QUICKSTART.md](./QUICKSTART.md)
- **Want to learn?** → Read [USER_CYCLE_COMPLETE.md](./USER_CYCLE_COMPLETE.md)

**Your PropGroup journey starts now! 💪**
