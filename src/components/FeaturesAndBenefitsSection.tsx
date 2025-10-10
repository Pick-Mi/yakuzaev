const FeaturesAndBenefitsSection = () => {
  const benefits = [
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

  return (
    <section className="bg-[#f8f9f9] w-full py-16 px-4 md:px-[70px]">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        <h2 className="font-inter font-medium text-[48px] text-[#000000]">Features and Benefits</h2>
        
        <div className="flex gap-8 overflow-x-auto">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="bg-white flex-1 flex flex-col">
              <div className="bg-[#888888] h-[340px] w-full" />
              
              <div className="p-8 flex flex-col gap-3">
                <p className="font-inter font-medium text-[24px] text-[#000000]">
                  {benefit.title}
                </p>
                
                <p className="font-inter font-normal text-base text-[#666666]">
                  {benefit.subtitle}
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
