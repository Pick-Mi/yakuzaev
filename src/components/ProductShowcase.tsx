import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
    recommended: true
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
    recommended: true
  },
  {
    id: 3,
    name: "Ultra-Thin Laptop",
    price: "$1,299",
    image: laptop,
    rating: 5,
    reviewCount: 45,
    recommended: false
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
    recommended: true
  }
];

const ProductShowcase = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
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
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              onQuickView={handleQuickView}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        
        {/* View all button */}
        <div className="text-center">
          <Button variant="ai" size="lg" className="group">
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Product Detail Modal */}
        <ProductDetail
          product={selectedProduct}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </div>
    </section>
  );
};

export default ProductShowcase;