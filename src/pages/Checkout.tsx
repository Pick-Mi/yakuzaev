import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import PayUPayment from "@/components/PayUPayment";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const { items, itemCount, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Get data from booking confirmation or cart
  const bookingData = location.state;

  // Fetch user profile data for customer details
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      // Use booking profile if available, otherwise fetch from database
      if (bookingData?.userProfile) {
        setUserProfile(bookingData.userProfile);
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
        }
      }
    };

    fetchUserProfile();
  }, [user, bookingData]);
  // Determine if this is from booking or cart
  const isBookingFlow = bookingData && bookingData.orderId && bookingData.orderData;
  const displayItems = isBookingFlow ? bookingData.orderData.order_items_data : items;
  const displayTotal = isBookingFlow ? bookingData.amount : total;
  const displayItemCount = isBookingFlow ? 1 : itemCount;

  if (!isBookingFlow && items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <Link to="/">
            <Button variant="ai">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        {isBookingFlow ? (
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Booking
          </Button>
        ) : (
          <Link to="/cart">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        )}

        <div className="max-w-2xl mx-auto">
          {/* Order Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
              <p className="text-muted-foreground">Review your order before proceeding to payment</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items */}
              <div className="space-y-4">
                {displayItems.map((item: any, index: number) => (
                  <div key={item.id || index} className="flex gap-4 p-4 bg-accent/50 rounded-lg">
                    {!isBookingFlow && item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name || item.product_name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name || item.product_name}</h4>
                      {(item.selectedVariant || item.variant) && (
                        <p className="text-sm text-muted-foreground">
                          Variant: {typeof item.selectedVariant === 'string' ? item.selectedVariant : item.selectedVariant?.name || item.variant}
                        </p>
                      )}
                      {(item.color) && (
                        <p className="text-sm text-muted-foreground">
                          Color: {item.color}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="font-semibold text-primary">
                          ₹{(item.unit_price || parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0')).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-base">
                  <span>Subtotal ({displayItemCount} {displayItemCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium">
                    {isBookingFlow ? `₹${displayTotal.toLocaleString('en-IN')}` : displayTotal}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Tax</span>
                  <span className="font-medium">₹0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">
                    {isBookingFlow ? `₹${displayTotal.toLocaleString('en-IN')}` : displayTotal}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              {/* PayU Payment Component */}
              <div className="space-y-3">
                <PayUPayment
                  orderId={isBookingFlow ? bookingData.orderId : `ORDER_${Date.now()}`}
                  amount={isBookingFlow ? displayTotal : (() => {
                    const numericTotal = parseFloat(displayTotal.replace(/[^0-9.]/g, ''));
                    return isNaN(numericTotal) || numericTotal <= 0 ? 0 : numericTotal;
                  })()}
                  productInfo={isBookingFlow ? bookingData.productInfo : `Order with ${displayItemCount} items`}
                  customerDetails={
                    isBookingFlow && bookingData.customerDetails 
                      ? bookingData.customerDetails 
                      : {
                          firstName: userProfile?.first_name || userProfile?.display_name || 'Customer',
                          email: userProfile?.email || user?.email || 'customer@example.com',
                          phone: userProfile?.phone || '9999999999'
                        }
                  }
                  cartItems={isBookingFlow ? [] : items}
                  orderData={isBookingFlow ? bookingData.orderData : undefined}
                  userProfile={userProfile}
                  onSuccess={(paymentData) => {
                    console.log('Payment successful:', paymentData);
                    // Cart will be cleared after payment verification on success page
                    // Don't navigate yet - PayU will handle the redirect
                  }}
                  onFailure={(error) => {
                    console.error('Payment failed:', error);
                    toast({
                      title: "Payment failed",
                      description: "Please try again.",
                      variant: "destructive"
                    });
                  }}
                />
                
                <p className="text-xs text-center text-muted-foreground">
                  By proceeding to payment, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;