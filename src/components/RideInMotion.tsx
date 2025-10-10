import { ArrowRight, Play } from "lucide-react";

const RideInMotion = () => {
  return (
    <section className="bg-white w-full py-16 px-4 md:px-[70px]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-inter font-medium text-[48px] text-[#000000]">
            Ride in Motion
          </h2>
          <button className="hover:translate-x-1 transition-transform">
            <ArrowRight className="w-8 h-8 text-[#000000]" />
          </button>
        </div>

        {/* Video Grid */}
        <div className="flex gap-6">
          {/* Large Video Card */}
          <div className="relative w-[60%] h-[440px] bg-[#0a0a0a] overflow-hidden cursor-pointer group">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-black ml-1" fill="black" />
              </div>
            </div>
          </div>

          {/* Small Video Cards Container */}
          <div className="flex flex-col gap-6 w-[40%]">
            {/* Small Video Card 1 */}
            <div className="relative h-[212px] bg-[#888888] overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
                </div>
              </div>
            </div>

            {/* Small Video Card 2 */}
            <div className="relative h-[212px] bg-[#888888] overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RideInMotion;
