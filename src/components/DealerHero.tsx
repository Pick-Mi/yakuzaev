import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Handshake } from "lucide-react";

const DealerHero = () => {
  return (
    <section 
      className="relative w-full min-h-screen h-[829px] bg-gradient-to-br from-gray-900 via-orange-900 to-orange-700 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <h1 className="font-sans font-bold text-5xl md:text-7xl leading-tight text-white mb-6">
            Partner with the
            <br />
            <span className="text-orange-300">Electric Future</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
            Join our growing network of authorized dealers and be part of India's electric vehicle revolution
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10 max-w-2xl">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-orange-300" size={24} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-white/80">Active Dealers</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-orange-300" size={24} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-white/80">Happy Customers</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Handshake className="text-orange-300" size={24} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">100+</div>
              <div className="text-sm text-white/80">Cities Covered</div>
            </div>
          </div>
          
          <div className="flex gap-6 items-center flex-wrap">
            <Button 
              onClick={() => {
                const form = document.getElementById('dealer-application-form');
                form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex justify-center items-center gap-[10px] bg-white text-black hover:bg-gray-100 px-[35px] h-[50px] text-[14px] font-medium font-sans rounded-none"
            >
              Apply Now
            </Button>
            <Link to="/products">
              <Button 
                className="bg-white/15 text-white hover:bg-white hover:text-black px-12 h-[50px] text-[14px] font-medium font-sans rounded-none border border-white/30"
              >
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <circle cx="350" cy="350" r="150" fill="white" opacity="0.1" />
          <circle cx="300" cy="300" r="100" fill="white" opacity="0.15" />
        </svg>
      </div>
    </section>
  );
};

export default DealerHero;
