import { Box } from "lucide-react";

interface DesignFeature {
  image?: string;
  text?: string;
  title?: string;
  subtitle?: string;
  width?: string;
}

interface DesignSectionProps {
  designFeatures?: DesignFeature[];
}

const DesignSection = ({ designFeatures = [] }: DesignSectionProps) => {
  const firstCard = designFeatures[0];
  const secondCard = designFeatures[1];
  const thirdCard = designFeatures[2];
  const fourthCard = designFeatures[3];
  const fifthCard = designFeatures[4];

  return (
    <section className="bg-[#F8F9F9] w-full py-12 px-4">
      <div className="max-w-[1300px] mx-auto">
        {/* Heading */}
        <h2 className="font-inter font-semibold text-2xl md:text-4xl lg:text-[48px] text-[#000000] mb-8">Design</h2>
        
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col gap-8">
          {/* First Row - Two Main Cards */}
          <div className="flex gap-8">
            {/* First Design Card - Dynamic from Database */}
            <div 
              className="h-[460px] flex-[63] relative overflow-hidden"
              style={{
                backgroundImage: firstCard?.image ? `url(${firstCard.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: firstCard?.image ? 'transparent' : '#8a8a8a'
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-8 top-8 flex flex-col gap-3 text-white z-10">
                <p className="font-inter font-medium text-2xl lg:text-[28px]">{firstCard?.title || firstCard?.text || 'New Stylish Bike'}</p>
                <p className="font-inter font-normal text-lg lg:text-[22px] opacity-70">{firstCard?.subtitle || 'Elegance engineered for speed'}</p>
              </div>
            </div>
            
            {/* Second Design Card - Dynamic from Database */}
            <div 
              className="h-[460px] flex-[37] relative overflow-hidden"
              style={{
                backgroundImage: secondCard?.image ? `url(${secondCard.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: secondCard?.image ? 'transparent' : '#8a8a8a'
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-8 top-8 flex flex-col gap-3 text-white z-10">
                <p className="font-inter font-medium text-2xl lg:text-[28px]">{secondCard?.title || secondCard?.text || 'Premium Seat'}</p>
                <p className="font-inter font-normal text-lg lg:text-[22px] opacity-70">{secondCard?.subtitle || 'Comfort engineered for long rides'}</p>
              </div>
            </div>
          </div>

          {/* Second Row - Three Feature Cards */}
          <div className="flex gap-8">
            {/* Third Design Card - Dynamic from Database */}
            <div className="bg-[#e8ebf0] h-[242px] flex-1 relative overflow-hidden p-8">
              <div className="flex flex-col gap-6">
                {thirdCard?.image ? (
                  <img src={thirdCard.image} alt={thirdCard.title || thirdCard.text} className="w-12 h-12 object-contain" />
                ) : (
                  <Box className="w-8 h-8 text-[#5d637d]" strokeWidth={1.5} />
                )}
                <div className="flex flex-col gap-3">
                  <p className="font-inter font-medium text-xl lg:text-[24px] text-[#5d637d]">
                    {thirdCard?.title || thirdCard?.text || 'Fast-Charge Battery'}
                  </p>
                  <p className="font-inter font-normal text-base lg:text-[20px] text-[#5d637d] opacity-60">
                    {thirdCard?.subtitle || 'Get charged in minutes'}
                  </p>
                </div>
              </div>
            </div>

            {/* Fourth Design Card - Dynamic from Database */}
            <div 
              className="h-[242px] flex-1 relative overflow-hidden p-8"
              style={{
                backgroundImage: fourthCard?.image ? `url(${fourthCard.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: fourthCard?.image ? 'transparent' : '#8a8a8a'
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="flex flex-col gap-3 text-white relative z-10">
                <p className="font-inter font-medium text-xl lg:text-[24px]">{fourthCard?.title || fourthCard?.text || 'LED Matrix Headlight'}</p>
                <p className="font-inter font-normal text-base lg:text-[20px] opacity-70">{fourthCard?.subtitle || 'Brightness that leads the way'}</p>
              </div>
            </div>

            {/* Fifth Design Card - Dynamic from Database */}
            <div className="bg-[#e8ebf0] h-[242px] flex-1 relative overflow-hidden p-8">
              <div className="flex flex-col gap-6">
                {fifthCard?.image ? (
                  <img src={fifthCard.image} alt={fifthCard.title || fifthCard.text} className="w-12 h-12 object-contain" />
                ) : (
                  <Box className="w-12 h-12 text-[#5d637d]" strokeWidth={1.5} />
                )}
                <div className="flex flex-col gap-3">
                  <p className="font-inter font-medium text-xl lg:text-[24px] text-[#5d637d]">
                    {fifthCard?.title || fifthCard?.text || 'Smart Boot Space'}
                  </p>
                  <p className="font-inter font-normal text-base lg:text-[20px] text-[#5d637d] opacity-60">
                    {fifthCard?.subtitle || 'Compact design, ample room'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-5">
          {/* First Card - Large Full Width */}
          <div 
            className="h-[400px] w-full relative overflow-hidden"
            style={{
              backgroundImage: firstCard?.image ? `url(${firstCard.image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: firstCard?.image ? 'transparent' : '#8a8a8a'
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute left-8 top-8 flex flex-col gap-3 text-white z-10">
              <p className="font-inter font-medium text-2xl">{firstCard?.title || firstCard?.text || 'New Stylish Bike'}</p>
              <p className="font-inter font-normal text-lg opacity-70">{firstCard?.subtitle || 'Elegance engineered for speed'}</p>
            </div>
          </div>

          {/* Second Row - Two Cards */}
          <div className="grid grid-cols-2 gap-5">
            {/* Second Card */}
            <div 
              className="h-[250px] w-full relative overflow-hidden"
              style={{
                backgroundImage: secondCard?.image ? `url(${secondCard.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: secondCard?.image ? 'transparent' : '#8a8a8a'
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-4 top-4 flex flex-col gap-2 text-white z-10">
                <p className="font-inter font-medium text-base">{secondCard?.title || secondCard?.text || 'Premium Seat'}</p>
                <p className="font-inter font-normal text-sm opacity-70">{secondCard?.subtitle || 'Comfort for rides'}</p>
              </div>
            </div>

            {/* Third Card */}
            <div className="bg-[#e8ebf0] h-[250px] w-full relative overflow-hidden p-4">
              <div className="flex flex-col gap-4">
                {thirdCard?.image ? (
                  <img src={thirdCard.image} alt={thirdCard.title || thirdCard.text} className="w-8 h-8 object-contain" />
                ) : (
                  <Box className="w-6 h-6 text-[#5d637d]" strokeWidth={1.5} />
                )}
                <div className="flex flex-col gap-2">
                  <p className="font-inter font-medium text-base text-[#5d637d]">
                    {thirdCard?.title || thirdCard?.text || 'Fast-Charge Battery'}
                  </p>
                  <p className="font-inter font-normal text-sm text-[#5d637d] opacity-60">
                    {thirdCard?.subtitle || 'Get charged in minutes'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Third Row - Two Cards */}
          <div className="grid grid-cols-2 gap-5">
            {/* Fifth Card */}
            <div className="bg-[#e8ebf0] h-[250px] w-full relative overflow-hidden p-4">
              <div className="flex flex-col gap-4">
                {fifthCard?.image ? (
                  <img src={fifthCard.image} alt={fifthCard.title || fifthCard.text} className="w-8 h-8 object-contain" />
                ) : (
                  <Box className="w-8 h-8 text-[#5d637d]" strokeWidth={1.5} />
                )}
                <div className="flex flex-col gap-2">
                  <p className="font-inter font-medium text-base text-[#5d637d]">
                    {fifthCard?.title || fifthCard?.text || 'Smart Boot Space'}
                  </p>
                  <p className="font-inter font-normal text-sm text-[#5d637d] opacity-60">
                    {fifthCard?.subtitle || 'Compact design'}
                  </p>
                </div>
              </div>
            </div>

            {/* Fourth Card */}
            <div 
              className="h-[250px] w-full relative overflow-hidden p-4"
              style={{
                backgroundImage: fourthCard?.image ? `url(${fourthCard.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: fourthCard?.image ? 'transparent' : '#8a8a8a'
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="flex flex-col gap-2 text-white relative z-10">
                <p className="font-inter font-medium text-base">{fourthCard?.title || fourthCard?.text || 'LED Headlight'}</p>
                <p className="font-inter font-normal text-sm opacity-70">{fourthCard?.subtitle || 'Brightness ahead'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignSection;
