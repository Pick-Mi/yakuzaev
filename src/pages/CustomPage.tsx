import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface PageData {
  id: string;
  page_name: string;
  page_slug: string;
  source_code: string;
  is_active: boolean;
}

const CustomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      const pageSlug = `/${slug}`;
      const { data, error } = await supabase
        .from('page_management')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        navigate('/404');
        return;
      }

      setPageData(data);
      setLoading(false);
    };

    if (slug) fetchPage();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-10 pt-32 pb-16 md:pt-40 md:pb-24 max-w-[1200px]">
          <div className="animate-pulse">
            <div className="h-10 bg-muted rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-muted rounded w-full mb-4"></div>
            <div className="h-4 bg-muted rounded w-5/6 mb-4"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pageData) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-10 pt-32 pb-16 md:pt-40 md:pb-24 max-w-[1200px]">
        <h1 className="text-4xl md:text-5xl font-semibold mb-8">{pageData.page_name}</h1>
        <div 
          className="custom-page-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: pageData.source_code }}
          style={{
            lineHeight: '1.8',
          }}
        />
        <style>{`
          .custom-page-content p { margin-bottom: 1rem; }
          .custom-page-content h1 { font-size: 2rem; font-weight: 600; margin: 1.5rem 0 1rem; }
          .custom-page-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 1rem; }
          .custom-page-content h3 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.75rem; }
          .custom-page-content ul, .custom-page-content ol { margin: 1rem 0; padding-left: 2rem; }
          .custom-page-content li { margin-bottom: 0.5rem; }
          .custom-page-content a { color: hsl(var(--primary)); text-decoration: underline; }
          .custom-page-content strong { font-weight: 600; }
        `}</style>
      </main>
      <Footer />
    </div>
  );
};

export default CustomPage;
