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
│       ├── page.tsx        # Products list
│       └── [slug]/
│           └── page.tsx    # Product detail (SSR metadata only)
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

## Component Migration Strategy

**Important**: The existing Vite components are designed for client-side rendering. You have two migration paths:

### Path 1: Minimal Changes (Recommended for Quick Migration)
- Keep all existing components as client components
- Add `'use client'` directive to all interactive components
- Use server components only for layouts and metadata
- This maintains all existing functionality with minimal refactoring

**Example**:
```tsx
// app/products/[slug]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
// ... copy rest of Product.tsx implementation exactly as-is
```

### Path 2: Full SSR Optimization (Better Performance)
- Refactor components to separate server and client concerns
- Pass data as props from server components
- Move data fetching to server components
- Only mark interactive parts as client components
- More work but better performance and SEO

## Migration Steps

### Phase 1: Copy All Components

1. **Copy Component Files**
   ```bash
   # Copy all components from Vite project
   cp -r vite-project/src/components nextjs-project/src/
   ```

2. **Add 'use client' Directive**
   - Add to top of components that use:
     - React hooks (useState, useEffect, etc.)
     - Event handlers (onClick, onChange, etc.)
     - Browser APIs (window, document, localStorage)
     - React Context consumers
   
   Example:
   ```tsx
   'use client';
   
   import { useState } from 'react';
   // ... rest of component
   ```

### Phase 2: Migrate Pages

3. **Copy Page Logic**
   For each page in `src/pages/`, create corresponding route in `src/app/`:
   
   - `src/pages/Index.tsx` → `src/app/page.tsx` ✅ (already done)
   - `src/pages/Products.tsx` → `src/app/products/page.tsx` ✅ (already done)
   - `src/pages/Product.tsx` → `src/app/products/[slug]/page.tsx` (needs migration)
   - `src/pages/Blogs.tsx` → `src/app/blogs/page.tsx`
   - `src/pages/BlogDetail.tsx` → `src/app/blogs/[slug]/page.tsx`
   - `src/pages/Cart.tsx` → `src/app/cart/page.tsx`
   - etc.

4. **Migrate Product Detail Page**
   The Product.tsx page is complex. Recommended approach:
   
   ```tsx
   // app/products/[slug]/page.tsx
   'use client';
   
   import { useParams } from 'next/navigation';
   // Copy all imports from Product.tsx
   // Copy all component logic from Product.tsx
   // Replace useParams from react-router-dom with next/navigation
   // Replace navigate from react-router-dom with useRouter from next/navigation
   ```

### Phase 3: Authentication & Context

5. **Migrate Auth Context**
   - Copy `src/hooks/useAuth.tsx` to Next.js
   - Add `'use client'` at the top
   - Update to use Next.js navigation

6. **Migrate Cart Context**
   - Copy `src/hooks/useCart.tsx` to Next.js
   - Add `'use client'` at the top

### Phase 4: SEO & Metadata

7. **Add Metadata to Server Components**
   For each page, add metadata export:
   
   ```tsx
   // Server component metadata
   export const metadata: Metadata = {
     title: 'Page Title',
     description: 'Page description',
   };
   
   // For dynamic metadata
   export async function generateMetadata({ params }): Promise<Metadata> {
     const data = await fetchData(params.slug);
     return {
       title: data.meta_title,
       description: data.meta_description,
     };
   }
   ```

8. **Remove react-helmet**
   - Remove `<Helmet>` components from client pages
   - Use Next.js metadata API in server components instead

### Phase 5: Testing

9. **Test All Routes**
   - Visit each route: `/`, `/products`, `/products/neu`, `/blogs`, etc.
   - Right-click → "View Page Source" to verify SSR
   - Check that SEO meta tags are visible in source
   - Test authentication flows
   - Test cart functionality

10. **Performance Check**
    - Check Lighthouse scores
    - Verify images are optimized
    - Check bundle sizes

## Key Differences to Note

| Feature | Vite/React Router | Next.js App Router |
|---------|-------------------|-------------------|
| **Routing** | Components in pages/ + React Router | File-based routing in app/ |
| **Data Fetching** | useEffect + fetch | async/await in server components |
| **SEO** | react-helmet | Metadata API |
| **Links** | `<Link>` from react-router | `<Link>` from next/link |
| **Navigation** | `useNavigate()` | `useRouter()` from next/navigation |
| **Params** | `useParams()` from react-router | `useParams()` from next/navigation |
| **Component Type** | All client-side | Server by default, client with `'use client'` |

## Running the App

```bash
npm run dev
```

Visit http://localhost:3000

## Testing SSR

Right-click → "View Page Source" on any page to see fully rendered HTML with:
- Complete product/blog content
- SEO meta tags
- Open Graph tags
- JSON-LD structured data

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Your app will be available at: `yourproject.vercel.app`

### Alternative: Self-Host

```bash
npm run build
npm start
```

Requires Node.js server environment.

## Troubleshooting

### "use client" directive errors
- Add `'use client'` to any component using hooks, events, or browser APIs

### Import errors
- Update imports: `react-router-dom` → `next/navigation`
- Update imports: `@/hooks/use-toast` (correct path for shadcn)

### Hydration errors
- Ensure server and client render the same content
- Avoid using browser APIs during initial render
- Use `useEffect` for browser-specific code

### Image optimization
- Replace `<img>` with `<Image>` from `next/image`
- Add remote patterns in `next.config.mjs`

## Need Help?

- Next.js Docs: https://nextjs.org/docs
- Supabase SSR: https://supabase.com/docs/guides/auth/server-side/nextjs
- App Router: https://nextjs.org/docs/app
- Migration Guide: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration
