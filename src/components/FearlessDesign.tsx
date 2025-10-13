import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    thumbnail: string;
    feature1: string;
    feature2: string;
    price: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { name, thumbnail, feature1, feature2, price } = product;

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
            src={thumbnail}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-[25px] pb-[25px]">
          <div className="flex items-center justify-between mb-[15px]">
            <div>
              <h3 className="font-medium text-[24px] text-foreground mb-2">{name}</h3>
              <p className="text-[16px] text-muted-foreground">{feature1} {feature2}</p>
            </div>
            <div className="h-[36.5px] w-[1px] bg-border opacity-10 mx-4" />
            <div>
              <p className="text-[14px] text-muted-foreground opacity-80 mb-2">
                Starting Price
              </p>
              <p>
                <span className="font-medium text-[20.939px] text-foreground">
                  ₹{price.toFixed(2)}
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
            src={thumbnail}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-[25px] left-[25px] right-[25px]">
          <div className="flex items-center justify-between mb-[25px]">
            <div>
              <h3 className="font-medium text-[24px] text-foreground mb-2">{name}</h3>
              <p className="text-[16px] text-muted-foreground">{feature1} {feature2}</p>
            </div>
            <div className="h-[36.5px] w-[1px] bg-border opacity-10 mx-4" />
            <div>
              <p className="text-[14px] text-muted-foreground opacity-80 mb-2">
                Starting Price
              </p>
              <p>
                <span className="font-medium text-[20.939px] text-foreground">
                  ₹{price.toFixed(2)}
                </span>
                <span className="text-[15.705px] text-foreground/75 ml-1">
                  / showroom price
                </span>
              </p>
            </div>
          </div>
          <div className="w-full h-[1px] bg-border opacity-10 mb-[15px]" />
          <div className="flex flex-col gap-[15px]">
            <Link to={`/products/${product.id}`} className="w-full">
              <Button className="w-full h-[55px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-[16px] font-medium">
                Book Now
              </Button>
            </Link>
            <Link to={`/products/${product.id}`} className="w-full">
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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First get the sports category ID
        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", "sports")
          .single();

        if (category) {
          // Fetch products from sports category
          const { data } = await supabase
            .from("products")
            .select("id, name, thumbnail, feature1, feature2, price")
            .eq("category_id", category.id)
            .eq("is_active", true)
            .limit(4);

          setProducts(data || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="relative w-full min-h-[700px] bg-background py-[80px] px-[70px]">
      <div className="max-w-[1300px] mx-auto">
        <h2 className="font-medium text-[48px] text-foreground mb-[80px]">
          Fearless by Design
        </h2>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px]">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">No sports products available</div>
        )}
      </div>
    </section>
  );
};

export default FearlessDesign;
