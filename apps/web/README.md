# Smart Investment Portal - Web App

This is the Next.js web application for the Smart Investment Portal.

## Features

- **Authentication**: Supabase Auth with email/password login
- **Protected Routes**: Middleware-based route protection for `/portal/*`
- **API Routes**: Contact form with Zod validation and Resend email integration
- **Shared Components**: Uses shared UI components from `@propgroup/ui`
- **Type Safety**: Full TypeScript support with shared types from `@propgroup/config`

## Environment Setup

1. Copy the environment variables:
   ```bash
   cp ../../env.example .env.local
   ```

2. Update the following variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   RESEND_API_KEY=your_resend_api_key
   ```

## Development

```bash
npm run dev
```

## Authentication Flow

1. **Sign Up**: Users can create accounts with email/password
2. **Sign In**: Existing users can sign in
3. **Protected Routes**: `/portal/*` routes require authentication
4. **Middleware**: Automatically redirects unauthenticated users

## API Routes

### POST /api/contact

Handles property inquiry submissions with:
- Zod validation using `contactFormSchema`
- Email notifications via Resend
- Proper error handling and responses

## Components

- **AuthModal**: Login/signup modal with form validation
- **AuthSection**: Authentication state display and controls
- **PropertyCard**: Shared property display component

## Security Features

- **Route Protection**: Middleware-based authentication
- **Input Validation**: Zod schemas for all API inputs
- **Error Handling**: Comprehensive error responses
- **Type Safety**: Full TypeScript coverage