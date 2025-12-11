import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
const BlogSection = () => {
  const [blogs, setBlogs] = useState<Array<{
    id: string;
    title: string;
    excerpt: string;
    featured_image: string;
    slug: string;
  }>>([]);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from("blog_posts").select("id, title, excerpt, featured_image, slug").eq("status", "published").limit(3);
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
  return <section className="w-full py-8 sm:py-10 md:py-[42px] px-4 sm:px-8 md:px-12 lg:px-[70px] overflow-hidden" style={{
    backgroundColor: '#F8F9F9'
  }}>
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col gap-10 sm:gap-14 md:gap-[25px]">
          <h2 className="font-['Inter',sans-serif] font-medium text-[28px] sm:text-[36px] md:text-[48px] text-[#12141d]">
            Compelling reasons
          </h2>
          
          <div className="flex gap-6 sm:gap-8 md:gap-[40px] overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {blogs.map(blog => <Link key={blog.id} to={`/blogs/${blog.slug}`} className="block bg-white w-[280px] sm:w-[300px] md:w-[350px] lg:w-[407px] h-auto md:h-[388px] shrink-0 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative w-full h-[180px] sm:h-[200px] md:h-[244px] bg-[#d9d9d9]">
                  <img src={blog.featured_image || "/placeholder.svg"} alt={blog.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 sm:p-[18px] md:p-[20px] flex flex-col gap-2 md:gap-[9.403px]">
                  <h3 className="font-['Inter',sans-serif] font-semibold text-[18px] sm:text-[20px] md:text-[22px] text-black capitalize leading-[1.4] sm:leading-[1.5] md:leading-[39px]">
                    {blog.title}
                  </h3>
                  <p className="font-['Inter',sans-serif] font-normal text-[13px] sm:text-[14px] md:text-[15.386px] text-black opacity-80">
                    {blog.excerpt}
                  </p>
                </div>
              </Link>)}
          </div>
          
          <div className="flex justify-center mt-6 sm:mt-8 md:mt-[46px]">
            <Link to="/blogs" className="bg-black h-[45px] sm:h-[50px] md:h-[55px] px-5 sm:px-6 md:px-[23px] py-[13px] flex items-center justify-center w-full sm:w-auto sm:min-w-[180px] md:w-[200px] rounded-none hover:bg-black/90 transition-colors">
              <span className="font-['Poppins',sans-serif] font-medium text-[14px] sm:text-[15px] md:text-[16px] text-white">
                Explore
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>;
};
export default BlogSection;