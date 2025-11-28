import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: heroSections = [] } = useQuery({
    queryKey: ['hero-sections'],
    queryFn: async () => {
      const { data } = await supabase
        .from('hero_sections')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      return data || [];
    },
  });

  useEffect(() => {
    if (heroSections.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSections.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSections.length]);

  if (heroSections.length === 0) {
    return null;
  }

  const currentSection = heroSections[currentSlide];
  const buttons = currentSection?.cta_buttons ? 
    (typeof currentSection.cta_buttons === 'string' ? 
      JSON.parse(currentSection.cta_buttons) : 
      currentSection.cta_buttons) : 
    [];

  return (
    <section className="relative w-full h-[600px] md:h-[700px] lg:h-screen overflow-hidden">
      {heroSections.map((section: any, index: number) => {
        const sectionButtons = section?.cta_buttons ? 
          (typeof section.cta_buttons === 'string' ? 
            JSON.parse(section.cta_buttons) : 
            section.cta_buttons) : 
          [];

        return (
          <div
            key={section.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <picture>
              <source media="(max-width: 640px)" srcSet={section.mobile_image_url || section.image_url} />
              <source media="(max-width: 1024px)" srcSet={section.tablet_image_url || section.image_url} />
              <img
                src={section.image_url}
                alt={section.title || 'Hero image'}
                className="w-full h-full object-cover"
              />
            </picture>

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16 text-white">
              {section.title && (
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 max-w-4xl">
                  {section.title}
                </h1>
              )}
              
              {sectionButtons.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {sectionButtons.map((button: any, btnIndex: number) => (
                    <Link
                      key={btnIndex}
                      to={button.url || '#'}
                      className={`px-6 py-3 font-medium transition-all ${
                        button.variant === 'outline'
                          ? 'bg-transparent border-2 border-white hover:bg-white hover:text-black'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      {button.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {heroSections.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSections.length) % heroSections.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSections.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroSections.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Hero;
