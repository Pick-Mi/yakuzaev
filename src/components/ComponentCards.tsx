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
  const thirdCard = visualFeatures[2];
  
  return (
    <section className="bg-[#f5f5f5] w-full px-5 py-[30px] md:p-[75px]">
      <div className="max-w-[1400px] mx-auto space-y-5 md:space-y-4 sm:space-y-3">
        
        {/* Third Card - Large Full Width Card at Top */}
        <div 
          className="w-full h-[400px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg
                     md:h-[450px]
                     sm:h-[300px]"
          style={{
            backgroundImage: thirdCard?.image ? `url(${thirdCard.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: thirdCard?.image ? 'transparent' : '#888888'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-8 left-10 font-inter font-medium text-3xl text-white z-10
                        md:text-4xl md:bottom-10 md:left-12
                        sm:text-2xl sm:bottom-6 sm:left-6">
            {thirdCard?.text || 'Hub Motor'}
          </p>
        </div>

        {/* First and Second Cards - Two Columns Below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4 sm:gap-3">
          {/* First Card */}
          <div 
            className="w-full h-[350px] relative overflow-hidden
                       transition-all duration-300 ease-out cursor-pointer
                       hover:-translate-y-1 hover:shadow-lg
                       md:h-[400px]
                       sm:h-[250px]"
            style={{
              backgroundImage: firstCard?.image ? `url(${firstCard.image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: firstCard?.image ? 'transparent' : '#888888'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-8 left-10 font-inter font-medium text-3xl text-white z-10
                          md:text-4xl md:bottom-10 md:left-12
                          sm:text-xl sm:bottom-6 sm:left-6">
              {firstCard?.text || 'Head Light'}
            </p>
          </div>

          {/* Second Card */}
          <div 
            className="w-full h-[350px] relative overflow-hidden
                       transition-all duration-300 ease-out cursor-pointer
                       hover:-translate-y-1 hover:shadow-lg
                       md:h-[400px]
                       sm:h-[250px]"
            style={{
              backgroundImage: secondCard?.image ? `url(${secondCard.image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: secondCard?.image ? 'transparent' : '#888888'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-8 left-10 font-inter font-medium text-3xl text-white z-10
                          md:text-4xl md:bottom-10 md:left-12
                          sm:text-xl sm:bottom-6 sm:left-6">
              {secondCard?.text || 'Disc Brake'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentCards;
