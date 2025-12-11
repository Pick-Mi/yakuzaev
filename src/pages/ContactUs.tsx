import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSEOSettings } from "@/hooks/useSEOSettings";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SubtitleItem {
  title: string;
  paragraph?: string;
}

interface HelpSection {
  id: string;
  title: string;
  subtitles: (string | SubtitleItem)[];
  display_order: number;
}

// Helper to get title from subtitle item (handles both string and object)
const getSubtitleTitle = (item: string | SubtitleItem): string => {
  if (typeof item === 'string') return item;
  return item.title || '';
};

// Helper to get paragraph from subtitle item
const getSubtitleParagraph = (item: string | SubtitleItem): string => {
  if (typeof item === 'string') return '';
  return item.paragraph || '';
};

const ContactUs = () => {
  const seoSettings = useSEOSettings('/contact');
  const [helpSections, setHelpSections] = useState<HelpSection[]>([]);
  
  useEffect(() => {
    const fetchHelpSections = async () => {
      const { data, error } = await supabase
        .from('contact_help_sections')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (data && !error) {
        setHelpSections(data as unknown as HelpSection[]);
      }
    };
    
    fetchHelpSections();
  }, []);
  
  // Get delivery related section for the main content
  const deliverySection = helpSections.find(s => s.title.toLowerCase().includes('delivery'));
  const deliveryQuestions = deliverySection?.subtitles || [];

  // Get latest 4 items from all sections for suggestions
  const latestSuggestions = helpSections
    .flatMap(section => 
      section.subtitles.map(item => ({
        title: getSubtitleTitle(item),
        subtitle: "Popular article • 4 min"
      }))
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        {seoSettings?.meta_title && <title>{seoSettings.meta_title}</title>}
        {seoSettings?.meta_description && (
          <meta name="description" content={seoSettings.meta_description} />
        )}
        {seoSettings?.meta_keywords && (
          <meta name="keywords" content={seoSettings.meta_keywords} />
        )}
        {seoSettings?.og_title && (
          <meta property="og:title" content={seoSettings.og_title} />
        )}
        {seoSettings?.og_description && (
          <meta property="og:description" content={seoSettings.og_description} />
        )}
        {seoSettings?.og_image && (
          <meta property="og:image" content={seoSettings.og_image} />
        )}
        {seoSettings?.canonical_url && (
          <link rel="canonical" href={seoSettings.canonical_url} />
        )}
        {seoSettings?.schema_json && (
          <script type="application/ld+json">
            {JSON.stringify(seoSettings.schema_json, null, 2)}
          </script>
        )}
      </Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-32 max-w-7xl" style={{ backgroundColor: '#F8F9F9' }}>
        
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Left Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <h1 className="text-3xl font-semibold text-foreground">Customer Service</h1>
            {/* Need Help Card */}
            <div className="bg-white p-6 shadow-sm rounded-none">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">Need more help?</h2>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Get the help you need from our automated assistant, or contact an agent
              </p>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11"
                asChild
              >
                <a href="https://wa.me/917056009099" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  Contact With WhatsApp
                </a>
              </Button>
            </div>

            {/* Suggestions for you - Mobile/Tablet only */}
            <div className="bg-white p-6 shadow-sm rounded-none lg:hidden">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">Suggestions for you</h2>
              <p className="text-sm text-gray-600 mb-4">Select an action or article to learn more</p>
              
              <div className="space-y-2">
                {latestSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left hover:bg-gray-50 transition-colors p-2 rounded group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-normal text-sm text-gray-900 underline group-hover:text-blue-600">
                          {suggestion.title}
                        </h3>
                        <p className="text-xs text-gray-500">{suggestion.subtitle}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Type of Issue & Help Topics from Database */}
            <div className="bg-white p-6 shadow-sm rounded-none">
              {helpSections.filter(s => !s.title.toLowerCase().includes('delivery')).map((section, sectionIndex, filteredArr) => (
                <div key={section.id}>
                  <div>
                    <h3 className="text-base font-bold mb-4 text-gray-900 uppercase tracking-wide">{section.title}</h3>
                                    {/* Desktop view - simple list */}
                                    <div className="hidden lg:block space-y-3">
                                      {section.subtitles.map((item, index) => (
                                        <button
                                          key={index}
                                          className="block w-full text-left text-base text-gray-700 hover:text-gray-900 transition-colors"
                                        >
                                          {getSubtitleTitle(item)}
                                        </button>
                                      ))}
                                    </div>
                                    {/* Mobile/Tablet view - accordion */}
                                    <Accordion type="single" collapsible className="lg:hidden">
                                      {section.subtitles.map((item, index) => (
                                        <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
                                          <AccordionTrigger className="text-base text-gray-700 hover:text-gray-900 py-2 hover:no-underline">
                                            {getSubtitleTitle(item)}
                                          </AccordionTrigger>
                                          <AccordionContent className="text-sm text-gray-600 pb-3">
                                            {getSubtitleParagraph(item) || "More information about this topic will be displayed here."}
                                          </AccordionContent>
                                        </AccordionItem>
                                      ))}
                                    </Accordion>
                  </div>
                  {sectionIndex < filteredArr.length - 1 && (
                    <hr className="my-6 border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-10">
            {/* Suggestions - Desktop only */}
            <section className="hidden lg:block bg-white p-6 shadow-sm rounded-none">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">Suggestions for you</h2>
              <p className="text-sm text-gray-600 mb-6">Select an action or article to learn more</p>
              
              <div className="space-y-3">
                {latestSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left hover:bg-gray-50 transition-colors p-3 rounded group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-normal text-base text-gray-900 mb-1 underline group-hover:text-blue-600">
                          {suggestion.title}
                        </h3>
                        <p className="text-sm text-gray-500">{suggestion.subtitle}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Delivery Related from Database */}
            {deliverySection && (
              <section className="bg-white p-6 shadow-sm rounded-none">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">{deliverySection.title}</h2>
                
                {/* Desktop view - simple list */}
                <div className="hidden lg:block space-y-4">
                  {deliveryQuestions.map((item, index) => (
                    <button
                      key={index}
                      className="block w-full text-left text-base text-gray-700 hover:text-gray-900 hover:underline transition-colors py-1"
                    >
                      {getSubtitleTitle(item)}
                    </button>
                  ))}
                </div>
                {/* Mobile/Tablet view - accordion */}
                <Accordion type="single" collapsible className="lg:hidden">
                  {deliveryQuestions.map((item, index) => (
                    <AccordionItem key={index} value={`delivery-${index}`} className="border-b-0">
                      <AccordionTrigger className="text-base text-gray-700 hover:text-gray-900 py-2 hover:no-underline">
                        {getSubtitleTitle(item)}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600 pb-3">
                        {getSubtitleParagraph(item) || "More information about this topic will be displayed here."}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <button className="mt-8 text-base font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                  View More
                </button>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
