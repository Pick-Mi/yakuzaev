import { Box } from "lucide-react";

const DesignSection = () => {
  return (
    <section className="bg-white w-full py-12 px-4">
      <div className="max-w-[1300px] mx-auto">
        {/* Heading */}
        <h2 className="font-inter font-semibold text-[48px] text-[#000000] mb-8">Design</h2>
        
        <div className="flex flex-col gap-8">
          {/* First Row - Two Main Cards */}
          <div className="flex gap-8">
            {/* New Stylish Bike Card */}
            <div className="bg-[#8a8a8a] h-[460px] flex-[63] relative overflow-hidden">
              <div className="absolute left-8 top-8 flex flex-col gap-3 text-white">
                <p className="font-inter font-medium text-[28px]">New Stylish Bike</p>
                <p className="font-inter font-normal text-[22px] opacity-70">Elegance engineered for speed</p>
              </div>
            </div>
            
            {/* Premium Seat Card */}
            <div className="bg-[#8a8a8a] h-[460px] flex-[37] relative overflow-hidden">
              <div className="absolute left-8 top-8 flex flex-col gap-3 text-white">
                <p className="font-inter font-medium text-[28px]">Premium Seat</p>
                <p className="font-inter font-normal text-[22px] opacity-70">Comfort engineered for long rides</p>
              </div>
            </div>
          </div>

          {/* Second Row - Three Feature Cards */}
          <div className="flex gap-8">
            {/* Fast-Charge Battery Card */}
            <div className="bg-[#e8ebf0] h-[242px] flex-1 relative overflow-hidden p-8">
              <div className="flex flex-col gap-6">
                <Box className="w-8 h-8 text-[#5d637d]" strokeWidth={1.5} />
                <div className="flex flex-col gap-3">
                  <p className="font-inter font-medium text-[24px] text-[#5d637d]">Fast-Charge Battery</p>
                  <p className="font-inter font-normal text-[20px] text-[#5d637d] opacity-60">Get charged in minutes</p>
                </div>
              </div>
            </div>

            {/* LED Matrix Headlight Card */}
            <div className="bg-[#8a8a8a] h-[242px] flex-1 relative overflow-hidden rounded p-8">
              <div className="flex flex-col gap-3 text-white">
                <p className="font-inter font-medium text-[24px]">LED Matrix Headlight</p>
                <p className="font-inter font-normal text-[20px] opacity-70">Brightness that leads the way</p>
              </div>
            </div>

            {/* Smart Boot Space Card */}
            <div className="bg-[#e8ebf0] h-[242px] flex-1 relative overflow-hidden rounded p-8">
              <div className="flex flex-col gap-6">
                <Box className="w-8 h-8 text-[#5d637d]" strokeWidth={1.5} />
                <div className="flex flex-col gap-3">
                  <p className="font-inter font-medium text-[24px] text-[#5d637d]">Smart Boot Space</p>
                  <p className="font-inter font-normal text-[20px] text-[#5d637d] opacity-60">Compact design, ample room</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignSection;
