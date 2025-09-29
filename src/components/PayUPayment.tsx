import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PayUPaymentProps {
  orderId: string;
  amount: number;
  productInfo: string;
  customerDetails: {
    firstName: string;
    email: string;
    phone: string;
  };
  onSuccess: (paymentData: any) => void;
  onFailure: (error: any) => void;
  disabled?: boolean;
}

export default function PayUPayment({
  orderId,
  amount,
  productInfo,
  customerDetails,
  onSuccess,
  onFailure,
  disabled = false
}: PayUPaymentProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to proceed with payment",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create success and failure URLs
      const baseUrl = window.location.origin;
      const surl = `${baseUrl}/payment/success`;
      const furl = `${baseUrl}/payment/failure`;

      const paymentData = {
        orderId: orderId,
        amount: amount,
        productInfo: productInfo,
        firstName: customerDetails.firstName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        surl: surl,
        furl: furl,
        udf1: user.id, // Store user ID for reference
        udf2: '', 
        udf3: '',
        udf4: '',
        udf5: ''
      };

      console.log('Initiating PayU payment with data:', paymentData);

      // Call the edge function to get payment parameters
      const { data: paymentResponse, error } = await supabase.functions.invoke(
        'payu-payment',
        {
          body: {
            action: 'initiate_payment',
            paymentData: paymentData
          }
        }
      );

      if (error) {
        console.error('PayU payment initiation error:', error);
        throw error;
      }

      if (!paymentResponse?.success) {
        throw new Error('Failed to initiate PayU payment');
      }

      console.log('PayU payment params received:', paymentResponse);

      // Create form dynamically and submit to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentResponse.payuUrl;
      form.target = '_self';

      // Add all PayU parameters as hidden inputs
      Object.entries(paymentResponse.paymentParams).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      // Submit form to redirect to PayU
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

    } catch (error) {
      console.error('PayU payment error:', error);
      setIsProcessing(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Payment initiation failed';
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      onFailure(error);
    }
  };

  // Handle payment response (success/failure) - This is handled by dedicated pages
  // Remove useEffect as PaymentSuccess/PaymentFailure pages handle URL params

  return (
    <div className="space-y-4">
      <div className="p-4 bg-accent/50 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">PayU Payment Gateway</h4>
        <p className="text-sm text-muted-foreground mb-3">
          You will be redirected to PayU's secure payment page to complete your transaction.
        </p>
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Order ID:</span> {orderId}</p>
          <p><span className="font-medium">Amount:</span> ₹{amount.toFixed(2)}</p>
          <p><span className="font-medium">Customer:</span> {customerDetails.firstName}</p>
        </div>
      </div>
      
      <Button
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? 'Redirecting to PayU...' : `Pay ₹${amount.toFixed(2)} with PayU`}
      </Button>

      <form ref={formRef} style={{ display: 'none' }} />
    </div>
  );
}