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
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Powering India's EV Future
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Stories, insights, and innovations from Yakuza — where technology meets sustainability.
          </p>
          <Button 
            onClick={scrollToBlogs}
            className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6 h-auto font-semibold"
          >
            Read Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
