import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  thumbnail: string | null;
  feature1: string | null;
  feature2: string | null;
  price: number;
}

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative h-[400px] overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Product Image */}
      <div className="absolute inset-0 bg-[#b7b8b8]">
        {product.thumbnail && (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Default Content (visible when not hovered) */}
      <div
        className={`absolute inset-0 bg-black/40 flex flex-col justify-end p-6 transition-opacity duration-300 ${
          isHovered ? "opacity-0" : "opacity-100"
        }`}
      >
        <h3 className="text-white font-['Poppins'] font-semibold text-2xl mb-2">
          {product.name}
        </h3>
        <div className="flex gap-3 items-center text-white/80 text-sm">
          {product.feature1 && <span>{product.feature1}</span>}
          {product.feature1 && product.feature2 && (
            <span className="text-white/60">|</span>
          )}
          {product.feature2 && <span>{product.feature2}</span>}
        </div>
        <p className="text-white font-semibold text-xl mt-2">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Hover Content */}
      <div
        className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/product-config', {
              state: {
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.thumbnail
                },
                selectedVariant: null,
                quantity: 1,
                from: 'FearlessDesign'
              }
            });
          }}
          className="bg-black text-white px-8 py-3 font-['Poppins'] font-medium hover:bg-black/90 transition-colors"
        >
          Book Now
        </button>
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="bg-white/10 text-white px-8 py-3 font-['Poppins'] font-medium hover:bg-white/20 transition-colors border border-white/30"
        >
          Explore {product.name}
        </button>
      </div>
    </div>
  );
};


const FearlessDesign = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSportsProducts = async () => {
      try {
        // First, get the Sports category ID
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'sports')
          .single();

        if (categoryError) throw categoryError;

        if (categoryData) {
          // Fetch products from Sports category
          const { data: productsData, error: productsError } = await (supabase as any)
            .from('products')
            .select('id, name, thumbnail, feature1, feature2, price')
            .eq('category_id', categoryData.id)
            .eq('is_active', true)
            .limit(4);

          if (productsError) throw productsError;

          setProducts(productsData || []);
        }
      } catch (error) {
        console.error('Error fetching sports products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSportsProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <p className="text-center text-gray-600">Loading products...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <h2 className="font-['Inter'] font-medium text-5xl text-center mb-12">
          Fearless by Design
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FearlessDesign;
