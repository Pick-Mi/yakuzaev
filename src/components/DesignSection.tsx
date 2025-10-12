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
        <h2 className="font-inter font-semibold text-[48px] text-[#000000] mb-8">Design</h2>
        
        <div className="flex flex-col gap-8">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-8 top-8 flex flex-col gap-3 text-white z-10">
                <p className="font-inter font-medium text-[28px]">{firstCard?.title || firstCard?.text || 'New Stylish Bike'}</p>
                <p className="font-inter font-normal text-[22px] opacity-70">{firstCard?.subtitle || 'Elegance engineered for speed'}</p>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-8 top-8 flex flex-col gap-3 text-white z-10">
                <p className="font-inter font-medium text-[28px]">{secondCard?.title || secondCard?.text || 'Premium Seat'}</p>
                <p className="font-inter font-normal text-[22px] opacity-70">{secondCard?.subtitle || 'Comfort engineered for long rides'}</p>
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
                  <p className="font-inter font-medium text-[24px] text-[#5d637d]">
                    {thirdCard?.title || thirdCard?.text || 'Fast-Charge Battery'}
                  </p>
                  <p className="font-inter font-normal text-[20px] text-[#5d637d] opacity-60">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="flex flex-col gap-3 text-white relative z-10">
                <p className="font-inter font-medium text-[24px]">{fourthCard?.title || fourthCard?.text || 'LED Matrix Headlight'}</p>
                <p className="font-inter font-normal text-[20px] opacity-70">{fourthCard?.subtitle || 'Brightness that leads the way'}</p>
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
                  <p className="font-inter font-medium text-[24px] text-[#5d637d]">
                    {fifthCard?.title || fifthCard?.text || 'Smart Boot Space'}
                  </p>
                  <p className="font-inter font-normal text-[20px] text-[#5d637d] opacity-60">
                    {fifthCard?.subtitle || 'Compact design, ample room'}
                  </p>
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
