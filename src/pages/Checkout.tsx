import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { ArrowLeft, CreditCard, Shield, Lock, Edit, Banknote, Smartphone, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Checkout = () => {
  const { items, itemCount, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    bankName: "",
    accountNumber: "",
    upiId: ""
  });

  // Fetch user profile data
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
        setShippingInfo({
          fullName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.display_name || '',
          email: profile.email || user?.email || '',
          phone: profile.phone || '',
          address: profile.street_address || '',
          city: profile.city || '',
          state: profile.state_province || '',
          zipCode: profile.postal_code || '',
          country: profile.country || 'India'
        });
      }
    };

    fetchUserProfile();
  }, [user]);

  const handlePlaceOrder = async () => {
    console.log('Place Order clicked - starting process');
    console.log('User:', user);
    console.log('Items:', items);
    console.log('Payment method:', paymentMethod);
    console.log('Shipping info:', shippingInfo);
    
    setIsProcessing(true);
    
    try {
      // Calculate total amount for database storage
      const totalAmount = items.reduce((sum, item) => {
        const priceStr = typeof item.price === 'string' ? item.price : String(item.price);
        const price = parseFloat(priceStr.replace('$', ''));
        return sum + (price * item.quantity);
      }, 0);
      
      console.log('Total amount calculated:', totalAmount);

      // Create the order in the database
      console.log('About to insert order with data:', {
        customer_id: user?.id,
        total_amount: totalAmount,
        status: 'pending',
        payment_method: paymentMethod,
      });
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user?.id,
          total_amount: totalAmount,
          status: 'pending',
          payment_method: paymentMethod,
          shipping_address: {
            fullName: shippingInfo.fullName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zipCode: shippingInfo.zipCode,
            country: shippingInfo.country
          },
          billing_address: paymentMethod === 'card' ? {
            cardName: paymentInfo.cardName,
            cardNumber: paymentInfo.cardNumber.slice(-4)
          } : paymentMethod === 'bank' ? {
            bankName: paymentInfo.bankName,
            accountNumber: paymentInfo.accountNumber.slice(-4)
          } : paymentMethod === 'upi' ? {
            upiId: paymentInfo.upiId
          } : {
            method: 'Cash on Delivery'
          }
        })
        .select()
        .single();

      console.log('Order insertion result:', { orderData, orderError });
      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => {
        const priceStr = typeof item.price === 'string' ? item.price : String(item.price);
        const unitPrice = parseFloat(priceStr.replace('$', ''));
        return {
          order_id: orderData.id,
          product_id: String(item.id),
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: unitPrice * item.quantity
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update order status to completed
      await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderData.id);

      clearCart();
      setIsProcessing(false);
      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderData.id.slice(0, 8)} has been confirmed.`,
      });
      navigate("/");
      
    } catch (error) {
      console.error('Error placing order:', error);
      setIsProcessing(false);
      toast({
        title: "Error placing order",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

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
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Shipping Information</CardTitle>
                {userProfile && !isEditingAddress && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditingAddress(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Address
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile && !isEditingAddress ? (
                  // Display saved address
                  <div className="p-4 bg-accent/50 rounded-lg">
                    <h4 className="font-medium mb-2">Delivery Address:</h4>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{shippingInfo.fullName}</p>
                      <p>{shippingInfo.email}</p>
                      <p>{shippingInfo.phone}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.country}</p>
                    </div>
                  </div>
                ) : (
                  // Editable address form
                  <>
                    {isEditingAddress && (
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsEditingAddress(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    placeholder="123 Main Street"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">PIN Code</Label>
                    <Input
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      placeholder="400001"
                    />
                  </div>
                </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="w-5 h-5" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                      <Banknote className="w-5 h-5" />
                      Net Banking
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                      <Smartphone className="w-5 h-5" />
                      UPI
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                      <Truck className="w-5 h-5" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details */}
            {paymentMethod !== 'cod' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {paymentMethod === 'card' && <CreditCard className="w-5 h-5" />}
                    {paymentMethod === 'bank' && <Banknote className="w-5 h-5" />}
                    {paymentMethod === 'upi' && <Smartphone className="w-5 h-5" />}
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethod === 'card' && (
                    <>
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === 'bank' && (
                    <>
                      <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={paymentInfo.bankName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, bankName: e.target.value})}
                          placeholder="State Bank of India"
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={paymentInfo.accountNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, accountNumber: e.target.value})}
                          placeholder="Enter your account number"
                        />
                      </div>
                    </>
                  )}

                  {paymentMethod === 'upi' && (
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        value={paymentInfo.upiId}
                        onChange={(e) => setPaymentInfo({...paymentInfo, upiId: e.target.value})}
                        placeholder="yourname@paytm"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 p-3 rounded-lg">
                    <Shield className="w-4 h-4" />
                    Your payment information is encrypted and secure
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-primary">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{total}</span>
                  </div>
                </div>
                
                {/* Place Order Button */}
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Place Order
                    </>
                  )}
                </Button>
                
                <div className="text-xs text-center text-muted-foreground">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;