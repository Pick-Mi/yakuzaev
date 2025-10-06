import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  const [heroSections, setHeroSections] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHeroSections = async () => {
      const { data } = await (supabase as any)
        .from("hero_sections")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (data && data.length > 0) {
        setHeroSections(data);
      }
    };
    
    fetchHeroSections();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (heroSections.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === heroSections.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [heroSections.length]);

  const currentHero = heroSections[currentIndex] || {
    image_url: "",
    title: "Turn every ride into an adventure."
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? heroSections.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === heroSections.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section 
      className="relative w-full min-h-screen h-[829px] bg-black overflow-hidden transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: currentHero.image_url ? `url(${currentHero.image_url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute left-10 top-[520px] w-[601px] max-w-[90%] flex flex-col gap-6 items-start">
        <h1 className="font-sans font-normal text-[52px] leading-[73px] text-white m-0 transition-opacity duration-700">
          {currentHero.title}
        </h1>
        
        <div className="flex gap-6 items-center flex-wrap">
          <Link to="/products">
            <Button 
              className="flex justify-center items-center gap-[10px] bg-white text-black hover:bg-gray-100 px-[35px] h-[50px] text-[14px] font-medium font-sans rounded-none"
            >
              Book Now
            </Button>
          </Link>
          <Link to="/products">
            <Button 
              className="bg-white/15 text-white hover:bg-white hover:text-black px-12 h-[50px] text-[14px] font-medium font-sans rounded-none"
            >
              Explore
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Buttons */}
      {heroSections.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-none backdrop-blur-sm transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-none backdrop-blur-sm transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </section>
  );
};

export default Hero;