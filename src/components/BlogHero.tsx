import { Button } from "@/components/ui/button";
import blogHeroImage from "@/assets/blog-hero.jpg";

const BlogHero = () => {
  const scrollToBlogs = () => {
    const blogsSection = document.getElementById('blogs-section');
    blogsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={blogHeroImage} 
          alt="Yakuza EV Scooter" 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-8 sm:bottom-16 md:bottom-24 left-4 sm:left-6 md:left-10 right-4 sm:right-auto w-auto sm:w-[601px] max-w-[calc(100%-2rem)] sm:max-w-[90%] flex flex-col gap-4 sm:gap-6 items-start px-2 sm:px-0 animate-fade-in">
        <h1 className="font-sans font-normal text-[28px] sm:text-[42px] md:text-[52px] leading-[1.2] sm:leading-[1.4] md:leading-[73px] text-[#FFFFFF] m-0">
          Powering India's EV Future
        </h1>
        <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-2 sm:mb-4">
          Stories, insights, and innovations from Yakuza — where technology meets sustainability.
        </p>
        
        <Button 
          onClick={scrollToBlogs}
          className="flex justify-center items-center gap-[10px] bg-white text-black hover:bg-gray-100 px-[35px] h-[50px] text-[13px] sm:text-[14px] font-medium font-sans rounded-none transition-colors"
        >
          Read Now
        </Button>
      </div>
    </section>
  );
};

export default BlogHero;
