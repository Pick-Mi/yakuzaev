import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import emptyCartIcon from "@/assets/cart-icon.svg";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, itemCount, total } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-8 max-w-md">
            <div className="inline-block p-6 mb-[10px]">
              <img src={emptyCartIcon} alt="Empty cart" className="w-12 h-12 text-foreground" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-foreground">Your cart is empty</h1>
              <p className="text-lg text-muted-foreground">Add some products to get started</p>
            </div>
            <Link to="/products">
              <Button 
                className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium rounded-none mt-4"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    if (!item || !item.price) return sum;
    const priceStr = typeof item.price === 'string' ? item.price : item.price.toString();
    const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);
  const discount = 1250; // Fixed discount from reference
  const totalAmount = subtotal - discount;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9F9' }}>
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          {/* Title */}
          <h1 className="text-[40px] md:text-[48px] font-bold text-black mb-10" style={{ fontFamily: 'Poppins, sans-serif' }}>
            My Card
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-36 h-36 md:w-44 md:h-44 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center p-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 space-y-2.5">
                      <h3 className="text-[17px] md:text-[18px] font-semibold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {item.name}
                      </h3>
                      
                      <p className="text-[13px] md:text-[14px] text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Return or Replace: Eligible through Oct 20, 2025
                      </p>
                      
                      <div className="text-[13px] md:text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <span className="text-gray-400">Variant : </span>
                        <span className="font-medium text-black">(43V, 60km Range, Matte Black)</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[13px] md:text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <span className="text-gray-400">Colour :</span>
                        <span className="font-semibold text-black">Black</span>
                        <div className="w-4 h-4 bg-black rounded-sm"></div>
                      </div>
                      
                      <p className="text-[17px] md:text-[18px] font-semibold text-black pt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₹{(() => {
                          if (!item.price) return '0.00';
                          const priceStr = typeof item.price === 'string' ? item.price : item.price.toString();
                          const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
                          return price.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                        })()}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="text-[15px] font-medium text-black min-w-[24px] text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-9 h-9 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-red-300 transition-colors ml-1"
                        >
                          <Trash2 className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-[18px] font-semibold text-black mb-6" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.5px' }}>
                  PRICE DETAILS
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[15px] text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Price ({itemCount} items)
                    </span>
                    <span className="text-[15px] font-medium text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      ₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[15px] text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Discount
                    </span>
                    <span className="text-[15px] font-medium" style={{ fontFamily: 'Poppins, sans-serif', color: '#FF8C42' }}>
                      -₹ {discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[16px] font-semibold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Total Amount
                      </span>
                      <span className="text-[16px] font-semibold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₹{totalAmount.toLocaleString('en-IN')} -/
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-[14px] mb-6" style={{ fontFamily: 'Poppins, sans-serif', color: '#FF8C42' }}>
                  You will save ₹{discount.toLocaleString('en-IN')} on this order
                </p>
                
                <Link to="/checkout">
                  <button className="w-full bg-black text-white py-3.5 rounded-lg font-medium hover:bg-gray-900 transition-colors text-[15px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;