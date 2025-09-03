import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { ArrowLeft, Star, Heart, Shield, Truck, RotateCcw, Minus, Plus } from "lucide-react";
import { useState } from "react";

// Import product images
import headphones from "@/assets/headphones.jpg";
import smartphone from "@/assets/smartphone.jpg";
import laptop from "@/assets/laptop.jpg";
import smartwatch from "@/assets/smartwatch.jpg";

const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: "$199",
    originalPrice: "$249",
    image: headphones,
    rating: 5,
    reviewCount: 128,
    badge: "20% OFF",
    recommended: true,
    description: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort padding.",
    features: ["Active Noise Cancellation", "30-hour Battery Life", "Premium Comfort", "Crystal Clear Audio", "Wireless Freedom"]
  },
  {
    id: 2,
    name: "Latest Smartphone Pro",
    price: "$899",
    originalPrice: "$999",
    image: smartphone,
    rating: 4,
    reviewCount: 89,
    badge: "10% OFF",
    recommended: true,
    description: "The latest smartphone with cutting-edge technology, professional camera system, and lightning-fast performance for all your needs.",
    features: ["Pro Camera System", "Lightning Fast Performance", "All-Day Battery", "Premium Design", "5G Ready"]
  },
  {
    id: 3,
    name: "Ultra-Thin Laptop",
    price: "$1,299",
    image: laptop,
    rating: 5,
    reviewCount: 45,
    recommended: false,
    description: "Ultra-portable laptop with powerful performance, stunning display, and all-day battery life for professionals on the go.",
    features: ["Ultra-Portable Design", "Powerful Performance", "Stunning Display", "All-Day Battery", "Professional Ready"]
  },
  {
    id: 4,
    name: "Smart Fitness Watch",
    price: "$299",
    originalPrice: "$349",
    image: smartwatch,
    rating: 4,
    reviewCount: 167,
    badge: "15% OFF",
    recommended: true,
    description: "Track your fitness goals with our smart watch featuring advanced health monitoring, GPS tracking, and smart notifications.",
    features: ["Advanced Health Monitoring", "GPS Tracking", "Smart Notifications", "Water Resistant", "Long Battery Life"]
  }
];

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === parseInt(id || "0"));

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Button onClick={() => navigate("/")} variant="ai">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

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
          {/* Product Image */}
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
            {product.badge && (
              <Badge variant="destructive" className="absolute top-4 right-4">
                {product.badge}
              </Badge>
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
                <span className="text-3xl font-bold text-primary">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">{product.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

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
                variant="hero" 
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