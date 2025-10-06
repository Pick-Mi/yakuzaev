import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen h-[829px] bg-black overflow-hidden">
      <div className="absolute left-1/2 top-[549px] -translate-x-1/2 w-[601px] max-w-[90%] flex flex-col gap-6 items-start">
        <h1 className="font-normal text-[52px] leading-[73px] text-white m-0">
          Turn every ride into an adventure.
        </h1>
        
        <div className="flex gap-6 items-center flex-wrap">
          <Link to="/products">
            <Button 
              className="bg-white text-black hover:bg-gray-100 px-9 py-3 text-base font-medium font-['Poppins']"
            >
              Book Now
            </Button>
          </Link>
          <Link to="/products">
            <Button 
              className="bg-white/15 text-white hover:bg-white/25 px-12 py-3 text-sm font-medium"
            >
              Explore
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;