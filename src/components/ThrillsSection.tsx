import { Button } from "@/components/ui/button";

interface PromoCard {
  image?: string;
  title?: string;
  description?: string;
  features?: Array<string | { icon?: string; label?: string; text?: string }>;
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
        <div className="bg-[#1a1a1a] flex flex-col md:flex-row overflow-hidden">
          {/* Left Image Section */}
          {promoCard?.image ? (
            <div 
              className="w-full md:w-1/2 min-h-[250px] md:min-h-[420px] bg-cover bg-center"
              style={{ backgroundImage: `url(${promoCard.image})` }}
            />
          ) : (
            <div className="w-full md:w-1/2 bg-[#888888] min-h-[250px] md:min-h-[420px]" />
          )}
          
          {/* Right Content Section */}
          <div className="w-full md:w-1/2 px-6 py-8 md:px-16 md:py-12 flex flex-col justify-center">
            <h2 className="font-inter font-medium text-2xl md:text-4xl lg:text-[48px] text-white mb-4">
              {promoCard?.title || "Say Yakuza to Thrills"}
            </h2>
            
            <p className="font-inter font-normal text-sm md:text-base lg:text-lg text-[#b0b0b0] mb-8 max-w-[500px]">
              {promoCard?.description || "The smart helmet built for riders who live for the rush — always connected, always safe."}
            </p>
            
            {/* Features List */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="text-left">
                  <p className="font-inter font-normal text-sm text-[#b0b0b0]">
                    {typeof feature === 'string' ? feature : feature.label || feature.text}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                className="bg-white text-black hover:bg-gray-100 px-6 md:px-8 py-4 md:py-6 text-sm md:text-base font-medium w-full md:w-auto rounded-none"
              >
                Book Now
              </Button>
              <Button 
                variant="secondary"
                className="px-6 md:px-8 py-4 md:py-6 text-sm md:text-base font-medium w-full md:w-auto rounded-none"
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
