// Vercel Edge Function for SSR
export const config = {
  runtime: 'edge',
};

const CRAWLER_USER_AGENTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'discordbot', 'slackbot', 'curl', 'wget'
];

function isCrawler(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot));
}

export default async function handler(request) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path') || '/';
  const userAgent = request.headers.get('user-agent') || '';
  
  console.log('Edge Render - Path:', path, '| Crawler:', isCrawler(userAgent));
  
  // Always serve SSR for this endpoint (used for testing and crawlers)
  try {
    const ssrUrl = `https://tqhwoizjlvjdiuemirsy.supabase.co/functions/v1/ssr-renderer?path=${encodeURIComponent(path)}`;
    
    const response = await fetch(ssrUrl, {
      headers: { 'User-Agent': userAgent || 'Vercel-SSR-Proxy' }
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
    
    return new Response('SSR fetch failed', { status: 500 });
  } catch (error) {
    console.error('SSR Error:', error);
    return new Response('SSR error: ' + error.message, { status: 500 });
  }
}
