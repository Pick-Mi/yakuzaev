import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ProductHero from "@/components/ProductHero";
import ProductFeatures from "@/components/ProductFeatures";
import ComponentCards from "@/components/ComponentCards";
import DesignSection from "@/components/DesignSection";




import { ArrowLeft, Star, Heart, Shield, Truck, RotateCcw, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Using any type to bypass the current type limitations
        const response = await (supabase as any)
          .from('products')
          .select('id, name, price, image_url, images, description, variants, is_active')
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (response.error) throw response.error;

        if (response.data) {
          // Parse images if it's a JSON string
          let parsedImages = [];
          try {
            parsedImages = typeof response.data.images === 'string' 
              ? JSON.parse(response.data.images) 
              : response.data.images || [];
          } catch (e) {
            parsedImages = [];
          }

          // Parse variants if it's a JSON string
          let parsedVariants = [];
          try {
            parsedVariants = typeof response.data.variants === 'string' 
              ? JSON.parse(response.data.variants) 
              : response.data.variants || [];
          } catch (e) {
            parsedVariants = [];
          }

          const fetchedProduct = {
            id: response.data.id,
            name: response.data.name,
            price: response.data.price,
            images: parsedImages,
            image: parsedImages.length > 0 ? parsedImages[0] : response.data.image_url,
            rating: 5, // Default rating
            reviewCount: Math.floor(Math.random() * 200) + 10,
            recommended: true,
            description: response.data.description || "High-quality product for your needs.",
            variants: parsedVariants
          };
          setProduct(fetchedProduct);
          
          // Set first variant as default selected
          if (parsedVariants.length > 0) {
            setSelectedVariant(parsedVariants[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  const handleAddToCart = () => {
    if (product) {
      const productToAdd = {
        ...product,
        quantity,
        selectedVariant: selectedVariant,
        price: selectedVariant ? selectedVariant.price : product.price
      };
      addToCart(productToAdd);
      toast({
        title: "Added to cart",
        description: `${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''} has been added to your cart.`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      const productToAdd = {
        ...product,
        quantity,
        selectedVariant: selectedVariant,
        price: selectedVariant ? selectedVariant.price : product.price
      };
      addToCart(productToAdd);
      navigate('/checkout');
    }
  };

  const getCurrentPrice = () => {
    return selectedVariant ? selectedVariant.price : product?.price || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080f18]">
      <Header />
      
      {/* Hero Section */}
      <ProductHero
        productName={product.name}
        price={getCurrentPrice()}
        topSpeed="90 km/h"
        range="161 km"
        chargeTime="30 km"
        onBookNow={handleBuyNow}
        onAddToCart={handleAddToCart}
      />
      
      {/* Features Section */}
      <div className="bg-[#f5f5f5]">
        <ProductFeatures />
      </div>
      
      {/* Component Cards Section */}
      <ComponentCards />
      
      {/* Design Section */}
      <DesignSection />
      
    </div>
  );
};

export default Product;