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
  const { name, thumbnail, feature1, feature2, price } = product;

  return (
    <div className="group bg-white min-h-[450px] sm:h-[500px] md:h-[629px] w-full max-w-[630px] overflow-hidden transition-shadow duration-300 hover:shadow-xl cursor-pointer">
      <div className="w-full h-[200px] sm:h-[250px] md:h-[329px] bg-gray-200 overflow-hidden">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="px-4 sm:px-[25px] pb-4 sm:pb-[25px] pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h3 className="font-medium text-[18px] sm:text-[20px] md:text-[24px] text-[#212121] mb-1 sm:mb-2">{name}</h3>
            <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#4b4f54]">{feature1} {feature2}</p>
          </div>
          <div className="h-[36.5px] w-[1px] bg-gray-300 mx-4 hidden sm:block" />
          <div>
            <p className="text-[12px] sm:text-[13px] md:text-[14px] text-[#4b4f54] opacity-80 mb-1 sm:mb-2">
              Starting Price
            </p>
            <p>
              <span className="font-medium text-[16px] sm:text-[18px] md:text-[20.939px] text-[#212121]">
                ₹{price.toFixed(2)}
              </span>
              <span className="text-[13px] sm:text-[14px] md:text-[15.705px] text-[#212121] opacity-75 ml-1">
                / showroom price
              </span>
            </p>
          </div>
        </div>
        <div className="w-full h-[1px] bg-gray-300 mt-4 sm:mt-[25px] mb-3 sm:mb-[15px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="flex flex-col gap-3 sm:gap-[15px] max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-[200px] group-hover:opacity-100">
          <Link to={`/products/${product.id}`} className="w-full">
            <Button className="w-full h-[45px] sm:h-[50px] md:h-[55px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-[14px] sm:text-[15px] md:text-[16px] font-medium">
              Book Now
            </Button>
          </Link>
          <Link to={`/products/${product.id}`} className="w-full">
            <Button variant="outline" className="w-full h-[45px] sm:h-[50px] md:h-[55px] bg-background text-foreground border-none rounded-none text-[12px] sm:text-[13px] md:text-[14px] font-medium">
              Explore {name}
            </Button>
          </Link>
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
        console.log("Fetching sports category...");
        // First get the sports category ID
        const { data: category, error: categoryError } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", "sports")
          .single();

        console.log("Category data:", category, "Error:", categoryError);

        if (category) {
          // Fetch products from sports category
          const { data, error: productsError } = await supabase
            .from("products")
            .select("id, name, thumbnail, feature1, feature2, price")
            .eq("category_id", category.id)
            .eq("is_active", true)
            .limit(4);

          console.log("Products data:", data, "Error:", productsError);
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
    <section className="w-full py-10 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12 lg:px-[70px]">
      <div className="max-w-[1300px] mx-auto">
        <h2 className="font-medium text-[28px] sm:text-[36px] md:text-[48px] text-[#212121] mb-10 sm:mb-16 md:mb-20">
          Fearless by Design
        </h2>
        {loading ? (
          <div className="text-center text-[#4b4f54] py-20">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-[#4b4f54] py-20">No sports products available</div>
        )}
      </div>
    </section>
  );
};

export default FearlessDesign;
