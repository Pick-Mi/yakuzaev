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
    <section className="bg-[#f8f9f9] w-full py-20 px-4">
      <div className="max-w-[1300px] mx-auto flex flex-col gap-12">
        <h2 className="font-inter font-medium text-5xl text-[#12141d]">Features and Benefits</h2>
        
        <div className="flex gap-10 lg:flex-col">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="bg-white h-[543px] flex-1 relative overflow-hidden">
              <div className="absolute bg-[#8a8a8a] h-[376px] w-[385px] left-2.5 top-2.5" />
              
              <p className="absolute font-inter font-medium text-[26px] text-black left-5 top-[442px]">
                {benefit.title}
              </p>
              
              <p className="absolute font-inter font-normal text-lg text-[#191919] opacity-70 left-5 top-[496px] max-w-[375px]">
                {benefit.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesAndBenefitsSection;
