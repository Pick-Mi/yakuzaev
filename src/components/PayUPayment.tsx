import { useState } from 'react';
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
  cartItems?: any[];
  orderData?: any;
  userProfile?: any;
  onSuccess: (paymentData: any) => void;
  onFailure: (error: any) => void;
  disabled?: boolean;
}

export default function PayUPayment({
  orderId,
  amount,
  productInfo,
  customerDetails,
  cartItems = [],
  orderData,
  userProfile,
  onSuccess,
  onFailure,
  disabled = false
}: PayUPaymentProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

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
      // Determine if this is a remaining payment for existing order or a new order
      let actualOrderId = orderId;
      
      // Only create a new order if orderData is provided (booking flow) or if we have cart items (cart flow)
      if (orderData) {
        // Booking flow - create new order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (orderError) {
          console.error('Order creation error:', orderError);
          throw new Error('Failed to create order: ' + orderError.message);
        }
        actualOrderId = order.id;
        console.log('New order created successfully:', order);
      } else if (cartItems && cartItems.length > 0) {
        // Cart flow - create order from cart items
        const orderDataFromCart = {
          customer_id: user.id,
          status: 'pending',
          payment_status: 'pending',
          total_amount: amount,
          order_items_data: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            selectedVariant: item.selectedVariant
          })),
          customer_details: {
            name: customerDetails.firstName,
            email: customerDetails.email,
            phone: customerDetails.phone,
            userId: user.id,
            isVerified: userProfile?.is_verified || false,
            customerType: userProfile?.customer_type || 'individual',
            loyaltyPoints: userProfile?.loyalty_points || 0
          },
          delivery_address: {
            fullName: customerDetails.firstName,
            email: customerDetails.email,
            phone: customerDetails.phone,
            streetAddress: userProfile?.street_address || '',
            city: userProfile?.city || '',
            state: userProfile?.state_province || '',
            zipCode: userProfile?.postal_code || '',
            country: userProfile?.country || 'India',
            addressType: 'delivery'
          },
          order_summary: {
            subtotal: amount,
            itemCount: cartItems.length,
            totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
            discountAmount: 0,
            taxAmount: 0,
            shippingCharge: 0,
            finalTotal: amount
          },
          payment_method: 'payu',
          order_source: 'web',
          estimated_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };

        console.log('Creating order in database:', orderDataFromCart);

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert(orderDataFromCart)
          .select()
          .single();

        if (orderError) {
          console.error('Order creation error:', orderError);
          throw new Error('Failed to create order: ' + orderError.message);
        }
        actualOrderId = order.id;
        console.log('New order created successfully:', order);
      } else {
        // Remaining payment flow - use existing orderId, don't create new order
        console.log('Processing remaining payment for existing order:', actualOrderId);
      }

      // Create success and failure URLs - pointing to webhook endpoint
      const baseUrl = window.location.origin;
      const webhookUrl = 'https://tqhwoizjlvjdiuemirsy.supabase.co/functions/v1/payu-webhook';
      const surl = webhookUrl;
      const furl = webhookUrl;

      const paymentData = {
        orderId: actualOrderId,
        amount: amount,
        productInfo: productInfo,
        firstName: customerDetails.firstName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        surl: surl,
        furl: furl,
        udf1: user.id,
        udf2: actualOrderId, 
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

      // Create and submit form for PayU redirection
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentResponse.payuUrl;

      // Add all PayU parameters
      Object.entries(paymentResponse.paymentParams).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value || '');
        form.appendChild(input);
      });

      document.body.appendChild(form);
      
      console.log('Submitting to PayU...');
      
      // Submit the form
      form.submit();
      
      // Remove form after submission
      setTimeout(() => {
        document.body.removeChild(form);
      }, 100);

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
    </div>
  );
}
