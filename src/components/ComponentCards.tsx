interface VisualFeature {
  image?: string;
  text?: string;
  width?: string;
}

interface ComponentCardsProps {
  visualFeatures?: VisualFeature[];
}

const ComponentCards = ({ visualFeatures = [] }: ComponentCardsProps) => {
  const firstCard = visualFeatures[0];
  const secondCard = visualFeatures[1];
  
  return (
    <section className="bg-[#f5f5f5] w-full py-16 px-[70px]">
      <div className="max-w-[1400px] mx-auto flex gap-5
                      md:gap-4
                      sm:gap-3">
        
        {/* First Card - Dynamic from Database */}
        <div 
          className="w-[46%] h-[300px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg
                     md:h-[250px]
                     sm:h-[200px]"
          style={{
            backgroundImage: firstCard?.image ? `url(${firstCard.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: firstCard?.image ? 'transparent' : '#888888'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-6 left-8 font-inter font-medium text-2xl text-white z-10
                        md:text-xl md:bottom-5 md:left-6
                        sm:text-base sm:bottom-4 sm:left-4">
            {firstCard?.text || 'Hub Motor'}
          </p>
        </div>

        {/* Second Card - Dynamic from Database */}
        <div 
          className="w-[27%] h-[300px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg
                     md:h-[250px]
                     sm:h-[200px]"
          style={{
            backgroundImage: secondCard?.image ? `url(${secondCard.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: secondCard?.image ? 'transparent' : '#888888'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-6 left-8 font-inter font-medium text-2xl text-white z-10
                        md:text-xl md:bottom-5 md:left-6
                        sm:text-base sm:bottom-4 sm:left-4">
            {secondCard?.text || 'Head Light'}
          </p>
        </div>

        {/* Disc Brake - Medium Card */}
        <div 
          className="w-[27%] bg-[#888888] h-[300px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg
                     md:h-[250px]
                     sm:h-[200px]"
        >
          <p className="absolute bottom-6 left-8 font-inter font-medium text-2xl text-white
                        md:text-xl md:bottom-5 md:left-6
                        sm:text-base sm:bottom-4 sm:left-4">
            Disc Brake
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComponentCards;
