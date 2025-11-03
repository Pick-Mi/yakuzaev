import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import PayUPayment from "@/components/PayUPayment";
import { ArrowLeft, Upload, X, FileText } from "lucide-react";
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
  const [uploadingId, setUploadingId] = useState(false);
  const [idProof, setIdProof] = useState({
    document_type: "",
    document_number: "",
    document_file_url: "",
  });
  
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
          
          // Load existing ID proof if available
          setIdProof({
            document_type: profile.document_type || "",
            document_number: profile.document_number || "",
            document_file_url: profile.document_file_url || "",
          });
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

  const handleIdProofUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size should be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Only JPG, PNG, and PDF files are allowed",
        variant: "destructive"
      });
      return;
    }

    setUploadingId(true);

    try {
      // Delete old file if exists
      if (idProof.document_file_url) {
        const oldPath = idProof.document_file_url.split('/').slice(-2).join('/');
        await supabase.storage.from('id-documents').remove([oldPath]);
      }

      // Upload new file
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('id-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('id-documents')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          document_file_url: publicUrl,
          document_type: idProof.document_type || 'other',
          document_number: idProof.document_number,
        })
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      setIdProof({ ...idProof, document_file_url: publicUrl });

      toast({
        title: "Success",
        description: "ID proof uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading ID proof:', error);
      toast({
        title: "Error",
        description: "Failed to upload ID proof",
        variant: "destructive"
      });
    } finally {
      setUploadingId(false);
    }
  };

  const handleRemoveIdProof = () => {
    setIdProof({ ...idProof, document_file_url: "" });
  };

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
              
              {/* ID Proof Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Identification Details (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your ID proof for verification purposes
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm mb-2 block">Document Type</Label>
                    <select
                      value={idProof.document_type}
                      onChange={(e) => setIdProof({ ...idProof, document_type: e.target.value })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="">Select Type</option>
                      <option value="aadhaar">Aadhaar Card</option>
                      <option value="pan">PAN Card</option>
                      <option value="passport">Passport</option>
                      <option value="driving_license">Driving License</option>
                      <option value="voter_id">Voter ID</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm mb-2 block">Document Number</Label>
                    <Input
                      value={idProof.document_number}
                      onChange={(e) => setIdProof({ ...idProof, document_number: e.target.value })}
                      placeholder="Enter document number"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm mb-2 block">Upload Document (JPG, PNG, PDF - Max 5MB)</Label>
                  
                  {idProof.document_file_url ? (
                    <div className="border border-input rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Document Uploaded</p>
                            <a
                              href={idProof.document_file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              View Document
                            </a>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveIdProof}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        id="id-proof-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={handleIdProofUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('id-proof-upload')?.click()}
                        disabled={uploadingId}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingId ? "Uploading..." : "Upload Document"}
                      </Button>
                    </div>
                  )}
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