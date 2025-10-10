import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";

const ProductConfig = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, selectedVariant, quantity = 1 } = location.state || {};
  const [selectedColor, setSelectedColor] = useState<string>("");

  // Sample colors - you can customize these
  const colors = [
    { name: "White", value: "#FFFFFF" },
    { name: "Beige", value: "#F5DEB3" },
    { name: "Blue", value: "#A7C7E7" },
    { name: "Red", value: "#FF6B6B" },
    { name: "Black", value: "#000000" },
  ];

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const productImage = product.images?.[0] || product.image;

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#F8F9F9]">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-6xl mx-auto">
          <h1 className="font-['Poppins'] font-bold text-[32px] mb-8">
            Configure Your Product
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-white rounded-lg p-8">
              <img 
                src={productImage} 
                alt={product.name}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            {/* Configuration Panel */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Product Name */}
                  <div>
                    <h2 className="font-['Poppins'] font-semibold text-[28px]">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 mt-2">{product.description}</p>
                  </div>

                  {/* Variant Selection */}
                  {product.variants && product.variants.length > 0 && (
                    <div>
                      <h3 className="font-['Inter'] font-medium text-[18px] mb-3">
                        Select Variant
                      </h3>
                      <div className="flex gap-3 flex-wrap">
                        {product.variants.map((variant: any, index: number) => (
                          <div
                            key={index}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              selectedVariant?.name === variant.name
                                ? "border-black bg-black/5"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <p className="font-medium">{variant.name}</p>
                            <p className="text-sm text-gray-600">
                              ₹{variant.price?.toLocaleString('en-IN')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  <div>
                    <h3 className="font-['Inter'] font-medium text-[18px] mb-3">
                      Choose Color
                    </h3>
                    <div className="flex gap-3 flex-wrap">
                      {colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`relative w-14 h-14 rounded-lg border-2 transition-all ${
                            selectedColor === color.name
                              ? "border-black scale-110"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {selectedColor === color.name && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <h3 className="font-['Inter'] font-medium text-[18px] mb-3">
                      Quantity
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="border border-gray-300 rounded-lg px-4 py-2 font-medium">
                        {quantity}
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-medium">
                        ₹{currentPrice?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Quantity</span>
                      <span className="font-medium">× {quantity}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total Amount</span>
                      <span className="text-black">
                        ₹{(currentPrice * quantity)?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleProceedToCheckout}
                      className="bg-black text-white h-[55px] px-[40px] font-['Poppins'] font-medium text-[16px] w-full hover:bg-black/90 transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={() => navigate(-1)}
                      className="bg-[#f8f9f9] text-black h-[55px] px-[40px] font-['Inter'] font-medium text-[16px] w-full hover:bg-[#e8e9e9] transition-colors border border-gray-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductConfig;
