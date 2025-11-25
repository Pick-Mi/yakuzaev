import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CRAWLER_USER_AGENTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'applebot', 'chrome-lighthouse'
];

function isCrawler(userAgent: string): boolean {
  const agent = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(crawler => agent.includes(crawler));
}

function generateHTML(data: {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  schemaMarkup?: any;
  bodyContent?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <meta name="description" content="${data.description}">
  ${data.keywords ? `<meta name="keywords" content="${data.keywords}">` : ''}
  ${data.ogTitle ? `<meta property="og:title" content="${data.ogTitle}">` : ''}
  ${data.ogDescription ? `<meta property="og:description" content="${data.ogDescription}">` : ''}
  ${data.ogImage ? `<meta property="og:image" content="${data.ogImage}">` : ''}
  ${data.canonicalUrl ? `<link rel="canonical" href="${data.canonicalUrl}">` : ''}
  ${data.schemaMarkup ? `<script type="application/ld+json">${JSON.stringify(data.schemaMarkup)}</script>` : ''}
  <meta name="robots" content="index, follow">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body>
  ${data.bodyContent || '<div id="root">Loading...</div>'}
  <noscript>This page requires JavaScript to run the interactive features.</noscript>
</body>
</html>`;
}

async function renderProductPage(supabase: any, slug: string) {
  console.log('Rendering product page for slug:', slug);
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    console.error('Product not found:', error);
    return null;
  }

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.seo_title || product.meta_title || product.name,
    "description": product.seo_desc || product.meta_description || product.description,
    "image": product.og_image || product.image_url,
    "brand": {
      "@type": "Brand",
      "name": "Yakuza"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "sku": product.sku
  };

  const bodyContent = `
    <div id="root">
      <main>
        <h1>${product.name}</h1>
        <p>${product.description || ''}</p>
        <div>
          <strong>Price:</strong> ₹${product.price}
        </div>
        <div>
          <strong>SKU:</strong> ${product.sku}
        </div>
      </main>
    </div>
  `;

  return generateHTML({
    title: product.seo_title || product.meta_title || product.name,
    description: product.seo_desc || product.meta_description || product.description || '',
    keywords: product.meta_keywords || '',
    ogTitle: product.og_title || product.seo_title || product.name,
    ogDescription: product.og_description || product.seo_desc || product.description || '',
    ogImage: product.og_image || product.image_url || '',
    canonicalUrl: product.canonical_url || `https://yourdomain.com/products/${slug}`,
    schemaMarkup,
    bodyContent
  });
}

async function renderBlogPage(supabase: any, slug: string) {
  console.log('Rendering blog page for slug:', slug);
  
  const { data: blog, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !blog) {
    console.error('Blog not found:', error);
    return null;
  }

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt || '',
    "image": blog.featured_image || '',
    "datePublished": blog.published_at,
    "dateModified": blog.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Yakuza"
    }
  };

  const bodyContent = `
    <div id="root">
      <article>
        <h1>${blog.title}</h1>
        ${blog.featured_image ? `<img src="${blog.featured_image}" alt="${blog.title}">` : ''}
        <div>${blog.content}</div>
      </article>
    </div>
  `;

  return generateHTML({
    title: blog.title,
    description: blog.excerpt || '',
    ogTitle: blog.title,
    ogDescription: blog.excerpt || '',
    ogImage: blog.featured_image || '',
    canonicalUrl: `https://yourdomain.com/blogs/${slug}`,
    schemaMarkup,
    bodyContent
  });
}

async function renderHomePage(supabase: any) {
  console.log('Rendering home page');
  
  const { data: seoSettings } = await supabase
    .from('page_seo_settings')
    .select('*')
    .eq('page_route', '/')
    .eq('is_active', true)
    .maybeSingle();

  const schemaMarkup = seoSettings?.schema_json || {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Yakuza",
    "url": "https://yourdomain.com"
  };

  return generateHTML({
    title: seoSettings?.meta_title || 'Yakuza - Electric Vehicles',
    description: seoSettings?.meta_description || 'Leading electric vehicle manufacturer',
    keywords: seoSettings?.meta_keywords || '',
    ogTitle: seoSettings?.og_title || 'Yakuza',
    ogDescription: seoSettings?.og_description || '',
    ogImage: seoSettings?.og_image || '',
    canonicalUrl: seoSettings?.canonical_url || 'https://yourdomain.com',
    schemaMarkup,
    bodyContent: '<div id="root">Loading...</div>'
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const userAgent = req.headers.get('user-agent') || '';
    const url = new URL(req.url);
    const pathname = url.searchParams.get('path') || '/';

    console.log('SSR Request:', { pathname, userAgent, isCrawler: isCrawler(userAgent) });

    // If not a crawler, return a simple response indicating no SSR needed
    if (!isCrawler(userAgent)) {
      return new Response(
        JSON.stringify({ message: 'SSR not needed for regular users' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    let html = null;

    // Route matching
    if (pathname === '/') {
      html = await renderHomePage(supabase);
    } else if (pathname.startsWith('/products/')) {
      const slug = pathname.replace('/products/', '');
      html = await renderProductPage(supabase, slug);
    } else if (pathname.startsWith('/blogs/')) {
      const slug = pathname.replace('/blogs/', '');
      html = await renderBlogPage(supabase, slug);
    } else {
      // For other pages, render with basic SEO from page_seo_settings
      const { data: seoSettings } = await supabase
        .from('page_seo_settings')
        .select('*')
        .eq('page_route', pathname)
        .eq('is_active', true)
        .maybeSingle();

      if (seoSettings) {
        html = generateHTML({
          title: seoSettings.meta_title || 'Yakuza',
          description: seoSettings.meta_description || '',
          keywords: seoSettings.meta_keywords || '',
          ogTitle: seoSettings.og_title || '',
          ogDescription: seoSettings.og_description || '',
          ogImage: seoSettings.og_image || '',
          canonicalUrl: seoSettings.canonical_url || '',
          schemaMarkup: seoSettings.schema_json,
          bodyContent: '<div id="root">Loading...</div>'
        });
      }
    }

    if (html) {
      return new Response(html, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
      });
    }

    return new Response(
      JSON.stringify({ error: 'Page not found' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404 
      }
    );

  } catch (error) {
    console.error('SSR Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
