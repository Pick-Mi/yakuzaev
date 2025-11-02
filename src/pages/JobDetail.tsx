import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Share2, ArrowLeft } from "lucide-react";
import { FaXTwitter, FaLinkedin, FaTelegram, FaFacebook, FaWhatsapp } from "react-icons/fa6";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app, this would fetch job details from an API
  const jobData = {
    title: "Technical Support",
    type: "Full-time",
    openings: 10,
    applied: 10,
    locations: ["Bengaluru", "Chennai", "Mumbai", "Singapore"],
    companyDescription: [
      "Acumen is redefining how businesses and Chartered Accountants manage compliance, financial analytics, and security. Our end-to-end platform empowers professionals with innovative tools that are affordable, easy to implement, and tailored for seamless user experiences. Headquartered in [Location], Acumen operates with a dedicated team spread across multiple locations, supporting organizations worldwide—from startups to enterprises—in optimizing their operations and driving growth.",
      "Acumen's platform includes modules like Financial Analytics, Compliance Management, Team Collaboration, and more, all backed by cutting-edge technologies to deliver transformative digital solutions.",
      "We take pride in fostering an inclusive and collaborative work culture. Recognized for our innovation and workplace excellence, Acumen is committed to empowering its team to make a real impact in the professional world."
    ],
    aboutRole: [
      "Acumen is redefining how businesses and Chartered Accountants manage compliance, financial analytics, and security. Our end-to-end platform empowers professionals with innovative tools that are affordable, easy to implement, and tailored for seamless user experiences. Headquartered in [Location], Acumen operates with a dedicated team spread across multiple locations, supporting organizations worldwide—from startups to enterprises—in optimizing their operations and driving growth.",
      "Acumen's platform includes modules like Financial Analytics, Compliance Management, Team Collaboration, and more, all backed by cutting-edge technologies to deliver transformative digital solutions.",
      "We take pride in fostering an inclusive and collaborative work culture. Recognized for our innovation and workplace excellence, Acumen is committed to empowering its team to make a real impact in the professional world."
    ],
    responsibilities: [
      { title: "Web Development", description: "Design, develop, test, and deploy responsive and dynamic web applications tailored to user needs." },
      { title: "Collaboration", description: "Work closely with UI/UX designers to transform designs into functional, visually appealing web pages." },
      { title: "Optimization", description: "Ensure the performance, scalability, and security of the web applications by implementing industry best practices." },
      { title: "Integration", description: "Integrate APIs and third-party services into the platform to extend its functionality and enhance user experience." },
      { title: "Maintenance", description: "Regularly update and maintain web applications, ensuring compatibility with modern browsers and devices." },
      { title: "Problem Solving", description: "Troubleshoot, debug, and resolve technical issues efficiently." },
      { title: "Innovation", description: "Stay updated with the latest web development technologies and trends, recommending improvements for the platform." }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Title */}
              <div>
                <h1 className="text-4xl font-bold mb-2 text-foreground">{jobData.title}</h1>
                <p className="text-muted-foreground">{jobData.type}</p>
              </div>

              {/* Company Description */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Company Description</h2>
                <div className="space-y-4 text-foreground/80">
                  {jobData.companyDescription.map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* About the Role */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">About the Role</h2>
                <div className="space-y-4 text-foreground/80">
                  {jobData.aboutRole.map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Responsibilities</h2>
                <div className="space-y-4">
                  {jobData.responsibilities.map((item, index) => (
                    <div key={index}>
                      <p className="text-foreground">
                        <span className="font-semibold">{item.title}</span> : {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 sticky top-24 space-y-6">
                {/* Openings Info */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{jobData.openings} Openings / {jobData.type}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{jobData.applied}+ Applied</span>
                </div>

                {/* Locations */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">Locations</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {jobData.locations.map((location, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                </div>

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
                  <Button className="w-full rounded-none bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
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
