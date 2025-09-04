import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ProductShowcase = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Using any type to bypass the current type limitations
        const response = await (supabase as any)
          .from('products')
          .select('id, name, price, image_url, images, description, variants, is_active')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (response.error) throw response.error;

        const formattedProducts = response.data?.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: `$${product.price}`,
          image: product.images && product.images.length > 0 ? product.images[0] : product.image_url,
          rating: 5, // Default rating since not in database
          reviewCount: Math.floor(Math.random() * 200) + 10, // Random for demo
          recommended: true,
          description: product.description,
          variants: product.variants
        })) || [];

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

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = (product: any) => {
    addToCart(product);
    navigate('/cart');
  };
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-accent-foreground">AI Curated</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Recommended for You
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI has analyzed thousands of products to find these perfect matches for your preferences.
          </p>
        </div>
        
        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No products available</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
              />
            ))
          )}
        </div>
        
        {/* View all button */}
        <div className="text-center">
          <Button variant="cta" size="lg" className="group">
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

      </div>
    </section>
  );
};

export default ProductShowcase;