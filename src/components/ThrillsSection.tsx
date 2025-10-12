import { Button } from "@/components/ui/button";

interface PromoCard {
  image?: string;
  title?: string;
  description?: string;
  features?: string[];
  buttonText?: string;
  buttonLink?: string;
}

interface ThrillsSectionProps {
  promoCard?: PromoCard;
}

const ThrillsSection = ({ promoCard }: ThrillsSectionProps) => {
  const features = promoCard?.features || [
    "Call & Music Control",
    "RideChat™ & Music Sharing",
    "Yakuza Smart Sensor"
  ];

  return (
    <section className="bg-[#f8f9f9] w-full py-16 px-4 md:px-[70px]">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-[#1a1a1a] flex overflow-hidden">
          {/* Left Image Section */}
          {promoCard?.image ? (
            <div 
              className="w-1/2 min-h-[420px] bg-cover bg-center"
              style={{ backgroundImage: `url(${promoCard.image})` }}
            />
          ) : (
            <div className="w-1/2 bg-[#888888] min-h-[420px]" />
          )}
          
          {/* Right Content Section */}
          <div className="w-1/2 px-16 py-12 flex flex-col justify-center">
            <h2 className="font-inter font-medium text-[48px] text-white mb-4">
              {promoCard?.title || "Say Yakuza to Thrills"}
            </h2>
            
            <p className="font-inter font-normal text-lg text-[#b0b0b0] mb-8 max-w-[500px]">
              {promoCard?.description || "The smart helmet built for riders who live for the rush — always connected, always safe."}
            </p>
            
            {/* Features List */}
            <div className="flex gap-12 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <p className="font-inter font-normal text-sm text-[#b0b0b0]">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Buttons */}
            <div className="flex gap-4">
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
