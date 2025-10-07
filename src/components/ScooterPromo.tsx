import { Link } from "react-router-dom";

const ScooterPromo = () => {
  return (
    <section className="w-full py-16 bg-background">
      <div className="container mx-auto max-w-[1300px] px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-popover p-[15px] rounded-lg">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="font-['Inter',sans-serif] font-medium text-[28px] leading-[1.2] text-foreground mb-6">
                Now Get 3<br />
                Scooters at only
              </h2>
              <p className="font-['Inter',sans-serif] font-extrabold text-[48px] leading-[1.2] text-foreground">
                ₹ 99,999/-
              </p>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="font-['Poppins',sans-serif] text-base">Zero Emissions</span>
              <div className="h-4 w-px bg-border"></div>
              <span className="font-['Poppins',sans-serif] text-base">Stylish Design</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/products"
                className="bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-['Poppins',sans-serif] font-medium text-base hover:bg-primary/90 transition-colors"
              >
                Book Now
              </Link>
              <Link
                to="/products"
                className="bg-secondary text-secondary-foreground px-6 py-3.5 rounded-lg font-['Inter',sans-serif] font-medium text-sm hover:bg-secondary/80 transition-colors"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Right - Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="Scooter front view"
                className="w-[215px] h-full object-cover"
              />
            </div>
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="Scooter side view"
                className="w-[572px] h-full object-cover"
              />
            </div>
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="Scooter rear view"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="Scooter detail view"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScooterPromo;
