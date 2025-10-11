import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, itemCount, total } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center space-y-6">
            <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
              <p className="text-muted-foreground">Add some products to get started</p>
            </div>
            <Link to="/">
              <Button variant="ai" size="lg">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) * item.quantity), 0);
  const discount = 1250; // Fixed discount from reference
  const totalAmount = subtotal - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            My Card
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-40 h-40 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {item.name}
                      </h3>
                      
                      <p className="text-sm text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Return or Replace: Eligible through Oct 20, 2025
                      </p>
                      
                      <div className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <span className="text-gray-400">Variant : </span>
                        <span className="font-medium text-gray-900">(43V, 60km Range, Matte Black)</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <span className="text-gray-400">Colour :</span>
                        <span className="font-medium text-gray-900">Black</span>
                        <div className="w-4 h-4 bg-black rounded-sm border border-gray-300"></div>
                      </div>
                      
                      <p className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₹{parseFloat(item.price.toString().replace(/[^0-9.]/g, '')).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 pt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-base font-medium text-gray-900 min-w-[20px] text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 ml-2"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  PRICE DETAILS
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Price ({itemCount} items)
                    </span>
                    <span className="text-base font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      ₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Discount
                    </span>
                    <span className="text-base font-medium text-orange-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      -₹ {discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Total Amount
                      </span>
                      <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₹{totalAmount.toLocaleString('en-IN')} -/
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-orange-500 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  You will save ₹{discount.toLocaleString('en-IN')} on this order
                </p>
                
                <Link to="/checkout">
                  <button className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
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