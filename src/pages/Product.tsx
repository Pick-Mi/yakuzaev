import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full aspect-square object-cover rounded-2xl"
              />
              {product.recommended && (
                <Badge className="absolute top-4 left-4 bg-primary text-white">
                  AI Recommended
                </Badge>
              )}
            </div>
            
            {/* Additional Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setProduct({...product, image})}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">${getCurrentPrice()}</span>
                {selectedVariant && selectedVariant.price !== product.price && (
                  <span className="text-xl text-muted-foreground line-through">${product.price}</span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Available Variants</h3>
                <div className="space-y-3">
                  {product.variants.map((variant: any, index: number) => (
                    <Card 
                      key={variant.id || index} 
                      className={`cursor-pointer transition-all ${
                        selectedVariant?.id === variant.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground mb-1">{variant.name}</h4>
                            {variant.batteryDetails && (
                              <p className="text-sm text-muted-foreground mb-2">
                                Battery: {variant.batteryDetails}
                              </p>
                            )}
                            {variant.colors && variant.colors.length > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Colors:</span>
                                <div className="flex gap-1">
                                  {variant.colors.map((color: string, colorIndex: number) => (
                                    <span 
                                      key={colorIndex}
                                      className="px-2 py-1 text-xs bg-accent rounded-md text-accent-foreground"
                                    >
                                      {color}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-primary">${variant.price}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                variant="cta" 
                size="lg" 
                className="w-full"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-4 h-4" />
                  Add to Wishlist
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Secure Payment</p>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;