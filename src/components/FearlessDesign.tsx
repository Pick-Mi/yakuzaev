import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
  slug: string;
}

const ProductCard = ({ name, description, price, image, slug }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative bg-white h-[629px] w-full max-w-[630px] overflow-hidden cursor-pointer transition-all duration-500 ease-in-out hover:shadow-xl hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Default State */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isHovered ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-[503px] bg-gray-200 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-[25px] pb-[25px]">
          <div className="flex items-center justify-between mb-[15px]">
            <div>
              <h3 className="font-medium text-[24px] text-foreground mb-2">{name}</h3>
              <p className="text-[16px] text-muted-foreground">{description}</p>
            </div>
            <div className="h-[36.5px] w-[1px] bg-border opacity-10 mx-4" />
            <div>
              <p className="text-[14px] text-muted-foreground opacity-80 mb-2">
                Starting Price
              </p>
              <p>
                <span className="font-medium text-[20.939px] text-foreground">
                  {price}
                </span>
                <span className="text-[15.705px] text-foreground/75 ml-1">
                  / showroom price
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hover State */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-[329px] overflow-hidden transition-all duration-500">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-[25px] left-[25px] right-[25px]">
          <div className="flex items-center justify-between mb-[25px]">
            <div>
              <h3 className="font-medium text-[24px] text-foreground mb-2">{name}</h3>
              <p className="text-[16px] text-muted-foreground">{description}</p>
            </div>
            <div className="h-[36.5px] w-[1px] bg-border opacity-10 mx-4" />
            <div>
              <p className="text-[14px] text-muted-foreground opacity-80 mb-2">
                Starting Price
              </p>
              <p>
                <span className="font-medium text-[20.939px] text-foreground">
                  {price}
                </span>
                <span className="text-[15.705px] text-foreground/75 ml-1">
                  / showroom price
                </span>
              </p>
            </div>
          </div>
          <div className="w-full h-[1px] bg-border opacity-10 mb-[15px]" />
          <div className="flex flex-col gap-[15px]">
            <Link to={`/products/${slug}`} className="w-full">
              <Button className="w-full h-[55px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-[16px] font-medium">
                Book Now
              </Button>
            </Link>
            <Link to={`/products/${slug}`} className="w-full">
              <Button variant="outline" className="w-full h-[55px] bg-background text-foreground border-none rounded-none text-[14px] font-medium">
                Explore {name}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FearlessDesign = () => {
  const products = [
    {
      name: "Nebula",
      description: "Pure Power. Peak Performance",
      price: "₹39,616.00",
      image: "/placeholder.svg",
      slug: "nebula",
    },
    {
      name: "Cyclone Sway",
      description: "Pure Power. Peak Performance",
      price: "₹39,616.00",
      image: "/placeholder.svg",
      slug: "cyclone-sway",
    },
  ];

  return (
    <section className="relative w-full min-h-[700px] bg-background py-[80px] ml-[70px]">
      <div className="max-w-[1300px] mx-auto px-4">
        <h2 className="font-medium text-[48px] text-foreground mb-[80px]">
          Fearless by Design
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px]">
          {products.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FearlessDesign;
