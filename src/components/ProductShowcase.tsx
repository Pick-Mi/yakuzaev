import { useState, useEffect, useRef } from "react";
import { useCart } from "@/hooks/useCart";
import { useNavigate, Link } from "react-router-dom";
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
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // Filter by category if one is selected
        if (activeCategory) {
          productsQuery = productsQuery.eq('category_id', activeCategory);
        }

        const response = await productsQuery.limit(10);

        if (response.error) throw response.error;

        const formattedProducts = response.data?.map((product: any) => {
          console.log('📦 Raw product from database:', {
            name: product.name,
            thumbnail: product.thumbnail,
            image_url: product.image_url,
            images: product.images
          });
          
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

          // Return ALL product fields including thumbnail
          return {
            ...product, // This includes thumbnail, image_url, images, etc.
            image: imageUrl // Used for display in ProductShowcase
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
    navigate(`/products/${product.id}`);
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
    <section className="relative bg-[#F8F9F9] py-10 sm:py-16 md:py-20 overflow-hidden">
      <div className="mx-auto px-0 sm:px-8 md:px-12 lg:px-[70px]">
        {/* Header */}
        <h2 className="font-['Inter'] font-medium text-[28px] sm:text-[36px] md:text-[48px] text-[#12141d] mb-10 sm:mb-16 md:mb-20 px-4 sm:px-0">
          Experience the Next Generation of Riding
        </h2>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 sm:mb-16 md:mb-20 gap-4 px-4 sm:px-0">
          <div className="flex gap-2 sm:gap-4 md:gap-5 overflow-x-auto pb-2 w-full sm:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-6 sm:px-4 md:px-5 py-[13px] font-['Poppins'] text-[14px] sm:text-[14px] md:text-[16px] transition-colors whitespace-nowrap ${
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
                className={`px-6 sm:px-4 md:px-5 py-[13px] font-['Poppins'] text-[14px] sm:text-[14px] md:text-[16px] transition-colors whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-[#12141d] text-white opacity-90 shadow-[3px_4px_16px_0px_rgba(0,0,0,0.1)]"
                    : "bg-white text-[#12141d] opacity-90"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex gap-3">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white flex items-center justify-center hover:bg-[#e8e9e9] transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#12141d]" />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white flex items-center justify-center hover:bg-[#e8e9e9] transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#12141d]" />
            </button>
          </div>
        </div>

        {/* Product Cards - Horizontal scroll */}
        <div ref={scrollContainerRef} className="overflow-x-auto pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-4 sm:gap-6 md:gap-[35px] pb-4 pl-4 sm:pl-0">
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
                  className="bg-white flex flex-col gap-4 sm:gap-[25px] pb-4 sm:pb-5 w-[calc(100vw-2rem)] sm:w-[350px] md:w-[420px] flex-shrink-0 last:pr-4"
                >
                  {/* Product Image */}
                  <div className="w-full h-[200px] sm:h-[220px] md:h-[270px] bg-[#b7b8b8] flex items-center justify-center overflow-hidden">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-fill"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="px-4 sm:px-[26px] flex flex-col gap-4 sm:gap-[24.621px]">
                    <div className="flex flex-col gap-4 sm:gap-[25px]">
                      {/* Title & Specs */}
                      <div className="flex flex-col gap-2 sm:gap-[13.688px]">
                        <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] md:text-[24px] text-[#212121]">
                          {product.name}
                        </h3>
                        <div className="flex gap-2 sm:gap-[13.688px] items-center flex-wrap">
                          {product.feature1 && (
                            <p className="font-['Poppins'] text-[12px] sm:text-[14px] md:text-[15.758px] text-[#212121] opacity-80">
                              {product.feature1}
                            </p>
                          )}
                          {product.feature1 && product.feature2 && (
                            <div className="w-[1.24px] h-[15px] sm:h-[19.288px] bg-[#212121] opacity-80" />
                          )}
                          {product.feature2 && (
                            <p className="font-['Poppins'] text-[12px] sm:text-[14px] md:text-[15.758px] text-[#212121] opacity-80">
                              {product.feature2}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="w-full h-[1.24px] bg-black opacity-10" />

                      {/* Price */}
                      <div className="flex flex-col gap-1 sm:gap-[8.891px]">
                        <p className="font-['Poppins'] text-[12px] sm:text-[14px] md:text-[15.758px] text-[#212121] opacity-80">
                          Starting Price
                        </p>
                        <p className="font-['Poppins']">
                          <span className="text-[18px] sm:text-[20px] md:text-[23.636px] font-semibold text-[#212121]">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[14px] sm:text-[16px] md:text-[17.727px] text-[rgba(33,33,33,0.75)]">
                            {" "}/ showroom price
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:gap-[15px] w-full">
                      <button
                        onClick={() => handleBookNow(product)}
                        className="bg-black text-white h-[45px] sm:h-[50px] md:h-[55px] px-4 sm:px-[23px] py-[13px] font-['Poppins'] font-medium text-[14px] sm:text-[15px] md:text-[16px] w-full hover:bg-black/90 transition-colors"
                      >
                        Book Now
                      </button>
                      <button
                        onClick={() => handleExplore(product)}
                        className="bg-[#f8f9f9] text-black h-[45px] sm:h-[50px] md:h-[55px] px-4 sm:px-[50px] py-[13px] font-['Inter'] font-medium text-[12px] sm:text-[13px] md:text-[14px] w-full hover:bg-[#e8e9e9] transition-colors"
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
        
        {/* Explore All Bikes CTA - Outside scroll container */}
        <div className="flex justify-center mt-8 sm:mt-10 md:mt-12 px-4 sm:px-0">
          <Link
            to="/products"
            className="bg-black text-white h-[45px] sm:h-[50px] md:h-[55px] px-6 sm:px-8 md:px-10 py-[13px] font-['Poppins'] font-medium text-[14px] sm:text-[15px] md:text-[16px] hover:bg-black/90 transition-colors flex items-center justify-center"
          >
            Explore All Bike
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ProductShowcase;