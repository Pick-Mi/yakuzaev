# SSR Deployment Guide for Yakuza EV

This guide explains how to enable Server-Side Rendering (SSR) for your production site to make it SEO-friendly.

## 🚀 What's Already Working

Your Lovable project has a **fully functional SSR Edge Function** that renders pages server-side:
- ✅ Home page
- ✅ All product pages
- ✅ All blog posts
- ✅ About, Contact, Careers, Dealer pages
- ✅ Complete HTML with meta tags and schema markup

**Test it now:** https://tqhwoizjlvjdiuemirsy.supabase.co/functions/v1/ssr-renderer?path=/products/neu

## ⚠️ Current Limitation

The SSR Edge Function is **not integrated** as your site's entry point. Currently:
- Your site serves a static React app (client-side rendering)
- Search engines see minimal content in "View Page Source"
- The SSR function only works when accessed directly

## 🎯 Solution: Cloudflare Workers Proxy

To enable SSR for your production domain, use Cloudflare Workers to proxy requests through the SSR Edge Function.

### Step 1: Set Up Cloudflare

1. **Add your domain to Cloudflare** (if not already):
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Click "Add a Site"
   - Follow the instructions to update your nameservers

2. **Create a Cloudflare Worker**:
   - Go to Workers & Pages → Create Worker
   - Name it something like `yakuza-ssr-proxy`
   - Copy the entire code from `cloudflare-worker.js`
   - Replace `SUPABASE_FUNCTION_URL` with your project ID (already set correctly)
   - Click "Save and Deploy"

### Step 2: Configure Worker Route

1. Go to your domain settings in Cloudflare
2. Navigate to Workers Routes
3. Add a new route:
   - **Route:** `yourdomain.com/*`
   - **Worker:** Select your `yakuza-ssr-proxy` worker
   - **Save**

### Step 3: Test SSR

1. **View Page Source** on your production domain
2. You should now see:
   ✅ Complete HTML content
   ✅ Full product details
   ✅ Schema markup
   ✅ Meta tags for SEO

## 🔧 Configuration Options

### Enable SSR for All Users

By default, SSR is only enabled for search engine crawlers. To enable for all users:

1. In Cloudflare Worker settings, add environment variable:
   - **Variable Name:** `ENABLE_SSR`
   - **Value:** `true`

**Note:** This increases server costs as every page view goes through SSR.

### Adjust Cache Duration

To change how long pages are cached:

1. Add environment variable:
   - **Variable Name:** `CACHE_TTL`
   - **Value:** `7200` (seconds)

## 📊 Verify SSR is Working

### Method 1: View Page Source
1. Visit your production site
2. Right-click → "View Page Source"
3. Search for your product name, description, etc.
4. ✅ If you see full content, SSR is working!

### Method 2: Google Search Console
1. Submit your URLs for indexing
2. Use "URL Inspection Tool"
3. Check "View Crawled Page" → "HTML"
4. ✅ Google should see full content

### Method 3: Social Media Preview
1. Share a product URL on Facebook/Twitter
2. ✅ Rich previews with images should appear

## 🎨 Alternative: Static Pre-rendering (No Cloudflare)

If you don't want to use Cloudflare, you can generate static HTML files for important pages:

1. Create a build script that calls the SSR Edge Function for each page
2. Save the HTML output as static files
3. Upload to your hosting provider
4. Configure server to serve these files for crawlers

**This is more complex but avoids Cloudflare dependency.**

## 📈 Expected Results

After implementing SSR:
- ✅ Google sees full page content
- ✅ Better search rankings
- ✅ Rich social media previews
- ✅ Faster perceived load times
- ✅ Improved Core Web Vitals

## 🆘 Troubleshooting

### SSR Not Working
1. Check Worker logs in Cloudflare Dashboard
2. Verify the Supabase Function URL is correct
3. Test the Edge Function directly first

### Blank Pages
1. Check for JavaScript errors in browser console
2. Verify all routes are handled in the SSR Edge Function
3. Check CORS settings

### Slow Performance
1. Increase cache duration
2. Use Cloudflare's edge caching
3. Consider enabling SSR only for crawlers

## 🔗 Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Google Search Console](https://search.google.com/search-console)

## 💡 Important Notes

- **Lovable Limitation:** Lovable cannot run Next.js or traditional SSR frameworks
- **Current Solution:** This hybrid approach gives you SSR benefits within Lovable's constraints
- **Cost:** Cloudflare Workers free tier: 100,000 requests/day
- **Maintenance:** The SSR Edge Function auto-deploys with your code changes

---

Need help? Check the [Supabase Edge Function logs](https://supabase.com/dashboard/project/tqhwoizjlvjdiuemirsy/functions/ssr-renderer/logs)
