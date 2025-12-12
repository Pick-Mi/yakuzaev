import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Share2, ArrowLeft } from "lucide-react";
import { FaXTwitter, FaLinkedin, FaTelegram, FaFacebook, FaWhatsapp } from "react-icons/fa6";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type JobPost = Database['public']['Tables']['job_posts']['Row'];

const JobDetail = () => {
  const { id } = useParams(); // This is actually the slug
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('job_posts')
          .select('*')
          .eq('slug', id)
          .eq('status', 'active')
          .maybeSingle();

        if (error) throw error;
        setJob(data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const parseTextList = (text: string | null): string[] => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim() !== '');
  };

  const getLocations = (location: any): string[] => {
    if (Array.isArray(location)) return location;
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#F8F9F9' }}>
          <p className="text-muted-foreground">Loading job details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#F8F9F9' }}>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Job not found</p>
            <Button onClick={() => navigate('/careers')}>Back to Careers</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const descriptionParagraphs = parseTextList(job.description);
  const requirementsList = parseTextList(job.requirements);
  const responsibilitiesList = parseTextList(job.responsibilities);
  const locations = getLocations(job.location);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1" style={{ backgroundColor: '#F8F9F9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8 bg-white dark:bg-neutral-950 p-[15px]">
              {/* Job Title */}
              <div>
                <h1 className="text-4xl font-bold mb-2 text-foreground">{job.title}</h1>
                <p className="text-muted-foreground">{job.job_type}</p>
              </div>

              {/* Job Description */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Job Description</h2>
                <div className="space-y-4 text-foreground/80">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {requirementsList.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">Requirements</h2>
                  <ul className="space-y-2 text-foreground/80">
                    {requirementsList.map((requirement, index) => (
                      <li key={index} className="leading-relaxed flex">
                        <span className="mr-2">•</span>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {responsibilitiesList.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">Responsibilities</h2>
                  <ul className="space-y-2 text-foreground/80">
                    {responsibilitiesList.map((responsibility, index) => (
                      <li key={index} className="leading-relaxed flex">
                        <span className="mr-2">•</span>
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-neutral-950 p-6 sticky top-24 space-y-6">
                {/* Openings Info */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{job.openings} Openings / {job.job_type}</span>
                  </div>
                </div>

                {/* Locations */}
                {locations.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-foreground">Locations</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {locations.map((location, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share The Job */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">Share The Job</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                      <FaXTwitter className="w-5 h-5 text-foreground" />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                      <FaLinkedin className="w-5 h-5 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                      <FaTelegram className="w-5 h-5 text-blue-500" />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                      <FaFacebook className="w-5 h-5 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                      <FaWhatsapp className="w-5 h-5 text-green-600" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button variant="outline" className="w-full rounded-none">
                    Refer a Friend
                  </Button>
                  <Button 
                    onClick={() => navigate(`/careers/${job.slug}/apply`)}
                    className="w-full rounded-none bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;
