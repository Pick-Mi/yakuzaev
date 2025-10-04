import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-scooter.png";
import heroBackground from "@/assets/hero-background.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#0a1525] min-h-[600px] lg:min-h-[700px]">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: `url(${heroBackground})` }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10 h-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[600px] lg:min-h-[700px] py-12 lg:py-0">
          {/* Left content */}
          <div className="text-left space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Turn every ride into an adventure.
            </h1>
            
            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-[#0a1525] hover:bg-gray-100 font-semibold px-8"
              >
                Book Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8"
              >
                Explore
              </Button>
            </div>
          </div>
          
          {/* Right side - Product image */}
          <div className="relative flex items-center justify-center">
            <img 
              src={heroImage} 
              alt="Modern electric scooter" 
              className="w-full max-w-[600px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;