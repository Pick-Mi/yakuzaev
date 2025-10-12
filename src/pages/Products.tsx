import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, Grid, List } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await (supabase as any)
          .from('products')
          .select('id, name, price, image_url, images, description, variants, is_active')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (response.error) throw response.error;

        const formattedProducts = response.data?.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: `₹${product.price}`,
          image: product.images && product.images.length > 0 ? product.images[0] : product.image_url,
          rating: 5,
          reviewCount: Math.floor(Math.random() * 200) + 10,
          recommended: false,
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full h-[800px] bg-[#080f18]">
        {/* Main Content Section */}
        <div className="absolute flex flex-col gap-[35px] items-start left-[70px] top-[530px] w-[635px] max-lg:left-5 max-lg:right-5 max-lg:w-auto max-md:top-auto max-md:bottom-[200px]">
          {/* Main Title */}
          <h1 className="font-['Inter'] font-normal leading-[73px] text-white text-[48px] min-w-full w-min max-md:text-[32px] max-md:leading-tight">
            Explore Our Collection
          </h1>
          
          {/* Tagline */}
          <p className="font-['Inter'] font-normal text-white/80 text-lg max-md:text-base">
            Discover premium products designed for your lifestyle
          </p>
        </div>

        {/* CTA Buttons Section */}
        <div className="absolute flex flex-col gap-5 items-start left-[1081px] top-[610px] w-[289px] max-lg:left-auto max-lg:right-5 max-lg:top-auto max-lg:bottom-10">
          <div className="flex gap-[25px] items-center w-full max-md:flex-col max-md:gap-4">
            <button
              onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white flex gap-2.5 items-center justify-center overflow-hidden px-[23px] py-[13px] transition-all hover:bg-gray-100 active:scale-95 max-md:w-full"
            >
              <span className="font-['Poppins'] font-medium leading-normal text-black text-base whitespace-nowrap">
                View All
              </span>
            </button>
          </div>
        </div>
      </section>
      
      <main id="products-grid" className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Products</h1>
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${products.length} products available`}
            </p>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none border-r"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;