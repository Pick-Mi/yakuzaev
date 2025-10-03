import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

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
          setVerificationStatus('success');
          setPaymentDetails({
            orderId: payuResponse.txnid,
            mihpayid: payuResponse.mihpayid,
            amount: payuResponse.amount,
            mode: payuResponse.mode,
            status: payuResponse.status
          });
          
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
      navigate('/');
    }
  }, [searchParams, navigate, toast]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                {verificationStatus === 'verifying' && (
                  <>
                    <Clock className="w-6 h-6 text-yellow-500" />
                    Verifying Payment
                  </>
                )}
                {verificationStatus === 'success' && (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    Payment Successful
                  </>
                )}
                {verificationStatus === 'failed' && (
                  <>
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    Payment Verification Failed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationStatus === 'verifying' && (
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Please wait while we verify your payment...
                  </p>
                </div>
              )}

              {verificationStatus === 'success' && paymentDetails && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 font-medium">
                      Your payment has been processed successfully!
                    </p>
                    <p className="text-green-600 text-sm">
                      You will receive a confirmation email shortly.
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-medium">{paymentDetails.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-medium">{paymentDetails.mihpayid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">₹{paymentDetails.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Mode:</span>
                      <span className="font-medium capitalize">{paymentDetails.mode}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => navigate(`/orders/${paymentDetails.orderId}`)} 
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      View Order Details
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleViewOrders} className="flex-1">
                        All Orders
                      </Button>
                      <Button variant="outline" onClick={handleContinueShopping} className="flex-1">
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {verificationStatus === 'failed' && (
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-800 font-medium">
                      Payment verification failed
                    </p>
                    <p className="text-red-600 text-sm">
                      If the amount was debited from your account, please contact our support team.
                    </p>
                  </div>
                  
                  <Button onClick={handleContinueShopping} className="w-full">
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