import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  slug: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (error) {
          console.error("Error fetching blog:", error);
          navigate("/blogs");
          return;
        }

        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full py-12 px-4 sm:px-8 md:px-12 lg:px-[70px]">
          <div className="max-w-[900px] mx-auto">
            <Skeleton className="h-12 w-3/4 mb-8" />
            <Skeleton className="h-[400px] w-full mb-8" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-2/3 mb-4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{blog.title} - Yakuza EV Blog</title>
        <meta name="description" content={blog.excerpt || blog.title} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || blog.title} />
        {blog.featured_image && <meta property="og:image" content={blog.featured_image} />}
        <meta property="og:type" content="article" />
      </Helmet>

      <Header />
      
      <main className="w-full py-12 px-4 sm:px-8 md:px-12 lg:px-[70px]">
        <article className="max-w-[900px] mx-auto">
          {/* Blog Title */}
          <h1 className="font-['Inter',sans-serif] font-medium text-3xl sm:text-4xl md:text-[48px] text-foreground mb-8 sm:mb-10 md:mb-12">
            {blog.title}
          </h1>

          {/* Featured Image */}
          {blog.featured_image && (
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] mb-8 sm:mb-10 md:mb-12 overflow-hidden rounded-lg">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div 
            className="prose prose-lg max-w-none
              prose-headings:font-['Inter',sans-serif] prose-headings:font-semibold prose-headings:text-foreground
              prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:font-['Inter',sans-serif] prose-p:text-base prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:font-['Inter',sans-serif] prose-li:text-base prose-li:text-foreground prose-li:mb-2
              prose-strong:font-semibold prose-strong:text-foreground
              prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
              prose-img:rounded-lg prose-img:my-8"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Published Date */}
          {blog.published_at && (
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Published on {new Date(blog.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
