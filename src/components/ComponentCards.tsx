const ComponentCards = () => {
  const cards = [
    { id: 1, label: "Hub Motor" },
    { id: 2, label: "Head Light" },
    { id: 3, label: "Disc Brake" }
  ];

  return (
    <section className="bg-[#f8f9f9] w-full py-20 px-4">
      <div className="max-w-[1400px] mx-auto flex gap-8 
                      lg:flex-wrap lg:gap-6 
                      md:gap-5 
                      sm:flex-col sm:gap-4">
        {/* Hub Motor - Larger Card */}
        <div className="flex-[1.75] bg-[#8a8a8a] h-[400px] relative overflow-hidden
                       transition-all duration-300 ease-out cursor-pointer
                       hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                       lg:min-w-full
                       md:h-[350px]
                       sm:min-w-full sm:h-[300px]">
          <p className="absolute bottom-8 left-8 font-inter font-medium text-3xl text-white
                        md:text-2xl md:bottom-6 md:left-6
                        sm:text-xl sm:bottom-5 sm:left-5">
            Hub Motor
          </p>
        </div>

        {/* Head Light - Smaller Card */}
        <div className="flex-1 bg-[#8a8a8a] h-[400px] relative overflow-hidden
                       transition-all duration-300 ease-out cursor-pointer
                       hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                       lg:min-w-[calc(50%-12px)]
                       md:h-[350px]
                       sm:min-w-full sm:h-[300px]">
          <p className="absolute bottom-8 left-8 font-inter font-medium text-3xl text-white
                        md:text-2xl md:bottom-6 md:left-6
                        sm:text-xl sm:bottom-5 sm:left-5">
            Head Light
          </p>
        </div>

        {/* Disc Brake - Smaller Card */}
        <div className="flex-1 bg-[#8a8a8a] h-[400px] relative overflow-hidden
                       transition-all duration-300 ease-out cursor-pointer
                       hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                       lg:min-w-[calc(50%-12px)]
                       md:h-[350px]
                       sm:min-w-full sm:h-[300px]">
          <p className="absolute bottom-8 left-8 font-inter font-medium text-3xl text-white
                        md:text-2xl md:bottom-6 md:left-6
                        sm:text-xl sm:bottom-5 sm:left-5">
            Disc Brake
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComponentCards;
