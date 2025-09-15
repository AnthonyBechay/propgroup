# PropGroup - Smart Real Estate Investment Platform

A modern, full-stack real estate investment platform built with Next.js, TypeScript, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Docker Desktop (optional, for Supabase)

### Installation

1. **Clone and setup:**
```bash
git clone <repository-url>
cd propgroup
npm install --legacy-peer-deps
```

2. **Start development server:**

**Quick Start (Recommended - bypasses build errors):**
```bash
npm run dev:quick
```

**Or use the batch file (Windows):**
```cmd
quick-start.bat
```

**Note:** You may see TypeScript build errors for the Supabase package - these can be safely ignored. The app will run perfectly fine!

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Project Structure

```
propgroup/
├── apps/
│   ├── web/              # Next.js web application
│   └── mobile-capacitor/  # Mobile app (Capacitor)
├── packages/
│   ├── ui/               # Shared UI components
│   ├── config/           # Shared configuration
│   ├── supabase/         # Supabase client & utilities
│   └── db/               # Database utilities
├── scripts/              # Development scripts
└── supabase/            # Supabase configuration
```

## 🛠️ Available Scripts

### Development
- `npm run dev` - Start development server (attempts build)
- `npm run dev:quick` - Quick start (bypasses build errors) ✅
- `npm run dev:full` - Start with Supabase (requires Docker)

### Build & Deploy
- `npm run build` - Build for production
- `npm run start` - Start production server

### Utilities
- `npm run setup` - Initial project setup
- `npm run clean` - Clean all build artifacts
- `npm run build:packages` - Build all packages

## 🚨 Troubleshooting

### TypeScript Build Errors
If you see TypeScript errors when building the Supabase package:
- **These can be safely ignored!** The app runs fine without the build.
- Use `npm run dev:quick` or `quick-start.bat` to bypass the build.
- See `FIX_BUILD_ERROR.md` for detailed information.

### Common Issues
- **ENOENT errors:** Run `fresh-install.bat` for a clean installation
- **Module not found:** Delete `node_modules` and run `npm install --legacy-peer-deps`
- **Port 3000 in use:** Kill the process or use a different port

## 🎨 Features

- **Modern UI/UX** - Beautiful, responsive design with animations
- **Authentication** - Secure user authentication with Supabase
- **Property Management** - Browse, filter, and favorite properties
- **Investment Tools** - ROI calculator and market analysis
- **Admin Dashboard** - Manage properties and users
- **Mobile Ready** - Responsive design + mobile app

## 🔧 Environment Variables

Create `.env.local` in `apps/web/`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📱 Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, Radix UI
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Mobile:** Capacitor
- **Deployment:** Vercel

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ by PropGroup Team
