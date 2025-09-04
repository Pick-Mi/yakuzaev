import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Import EV bike images
import evBike1 from "@/assets/ev-bike-1.jpg";
import evBike2 from "@/assets/ev-bike-2.jpg";
import evBike3 from "@/assets/ev-bike-3.jpg";
import evBike4 from "@/assets/ev-bike-4.jpg";

const products = [
  {
    id: 1,
    name: "Premium Electric Bike",
    price: "$2,199",
    originalPrice: "$2,549",
    image: evBike1,
    rating: 5,
    reviewCount: 128,
    badge: "20% OFF",
    recommended: true
  },
  {
    id: 2,
    name: "Electric Mountain Bike Pro",
    price: "$3,299",
    originalPrice: "$3,699",
    image: evBike2,
    rating: 4,
    reviewCount: 89,
    badge: "15% OFF",
    recommended: true
  },
  {
    id: 3,
    name: "Urban Commuter E-Bike",
    price: "$1,899",
    image: evBike3,
    rating: 5,
    reviewCount: 45,
    recommended: false
  },
  {
    id: 4,
    name: "Foldable Electric Bike",
    price: "$1,599",
    originalPrice: "$1,799",
    image: evBike4,
    rating: 4,
    reviewCount: 167,
    badge: "12% OFF",
    recommended: true
  }
];

const ProductShowcase = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

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
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
            />
          ))}
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