'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroClient = () => {
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
    mobile_image_url: "",
    tablet_image_url: "",
    title: "Turn every ride into an adventure."
  };

  // Determine which image to use based on screen size
  const getBackgroundImage = () => {
    if (typeof window === 'undefined') return currentHero.image_url;
    
    if (window.innerWidth < 768 && currentHero.mobile_image_url) {
      return currentHero.mobile_image_url;
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024 && currentHero.tablet_image_url) {
      return currentHero.tablet_image_url;
    }
    return currentHero.image_url;
  };

  const [backgroundImage, setBackgroundImage] = useState(getBackgroundImage());

  // Update background image on window resize
  useEffect(() => {
    const handleResize = () => {
      setBackgroundImage(getBackgroundImage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentHero]);

  // Update background image when hero changes
  useEffect(() => {
    setBackgroundImage(getBackgroundImage());
  }, [currentIndex]);

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
      className="relative w-full min-h-screen h-[600px] sm:h-[700px] md:h-[829px] bg-black overflow-hidden bg-center bg-cover"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      }}
    >
      <div 
        className="absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          opacity: backgroundImage ? 1 : 0,
        }}
      />
      <div className="absolute bottom-8 sm:bottom-16 md:bottom-24 left-4 sm:left-6 md:left-10 right-4 sm:right-auto w-auto sm:w-[601px] max-w-[calc(100%-2rem)] sm:max-w-[90%] flex flex-col gap-4 sm:gap-6 items-start px-2 sm:px-0 animate-fade-in">
        <h1 className="font-sans font-normal text-[32px] sm:text-[42px] md:text-[52px] leading-[1.3] sm:leading-[1.4] md:leading-[73px] text-white m-0">
          {currentHero.title}
        </h1>
        
        <div className="flex gap-4 sm:gap-6 items-center flex-wrap w-full sm:w-auto">
          <Link href="/products" className="w-full sm:w-auto">
            <Button 
              className="w-full sm:w-auto flex justify-center items-center gap-[10px] bg-white text-black hover:bg-gray-100 px-[35px] h-[50px] text-[14px] font-medium font-sans rounded-none"
            >
              Book Now
            </Button>
          </Link>
          <Link href="/products" className="w-full sm:w-auto">
            <Button 
              className="w-full sm:w-auto bg-white/15 text-white hover:bg-white hover:text-black px-12 h-[50px] text-[14px] font-medium font-sans rounded-none"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-none backdrop-blur-sm transition-colors duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-none backdrop-blur-sm transition-colors duration-300"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </section>
  );
};

export default HeroClient;
