import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-scooter.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#0a1525] min-h-[600px] lg:min-h-[700px]">
      {/* Geometric background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#1a2844] rounded-3xl -rotate-12 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#152238] rounded-3xl rotate-12 opacity-50"></div>
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-[#1d3a5c] rounded-3xl -rotate-6 opacity-30"></div>
      </div>
      
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
          
        </div>
      </div>
    </section>
  );
};

export default Hero;