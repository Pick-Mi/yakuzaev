import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import PayUPayment from "@/components/PayUPayment";
import { CreditCard } from "lucide-react";

const GetPayment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    amount: ""
  });
  const [showPayment, setShowPayment] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your payment has been processed successfully.",
    });
    // Reset form
    setFormData({
      firstName: "",
      email: "",
      phone: "",
      amount: ""
    });
    setShowPayment(false);
  };

  const handlePaymentFailure = () => {
    toast({
      title: "Payment Failed",
      description: "Please try again.",
      variant: "destructive"
    });
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold text-foreground mb-2">Get Payment</h1>
            <p className="text-muted-foreground">
              Enter your details and amount to make a secure payment
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Fill in the details below to proceed with payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showPayment ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">Full Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        maxLength={255}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        maxLength={15}
                      />
                    </div>

                    <div>
                      <Label htmlFor="amount">Amount (₹) *</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Proceed to Payment
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-accent/50 rounded-lg space-y-2">
                    <h3 className="font-semibold text-foreground mb-3">Payment Summary</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {formData.firstName}</p>
                      <p><span className="font-medium">Email:</span> {formData.email}</p>
                      <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                      <p className="text-lg font-bold text-primary mt-2">
                        Amount: ₹{parseFloat(formData.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <PayUPayment
                    orderId={`PAY_${Date.now()}`}
                    amount={parseFloat(formData.amount)}
                    productInfo="Payment Request"
                    customerDetails={{
                      firstName: formData.firstName,
                      email: formData.email,
                      phone: formData.phone
                    }}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                  />

                  <Button
                    variant="outline"
                    onClick={() => setShowPayment(false)}
                    className="w-full"
                  >
                    Back to Edit Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GetPayment;
