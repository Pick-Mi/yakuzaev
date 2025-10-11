const ComponentCards = () => {
  return (
    <section className="bg-[#f5f5f5] w-full py-16 px-[70px]">
      <div className="max-w-[1400px] mx-auto flex gap-5
                      md:gap-4
                      sm:gap-3">
        
        {/* Hub Motor - Larger Card */}
        <div 
          className="w-[46%] bg-[#888888] h-[300px] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-1 hover:shadow-lg
                     md:h-[250px]
                     sm:h-[200px]"
        >
          <p className="absolute bottom-6 left-8 font-inter font-medium text-2xl text-white
                        md:text-xl md:bottom-5 md:left-6
                        sm:text-base sm:bottom-4 sm:left-4">
            Hub Motor
          </p>
        </div>

        {/* Head Light - Medium Card */}
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
            Head Light
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
