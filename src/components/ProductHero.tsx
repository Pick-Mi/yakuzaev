import { Button } from "@/components/ui/button";

interface ProductHeroProps {
  productName: string;
  price: number;
  topSpeed?: string;
  range?: string;
  chargeTime?: string;
  onBookNow: () => void;
  onAddToCart: () => void;
}

const ProductHero = ({
  productName,
  price,
  topSpeed = "90 km/h",
  range = "161 km",
  chargeTime = "30 km",
  onBookNow,
  onAddToCart
}: ProductHeroProps) => {
  return (
    <section className="relative w-full h-[800px] bg-[#080f18]">
      {/* Pricing and Buttons Section */}
      <div className="absolute flex flex-col gap-5 items-start left-[1081px] top-[690px] w-[289px] max-lg:left-auto max-lg:right-5 max-lg:top-auto max-lg:bottom-10">
        <p className="font-['Inter'] font-semibold leading-normal text-white text-sm w-full">
          Starting at just ₹{price} -/
        </p>
        <div className="flex gap-[25px] items-center w-full max-md:flex-col max-md:gap-4">
          <button
            onClick={onBookNow}
            className="bg-white flex gap-2.5 items-center justify-center overflow-hidden px-[23px] py-[13px] transition-all hover:bg-gray-100 active:scale-95 max-md:w-full"
          >
            <span className="font-['Poppins'] font-medium leading-normal text-black text-base whitespace-nowrap">
              Book Now
            </span>
          </button>
          <button
            onClick={onAddToCart}
            className="bg-white/5 flex gap-2.5 items-center justify-center overflow-hidden px-[23px] py-[13px] transition-all hover:bg-white/10 active:scale-95 max-md:w-full"
          >
            <span className="font-['Poppins'] font-medium leading-normal text-white text-base whitespace-nowrap">
              Add to Cart
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="absolute flex flex-col gap-[35px] items-start left-[70px] top-[610px] w-[635px] max-lg:left-5 max-lg:right-5 max-lg:w-auto max-md:top-auto max-md:bottom-[200px]">
        {/* Main Title */}
        <h1 className="font-['Inter'] font-normal leading-[73px] text-white text-[48px] min-w-full w-min max-md:text-[32px] max-md:leading-tight max-md:text-center">
          {productName}
        </h1>
        
        {/* Specifications */}
        <div className="flex gap-[50px] items-center max-md:gap-[30px] max-md:justify-center max-md:flex-wrap">
          <div className="flex flex-col gap-[13px] items-start font-['Inter'] font-medium leading-[0] text-white whitespace-nowrap">
            <div className="flex flex-col justify-center opacity-80 text-2xl">
              <p className="leading-normal whitespace-nowrap">{topSpeed}</p>
            </div>
            <div className="flex flex-col justify-center opacity-70 text-sm">
              <p className="leading-normal whitespace-nowrap">Top Speed</p>
            </div>
          </div>
          
          <div className="relative h-[45.5px] w-0 flex-shrink-0 max-md:hidden">
            <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0 w-[1px] h-full bg-white opacity-20"></div>
          </div>
          
          <div className="flex flex-col gap-[13px] items-start font-['Inter'] font-medium leading-[0] text-white whitespace-nowrap">
            <div className="flex flex-col justify-center opacity-80 text-2xl">
              <p className="leading-normal whitespace-nowrap">{range}</p>
            </div>
            <div className="flex flex-col justify-center opacity-70 text-sm">
              <p className="leading-normal whitespace-nowrap">IDC Range</p>
            </div>
          </div>
          
          <div className="relative h-[45.5px] w-0 flex-shrink-0 max-md:hidden">
            <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0 w-[1px] h-full bg-white opacity-20"></div>
          </div>
          
          <div className="flex flex-col gap-[13px] items-start font-['Inter'] font-medium leading-[0] text-white whitespace-nowrap">
            <div className="flex flex-col justify-center opacity-80 text-2xl">
              <p className="leading-normal whitespace-nowrap">{chargeTime}</p>
            </div>
            <div className="flex flex-col justify-center opacity-70 text-sm">
              <p className="leading-normal whitespace-nowrap">Charge in 10 min*</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
