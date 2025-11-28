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
    // Return 404 page with full HTML structure
    return generateHTML({
      title: 'Product Not Found - Yakuza EV',
      description: 'The requested product could not be found',
      keywords: '',
      ogTitle: 'Product Not Found',
      ogDescription: 'Product not available',
      ogImage: '',
      canonicalUrl: `https://yakuzaev.com/products/${slug}`,
      schemaMarkup: null,
      bodyContent: `
        <div id="root">
          <main style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: system-ui; text-align: center;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem; color: #ef4444;">404 - Product Not Found</h1>
            <p style="font-size: 1.25rem; color: #6b7280; margin-bottom: 2rem;">
              The product "${slug}" could not be found. It may have been removed or the URL is incorrect.
            </p>
            <p style="margin-bottom: 1rem;">Available products:</p>
            <ul style="list-style: none; padding: 0;">
              <li><a href="/products/neu" style="color: #2563eb; font-size: 1.125rem;">NEU</a></li>
              <li><a href="/products/aqaba" style="color: #2563eb; font-size: 1.125rem;">AQABA</a></li>
              <li><a href="/products/cyclone-sway" style="color: #2563eb; font-size: 1.125rem;">Cyclone Sway</a></li>
            </ul>
            <a href="/" style="display: inline-block; margin-top: 2rem; padding: 1rem 2rem; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-size: 1.125rem;">
              Return to Homepage
            </a>
          </main>
          <!-- Full Content Visible in View Source -->
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Product Not Found",
            "description": "The requested product could not be found"
          }
          </script>
        </div>
      `
    });
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

  // Extract arrays from JSON fields
  const images = Array.isArray(product.images) ? product.images : [];
  const features = Array.isArray(product.features) ? product.features : [];
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];
  const variants = Array.isArray(product.variants) ? product.variants : [];

  const bodyContent = `
    <div id="root">
      <!-- ========================================
           FULL PRODUCT DATA - VISIBLE IN PAGE SOURCE
           This content is server-side rendered and
           fully visible to search engines and users
           viewing the HTML source code.
           ======================================== -->
      <main style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: system-ui;">
        <article itemscope itemtype="https://schema.org/Product">
          <!-- PRODUCT TITLE -->
          <h1 itemprop="name" style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: 700; color: #1f2937;">
            ${product.name}
          </h1>
          
          <!-- PRODUCT IMAGE -->
          ${product.image_url || images[0] ? `
            <img 
              itemprop="image"
              src="${product.image_url || images[0]}" 
              alt="${product.name} - Electric Scooter" 
              style="max-width: 100%; height: auto; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" 
              width="800" 
              height="600" 
            />
          ` : ''}
          
          <!-- PRODUCT DESCRIPTION -->
          <div itemprop="description" style="margin: 2rem 0; line-height: 1.75;">
            <p style="font-size: 1.125rem; color: #374151;">
              ${product.description || 'Premium electric scooter with cutting-edge technology'}
            </p>
          </div>
          
          <!-- PRICE AND AVAILABILITY -->
          <div style="display: flex; gap: 2rem; align-items: center; margin: 2rem 0; padding: 1.5rem; background: #f9fafb; border-radius: 12px; border: 2px solid #e5e7eb;">
            <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
              <meta itemprop="priceCurrency" content="INR" />
              <meta itemprop="price" content="${product.price}" />
              <meta itemprop="availability" content="${product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}" />
              <div style="font-size: 2.5rem; font-weight: bold; color: #2563eb;">
                ₹${product.price.toLocaleString('en-IN')}
              </div>
            </div>
            <div style="padding: 0.75rem 1.5rem; background: ${product.stock_quantity > 0 ? '#10b981' : '#ef4444'}; color: white; border-radius: 8px; font-weight: 600; font-size: 1.125rem;">
              ${product.stock_quantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
            </div>
          </div>
          
          <!-- SKU -->
          ${product.sku ? `
            <div style="color: #6b7280; margin-bottom: 2rem; font-family: monospace; background: #f3f4f6; padding: 0.5rem 1rem; border-radius: 6px; display: inline-block;">
              <strong>SKU:</strong> <span itemprop="sku">${product.sku}</span>
            </div>
          ` : ''}
          
          <!-- KEY FEATURES SECTION -->
          ${features.length > 0 ? `
            <section style="margin: 3rem 0; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1);">
              <h2 style="font-size: 2rem; margin-bottom: 1.5rem; color: #1f2937; border-bottom: 3px solid #2563eb; padding-bottom: 0.5rem;">
                🚀 Key Features
              </h2>
              <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                ${features.map((f: any) => {
                  const text = typeof f === 'string' ? f : f.title || f.name || f.text || f.description || '';
                  return `
                    <li style="padding: 1rem; background: #f0f9ff; border-left: 4px solid #2563eb; border-radius: 6px;">
                      <span style="font-size: 1.125rem; color: #1e40af;">▸ ${text}</span>
                    </li>
                  `;
                }).join('')}
              </ul>
            </section>
          ` : ''}
          
          <!-- BENEFITS SECTION -->
          ${benefits.length > 0 ? `
            <section style="margin: 3rem 0; padding: 2rem; background: #f0fdf4; border-radius: 12px; border: 2px solid #86efac;">
              <h2 style="font-size: 2rem; margin-bottom: 1.5rem; color: #166534; border-bottom: 3px solid #10b981; padding-bottom: 0.5rem;">
                ✨ Benefits
              </h2>
              <ul style="list-style: none; padding: 0; line-height: 2;">
                ${benefits.map((b: any) => {
                  const text = typeof b === 'string' ? b : b.title || b.name || b.text || b.description || '';
                  return `
                    <li style="padding: 0.75rem 0; border-bottom: 1px solid #bbf7d0; color: #166534; font-size: 1.125rem;">
                      <span style="color: #10b981; font-weight: bold; margin-right: 0.5rem;">✓</span>${text}
                    </li>
                  `;
                }).join('')}
              </ul>
            </section>
          ` : ''}
          
          <!-- VARIANTS SECTION -->
          ${variants.length > 0 ? `
            <section style="margin: 3rem 0;">
              <h2 style="font-size: 2rem; margin-bottom: 1.5rem; color: #1f2937; border-bottom: 3px solid #2563eb; padding-bottom: 0.5rem;">
                🎨 Available Variants
              </h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                ${variants.map((v: any) => `
                  <div style="border: 2px solid #e5e7eb; padding: 1.5rem; border-radius: 12px; background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #1f2937; font-weight: 600;">
                      ${v.name || v.title || 'Variant'}
                    </h3>
                    <p style="font-size: 2rem; font-weight: bold; color: #2563eb; margin-bottom: 0.5rem;">
                      ₹${v.price ? v.price.toLocaleString('en-IN') : 'Contact for Price'}
                    </p>
                    ${v.description ? `
                      <p style="margin-top: 1rem; color: #6b7280; line-height: 1.6; font-size: 0.95rem;">
                        ${v.description}
                      </p>
                    ` : ''}
                    ${v.features ? `
                      <ul style="margin-top: 1rem; padding-left: 1.5rem; color: #4b5563; font-size: 0.9rem;">
                        ${(Array.isArray(v.features) ? v.features : [v.features]).map((feat: any) => 
                          `<li style="margin: 0.25rem 0;">${typeof feat === 'string' ? feat : feat.name || feat.title || ''}</li>`
                        ).join('')}
                      </ul>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
          
          <!-- STRUCTURED DATA EMBEDDED IN HTML -->
          <script type="application/ld+json">
          ${JSON.stringify(schemaMarkup, null, 2)}
          </script>
          
          <!-- CALL TO ACTION -->
          <div style="margin: 3rem 0; text-align: center; padding: 3rem; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 16px; color: white;">
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">Ready to Experience Electric Mobility?</h2>
            <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">Contact us today to learn more about ${product.name}</p>
            <a href="/contact" style="display: inline-block; padding: 1rem 3rem; background: white; color: #2563eb; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 1.125rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
              Get in Touch
            </a>
          </div>
        </article>
      </main>
      
      <!-- COMMENT: All content above is fully rendered and visible in page source -->
      <!-- This enables SEO, social sharing previews, and view-source debugging -->
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
        <section style="padding: 60px 20px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; text-align: center;">
          <h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: 800;">Welcome to Yakuza EV</h1>
          <p style="font-size: 1.5rem; margin-bottom: 2rem; opacity: 0.95;">Premium Electric Scooters for the Modern World</p>
        </section>
        ${products && products.length > 0 ? `
          <section style="max-width: 1200px; margin: 60px auto; padding: 0 20px;">
            <h2 style="font-size: 2.5rem; margin-bottom: 2rem; text-align: center; color: #1f2937;">Our Products</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
              ${products.map(p => `
                <article style="border: 2px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transition: transform 0.3s;">
                  ${p.image_url ? `<img src="${p.image_url}" alt="${p.name}" style="width: 100%; height: 250px; object-fit: cover;" />` : ''}
                  <div style="padding: 1.5rem;">
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #1f2937;">${p.name}</h3>
                    <p style="font-size: 1.25rem; color: #2563eb; font-weight: 600; margin-bottom: 1rem;">₹${p.price.toLocaleString('en-IN')}</p>
                    <a href="/products/${p.slug}" style="display: inline-block; padding: 0.75rem 1.5rem; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">View Details</a>
                  </div>
                </article>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </main>
    </div>
  `;

  return generateHTML({
    title: seoSettings?.meta_title || 'Yakuza EV - Electric Scooters',
    description: seoSettings?.meta_description || 'Discover premium electric scooters',
    keywords: seoSettings?.meta_keywords || 'electric scooter, ev, yakuza',
    ogTitle: seoSettings?.og_title || 'Yakuza EV',
    ogDescription: seoSettings?.og_description || '',
    ogImage: seoSettings?.og_image || '',
    canonicalUrl: seoSettings?.canonical_url || 'https://yakuzaev.com',
    schemaMarkup,
    bodyContent
  });
}

async function renderGenericPage(supabase: any, path: string, title: string, description: string) {
  console.log('Rendering generic page:', path);
  
  const { data: seoSettings } = await supabase
    .from('page_seo_settings')
    .select('*')
    .eq('page_route', path)
    .eq('is_active', true)
    .maybeSingle();

  const schemaMarkup = seoSettings?.schema_json || {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description
  };

  const bodyContent = `
    <div id="root">
      <main style="max-width: 1200px; margin: 0 auto; padding: 60px 20px; font-family: system-ui;">
        <h1 style="font-size: 3rem; margin-bottom: 2rem; color: #1f2937;">${title}</h1>
        <p style="font-size: 1.25rem; color: #6b7280; line-height: 1.8;">${description}</p>
      </main>
    </div>
  `;

  return generateHTML({
    title: seoSettings?.meta_title || title,
    description: seoSettings?.meta_description || description,
    keywords: seoSettings?.meta_keywords || '',
    ogTitle: seoSettings?.og_title || title,
    ogDescription: seoSettings?.og_description || description,
    ogImage: seoSettings?.og_image || '',
    canonicalUrl: seoSettings?.canonical_url || `https://yakuzaev.com${path}`,
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
    } else if (pathname === '/about-us') {
      html = await renderGenericPage(supabase, '/about-us', 'About Us - Yakuza EV', 'Learn about Yakuza EV and our mission to revolutionize electric mobility');
    } else if (pathname === '/contact-us') {
      html = await renderGenericPage(supabase, '/contact-us', 'Contact Us - Yakuza EV', 'Get in touch with Yakuza EV for inquiries and support');
    } else if (pathname === '/careers') {
      html = await renderGenericPage(supabase, '/careers', 'Careers - Yakuza EV', 'Join the Yakuza EV team and build the future of electric mobility');
    } else if (pathname === '/become-dealer') {
      html = await renderGenericPage(supabase, '/become-dealer', 'Become a Dealer - Yakuza EV', 'Partner with Yakuza EV and bring electric mobility to your region');
    } else if (pathname === '/products') {
      html = await renderGenericPage(supabase, '/products', 'Our Products - Yakuza EV', 'Explore our range of premium electric scooters');
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
          'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          'X-Robots-Tag': 'index, follow',
          'X-Rendered-By': 'Supabase-SSR-Edge-Function'
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
