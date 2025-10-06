import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { useCart } from '@/hooks/useCart';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Extract PayU response parameters
        const payuResponse = {
          mihpayid: searchParams.get('mihpayid') || '',
          mode: searchParams.get('mode') || '',
          status: searchParams.get('status') || '',
          unmappedstatus: searchParams.get('unmappedstatus') || '',
          key: searchParams.get('key') || '',
          txnid: searchParams.get('txnid') || '',
          amount: searchParams.get('amount') || '',
          productinfo: searchParams.get('productinfo') || '',
          firstname: searchParams.get('firstname') || '',
          email: searchParams.get('email') || '',
          phone: searchParams.get('phone') || '',
          udf1: searchParams.get('udf1') || '',
          udf2: searchParams.get('udf2') || '',
          udf3: searchParams.get('udf3') || '',
          udf4: searchParams.get('udf4') || '',
          udf5: searchParams.get('udf5') || '',
          hash: searchParams.get('hash') || '',
          field1: searchParams.get('field1') || '',
          field2: searchParams.get('field2') || '',
          field3: searchParams.get('field3') || '',
          field4: searchParams.get('field4') || '',
          field5: searchParams.get('field5') || '',
          field6: searchParams.get('field6') || '',
          field7: searchParams.get('field7') || '',
          field8: searchParams.get('field8') || '',
          field9: searchParams.get('field9') || '',
          error: searchParams.get('error') || '',
          error_Message: searchParams.get('error_Message') || '',
          net_amount_debit: searchParams.get('net_amount_debit') || '',
          addedon: searchParams.get('addedon') || ''
        };

        console.log('PayU Response received:', payuResponse);

        // Verify payment with backend
        const { data: verificationResponse, error } = await supabase.functions.invoke(
          'payu-payment',
          {
            body: {
              action: 'verify_payment',
              responseData: payuResponse
            }
          }
        );

        if (error) {
          console.error('Payment verification error:', error);
          setVerificationStatus('failed');
          toast({
            title: "Verification Failed",
            description: "Unable to verify payment status. Please contact support.",
            variant: "destructive"
          });
          return;
        }

        if (verificationResponse?.success && verificationResponse?.paymentStatus === 'success') {
          const orderId = verificationResponse.orderId || payuResponse.udf2;
          
          // Fetch full order details from database
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

          if (!orderError && order) {
            setOrderDetails(order);
          }

          setVerificationStatus('success');
          setPaymentDetails({
            orderId: orderId,
            txnid: payuResponse.txnid,
            mihpayid: payuResponse.mihpayid,
            amount: payuResponse.amount,
            mode: payuResponse.mode,
            status: payuResponse.status
          });
          
          // Clear cart after successful payment
          clearCart();
          
          toast({
            title: "Payment Successful!",
            description: `Your payment of ₹${payuResponse.amount} has been processed successfully.`,
          });
        } else {
          setVerificationStatus('failed');
          toast({
            title: "Payment Verification Failed",
            description: "Payment could not be verified. Please contact support if amount was debited.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationStatus('failed');
        toast({
          title: "Verification Error",
          description: "An error occurred while verifying payment. Please contact support.",
          variant: "destructive"
        });
      }
    };

    if (searchParams.has('txnid')) {
      verifyPayment();
    } else {
      // If no payment parameters, show error but don't redirect immediately
      setVerificationStatus('failed');
      toast({
        title: "Invalid Payment Response",
        description: "No payment information received. Please contact support.",
        variant: "destructive"
      });
    }
  }, [searchParams, navigate, toast]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              {verificationStatus === 'verifying' && (
                <div className="text-center space-y-4">
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-yellow-100 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 bg-yellow-200 rounded-full animate-pulse delay-75"></div>
                    <div className="absolute inset-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Clock className="w-12 h-12 text-white animate-spin" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Verifying Payment</h2>
                  <p className="text-muted-foreground">
                    Please wait while we verify your payment...
                  </p>
                </div>
              )}

              {verificationStatus === 'success' && paymentDetails && (
                <div className="text-center space-y-6">
                  {/* Success Icon with Concentric Circles */}
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-green-100 rounded-full opacity-40"></div>
                    <div className="absolute inset-4 bg-green-200 rounded-full opacity-60"></div>
                    <div className="absolute inset-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Payment Successful</h2>
                    <p className="text-muted-foreground">
                      Your order has been placed successfully!
                    </p>
                  </div>
                  
                  {/* Order Details */}
                  <div className="bg-accent/50 p-6 rounded-lg space-y-3 text-left">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-muted-foreground">Order Number</span>
                      <span className="font-semibold">#{orderDetails?.order_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-muted-foreground">Order ID</span>
                      <span className="font-mono text-xs">{paymentDetails.orderId}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-muted-foreground">Transaction ID</span>
                      <span className="font-mono text-xs">{paymentDetails.txnid}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-muted-foreground">Payment ID</span>
                      <span className="font-mono text-xs">{paymentDetails.mihpayid}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-muted-foreground">Amount Paid</span>
                      <span className="font-bold text-lg text-green-600">₹{paymentDetails.amount}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-muted-foreground">Payment Mode</span>
                      <span className="font-medium capitalize">{paymentDetails.mode}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-muted-foreground">Order Status</span>
                      <span className="font-medium capitalize">{orderDetails?.status || 'Processing'}</span>
                    </div>
                    {orderDetails?.order_items_data && orderDetails.order_items_data.length > 0 && (
                      <div className="pt-3">
                        <span className="text-sm text-muted-foreground block mb-2">Items Ordered:</span>
                        <div className="space-y-2">
                          {orderDetails.order_items_data.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span>{item.name} x {item.quantity}</span>
                              <span className="font-medium">{item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4">
                    <Button 
                      onClick={() => navigate(`/orders/${paymentDetails.orderId}`)} 
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      View Order Details
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={handleViewOrders}>
                        All Orders
                      </Button>
                      <Button variant="outline" onClick={handleContinueShopping}>
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {verificationStatus === 'failed' && (
                <div className="text-center space-y-6">
                  {/* Error Icon */}
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-red-100 rounded-full opacity-40"></div>
                    <div className="absolute inset-4 bg-red-200 rounded-full opacity-60"></div>
                    <div className="absolute inset-8 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-12 h-12 text-white" strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Payment Verification Failed</h2>
                    <p className="text-muted-foreground mb-4">
                      Payment could not be verified. Please contact support if amount was debited.
                    </p>
                  </div>
                  
                  <Button onClick={handleContinueShopping} className="w-full" size="lg">
                    Continue Shopping
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}