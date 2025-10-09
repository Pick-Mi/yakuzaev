import { Link } from "react-router-dom";

const ProductPromoSection = () => {
  return (
    <section className="bg-[#f8f9f9] w-full py-20 px-4">
      <div className="max-w-[1300px] mx-auto bg-[#191919] h-[470px] relative overflow-hidden lg:h-auto lg:pb-10">
        <div className="absolute bg-[#8a8a8a] h-[430px] w-[592px] left-5 top-5 lg:relative lg:w-[calc(100%-40px)] lg:h-[300px]" />
        
        <div className="absolute left-[676px] top-[52px] flex flex-col gap-8 w-[472px] lg:relative lg:left-5 lg:top-5 lg:w-[calc(100%-40px)]">
          <p className="font-inter font-medium text-[39.726px] text-white text-center lg:text-3xl">
            Say Yakuza to Thrills
          </p>
          <p className="font-inter font-medium text-xl text-[#9a9c9d] lg:text-base">
            The smart helmet built for riders who live for the rush — always connected, always safe.
          </p>
        </div>

        <div className="absolute left-[676px] top-[243px] flex flex-col gap-12 w-[452px] lg:relative lg:left-5 lg:top-8 lg:w-[calc(100%-40px)]">
          <div className="flex gap-10 items-center font-inter font-normal text-base text-center lg:flex-col lg:gap-5">
            <p className="text-[#6c6c6c] w-[124px] lg:w-full">Call & Music Control</p>
            <p className="text-[#6c6c6c] w-[124px] lg:w-full">RideChat™ & Music Sharing</p>
            <p className="text-white/70 w-[124px] lg:w-full">Yakuza Smart Sensor</p>
          </div>

          <div className="flex gap-4 items-center w-[351px] lg:w-full lg:flex-col">
            <Link
              to="/products"
              className="flex-1 bg-white h-[55px] flex items-center justify-center px-6 py-3 transition-all duration-300 hover:bg-[#f0f0f0] hover:-translate-y-0.5"
            >
              <span className="font-poppins font-medium text-base text-[#191919]">Book Now</span>
            </Link>
            <Link
              to="/products"
              className="flex-1 bg-white/10 h-[55px] flex items-center justify-center px-12 py-3 transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5"
            >
              <span className="font-inter font-medium text-sm text-white">Explore Neu</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPromoSection;
