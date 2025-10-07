import { Link } from "react-router-dom";

const ScooterPromo = () => {
  return (
    <section className="w-full" style={{ backgroundColor: '#F8F9F9' }}>
      <div className="container mx-auto max-w-[1300px]">
        <div className="relative bg-white h-[522px] overflow-hidden m-0 w-full">
          {/* Left Content */}
          <div className="absolute left-[40px] top-[51px]">
            <p className="font-['Inter',sans-serif] font-medium text-[28px] leading-[54px] text-[#212121] w-[267px]">
              Now Get 3<br />Scooters at only
            </p>
          </div>

          {/* Price */}
          <p className="absolute left-[167.5px] -translate-x-1/2 top-[217px] font-['Inter',sans-serif] font-extrabold text-[48px] leading-[54px] text-[#212121] text-center whitespace-pre">
            ₹ 99,999/-
          </p>

          {/* Features */}
          <div className="absolute left-[40px] top-[337px] flex items-center gap-[20px]">
            <p className="font-['Poppins',sans-serif] text-[15.932px] text-[#4b4f54] opacity-50 whitespace-pre">
              Zero Emissions
            </p>
            <div className="w-0 h-[14.936px] border-l border-[#B5B5B4]"></div>
            <p className="font-['Poppins',sans-serif] text-[15.932px] text-[#212121] opacity-50 whitespace-pre">
              Stylish Design
            </p>
          </div>

          {/* Buttons */}
          <div className="absolute -translate-x-1/2 top-[415px] flex items-center gap-[15px] w-[351px]" style={{ left: 'calc(50% - 434.5px)' }}>
            <Link
              to="/products"
              className="flex-1 bg-black h-[55px] flex items-center justify-center px-[23px] py-[13px] rounded-lg"
            >
              <span className="font-['Poppins',sans-serif] font-medium text-[16px] text-white whitespace-pre">
                Book Now
              </span>
            </Link>
            <Link
              to="/products"
              className="flex-1 h-[55px] flex items-center justify-center px-[50px] py-[13px] rounded-lg"
              style={{ backgroundColor: '#f8f9f9' }}
            >
              <span className="font-['Inter',sans-serif] font-medium text-[14px] text-black whitespace-pre">
                Explore 
              </span>
            </Link>
          </div>

          {/* Image Grid */}
          {/* Top Right Image - 572x288 */}
          <div className="absolute right-0 top-0 w-[572px] h-[288px] bg-[#d9d9d9] ml-[20px]">
            <img
              src="/placeholder.svg"
              alt="Scooter side view"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Right Image - 394x214 */}
          <div className="absolute right-0 bottom-0 w-[394px] h-[214px] bg-[#d9d9d9]">
            <img
              src="/placeholder.svg"
              alt="Scooter rear view"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Center Image - 393x214 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[393px] h-[214px] bg-[#d9d9d9] mt-[10px]" style={{ left: 'calc(50% + 39.5px)' }}>
            <img
              src="/placeholder.svg"
              alt="Scooter detail view"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Top Center Image - 215x288 */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[215px] h-[288px] bg-[#d9d9d9] mr-[20px]" style={{ left: 'calc(50% - 49.5px)' }}>
            <img
              src="/placeholder.svg"
              alt="Scooter front view"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScooterPromo;
