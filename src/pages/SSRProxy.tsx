import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SSRProxy component fetches server-side rendered HTML and displays it
 * This ensures search engines and users see fully rendered content in page source
 */
export const SSRProxy = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [ssrContent, setSsrContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSSR = async () => {
      try {
        // Fetch SSR content from edge function
        const response = await fetch(
          `https://tqhwoizjlvjdiuemirsy.supabase.co/functions/v1/ssr-renderer?path=${encodeURIComponent(location.pathname)}`
        );
        
        if (response.ok) {
          const html = await response.text();
          setSsrContent(html);
        }
      } catch (error) {
        console.error('SSR fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch SSR on initial load
    if (window.performance && performance.navigation.type === 0) {
      fetchSSR();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  // Show SSR content while React is hydrating
  if (loading) {
    return <div>Loading...</div>;
  }

  // Return React children (SPA mode)
  return <>{children}</>;
};
