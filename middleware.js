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
  
  console.log('SSR Middleware:', pathname, '| User-Agent:', userAgent.substring(0, 50));
  
  // Serve SSR content for crawlers
  if (isCrawler(userAgent)) {
    try {
      const ssrUrl = `https://tqhwoizjlvjdiuemirsy.supabase.co/functions/v1/ssr-renderer?path=${encodeURIComponent(pathname)}`;
      
      console.log('Fetching SSR:', ssrUrl);
      const response = await fetch(ssrUrl, {
        headers: {
          'User-Agent': userAgent
        }
      });
      
      if (response.ok) {
        const html = await response.text();
        console.log('SSR Success - HTML length:', html.length);
        
        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            'X-Robots-Tag': 'index, follow',
            'X-SSR-Enabled': 'true',
            'X-Rendered-By': 'Supabase-Edge-Function',
          },
        });
      } else {
        console.error('SSR fetch failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('SSR Error:', error.message);
    }
  }
  
  // For regular users, continue to React app
  return new Response(null, { status: 200 });
}
