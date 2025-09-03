import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  recommended?: boolean;
}

interface ProductWithQuantity extends Product {
  quantity: number;
}

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductWithQuantity) => void;
  onBuyNow: (product: ProductWithQuantity) => void;
}

const ProductDetail = ({ product, isOpen, onClose, onAddToCart, onBuyNow }: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
  };

  const handleBuyNow = () => {
    onBuyNow({ ...product, quantity });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Product Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.recommended && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-white border-0">
                  AI Recommended
                </Badge>
              </div>
            )}
            {product.badge && (
              <div className="absolute top-4 right-4">
                <Badge variant="destructive">
                  {product.badge}
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              
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

              {/* Pricing */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Product Features</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• Premium quality materials and construction</li>
                <li>• Advanced technology and performance</li>
                <li>• 2-year manufacturer warranty included</li>
                <li>• Free shipping and easy returns</li>
              </ul>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleBuyNow}
                size="lg" 
                className="w-full group"
                variant="hero"
              >
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Buy Now
              </Button>
              
              <Button 
                onClick={handleAddToCart}
                variant="ai" 
                size="lg" 
                className="w-full group"
              >
                <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Add to Cart
              </Button>

              <Button variant="ghost" size="lg" className="w-full group">
                <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail;