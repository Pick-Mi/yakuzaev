/**
 * Cloudflare Workers Script for SSR Integration
 * 
 * This worker proxies requests to your Supabase SSR Edge Function
 * to enable server-side rendering for all users and search engines.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Cloudflare Dashboard → Workers & Pages
 * 2. Create a new Worker
 * 3. Copy this entire code into the worker editor
 * 4. Update SUPABASE_FUNCTION_URL with your project ID
 * 5. Deploy the worker
 * 6. Add a route to your domain (e.g., yourdomain.com/*)
 * 
 * ENVIRONMENT VARIABLES (optional):
 * - ENABLE_SSR: Set to 'true' to enable SSR for all users (default: only crawlers)
 * - CACHE_TTL: Cache duration in seconds (default: 3600)
 */

const SUPABASE_FUNCTION_URL = 'https://tqhwoizjlvjdiuemirsy.supabase.co/functions/v1/ssr-renderer';

// Detect if the request is from a search engine crawler
const CRAWLER_USER_AGENTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'applebot', 'chrome-lighthouse'
];

function isCrawler(userAgent) {
  const agent = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(crawler => agent.includes(crawler));
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Bypass SSR for static assets
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/_') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)$/)
  ) {
    return fetch(request);
  }

  // Check if SSR should be enabled
  const enableSSR = ENABLE_SSR === 'true' || isCrawler(userAgent);

  if (!enableSSR) {
    // Serve the regular React app for non-crawlers
    return fetch(request);
  }

  try {
    // Call the SSR Edge Function
    const ssrUrl = `${SUPABASE_FUNCTION_URL}?path=${encodeURIComponent(url.pathname)}`;
    
    const ssrResponse = await fetch(ssrUrl, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
      },
    });

    if (ssrResponse.ok) {
      // Return the SSR HTML
      const html = await ssrResponse.text();
      
      return new Response(html, {
        status: ssrResponse.status,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          'X-Served-By': 'Cloudflare-SSR-Worker',
        },
      });
    }

    // Fallback to regular React app if SSR fails
    return fetch(request);
  } catch (error) {
    console.error('SSR Error:', error);
    // Fallback to regular React app on error
    return fetch(request);
  }
}
