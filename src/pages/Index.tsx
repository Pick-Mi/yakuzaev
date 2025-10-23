import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import FearlessDesign from "@/components/FearlessDesign";
import PromoSection from "@/components/PromoSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import RideInMotion from "@/components/RideInMotion";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  thumbnail?: string;
  url?: string;
  title?: string;
}

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase
        .from('products')
        .select('videos')
        .not('videos', 'is', null)
        .limit(1)
        .single();
      
      if (data?.videos) {
        const parsedVideos = typeof data.videos === 'string' 
          ? JSON.parse(data.videos) 
          : data.videos;
        
        // Filter out videos with empty URLs
        const validVideos = Array.isArray(parsedVideos) 
          ? parsedVideos
              .filter((v: any) => v.videoUrl && v.videoUrl.trim() !== '')
              .map((v: any) => ({
                thumbnail: v.thumbnail,
                url: v.videoUrl,
                title: v.title
              }))
          : [];
        
        setVideos(validVideos);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProductShowcase />
      <FearlessDesign />
      <RideInMotion videos={videos} />
      <PromoSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
