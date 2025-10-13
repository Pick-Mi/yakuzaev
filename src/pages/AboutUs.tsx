import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Zap, Target, Eye, Heart, Users, Award } from "lucide-react";
import teamMeeting from "@/assets/team-meeting.jpg";
import manufacturing from "@/assets/manufacturing.jpg";
import teamCollaboration from "@/assets/team-collaboration.jpg";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section 
          className="relative w-full min-h-screen h-[829px] bg-black overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/placeholder.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute left-10 top-[520px] w-[601px] max-w-[90%] flex flex-col gap-6 items-start">
            <h1 className="font-sans font-normal text-[52px] leading-[73px] text-white m-0">
              About <span className="text-orange-300">YakuzaEV</span>
            </h1>
            <p className="text-xl text-white/90 mb-4">
              Driving India towards a sustainable, electric future with innovative mobility solutions
            </p>
            
            <div className="flex gap-6 items-center flex-wrap">
              <a href="/products">
                <button className="flex justify-center items-center gap-[10px] bg-white text-black hover:bg-gray-100 px-[35px] h-[50px] text-[14px] font-medium font-sans rounded-none transition-colors">
                  Explore Products
                </button>
              </a>
              <a href="/become-dealer">
                <button className="bg-white/15 text-white hover:bg-white hover:text-black px-12 h-[50px] text-[14px] font-medium font-sans rounded-none transition-colors">
                  Become a Dealer
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Build to Rule Section */}
        <section className="py-[70px] px-4">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              We build to rule, We build to perform
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="overflow-hidden">
                <img 
                  src={teamMeeting} 
                  alt="Leadership team presenting to employees" 
                  className="w-full h-[700px] object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <img 
                  src={manufacturing} 
                  alt="Manufacturing facility with EV production" 
                  className="w-full h-[340px] object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <img 
                  src={teamCollaboration} 
                  alt="Team collaboration at office campus" 
                  className="w-full h-[340px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-[70px] px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="bg-white p-10 rounded-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-orange-600" strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg text-muted-foreground">
                  To accelerate India's transition to electric mobility by delivering high-performance, 
                  affordable, and sustainable electric vehicles that exceed customer expectations while 
                  contributing to a cleaner environment.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white p-10 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-blue-600" strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                <p className="text-lg text-muted-foreground">
                  To become India's most trusted electric vehicle brand, leading the charge towards 
                  zero-emission transportation and inspiring millions to embrace sustainable mobility 
                  for a better tomorrow.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-[70px] px-4 bg-gradient-to-br from-gray-900 via-orange-900 to-orange-700">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join the Electric Revolution
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Be part of our journey towards a sustainable future. Explore our range of electric vehicles today.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/products" className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-medium rounded-none hover:bg-gray-100 transition-colors">
                Explore Products
              </a>
              <a href="/become-dealer" className="inline-flex items-center justify-center px-8 py-3 bg-white/15 text-white font-medium rounded-none border border-white/30 hover:bg-white hover:text-black transition-colors">
                Become a Dealer
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
