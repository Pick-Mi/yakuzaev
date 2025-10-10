const ComponentCards = () => {
  return (
    <section className="bg-[#f5f5f5] w-full py-16 px-4">
      <div className="max-w-[1400px] mx-auto flex gap-6
                      lg:flex-wrap
                      md:flex-col">
        
        {/* Hub Motor - Larger Card */}
        <div 
          className="flex-[1.6] bg-[#888888] h-[300px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg
                     lg:w-full lg:flex-none
                     md:h-[280px]
                     sm:h-[250px]"
        >
          <p className="absolute bottom-6 left-8 font-inter font-medium text-2xl text-white
                        md:text-xl md:bottom-5 md:left-6
                        sm:text-lg">
            Hub Motor
          </p>
        </div>

        {/* Head Light - Medium Card */}
        <div 
          className="flex-1 bg-[#888888] h-[300px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg
                     lg:w-[calc(50%-12px)] lg:flex-none
                     md:w-full md:h-[280px]
                     sm:h-[250px]"
        >
          <p className="absolute bottom-6 left-8 font-inter font-medium text-2xl text-white
                        md:text-xl md:bottom-5 md:left-6
                        sm:text-lg">
            Head Light
          </p>
        </div>

        {/* Disc Brake - Medium Card */}
        <div 
          className="flex-1 bg-[#888888] h-[300px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg
                     lg:w-[calc(50%-12px)] lg:flex-none
                     md:w-full md:h-[280px]
                     sm:h-[250px]"
        >
          <p className="absolute bottom-6 left-8 font-inter font-medium text-2xl text-white
                        md:text-xl md:bottom-5 md:left-6
                        sm:text-lg">
            Disc Brake
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComponentCards;
