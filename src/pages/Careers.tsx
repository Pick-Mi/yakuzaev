import { Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CareersHero from "@/components/CareersHero";

const jobOpportunities = [
  {
    id: 1,
    title: "TECHNICAL SUPPORT ENGINEERS",
    description: "Provide voice-based support to international/domestic customers over the phone (Inbound and Outbound). Build a rapport with customers with clear and c...",
    type: "Full time",
    openings: 10,
    locations: 2,
  },
  {
    id: 2,
    title: "TECHNICAL SUPPORT ENGINEERS",
    description: "Provide voice-based support to international/domestic customers over the phone (Inbound and Outbound). Build a rapport with customers with clear and c...",
    type: "Full time",
    openings: 10,
    locations: 2,
  },
  {
    id: 3,
    title: "TECHNICAL SUPPORT ENGINEERS",
    description: "Provide voice-based support to international/domestic customers over the phone (Inbound and Outbound). Build a rapport with customers with clear and c...",
    type: "Full time",
    openings: 10,
    locations: 2,
  },
  {
    id: 4,
    title: "TECHNICAL SUPPORT ENGINEERS",
    description: "Provide voice-based support to international/domestic customers over the phone (Inbound and Outbound). Build a rapport with customers with clear and c...",
    type: "Full time",
    openings: 10,
    locations: 2,
  },
  {
    id: 5,
    title: "TECHNICAL SUPPORT ENGINEERS",
    description: "Provide voice-based support to international/domestic customers over the phone (Inbound and Outbound). Build a rapport with customers with clear and c...",
    type: "Full time",
    openings: 10,
    locations: 2,
  },
  {
    id: 6,
    title: "TECHNICAL SUPPORT ENGINEERS",
    description: "Provide voice-based support to international/domestic customers over the phone (Inbound and Outbound). Build a rapport with customers with clear and c...",
    type: "Full time",
    openings: 10,
    locations: 2,
  },
];

const Careers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CareersHero />
      <main className="flex-1 bg-background">
        <div id="opportunities" className="w-full" style={{ padding: '70px' }}>
          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-semibold mb-16 text-foreground">
            Some opportunities for you to explore
          </h1>

          {/* Job Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobOpportunities.map((job) => (
              <div
                key={job.id}
                className="group bg-white p-6 flex flex-col relative h-[280px] hover:shadow-lg transition-shadow overflow-hidden w-full"
              >
                <div>
                  <h2 className="text-base font-semibold uppercase mb-4 tracking-wide" style={{ color: '#1571BA' }}>
                    {job.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    {job.description}
                  </p>
                </div>

                {/* Bottom Info Section */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-sm transition-all duration-300 group-hover:bottom-[90px]">
                  <span className="text-green-600 font-medium">{job.type}</span>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.openings}</span>
                      <p className="text-sm">openings</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{String(job.locations).padStart(2, '0')}</span>
                      <p className="text-sm">location</p>
                    </div>
                  </div>
                </div>

                {/* Apply Now Button - Shows on Hover */}
                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button className="w-full rounded-none bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="my-16 border-t border-border"></div>

          {/* Join Our Team Section */}
          <div className="mb-16">
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
