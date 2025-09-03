import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Heart } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  recommended?: boolean;
  onProductClick?: (product: any) => void;
  onAddToCart?: (product: any) => void;
}

const ProductCard = ({ 
  id,
  name, 
  price, 
  originalPrice, 
  image, 
  rating, 
  reviewCount, 
  badge,
  recommended = false,
  onProductClick,
  onAddToCart
}: ProductCardProps) => {
  
  const product = { id, name, price, originalPrice, image, rating, reviewCount, badge, recommended };
  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-card border-0 shadow-product hover:shadow-hover transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      onClick={() => onProductClick?.(product)}
    >
      {/* AI Recommended badge */}
      {recommended && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-primary text-white border-0 shadow-lg">
            AI Recommended
          </Badge>
        </div>
      )}
      
      {/* Discount badge */}
      {badge && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="destructive" className="shadow-lg">
            {badge}
          </Badge>
        </div>
      )}
      
      {/* Heart icon */}
      <button className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-primary transform hover:scale-110">
        <Heart className="w-4 h-4" />
      </button>
      
      {/* Product image */}
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        />
        
        {/* View Product overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <Button 
            variant="product" 
            size="sm" 
            className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            View Product
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>
        </div>
        
        {/* Product name */}
        <h3 className="font-semibold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        {/* Pricing */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-primary">{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
          )}
        </div>
        
        {/* Add to cart button */}
        <Button 
          variant="default" 
          size="sm" 
          className="w-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;