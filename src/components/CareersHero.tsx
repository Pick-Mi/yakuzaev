import careersHeroImage from "@/assets/careers-hero.jpg";

const CareersHero = () => {
  return (
    <section 
      className="relative w-full h-[800px] bg-[#080f18]"
      style={{
        backgroundImage: `url(${careersHeroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Action Button Section */}
      <div className="absolute z-10 flex flex-col gap-5 items-center right-[70px] top-[610px] w-[289px] max-lg:left-5 max-lg:top-auto max-lg:bottom-10">
        <div className="flex gap-5 items-center w-full max-md:flex-col max-md:gap-4 max-md:w-full">
          <a
            href="#opportunities"
            className="bg-white flex gap-2.5 items-center justify-center overflow-hidden px-[23px] py-[13px] transition-all hover:bg-gray-100 active:scale-95 max-md:w-full max-md:h-[50px]"
          >
            <span className="font-['Poppins'] font-medium leading-normal text-black text-base whitespace-nowrap">
              Explore All Jobs
            </span>
          </a>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="absolute z-10 flex flex-col gap-[35px] items-start left-[70px] top-[460px] w-[635px] max-lg:left-5 max-lg:right-5 max-lg:w-auto max-md:top-auto max-md:bottom-[200px]">
        {/* Main Title */}
        <h1 className="font-['Inter'] font-normal leading-[73px] text-white text-[48px] min-w-full w-min max-md:text-[32px] max-md:leading-tight">
          The future of automobiles.<br />
          The future of retail.
        </h1>
        
        {/* Career Stats */}
        <div className="flex gap-[50px] items-center max-md:gap-[30px] max-md:flex-wrap">
          <div className="flex flex-col gap-[13px] items-start font-['Inter'] font-medium leading-[0] text-white whitespace-nowrap">
            <div className="flex flex-col justify-center opacity-80 text-2xl">
              <p className="leading-normal whitespace-nowrap">50+</p>
            </div>
            <div className="flex flex-col justify-center opacity-70 text-sm">
              <p className="leading-normal whitespace-nowrap">Open Positions</p>
            </div>
          </div>
          
          <div className="relative h-[45.5px] w-0 flex-shrink-0 max-md:hidden">
            <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0 w-[1px] h-full bg-white opacity-20"></div>
          </div>
          
          <div className="flex flex-col gap-[13px] items-start font-['Inter'] font-medium leading-[0] text-white whitespace-nowrap">
            <div className="flex flex-col justify-center opacity-80 text-2xl">
              <p className="leading-normal whitespace-nowrap">500+</p>
            </div>
            <div className="flex flex-col justify-center opacity-70 text-sm">
              <p className="leading-normal whitespace-nowrap">Team Members</p>
            </div>
          </div>
          
          <div className="relative h-[45.5px] w-0 flex-shrink-0 max-md:hidden">
            <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0 w-[1px] h-full bg-white opacity-20"></div>
          </div>
          
          <div className="flex flex-col gap-[13px] items-start font-['Inter'] font-medium leading-[0] text-white whitespace-nowrap">
            <div className="flex flex-col justify-center opacity-80 text-2xl">
              <p className="leading-normal whitespace-nowrap">100%</p>
            </div>
            <div className="flex flex-col justify-center opacity-70 text-sm">
              <p className="leading-normal whitespace-nowrap">Growth Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareersHero;
