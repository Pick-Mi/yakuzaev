import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogHero from "@/components/BlogHero";
import { supabase } from "@/integrations/supabase/client";
import { useSEOSettings } from "@/hooks/useSEOSettings";

const Blogs = () => {
  const seoSettings = useSEOSettings('/blogs');
  const [blogs, setBlogs] = useState<Array<{
    id: string;
    title: string;
    excerpt: string;
    featured_image: string;
    published_at: string;
    slug: string;
  }>>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, excerpt, featured_image, published_at, slug")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        if (error) {
          console.error("Error fetching blogs:", error);
          return;
        }

        setBlogs(data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        {seoSettings?.meta_title && <title>{seoSettings.meta_title}</title>}
        {seoSettings?.meta_description && (
          <meta name="description" content={seoSettings.meta_description} />
        )}
        {seoSettings?.meta_keywords && (
          <meta name="keywords" content={seoSettings.meta_keywords} />
        )}
        {seoSettings?.og_title && (
          <meta property="og:title" content={seoSettings.og_title} />
        )}
        {seoSettings?.og_description && (
          <meta property="og:description" content={seoSettings.og_description} />
        )}
        {seoSettings?.og_image && (
          <meta property="og:image" content={seoSettings.og_image} />
        )}
        {seoSettings?.canonical_url && (
          <link rel="canonical" href={seoSettings.canonical_url} />
        )}
        {seoSettings?.schema_json && (
          <script type="application/ld+json">
            {JSON.stringify(seoSettings.schema_json, null, 2)}
          </script>
        )}
      </Helmet>
      <Header />
      <BlogHero />
      <main id="blogs-section" className="w-full py-[60px] px-[70px]">
        <div className="max-w-[1300px] mx-auto">
          <h1 className="font-['Inter',sans-serif] font-medium text-[48px] text-[#12141d] mb-[50px]">
            All Blogs
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
            {blogs.map((blog) => (
              <Link 
                key={blog.id} 
                to={`/blogs/${blog.slug}`}
                className="bg-white w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
              >
                <div className="relative w-full h-[244px] bg-[#d9d9d9]">
                  <img 
                    src={blog.featured_image || "/placeholder.svg"} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-[20px] flex flex-col gap-[9.403px]">
                  <h3 className="font-['Inter',sans-serif] font-semibold text-[22px] text-black capitalize leading-[39px]">
                    {blog.title}
                  </h3>
                  <p className="font-['Inter',sans-serif] font-normal text-[15.386px] text-black opacity-80">
                    {blog.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {blogs.length === 0 && (
            <p className="text-center text-gray-500 py-20">No blogs published yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;
