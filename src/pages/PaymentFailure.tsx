import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Extract PayU response parameters
    const payuResponse = {
      txnid: searchParams.get('txnid') || '',
      amount: searchParams.get('amount') || '',
      status: searchParams.get('status') || '',
      error: searchParams.get('error') || '',
      error_Message: searchParams.get('error_Message') || '',
      firstname: searchParams.get('firstname') || '',
      email: searchParams.get('email') || ''
    };

    console.log('PayU Failure Response:', payuResponse);
    setPaymentDetails(payuResponse);

    toast({
      title: "Payment Failed",
      description: payuResponse.error_Message || "Your payment could not be processed. Please try again.",
      variant: "destructive"
    });
  }, [searchParams, toast]);

  const handleRetryPayment = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2 text-red-600">
                <XCircle className="w-6 h-6" />
                Payment Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800 font-medium">
                  Your payment could not be processed
                </p>
                {paymentDetails?.error_Message && (
                  <p className="text-red-600 text-sm mt-1">
                    Reason: {paymentDetails.error_Message}
                  </p>
                )}
                <p className="text-red-600 text-sm mt-2">
                  Don't worry, no amount has been deducted from your account.
                </p>
              </div>

              {paymentDetails && (
                <div className="space-y-2 text-sm">
                  {paymentDetails.txnid && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-medium">{paymentDetails.txnid}</span>
                    </div>
                  )}
                  {paymentDetails.amount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">₹{paymentDetails.amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-red-600 capitalize">
                      {paymentDetails.status || 'Failed'}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">What can you do?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check your internet connection and try again</li>
                  <li>• Ensure your payment details are correct</li>
                  <li>• Try using a different payment method</li>
                  <li>• Contact your bank if the issue persists</li>
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleRetryPayment} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Payment
                </Button>
                <Button variant="outline" onClick={handleContinueShopping} className="flex-1">
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}