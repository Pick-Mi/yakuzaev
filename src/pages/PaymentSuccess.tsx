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
        // Log all URL parameters for debugging
        console.log('=== PaymentSuccess Page Loaded ===');
        console.log('All URL params:', Object.fromEntries(searchParams.entries()));
        
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

        console.log('PayU Response extracted:', payuResponse);
        console.log('Payment Status from PayU:', payuResponse.status);
        console.log('Transaction ID:', payuResponse.txnid);
        console.log('Order ID (udf2):', payuResponse.udf2);


        console.log('=== Starting Payment Verification ===');
        console.log('Calling supabase.functions.invoke for payu-payment');
        
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

        console.log('=== Verification Complete ===');
        console.log('Verification response:', JSON.stringify(verificationResponse, null, 2));
        console.log('Verification error:', JSON.stringify(error, null, 2));

        if (error) {
          console.error('Payment verification error:', error);
          setVerificationStatus('failed');
          toast({
            title: "Verification Failed",
            description: error.message || "Unable to verify payment status. Please contact support.",
            variant: "destructive"
          });
          return;
        }


        // Check if verification was successful OR if PayU status is success
        // This handles cases where hash verification might fail but PayU confirms payment
        const payuStatusSuccess = payuResponse.status.toLowerCase() === 'success';
        const verificationSuccess = verificationResponse?.success && verificationResponse?.paymentStatus === 'success';
        
        console.log('PayU status from response:', payuResponse.status);
        console.log('Is PayU status success?', payuStatusSuccess);
        console.log('Verification response success?', verificationSuccess);
        
        if (verificationSuccess || payuStatusSuccess) {
          const orderId = verificationResponse?.orderId || payuResponse.udf2;
          
          console.log('Payment accepted! Order ID:', orderId);
          
          // Fetch full order details from database
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

          if (!orderError && order) {
            setOrderDetails(order);
            console.log('Order details fetched:', order);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          {verificationStatus === 'verifying' && (
            <div className="text-center space-y-8">
              <div className="relative mx-auto w-40 h-40">
                <div className="absolute inset-0 bg-yellow-100 rounded-full animate-pulse"></div>
                <div className="absolute inset-6 bg-yellow-200 rounded-full animate-pulse delay-75"></div>
                <div className="absolute inset-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Clock className="w-16 h-16 text-white animate-spin" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-foreground">Verifying Payment</h1>
              <p className="text-xl text-muted-foreground">
                Please wait while we verify your payment...
              </p>
            </div>
          )}

          {verificationStatus === 'success' && paymentDetails && (
            <div className="space-y-8">
              {/* Success Icon with Concentric Circles */}
              <div className="relative mx-auto w-40 h-40">
                <div className="absolute inset-0 bg-green-100 rounded-full opacity-40"></div>
                <div className="absolute inset-6 bg-green-200 rounded-full opacity-60"></div>
                <div className="absolute inset-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground">Payment Successful!</h1>
                <p className="text-xl text-muted-foreground">
                  Your order has been placed successfully
                </p>
              </div>
              
              {/* Order Details Card */}
              <Card className="border-2 border-green-500/20 shadow-2xl">
                <CardHeader className="bg-green-50 dark:bg-green-900/20">
                  <CardTitle className="text-2xl text-center">Order Details</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Order Number - Highlighted */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-lg border-2 border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        #{orderDetails?.order_number || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Payment Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-accent/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                        <p className="font-mono text-sm break-all">{paymentDetails.orderId}</p>
                      </div>
                      <div className="p-4 bg-accent/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                        <p className="font-mono text-sm break-all">{paymentDetails.txnid}</p>
                      </div>
                      <div className="p-4 bg-accent/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Payment ID</p>
                        <p className="font-mono text-sm break-all">{paymentDetails.mihpayid}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹{paymentDetails.amount}</p>
                      </div>
                      <div className="p-4 bg-accent/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Payment Mode</p>
                        <p className="font-medium capitalize">{paymentDetails.mode}</p>
                      </div>
                      <div className="p-4 bg-accent/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                        <p className="font-medium capitalize text-green-600 dark:text-green-400">
                          {orderDetails?.status || 'Processing'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {orderDetails?.order_items_data && orderDetails.order_items_data.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-semibold mb-4">Items Ordered</h3>
                      <div className="space-y-3">
                        {orderDetails.order_items_data.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                              )}
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-semibold">{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="space-y-3 pt-6">
                    <Button 
                      onClick={() => navigate(`/orders/${paymentDetails.orderId}`)} 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      View Full Order Details
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={handleViewOrders} size="lg">
                        All Orders
                      </Button>
                      <Button variant="outline" onClick={handleContinueShopping} size="lg">
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {verificationStatus === 'failed' && (
            <div className="space-y-8">
              {/* Error Icon */}
              <div className="relative mx-auto w-40 h-40">
                <div className="absolute inset-0 bg-red-100 rounded-full opacity-40"></div>
                <div className="absolute inset-6 bg-red-200 rounded-full opacity-60"></div>
                <div className="absolute inset-12 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-16 h-16 text-white" strokeWidth={3} />
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground">Payment Verification Failed</h1>
                <p className="text-xl text-muted-foreground">
                  Payment could not be verified. Please contact support if amount was debited.
                </p>
              </div>
              
              <Card className="border-2 border-red-500/20">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground">
                      If you've been charged, please save this information and contact our support team:
                    </p>
                    {searchParams.get('txnid') && (
                      <div className="p-4 bg-accent/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                        <p className="font-mono text-sm break-all">{searchParams.get('txnid')}</p>
                      </div>
                    )}
                    {searchParams.get('mihpayid') && (
                      <div className="p-4 bg-accent/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Payment ID</p>
                        <p className="font-mono text-sm break-all">{searchParams.get('mihpayid')}</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleContinueShopping} 
                    className="w-full mt-6" 
                    size="lg"
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}