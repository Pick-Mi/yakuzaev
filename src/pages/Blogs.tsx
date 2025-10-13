import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Array<{
    id: string;
    title: string;
    excerpt: string;
    featured_image: string;
    published_at: string;
  }>>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, excerpt, featured_image, published_at")
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
      <Header />
      <main className="w-full py-[60px] px-[70px]">
        <div className="max-w-[1300px] mx-auto">
          <h1 className="font-['Inter',sans-serif] font-medium text-[48px] text-[#12141d] mb-[50px]">
            All Blogs
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
              </div>
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
