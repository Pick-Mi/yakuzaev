import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogSection from "@/components/BlogSection";
import { Zap, Target, Eye, Heart, Users, Award, ArrowRight, BadgeCheck, Copyright } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import teamMeeting from "@/assets/team-meeting.jpg";
import manufacturing from "@/assets/manufacturing.jpg";
import teamCollaboration from "@/assets/team-collaboration.jpg";
import factoryTeam from "@/assets/factory-team.jpg";
import batteryCenter from "@/assets/battery-innovation-center.jpg";
import futureFactory from "@/assets/future-factory-construction.jpg";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section 
          className="relative w-full min-h-screen h-[600px] sm:h-[700px] md:h-[829px] bg-black overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/placeholder.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute bottom-8 sm:bottom-16 md:bottom-24 left-4 sm:left-6 md:left-10 right-4 sm:right-auto w-auto sm:w-[601px] max-w-[calc(100%-2rem)] sm:max-w-[90%] flex flex-col gap-4 sm:gap-6 items-start px-2 sm:px-0 animate-fade-in">
            <h1 className="font-sans font-normal text-[32px] sm:text-[42px] md:text-[52px] leading-[1.3] sm:leading-[1.4] md:leading-[73px] text-white m-0">
              About <span className="text-orange-300">YakuzaEV</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-2 sm:mb-4">
              Driving India towards a sustainable, electric future with innovative mobility solutions
            </p>
            
            <div className="flex gap-4 sm:gap-6 items-center flex-wrap w-full sm:w-auto">
              <a href="/products" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex justify-center items-center gap-[10px] bg-white text-black hover:bg-gray-100 px-[35px] h-[50px] text-[14px] font-medium font-sans rounded-none transition-colors">
                  Explore Products
                </button>
              </a>
              <a href="/become-dealer" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white/15 text-white hover:bg-white hover:text-black px-12 h-[50px] text-[14px] font-medium font-sans rounded-none transition-colors">
                  Become a Dealer
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Build to Rule Section */}
        <section className="py-[70px] px-4">
          <div className="container mx-auto max-w-7xl p-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              We build to rule, We build to perform
            </h2>
            
            <div className="overflow-x-auto pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex gap-6 pb-4">
                <div className="overflow-hidden flex-shrink-0">
                  <img 
                    src={teamMeeting} 
                    alt="Leadership team presenting to employees" 
                    className="w-[280px] h-[320px] object-cover"
                  />
                </div>
                <div className="overflow-hidden flex-shrink-0">
                  <img 
                    src={manufacturing} 
                    alt="Manufacturing facility with EV production" 
                    className="w-[280px] h-[320px] object-cover"
                  />
                </div>
                <div className="overflow-hidden flex-shrink-0">
                  <img 
                    src={teamCollaboration} 
                    alt="Team collaboration at office campus" 
                    className="w-[280px] h-[320px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* From India Section */}
        <section className="py-[70px] px-4">
          <div className="container mx-auto max-w-7xl p-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              We build to rule , We build to perform
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center bg-white p-[20px]">
              {/* Left - Image */}
              <div className="overflow-hidden">
                <img 
                  src={factoryTeam} 
                  alt="Factory team members at manufacturing facility" 
                  className="w-full h-[500px] object-cover"
                />
              </div>

              {/* Right - Content */}
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  From India. For The World.
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Yakuza, as a brand, embodies resilience and hard work. We are a pioneering electric vehicle 
                  company with manufacturing facilities in Haryana, Madhya Pradesh, and West Bengal. 
                  As a rapidly evolving startup led by industry veterans, we offer a diverse range of electric 
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Stats Section */}
        <section className="py-[70px] px-4 bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-[100px]">
              We build to rule , We build to perform
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-none rounded-none">
                <CardContent className="p-8">
                  <Users className="w-12 h-12 text-white mb-6" strokeWidth={1.5} />
                  <div className="text-5xl font-bold text-white mb-2">959</div>
                  <div className="text-lg text-gray-300">Employees in R&D</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-none rounded-none">
                <CardContent className="p-8">
                  <BadgeCheck className="w-12 h-12 text-white mb-6" strokeWidth={1.5} />
                  <div className="text-5xl font-bold text-white mb-2">569</div>
                  <div className="text-lg text-gray-300">Patents in India</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-none rounded-none">
                <CardContent className="p-8">
                  <Copyright className="w-12 h-12 text-white mb-6" strokeWidth={1.5} />
                  <div className="text-5xl font-bold text-white mb-2">959</div>
                  <div className="text-lg text-gray-300">Registered design</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Future Ready Section */}
        <section className="py-[70px] px-4 bg-background">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Future Ready. Already
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Battery Innovation Center */}
              <div className="flex flex-col bg-white p-6">
                <div className="overflow-hidden mb-6">
                  <img 
                    src={batteryCenter} 
                    alt="Battery Innovation Center architectural rendering" 
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">Battery Innovation Center</h3>
                <p className="text-lg text-muted-foreground">
                  An R&D facility dedicated entirely to battery innovation, housing some of the brightest minds from around the world.
                </p>
              </div>

              {/* Future Factory */}
              <div className="flex flex-col bg-white p-6">
                <div className="overflow-hidden mb-6">
                  <img 
                    src={futureFactory} 
                    alt="Future Factory construction site in Krishanagiri" 
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">Future Factory,</h3>
                <p className="text-lg text-muted-foreground">
                  We have largest integrated and automated Electric 2 Wheeler manufacturing plant in India, spread across 400+ acres* in Krishanagiri, Tamil Nadu
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <BlogSection />

      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
