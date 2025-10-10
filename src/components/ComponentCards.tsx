const ComponentCards = () => {
  return (
    <section className="bg-[#f8f9f9] w-full relative min-h-[600px] overflow-hidden py-[100px]">
      <div className="absolute left-1/2 top-[100px] -translate-x-1/2 flex gap-[30px] items-center w-[1300px] max-w-[calc(100%-80px)]
                      lg:flex-wrap lg:w-[calc(100%-40px)] lg:top-[50px] lg:gap-5
                      md:top-[30px] md:gap-[15px]
                      sm:w-[calc(100%-30px)] sm:top-5 sm:gap-[15px]">
        
        {/* Card 1: Hub Motor */}
        <div 
          className="shrink-0 w-[630px] h-[386px] bg-[#8a8a8a] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                     animate-[fadeInUp_0.6s_ease-out_0.1s_backwards]
                     lg:w-[40%] lg:min-w-[300px]
                     md:w-full md:h-[300px] md:flex-none
                     sm:h-[200px]"
          onClick={() => console.log('Clicked on: Hub Motor')}
        >
          <p className="absolute left-[30px] top-[322px] font-inter font-medium text-[28px] leading-normal text-white whitespace-pre
                        md:text-2xl md:top-[250px] md:left-5
                        sm:text-lg sm:top-[150px] sm:left-[15px]">
            Hub Motor
          </p>
        </div>

        {/* Card 2: Head Light */}
        <div 
          className="flex-1 min-w-0 h-[386px] bg-[#8a8a8a] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                     animate-[fadeInUp_0.6s_ease-out_0.2s_backwards]
                     md:w-full md:h-[300px] md:flex-none
                     sm:h-[200px]"
          onClick={() => console.log('Clicked on: Head Light')}
        >
          {/* Headlight Image Container */}
          <div className="absolute right-[-213.27px] top-[50%] translate-y-[calc(-50%+32.294px)] 
                         flex items-center justify-center
                         h-[calc(523.265625px*0.5634740591049194+606.203125px*0.8261337876319885)]
                         w-[calc(606.203125px*0.5634740591049194+523.265625px*0.8261337876319885)]">
            <div className="flex-none rotate-[214.296deg] scale-y-[-1]">
              <div className="w-[523.275px] h-[606.206px] bg-white/5"></div>
            </div>
          </div>
          
          <p className="absolute left-[30px] top-[322px] font-inter font-medium text-[28px] leading-normal text-white whitespace-pre
                        md:text-2xl md:top-[250px] md:left-5
                        sm:text-lg sm:top-[150px] sm:left-[15px]">
            Head Light 
          </p>
        </div>

        {/* Card 3: Disc Brake */}
        <div 
          className="flex-1 min-w-0 h-[386px] bg-[#8a8a8a] relative overflow-hidden
                     transition-all duration-300 ease-out cursor-pointer
                     hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                     animate-[fadeInUp_0.6s_ease-out_0.3s_backwards]
                     md:w-full md:h-[300px] md:flex-none
                     sm:h-[200px]"
          onClick={() => console.log('Clicked on: Disc Brake')}
        >
          {/* Disc Brake Image Container */}
          <div className="absolute right-[522px] top-1/2 -translate-y-1/2 flex items-center justify-center w-[108px] h-[384px]">
            <div className="flex-none rotate-180 scale-y-[-1]">
              <div className="h-[384px] w-[108px] relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img 
                    className="absolute h-[348.57%] left-[-1444.74%] top-[-178.81%] w-[1694.26%] max-w-none" 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" 
                    alt="Disc Brake" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <p className="absolute left-[30px] top-[332px] font-inter font-medium text-[28px] leading-normal text-white whitespace-pre
                        md:text-2xl md:top-[260px] md:left-5
                        sm:text-lg sm:top-[160px] sm:left-[15px]">
            Disc Brake
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default ComponentCards;
