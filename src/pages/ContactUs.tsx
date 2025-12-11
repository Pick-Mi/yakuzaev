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

interface HelpSection {
  id: string;
  title: string;
  subtitles: string[];
  display_order: number;
}

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
        setHelpSections(data as HelpSection[]);
      }
    };
    
    fetchHelpSections();
  }, []);
  
  const suggestions = [
    { title: "Return an item for a refund", subtitle: "Popular article • 4 min" },
    { title: "Get help with an item that hasn't arrived", subtitle: "Popular article • 4 min" },
    { title: "Shipping your items", subtitle: "Popular article • 2 min" },
    { title: "Creating a listing", subtitle: "Popular article • 4 min" },
  ];

  // Get delivery related section for the main content
  const deliverySection = helpSections.find(s => s.title.toLowerCase().includes('delivery'));
  const deliveryQuestions = deliverySection?.subtitles || [];

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

            {/* Type of Issue & Help Topics from Database */}
            <div className="bg-white p-6 shadow-sm rounded-none">
              {helpSections.filter(s => !s.title.toLowerCase().includes('delivery')).map((section, sectionIndex, filteredArr) => (
                <div key={section.id}>
                  <div>
                    <h3 className="text-base font-bold mb-4 text-gray-900 uppercase tracking-wide">{section.title}</h3>
                    <div className="space-y-3">
                      {section.subtitles.map((subtitle, index) => (
                        <button
                          key={index}
                          className="block w-full text-left text-base text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          {subtitle}
                        </button>
                      ))}
                    </div>
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
            {/* Suggestions */}
            <section className="bg-white p-6 shadow-sm rounded-none">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">Suggestions for you</h2>
              <p className="text-sm text-gray-600 mb-6">Select an action or article to learn more</p>
              
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
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
                
                <div className="space-y-4">
                  {deliveryQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="block w-full text-left text-base text-gray-700 hover:text-gray-900 hover:underline transition-colors py-1"
                    >
                      {question}
                    </button>
                  ))}
                </div>

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
