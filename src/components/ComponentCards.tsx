interface VisualFeature {
  image: string;
  text: string;
  width?: string;
}

interface ComponentCardsProps {
  visualFeatures?: VisualFeature[];
}

const ComponentCards = ({ visualFeatures = [] }: ComponentCardsProps) => {
  if (!visualFeatures || visualFeatures.length === 0) return null;

  return (
    <section className="bg-[#f5f5f5] w-full py-16 px-[70px]">
      <div className="max-w-[1400px] mx-auto flex gap-5
                      md:gap-4
                      sm:gap-3">
        
        {visualFeatures.map((feature, index) => (
          <div 
            key={index}
            className={`${feature.width || 'w-[27%]'} bg-[#888888] h-[300px] relative overflow-hidden
                       transition-all duration-300 ease-out cursor-pointer
                       hover:-translate-y-1 hover:shadow-lg
                       md:h-[250px]
                       sm:h-[200px]`}
          >
            {feature.image && (
              <img 
                src={feature.image} 
                alt={feature.text}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <p className="absolute bottom-6 left-8 font-inter font-medium text-2xl text-white z-10
                          md:text-xl md:bottom-5 md:left-6
                          sm:text-base sm:bottom-4 sm:left-4">
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComponentCards;
