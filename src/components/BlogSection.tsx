import { Link } from "react-router-dom";

const BlogSection = () => {
  const blogs = [
    {
      title: "Stories spark",
      description: "Confidently go electric by learning about charging, range and the cost of electric driving.",
      image: "/placeholder.svg"
    },
    {
      title: "lifestyle-driven",
      description: "Confidently go electric by learning about charging, range and the cost of electric driving.",
      image: "/placeholder.svg"
    },
    {
      title: "a place to pause,",
      description: "Confidently go electric by learning about charging, range and the cost of electric driving.",
      image: "/placeholder.svg"
    }
  ];

  return (
    <section className="w-full py-[42px] px-[70px]" style={{ backgroundColor: '#F8F9F9' }}>
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col gap-[70px]">
          <h2 className="font-['Inter',sans-serif] font-medium text-[48px] text-[#12141d]">
            Compelling reasons
          </h2>
          
          <div className="flex gap-[40px]">
            {blogs.map((blog, index) => (
              <div key={index} className="bg-white w-[407px] h-[388px] shrink-0 overflow-hidden">
                <div className="relative w-full h-[244px] bg-[#d9d9d9]">
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-[20px] flex flex-col gap-[9.403px]">
                  <h3 className="font-['Inter',sans-serif] font-semibold text-[22px] text-black capitalize leading-[39px]">
                    {blog.title}
                  </h3>
                  <p className="font-['Inter',sans-serif] font-normal text-[15.386px] text-black opacity-80">
                    {blog.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-[46px]">
            <Link
              to="/products"
              className="bg-black h-[55px] px-[23px] py-[13px] flex items-center justify-center w-[200px] rounded-none hover:bg-black/90 transition-colors"
            >
              <span className="font-['Poppins',sans-serif] font-medium text-[16px] text-white">
                Explore All Blogs
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
