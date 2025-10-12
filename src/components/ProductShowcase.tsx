import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Registration Model");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await (supabase as any)
          .from('products')
          .select('id, name, price, image_url, images, description, variants, is_active, thumbnail, features, feature1, feature2')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(4);

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
            variants: product.variants,
            features: product.features || [],
            feature1: product.feature1,
            feature2: product.feature2
          };
        }) || [];

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleBookNow = (product: any) => {
    navigate('/product-config', {
      state: {
        product,
        selectedVariant: product.variants?.[0] || null,
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
    <section className="bg-[#F8F9F9] w-full py-16 px-4 md:px-[70px]">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="font-inter font-medium text-[48px] text-[#000000] mb-12">
          Experience the Next Generation of Riding
        </h2>

        {/* Category Tabs */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex gap-2">
            {["Registration Model", "Family", "Business"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-inter font-medium text-[16px] transition-colors ${
                  activeTab === tab
                    ? 'bg-[#000000] text-white'
                    : 'bg-white text-[#000000] hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2 ml-auto">
            <button 
              onClick={scrollLeft}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Grid - Horizontal Scroll */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex gap-6 pb-4">
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
                <div key={product.id} className="bg-white rounded-lg overflow-hidden flex flex-col flex-shrink-0 w-[380px]">
                  {/* Product Image */}
                  <div className="w-full h-[300px] bg-gradient-to-b from-[#E8E8E8] to-[#F5F5F5] flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">{product.name}</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <div>
                      <h3 className="font-inter font-semibold text-[28px] text-[#000000] mb-3">
                        {product.name}
                      </h3>
                      <p className="font-inter font-normal text-[14px] text-[#666666]">
                        {product.feature1 && product.feature2 
                          ? `${product.feature1} | ${product.feature2}`
                          : product.feature1 || product.feature2 || '65 km Range | 40 Km/h Speed'}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <p className="font-inter font-normal text-[14px] text-[#666666] mb-2">
                        Starting Price
                      </p>
                      <p className="font-inter font-bold text-[24px] text-[#000000] mb-4">
                        ₹{product.price.toLocaleString('en-IN')}{' '}
                        <span className="font-normal text-[14px] text-[#666666]">/ showroom price</span>
                      </p>

                      <div className="flex flex-col gap-[15px]">
                        <button
                          onClick={() => handleBookNow(product)}
                          className="bg-black text-white h-[55px] px-[23px] py-[13px] font-['Poppins'] font-medium text-[16px] w-full hover:bg-black/90 transition-colors"
                        >
                          Book Now
                        </button>
                        <Link to={`/product/${product.id}`} className="w-full">
                          <button
                            className="bg-[#f8f9f9] text-black h-[55px] px-[50px] py-[13px] font-['Inter'] font-medium text-[14px] w-full hover:bg-[#e8e9e9] transition-colors"
                          >
                            Explore {product.name}
                          </button>
                        </Link>
                      </div>
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