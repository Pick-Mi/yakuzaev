import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [heroData, setHeroData] = useState({
    bannerUrl: "",
    title: "Turn every ride into an adventure.",
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      const { data } = await (supabase as any)
        .from("site_settings")
        .select("hero_banner_url, hero_title")
        .maybeSingle();
      
      if (data) {
        setHeroData({
          bannerUrl: data.hero_banner_url || "",
          title: data.hero_title || "Turn every ride into an adventure.",
        });
      }
    };
    
    fetchHeroData();
  }, []);

  return (
    <section 
      className="relative w-full min-h-screen h-[829px] bg-black overflow-hidden"
      style={{
        backgroundImage: heroData.bannerUrl ? `url(${heroData.bannerUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute left-10 top-[500px] w-[601px] max-w-[90%] flex flex-col gap-6 items-start">
        <h1 className="font-sans font-normal text-[52px] leading-[73px] text-white m-0">
          {heroData.title}
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
    </section>
  );
};

export default Hero;