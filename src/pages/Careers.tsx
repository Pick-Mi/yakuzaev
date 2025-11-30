import { Briefcase, MapPin } from "lucide-react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CareersHero from "@/components/CareersHero";
import { useSEOSettings } from "@/hooks/useSEOSettings";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type JobPost = Database['public']['Tables']['job_posts']['Row'];

const Careers = () => {
  const seoSettings = useSEOSettings('/careers');
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('job_posts')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJobPosts(data || []);
      } catch (error) {
        console.error('Error fetching job posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosts();
  }, []);

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getLocationCount = (location: any): number => {
    if (Array.isArray(location)) return location.length;
    return 0;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
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
      <CareersHero />
      <main className="flex-1" style={{ backgroundColor: '#F8F9F9' }}>
        <div id="opportunities" className="w-full" style={{ padding: '70px' }}>
          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-semibold mb-16 text-foreground">
            Some opportunities for you to explore
          </h1>

          {/* Job Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading job opportunities...</p>
            </div>
          ) : jobPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No job opportunities available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobPosts.map((job) => (
                <div
                  key={job.id}
                  className="group bg-white p-6 flex flex-col relative h-[280px] hover:shadow-lg transition-shadow overflow-hidden w-full"
                >
                  <div>
                    <h2 className="text-lg font-semibold uppercase mb-4 tracking-wide" style={{ color: '#1571BA' }}>
                      {job.title}
                    </h2>
                    <p className="text-base text-muted-foreground mb-6">
                      {truncateDescription(job.description)}
                    </p>
                  </div>

                  {/* Bottom Info Section */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-sm transition-all duration-300 group-hover:bottom-[90px]">
                    <span className="text-green-600 font-medium">{job.job_type}</span>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.openings}</span>
                        <p className="text-sm">openings</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{String(getLocationCount(job.location)).padStart(2, '0')}</span>
                        <p className="text-sm">location</p>
                      </div>
                    </div>
                  </div>

                  {/* Apply Now Button - Shows on Hover */}
                  <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      onClick={() => window.location.href = `/careers/${job.slug}`}
                      className="w-full rounded-none bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="my-16 border-t border-border"></div>

          {/* Join Our Team Section */}
          <div className="mb-16 w-full">
            <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-foreground">
              Join Our Team
            </h2>
            <div className="space-y-6 text-foreground/80 w-full">
              <p className="text-base leading-relaxed">
                we're always looking for passionate, creative, and dedicated professionals to join our growing family. Whether you're a designer, developer, marketer, or strategist — your next career move could start here.
              </p>
              <p className="text-base leading-relaxed">
                We're not just building designs — we're shaping experiences. If you're passionate, curious, and ready to take challenges that spark your creativity, this is the place for you. Drop your details below and let's build something amazing together.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
