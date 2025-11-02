import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  const [relatedBlogs, setRelatedBlogs] = useState<Array<{
    id: string;
    title: string;
    excerpt: string;
    featured_image: string;
    slug: string;
  }>>([]);
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
          .maybeSingle();

        if (error || !data) {
          console.error("Error fetching blog:", error);
          navigate("/blogs");
          return;
        }

        setBlog(data);

        // Fetch related blogs (other published blogs)
        const { data: relatedData } = await supabase
          .from("blog_posts")
          .select("id, title, excerpt, featured_image, slug")
          .eq("status", "published")
          .neq("id", data.id)
          .limit(3);

        setRelatedBlogs(relatedData || []);
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

        {/* Related Blogs Section */}
        {relatedBlogs.length > 0 && (
          <section className="max-w-[1300px] mx-auto mt-16 pt-12 border-t border-border">
            <h2 className="font-['Inter',sans-serif] font-medium text-2xl sm:text-3xl md:text-[36px] text-foreground mb-8 sm:mb-10 md:mb-12">
              More Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-[40px]">
              {relatedBlogs.map((relatedBlog) => (
                <Link 
                  key={relatedBlog.id} 
                  to={`/blogs/${relatedBlog.slug}`}
                  className="bg-white w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
                >
                  <div className="relative w-full h-[200px] sm:h-[220px] md:h-[244px] bg-muted">
                    <img 
                      src={relatedBlog.featured_image || "/placeholder.svg"} 
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-[18px] md:p-[20px] flex flex-col gap-2 md:gap-[9.403px]">
                    <h3 className="font-['Inter',sans-serif] font-semibold text-lg sm:text-xl md:text-[22px] text-foreground capitalize leading-tight sm:leading-normal">
                      {relatedBlog.title}
                    </h3>
                    <p className="font-['Inter',sans-serif] font-normal text-sm sm:text-[15px] md:text-[15.386px] text-muted-foreground line-clamp-3">
                      {relatedBlog.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
