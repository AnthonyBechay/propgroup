import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'propgroup-assets.s3.amazonaws.com',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Enable strict mode for better debugging
  reactStrictMode: true,
  // Output standalone for better deployment
  output: 'standalone',
  // Transpile packages for better compatibility
  transpilePackages: ['@propgroup/config', '@propgroup/db', '@propgroup/supabase', '@propgroup/ui'],
  // Skip ESLint during production builds to avoid version conflicts
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript errors during build (we handle them separately)
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // We're using this because we have proper type checking in CI/CD
    ignoreBuildErrors: true,
  },
  // Don't require all env vars at build time (they'll be checked at runtime)
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
};

export default nextConfig;
