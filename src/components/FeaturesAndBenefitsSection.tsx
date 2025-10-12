interface Benefit {
  image?: string;
  text?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

interface FeaturesAndBenefitsSectionProps {
  benefits?: Benefit[];
}

const FeaturesAndBenefitsSection = ({ benefits = [] }: FeaturesAndBenefitsSectionProps) => {
  // Fallback benefits if none provided from database
  const defaultBenefits = [
    {
      id: 1,
      title: "Why Choose This Bike",
      subtitle: "Packed with power, style, and comfort"
    },
    {
      id: 2,
      title: "Key Highlights",
      subtitle: "Smart features built for you"
    },
    {
      id: 3,
      title: "Smart Features",
      subtitle: "Designed to enhance every journey"
    }
  ];

  const displayBenefits = benefits.length > 0 ? benefits : defaultBenefits;

  return (
    <section className="bg-[#f8f9f9] w-full py-16 px-4 md:px-[70px]">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        <h2 className="font-inter font-medium text-[48px] text-[#000000]">Features and Benefits</h2>
        
        <div className="flex gap-8 overflow-x-auto">
          {displayBenefits.map((benefit, index) => (
            <div key={index} className="bg-white flex-1 flex flex-col">
              {benefit.image ? (
                <div 
                  className="h-[340px] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${benefit.image})` }}
                />
              ) : (
                <div className="bg-[#888888] h-[340px] w-full" />
              )}
              
              <div className="p-8 flex flex-col gap-3">
                <p className="font-inter font-medium text-[24px] text-[#000000]">
                  {benefit.title || benefit.text || 'Benefit Title'}
                </p>
                
                <p className="font-inter font-normal text-base text-[#666666]">
                  {benefit.description || benefit.subtitle || 'Benefit description'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesAndBenefitsSection;
