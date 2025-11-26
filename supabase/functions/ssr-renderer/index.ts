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
  const escapeHtml = (str: string) => str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.title)}</title>
  <meta name="description" content="${escapeHtml(data.description)}">
  ${data.keywords ? `<meta name="keywords" content="${escapeHtml(data.keywords)}">` : ''}
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  ${data.canonicalUrl ? `<link rel="canonical" href="${data.canonicalUrl}">` : ''}
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Yakuza EV">
  ${data.ogTitle ? `<meta property="og:title" content="${escapeHtml(data.ogTitle)}">` : ''}
  ${data.ogDescription ? `<meta property="og:description" content="${escapeHtml(data.ogDescription)}">` : ''}
  ${data.ogImage ? `<meta property="og:image" content="${data.ogImage}">` : ''}
  ${data.canonicalUrl ? `<meta property="og:url" content="${data.canonicalUrl}">` : ''}
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  ${data.ogTitle ? `<meta name="twitter:title" content="${escapeHtml(data.ogTitle)}">` : ''}
  ${data.ogDescription ? `<meta name="twitter:description" content="${escapeHtml(data.ogDescription)}">` : ''}
  ${data.ogImage ? `<meta name="twitter:image" content="${data.ogImage}">` : ''}
  
  ${data.schemaMarkup ? `<script type="application/ld+json">${JSON.stringify(data.schemaMarkup)}</script>` : ''}
  
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1f2937; }
    img { max-width: 100%; height: auto; display: block; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <!-- SSR Rendered Content - Visible in View Source -->
  ${data.bodyContent || '<div id="root"></div>'}
  
  <!-- React App Hydration -->
  <script type="module" src="/src/main.tsx"></script>
  <noscript>This page requires JavaScript for interactive features.</noscript>
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

  // Extract additional details
  const features = product.features ? (Array.isArray(product.features) ? product.features : []) : [];
  const benefits = product.benefits ? (Array.isArray(product.benefits) ? product.benefits : []) : [];
  const variants = product.variants ? (Array.isArray(product.variants) ? product.variants : []) : [];
  const images = product.images ? (Array.isArray(product.images) ? product.images : []) : [];

  const bodyContent = `
    <div id="root">
      <main style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: system-ui;">
        <article>
          <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">${product.name}</h1>
          ${product.image_url || images[0] ? `
            <img src="${product.image_url || images[0]}" alt="${product.name}" style="max-width: 100%; height: auto; border-radius: 12px;" width="800" height="600" />
          ` : ''}
          <div style="margin: 2rem 0;">
            <p style="font-size: 1.125rem; line-height: 1.75;">${product.description || ''}</p>
          </div>
          <div style="display: flex; gap: 2rem; align-items: center; margin: 2rem 0;">
            <div style="font-size: 2rem; font-weight: bold; color: #2563eb;">₹${product.price.toLocaleString()}</div>
            <div style="padding: 0.5rem 1rem; background: ${product.stock_quantity > 0 ? '#10b981' : '#ef4444'}; color: white; border-radius: 8px;">
              ${product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
          ${product.sku ? `<div style="color: #6b7280;">SKU: ${product.sku}</div>` : ''}
          
          ${features.length > 0 ? `
            <section style="margin: 3rem 0;">
              <h2 style="font-size: 2rem; margin-bottom: 1rem;">Key Features</h2>
              <ul style="list-style: disc; padding-left: 2rem; line-height: 2;">
                ${features.map((f: any) => `<li>${typeof f === 'string' ? f : f.title || f.name || f.text || ''}</li>`).join('')}
              </ul>
            </section>
          ` : ''}
          
          ${benefits.length > 0 ? `
            <section style="margin: 3rem 0;">
              <h2 style="font-size: 2rem; margin-bottom: 1rem;">Benefits</h2>
              <ul style="list-style: disc; padding-left: 2rem; line-height: 2;">
                ${benefits.map((b: any) => `<li>${typeof b === 'string' ? b : b.title || b.name || b.text || ''}</li>`).join('')}
              </ul>
            </section>
          ` : ''}
          
          ${variants.length > 0 ? `
            <section style="margin: 3rem 0;">
              <h2 style="font-size: 2rem; margin-bottom: 1rem;">Available Variants</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                ${variants.map((v: any) => `
                  <div style="border: 1px solid #e5e7eb; padding: 1.5rem; border-radius: 12px; background: #f9fafb;">
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${v.name || v.title || ''}</h3>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #2563eb;">₹${v.price ? v.price.toLocaleString() : 'N/A'}</p>
                    ${v.description ? `<p style="margin-top: 0.5rem; color: #6b7280;">${v.description}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </article>
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

  const publishedDate = new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const bodyContent = `
    <div id="root">
      <article style="max-width: 900px; margin: 0 auto; padding: 20px; font-family: system-ui;">
        <header style="margin-bottom: 3rem;">
          <h1 style="font-size: 2.5rem; margin-bottom: 1rem; line-height: 1.2;">${blog.title}</h1>
          ${blog.excerpt ? `<p style="font-size: 1.25rem; color: #6b7280; margin-bottom: 1rem;">${blog.excerpt}</p>` : ''}
          <time datetime="${blog.published_at}" style="color: #9ca3af;">${publishedDate}</time>
        </header>
        ${blog.featured_image ? `
          <img src="${blog.featured_image}" alt="${blog.title}" style="width: 100%; height: auto; border-radius: 12px; margin-bottom: 2rem;" width="1200" height="630" />
        ` : ''}
        <div style="line-height: 1.8; font-size: 1.125rem;">
          ${blog.content}
        </div>
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

  const { data: products } = await supabase
    .from('products')
    .select('name, slug, price, image_url')
    .eq('is_active', true)
    .limit(6);

  const schemaMarkup = seoSettings?.schema_json || {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Yakuza EV",
    "url": "https://yakuzaev.com"
  };

  const bodyContent = `
    <div id="root">
      <main style="font-family: system-ui;">
        <section style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; text-align: center;">
          <h1 style="font-size: 3rem; margin-bottom: 1rem;">Yakuza EV - Electric Vehicles</h1>
          <p style="font-size: 1.5rem; color: #6b7280; margin-bottom: 3rem;">Leading the electric mobility revolution</p>
        </section>
        
        ${products && products.length > 0 ? `
          <section style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="font-size: 2rem; margin-bottom: 2rem; text-align: center;">Our Products</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
              ${products.map(p => `
                <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: white;">
                  ${p.image_url ? `<img src="${p.image_url}" alt="${p.name}" style="width: 100%; height: 200px; object-fit: cover;" />` : ''}
                  <div style="padding: 1.5rem;">
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${p.name}</h3>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #2563eb;">₹${p.price.toLocaleString()}</p>
                    <a href="/products/${p.slug}" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #2563eb; color: white; text-decoration: none; border-radius: 8px;">View Details</a>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </main>
    </div>
  `;

  return generateHTML({
    title: seoSettings?.meta_title || 'Yakuza EV - Leading Electric Vehicle Manufacturer',
    description: seoSettings?.meta_description || 'Discover cutting-edge electric scooters and vehicles from Yakuza EV',
    keywords: seoSettings?.meta_keywords || 'electric vehicles, electric scooters, yakuza ev',
    ogTitle: seoSettings?.og_title || 'Yakuza EV',
    ogDescription: seoSettings?.og_description || 'Leading the electric mobility revolution',
    ogImage: seoSettings?.og_image || '',
    canonicalUrl: seoSettings?.canonical_url || 'https://yakuzaev.com',
    schemaMarkup,
    bodyContent
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

    // SSR for ALL requests now (not just crawlers)
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
