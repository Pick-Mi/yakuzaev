import { Button } from "@/components/ui/button";
import careersHeroImage from "@/assets/careers-hero.jpg";

const CareersHero = () => {
  return (
    <section 
      className="relative min-h-[500px] flex items-center justify-start overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${careersHeroImage})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="container relative z-10 mx-auto px-4 md:px-20 max-w-[1280px] py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-8">
            The future of automobiles.<br />
            The future of retail.
          </h1>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
            asChild
          >
            <a href="#opportunities">Explore All Jobs</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CareersHero;
