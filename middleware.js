// Vercel Edge Middleware for SSR
export const config = {
  matcher: ['/((?!_next|api|assets|src|favicon.ico|.*\\..*).*)', '/'],
  runtime: 'edge',
};

const CRAWLER_USER_AGENTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'discordbot', 'slackbot', 'curl'
];

function isCrawler(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot));
}

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Only intercept for crawlers
  if (isCrawler(userAgent)) {
    try {
      const ssrUrl = `https://tqhwoizjlvjdiuemirsy.supabase.co/functions/v1/ssr-renderer?path=${encodeURIComponent(pathname)}`;
      
      const response = await fetch(ssrUrl, {
        headers: {
          'User-Agent': userAgent
        }
      });
      
      if (response.ok) {
        const html = await response.text();
        
        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            'X-Robots-Tag': 'index, follow',
            'X-SSR-Enabled': 'true',
          },
        });
      }
    } catch (error) {
      // Fall through to default behavior on error
    }
  }
  
  // For regular users, let Vercel serve the static files (don't return anything)
  return;
}
