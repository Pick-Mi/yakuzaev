import { Link } from "react-router-dom";

const ScooterPromo = () => {
  return (
    <section className="w-full py-9 bg-background">
      <div className="container mx-auto max-w-[1300px] px-4">
        <div className="relative bg-card h-[522px] rounded-lg overflow-hidden shadow-lg">
          {/* Main Content */}
          <div className="absolute left-10 top-[51px] w-[267px]">
            <h2 className="font-['Inter',sans-serif] font-medium text-[28px] leading-[54px] text-foreground">
              Now Get 3 Scooters at only
            </h2>
          </div>

          {/* Price */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[217px]">
            <p className="font-['Inter',sans-serif] font-extrabold text-[48px] leading-[54px] text-center text-foreground whitespace-nowrap">
              ₹ 99,999/-
            </p>
          </div>

          {/* Features */}
          <div className="absolute left-10 top-[337px] flex items-center gap-5">
            <span className="font-['Poppins',sans-serif] text-[15.932px] text-muted-foreground opacity-50">
              Zero Emissions
            </span>
            <div className="h-[14.936px] w-0 border-l border-border"></div>
            <span className="font-['Poppins',sans-serif] text-[15.932px] text-muted-foreground opacity-50">
              Stylish Design
            </span>
          </div>

          {/* Buttons */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[415px] flex items-center gap-[15px] w-[351px]">
            <Link
              to="/products"
              className="flex-1 bg-primary text-primary-foreground h-[55px] flex items-center justify-center rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="font-['Poppins',sans-serif] font-medium text-[16px]">
                Book Now
              </span>
            </Link>
            <Link
              to="/products"
              className="flex-1 bg-secondary text-secondary-foreground h-[55px] flex items-center justify-center rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <span className="font-['Inter',sans-serif] font-medium text-[14px]">
                Explore
              </span>
            </Link>
          </div>

          {/* Scooter Images */}
          <div className="absolute right-0 top-0 w-[572px] h-[288px] overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="Scooter model 1"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-0 right-0 w-[394px] h-[214px] overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="Scooter model 2"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-x-[39.5px] w-[393px] h-[214px] overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="Scooter model 3"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 translate-x-[-49.5px] w-[215px] h-[288px] overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="Scooter detail"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScooterPromo;
