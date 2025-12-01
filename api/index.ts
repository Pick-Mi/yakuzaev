import type { VercelRequest, VercelResponse } from '@vercel/node';

const CRAWLER_USER_AGENTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'discordbot', 'slackbot'
];

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userAgent = req.headers['user-agent'] || '';
  const path = req.url || '/';
  
  // Only handle crawler requests
  if (!isCrawler(userAgent)) {
    return res.status(404).send('Not Found');
  }

  try {
    const ssrUrl = `https://tqhwoizjlvjdiuemirsy.supabase.co/functions/v1/ssr-renderer?path=${encodeURIComponent(path)}`;
    const response = await fetch(ssrUrl);
    
    if (response.ok) {
      const html = await response.text();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      res.setHeader('X-Robots-Tag', 'index, follow');
      return res.status(200).send(html);
    }
    
    return res.status(404).send('Not Found');
  } catch (error) {
    console.error('SSR Error:', error);
    return res.status(500).send('Internal Server Error');
  }
}
