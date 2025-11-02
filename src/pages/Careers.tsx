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
        <div id="opportunities" className="container mx-auto px-4 py-16 md:px-20 max-w-[1280px]">
          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-semibold mb-16 text-foreground">
            Some opportunities for you to explore
          </h1>

          {/* Job Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobOpportunities.map((job) => (
              <div
                key={job.id}
                className="bg-card rounded-lg p-6 flex flex-col justify-between border border-border hover:shadow-lg transition-shadow"
              >
                <div>
                  <h2 className="text-base font-semibold text-primary uppercase mb-4 tracking-wide">
                    {job.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    {job.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">{job.type}</span>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.openings}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{String(job.locations).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
