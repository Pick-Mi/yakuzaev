interface DesignFeature {
  image: string;
  text: string;
  width?: string;
}

interface ComponentCardsProps {
  designFeatures?: DesignFeature[];
}

const ComponentCards = ({ designFeatures }: ComponentCardsProps) => {
  const defaultFeatures = [
    { image: '', text: 'Hub Motor', width: '46%' },
    { image: '', text: 'Head Light', width: '27%' },
    { image: '', text: 'Disc Brake', width: '27%' }
  ];

  const displayFeatures = designFeatures || defaultFeatures;

  return (
    <section className="bg-[#f5f5f5] w-full py-16 px-[70px]">
      <div className="max-w-[1400px] mx-auto flex gap-5
                      md:gap-4
                      sm:gap-3">
        
        {displayFeatures.map((feature, index) => (
          <div 
            key={index}
            className="relative overflow-hidden bg-[#888888] h-[300px]
                       transition-all duration-300 ease-out cursor-pointer
                       hover:-translate-y-1 hover:shadow-lg
                       md:h-[250px]
                       sm:h-[200px]"
            style={{ 
              width: feature.width || (index === 0 ? '46%' : '27%'),
              backgroundImage: feature.image ? `url(${feature.image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <p className="absolute bottom-6 left-8 font-inter font-medium text-2xl text-white
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
