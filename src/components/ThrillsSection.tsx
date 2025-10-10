import { Button } from "@/components/ui/button";

const ThrillsSection = () => {
  const features = [
    "Call & Music Control",
    "RideChat™ & Music Sharing",
    "Yakuza Smart Sensor"
  ];

  return (
    <section className="bg-[#f8f9f9] w-full py-16 px-4 md:px-[70px]">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-[#1a1a1a] flex overflow-hidden md:flex-col">
          {/* Left Image Section */}
          <div className="w-1/2 bg-[#888888] min-h-[420px] md:w-full md:min-h-[300px]" />
          
          {/* Right Content Section */}
          <div className="w-1/2 px-16 py-12 flex flex-col justify-center md:w-full md:px-8 md:py-8">
            <h2 className="font-inter font-medium text-[48px] text-white mb-4 md:text-[36px]">
              Say Yakuza to Thrills
            </h2>
            
            <p className="font-inter font-normal text-lg text-[#b0b0b0] mb-8 max-w-[500px]">
              The smart helmet built for riders who live for the rush — always connected, always safe.
            </p>
            
            {/* Features List */}
            <div className="flex gap-12 mb-10 md:flex-col md:gap-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center md:text-left">
                  <p className="font-inter font-normal text-sm text-[#b0b0b0]">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Buttons */}
            <div className="flex gap-4 md:flex-col">
              <Button 
                className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-base font-medium"
              >
                Book Now
              </Button>
              <Button 
                variant="outline"
                className="border-[#555555] text-white hover:bg-[#2a2a2a] px-8 py-6 text-base font-medium"
              >
                Explore Neu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThrillsSection;
