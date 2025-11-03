import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    feature1: string;
    feature2: string;
    price: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, thumbnail, feature1, feature2, price } = product;

  return (
    <div className="bg-white w-full overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group h-[600px] flex flex-col">
      {/* Product Image - shrinks on hover */}
      <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden transition-all duration-300 group-hover:h-[280px] h-[380px]">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product Info - fixed height */}
      <div className="px-6 py-6 bg-white flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-6">
          {/* Left: Product Name & Tagline */}
          <div className="flex-1">
            <h3 className="text-2xl font-normal text-gray-900 mb-2">{name}</h3>
            <p className="text-base text-gray-600">{feature1}. {feature2}</p>
          </div>
          
          {/* Vertical Divider */}
          <div className="w-px h-16 bg-gray-300 mx-4" />
          
          {/* Right: Pricing */}
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-2">Starting Price</p>
            <p className="text-xl font-medium text-gray-900">
              ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-sm font-normal text-gray-600 ml-1">/ showroom price</span>
            </p>
          </div>
        </div>

        {/* Hover Action Buttons */}
        <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-4">
          <div className="w-full h-px bg-gray-300 mb-4" />
          <div className="flex flex-col gap-3">
            <Link to={`/products/${product.slug}`} className="w-full">
              <Button className="w-full h-[55px] bg-black text-white hover:bg-black/90 rounded-none text-base font-medium">
                Book Now
              </Button>
            </Link>
            <Link to={`/products/${product.slug}`} className="w-full">
              <Button variant="outline" className="w-full h-[55px] bg-gray-100 text-gray-900 border-none hover:bg-gray-200 rounded-none text-base font-medium">
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
            .select("id, name, slug, thumbnail, feature1, feature2, price")
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
