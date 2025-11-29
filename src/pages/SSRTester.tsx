import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';

const SSR_BASE_URL = 'https://tqhwoizjlvjdiuemirsy.supabase.co/functions/v1/ssr-renderer';

export default function SSRTester() {
  const [selectedRoute, setSelectedRoute] = useState('/');
  const [ssrUrl, setSsrUrl] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [ssrResponse, setSsrResponse] = useState('');

  // Static routes
  const staticRoutes = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products Listing' },
    { path: '/about', label: 'About Us' },
    { path: '/blogs', label: 'Blogs Listing' },
    { path: '/careers', label: 'Careers' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/become-dealer', label: 'Become a Dealer' },
  ];

  useEffect(() => {
    fetchDynamicRoutes();
  }, []);

  useEffect(() => {
    setSsrUrl(`${SSR_BASE_URL}?path=${encodeURIComponent(selectedRoute)}`);
  }, [selectedRoute]);

  const fetchDynamicRoutes = async () => {
    // Fetch products
    const { data: productsData } = await supabase
      .from('products')
      .select('slug, name')
      .eq('is_active', true);
    
    if (productsData) setProducts(productsData);

    // Fetch blogs
    const { data: blogsData } = await supabase
      .from('blog_posts')
      .select('slug, title')
      .eq('status', 'published');
    
    if (blogsData) setBlogs(blogsData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copied to clipboard!');
  };

  const testSSR = async () => {
    setLoading(true);
    setSsrResponse('');
    
    try {
      const response = await fetch(ssrUrl);
      const html = await response.text();
      setSsrResponse(html);
      toast.success('SSR content loaded successfully!');
    } catch (error) {
      toast.error('Failed to load SSR content');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openInNewTab = () => {
    window.open(ssrUrl, '_blank');
  };

  const allRoutes = [
    ...staticRoutes,
    ...products.map(p => ({ path: `/products/${p.slug}`, label: `Product: ${p.name}` })),
    ...blogs.map(b => ({ path: `/blogs/${b.slug}`, label: `Blog: ${b.title}` })),
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>SSR Testing Tool</CardTitle>
          <CardDescription>
            Test server-side rendering for any page. Select a route to generate its SSR URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Page Route</label>
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a page..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="divider-static" disabled>
                  <strong>Static Pages</strong>
                </SelectItem>
                {staticRoutes.map(route => (
                  <SelectItem key={route.path} value={route.path}>
                    {route.label}
                  </SelectItem>
                ))}
                
                {products.length > 0 && (
                  <>
                    <SelectItem value="divider-products" disabled>
                      <strong>Product Pages</strong>
                    </SelectItem>
                    {products.map(product => (
                      <SelectItem key={product.slug} value={`/products/${product.slug}`}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </>
                )}

                {blogs.length > 0 && (
                  <>
                    <SelectItem value="divider-blogs" disabled>
                      <strong>Blog Posts</strong>
                    </SelectItem>
                    {blogs.map(blog => (
                      <SelectItem key={blog.slug} value={`/blogs/${blog.slug}`}>
                        {blog.title}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">SSR Endpoint URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ssrUrl}
                readOnly
                className="flex-1 px-3 py-2 border rounded-md bg-muted font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(ssrUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={openInNewTab}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={testSSR} disabled={loading} className="flex-1">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Test SSR Rendering
            </Button>
          </div>

          {ssrResponse && (
            <div className="space-y-2">
              <label className="text-sm font-medium">SSR HTML Preview (First 2000 chars)</label>
              <pre className="p-4 bg-muted rounded-md text-xs overflow-auto max-h-96 border">
                {ssrResponse.substring(0, 2000)}...
              </pre>
              <p className="text-xs text-muted-foreground">
                Full HTML length: {ssrResponse.length} characters
              </p>
            </div>
          )}

          <div className="bg-muted/50 p-4 rounded-md space-y-2 text-sm">
            <h3 className="font-semibold">How to verify SSR:</h3>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Select any page from the dropdown above</li>
              <li>Click "Open in new tab" to see the raw SSR HTML</li>
              <li>Or click "Test SSR Rendering" to preview here</li>
              <li>Search for <code className="bg-background px-1 rounded">application/ld+json</code> in the HTML</li>
              <li>You should see both custom schema and auto-generated schema</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
