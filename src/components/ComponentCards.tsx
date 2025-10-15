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
      {/* Desktop: 3 columns layout */}
      <div className="hidden md:flex max-w-[1400px] mx-auto gap-4 sm:gap-3">
        {/* First Card */}
        <div 
          className="flex-1 h-[250px] sm:h-[200px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg"
          style={{
            backgroundImage: firstCard?.image ? `url(${firstCard.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: firstCard?.image ? 'transparent' : '#888888'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-5 left-6 font-inter font-medium text-xl sm:text-base sm:bottom-4 sm:left-4 text-white z-10">
            {firstCard?.text || 'Hub Motor'}
          </p>
        </div>

        {/* Second Card */}
        <div 
          className="flex-1 h-[250px] sm:h-[200px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg"
          style={{
            backgroundImage: secondCard?.image ? `url(${secondCard.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: secondCard?.image ? 'transparent' : '#888888'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-5 left-6 font-inter font-medium text-xl sm:text-base sm:bottom-4 sm:left-4 text-white z-10">
            {secondCard?.text || 'Head Light'}
          </p>
        </div>

        {/* Third Card */}
        <div 
          className="flex-1 h-[250px] sm:h-[200px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg"
          style={{
            backgroundImage: thirdCard?.image ? `url(${thirdCard.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: thirdCard?.image ? 'transparent' : '#888888'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-5 left-6 font-inter font-medium text-xl sm:text-base sm:bottom-4 sm:left-4 text-white z-10">
            {thirdCard?.text || 'Disc Brake'}
          </p>
        </div>
      </div>

      {/* Mobile: 1 large on top, 2 below */}
      <div className="md:hidden max-w-[1400px] mx-auto space-y-5">
        {/* Third Card - Large Full Width Card at Top (Mobile Only) */}
        <div 
          className="w-full h-[400px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg"
          style={{
            backgroundImage: thirdCard?.image ? `url(${thirdCard.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: thirdCard?.image ? 'transparent' : '#888888'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-8 left-10 font-inter font-medium text-3xl text-white z-10">
            {thirdCard?.text || 'Hub Motor'}
          </p>
        </div>

        {/* First and Second Cards - Two Columns Below (Mobile Only) */}
        <div className="grid grid-cols-2 gap-5">
          {/* First Card */}
          <div 
            className="w-full h-[250px] relative overflow-hidden
                       transition-all duration-300 ease-out cursor-pointer
                       hover:-translate-y-1 hover:shadow-lg"
            style={{
              backgroundImage: firstCard?.image ? `url(${firstCard.image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: firstCard?.image ? 'transparent' : '#888888'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-6 left-6 font-inter font-medium text-xl text-white z-10">
              {firstCard?.text || 'Head Light'}
            </p>
          </div>

          {/* Second Card */}
          <div 
            className="w-full h-[250px] relative overflow-hidden
                       transition-all duration-300 ease-out cursor-pointer
                       hover:-translate-y-1 hover:shadow-lg"
            style={{
              backgroundImage: secondCard?.image ? `url(${secondCard.image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: secondCard?.image ? 'transparent' : '#888888'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-6 left-6 font-inter font-medium text-xl text-white z-10">
              {secondCard?.text || 'Disc Brake'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentCards;
