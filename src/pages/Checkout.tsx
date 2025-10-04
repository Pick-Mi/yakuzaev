import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import PayUPayment from "@/components/PayUPayment";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const { items, itemCount, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile data for customer details
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profile) {
        setUserProfile(profile);
      }
    };

    fetchUserProfile();
  }, [user]);


  if (items.length === 0) {
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
        <Link to="/cart">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
        </Link>

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
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-accent/50 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      {item.selectedVariant && (
                        <p className="text-sm text-muted-foreground">
                          Variant: {typeof item.selectedVariant === 'string' ? item.selectedVariant : item.selectedVariant.name}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="font-semibold text-primary">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-base">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{total}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">{total}</span>
                </div>
              </div>
              
              <Separator />
              
              {/* PayU Payment Component */}
              <div className="space-y-3">
                <PayUPayment
                  orderId={`ORDER_${Date.now()}`}
                  amount={(() => {
                    const numericTotal = parseFloat(total.replace(/[^0-9.]/g, ''));
                    return isNaN(numericTotal) || numericTotal <= 0 ? 0 : numericTotal;
                  })()}
                  productInfo={`Order with ${itemCount} items`}
                  customerDetails={{
                    firstName: userProfile?.first_name || userProfile?.display_name || 'Customer',
                    email: userProfile?.email || user?.email || 'customer@example.com',
                    phone: userProfile?.phone || '9999999999'
                  }}
                  cartItems={items}
                  userProfile={userProfile}
                  onSuccess={(paymentData) => {
                    console.log('Payment successful:', paymentData);
                    clearCart();
                    toast({
                      title: "Payment successful!",
                      description: "Your order has been placed successfully.",
                    });
                    navigate("/payment/success");
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