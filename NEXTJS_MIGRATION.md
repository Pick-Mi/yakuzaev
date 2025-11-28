# Next.js Migration Guide

## Setup Instructions

### 1. Install Dependencies

```bash
npm install next@latest react@latest react-dom@latest
npm install @supabase/ssr @supabase/supabase-js
npm install @tanstack/react-query
npm install -D @types/node
```

### 2. Update package.json Scripts

Replace your scripts section with:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### 3. Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

### 4. File Structure Created

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page (SSR)
│   ├── globals.css         # Global styles
│   ├── providers.tsx       # Client-side providers
│   ├── auth/
│   │   ├── page.tsx        # Auth page (server component)
│   │   └── auth-form.tsx   # Auth form (client component)
│   └── products/
│       ├── page.tsx        # Products list (SSR)
│       └── [slug]/
│           └── page.tsx    # Product detail (SSR + ISR)
├── lib/
│   └── supabase/
│       ├── client.ts       # Client-side Supabase
│       └── server.ts       # Server-side Supabase
└── middleware.ts           # Auth middleware
```

### 5. What's Configured

✅ **App Router** - Modern Next.js routing with Server Components
✅ **Supabase SSR** - Client and server-side Supabase clients
✅ **Authentication Middleware** - Protected routes
✅ **Tailwind CSS** - Full design system from existing project
✅ **React Query** - Client-side data fetching
✅ **SEO Metadata** - Dynamic metadata generation
✅ **301 Redirects** - All legacy route redirects

### 6. Running the App

```bash
npm run dev
```

Visit http://localhost:3000

### 7. Testing SSR

Right-click → "View Page Source" on any page to see fully rendered HTML.

### 8. Migration Checklist

- [ ] Install dependencies
- [ ] Update package.json scripts
- [ ] Copy .env.local.example to .env.local
- [ ] Copy remaining components from src/components
- [ ] Copy remaining pages (blogs, cart, checkout, etc.)
- [ ] Test all routes
- [ ] Test authentication flow
- [ ] Verify SEO metadata
- [ ] Deploy to Vercel

### 9. Key Differences from Vite

- **No React Router** - Use Next.js App Router (file-based)
- **Server Components** - Default for better performance
- **'use client' directive** - Required for interactivity
- **Metadata API** - Replaces react-helmet
- **Built-in Image Optimization** - Use next/image

### 10. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

## Need Help?

- Next.js Docs: https://nextjs.org/docs
- Supabase SSR: https://supabase.com/docs/guides/auth/server-side/nextjs
- App Router: https://nextjs.org/docs/app
