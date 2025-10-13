import { useState, useEffect, useRef } from "react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await (supabase as any)
          .from('categories')
          .select('id, name, slug')
          .order('created_at', { ascending: false });

        if (categoriesResponse.error) throw categoriesResponse.error;

        const fetchedCategories = categoriesResponse.data || [];
        setCategories(fetchedCategories);

        // Fetch products
        let productsQuery = (supabase as any)
          .from('products')
          .select('id, name, price, image_url, images, description, is_active, thumbnail, features, feature1, feature2, category_id')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // Filter by category if one is selected
        if (activeCategory) {
          productsQuery = productsQuery.eq('category_id', activeCategory);
        }

        const response = await productsQuery.limit(10);

        if (response.error) throw response.error;

        const formattedProducts = response.data?.map((product: any) => {
          let imageUrl = product.thumbnail || product.image_url;
          
          // Parse images JSON string and get first image if no thumbnail
          if (!imageUrl && product.images) {
            try {
              const parsedImages = typeof product.images === 'string' 
                ? JSON.parse(product.images) 
                : product.images;
              if (parsedImages && parsedImages.length > 0) {
                imageUrl = parsedImages[0];
              }
            } catch (e) {
              console.error('Error parsing images:', e);
            }
          }

          return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: imageUrl,
            description: product.description,
            features: product.features || [],
            feature1: product.feature1,
            feature2: product.feature2
          };
        }) || [];

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, [toast, activeCategory]);

  const handleBookNow = (product: any) => {
    navigate('/product-config', {
      state: {
        product,
        selectedVariant: null,
        quantity: 1,
        from: 'Home'
      }
    });
  };

  const handleExplore = (product: any) => {
    navigate(`/product/${product.id}`);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -440, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 440, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-[#F8F9F9] py-20">
      <div className="mx-auto px-[70px]">
        {/* Header */}
        <h2 className="font-['Inter'] font-medium text-[48px] text-[#12141d] mb-20">
          Experience the Next Generation of Riding
        </h2>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-20">
          <div className="flex gap-5">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-[13px] font-['Poppins'] text-[16px] transition-colors ${
                activeCategory === null
                  ? "bg-[#12141d] text-white opacity-90 shadow-[3px_4px_16px_0px_rgba(0,0,0,0.1)]"
                  : "bg-white text-[#12141d] opacity-90"
              }`}
            >
              All Models
            </button>
            {categories.map((category: any) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-[13px] font-['Poppins'] text-[16px] transition-colors ${
                  activeCategory === category.id
                    ? "bg-[#12141d] text-white opacity-90 shadow-[3px_4px_16px_0px_rgba(0,0,0,0.1)]"
                    : "bg-white text-[#12141d] opacity-90"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={scrollLeft}
              className="w-12 h-12 bg-white flex items-center justify-center hover:bg-[#e8e9e9] transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-[#12141d]" />
            </button>
            <button
              onClick={scrollRight}
              className="w-12 h-12 bg-white flex items-center justify-center hover:bg-[#e8e9e9] transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-[#12141d]" />
            </button>
          </div>
        </div>

        {/* Product Cards Horizontal Scroll */}
        <div ref={scrollContainerRef} className="overflow-x-auto pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-[35px] pb-4 min-w-max">
            {loading ? (
              <div className="w-full text-center py-8">
                <p className="text-[#212121] opacity-80">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="w-full text-center py-8">
                <p className="text-[#212121] opacity-80">No products available</p>
              </div>
            ) : (
              products.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white flex flex-col gap-[25px] pb-5 w-[420px] flex-shrink-0"
                >
                  {/* Product Image */}
                  <div className="w-full h-[270px] bg-[#b7b8b8] flex items-center justify-center overflow-hidden">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="px-[26px] flex flex-col gap-[24.621px]">
                    <div className="flex flex-col gap-[25px]">
                      {/* Title & Specs */}
                      <div className="flex flex-col gap-[13.688px]">
                        <h3 className="font-['Poppins'] font-semibold text-[24px] text-[#212121]">
                          {product.name}
                        </h3>
                        <div className="flex gap-[13.688px] items-center">
                          {product.feature1 && (
                            <p className="font-['Poppins'] text-[15.758px] text-[#212121] opacity-80">
                              {product.feature1}
                            </p>
                          )}
                          {product.feature1 && product.feature2 && (
                            <div className="w-[1.24px] h-[19.288px] bg-[#212121] opacity-80" />
                          )}
                          {product.feature2 && (
                            <p className="font-['Poppins'] text-[15.758px] text-[#212121] opacity-80">
                              {product.feature2}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="w-full h-[1.24px] bg-black opacity-10" />

                      {/* Price */}
                      <div className="flex flex-col gap-[8.891px]">
                        <p className="font-['Poppins'] text-[15.758px] text-[#212121] opacity-80">
                          Starting Price
                        </p>
                        <p className="font-['Poppins']">
                          <span className="text-[23.636px] font-semibold text-[#212121]">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[17.727px] text-[rgba(33,33,33,0.75)]">
                            {" "}/ showroom price
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-[15px] w-full">
                      <button
                        onClick={() => handleBookNow(product)}
                        className="bg-black text-white h-[55px] px-[23px] py-[13px] font-['Poppins'] font-medium text-[16px] w-full hover:bg-black/90 transition-colors"
                      >
                        Book Now
                      </button>
                      <button
                        onClick={() => handleExplore(product)}
                        className="bg-[#f8f9f9] text-black h-[55px] px-[50px] py-[13px] font-['Inter'] font-medium text-[14px] w-full hover:bg-[#e8e9e9] transition-colors"
                      >
                        Explore {product.name}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductShowcase;