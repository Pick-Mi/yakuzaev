import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { 
  Package, 
  CheckCircle, 
  User,
  ChevronRight,
  Home,
  MessageCircle,
  XCircle,
  ChevronDown,
  Info
} from "lucide-react";
import Header from "@/components/Header";
import PayUPayment from "@/components/PayUPayment";

interface Transaction {
  id: string;
  payment_id: string;
  transaction_id: string;
  amount: number;
  status: string;
  payu_response?: any;
  created_at: string;
  customer_name: string;
  customer_email: string;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  payment_status?: string;
  order_items_data?: any;
  customer_details?: any;
  delivery_address?: any;
  payment_details?: any;
  payment_method?: string;
  estimated_delivery_date?: string;
  shipping_charge?: number;
  tax_amount?: number;
  discount_amount?: number;
  order_summary?: any;
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  useEffect(() => {
    if (user && id) {
      fetchOrder();
    }
  }, [user, id]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('customer_id', user?.id)
        .single();

      if (error) throw error;
      setOrder(data);

      // Fetch transaction details for this order
      try {
        const { data: transactionData } = await supabase
          .from('transactions' as any)
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }) as any;

        if (transactionData && transactionData.length > 0) {
          // Find transaction with order ID in payu_response
          const orderTransaction = transactionData.find(
            (t: any) => t.payu_response?.order_id === id
          );
          if (orderTransaction) {
            setTransaction({
              id: orderTransaction.id,
              payment_id: orderTransaction.payment_id,
              transaction_id: orderTransaction.transaction_id,
              amount: orderTransaction.amount,
              status: orderTransaction.status,
              payu_response: orderTransaction.payu_response,
              created_at: orderTransaction.created_at,
              customer_name: orderTransaction.customer_name,
              customer_email: orderTransaction.customer_email,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching transaction:', err);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getOrderTimeline = () => {
    if (!order) return [];
    
    const timeline = [];
    const orderDate = new Date(order.created_at);
    
    if (order.status === 'confirmed' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
      timeline.push({
        label: 'Order Confirmed',
        date: format(orderDate, 'EEE d MMM'),
        time: 'Today',
        completed: true,
        message: 'Your Order has been placed.',
      });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      const shippedDate = new Date(orderDate);
      shippedDate.setDate(shippedDate.getDate() + 1);
      timeline.push({
        label: 'Shipped',
        date: `Expected By ${format(shippedDate, 'MMM d')}`,
        time: '',
        completed: order.status === 'delivered',
        message: '',
      });
    } else if (order.status === 'confirmed' || order.status === 'processing') {
      timeline.push({
        label: 'Shipped',
        date: order.estimated_delivery_date ? `Expected By ${format(new Date(order.estimated_delivery_date), 'MMM d')}` : 'Expected soon',
        time: '',
        completed: false,
        message: '',
      });
    }

    timeline.push({
      label: 'Out For Delivery',
      date: '',
      time: '',
      completed: false,
      message: '',
    });

    if (order.estimated_delivery_date) {
      timeline.push({
        label: 'Delivery',
        date: format(new Date(order.estimated_delivery_date), 'MMM dd'),
        time: 'By 11 PM',
        completed: order.status === 'delivered',
        message: '',
      });
    }

    return timeline;
  };

  const handleCancelOrder = async () => {
    if (!order || !user) return;
    
    setCancelling(true);
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          payment_status: 'refunded'
        })
        .eq('id', order.id)
        .eq('customer_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled and refund will be processed within 5-7 business days.",
      });

      await fetchOrder();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Cancellation Failed",
        description: "Unable to cancel order. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setCancelling(false);
    }
  };

  const canCancelOrder = (status: string) => {
    return ['pending', 'confirmed', 'processing'].includes(status.toLowerCase());
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    setShowPaymentDialog(false);
    
    // Update order payment status
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: 'completed' })
      .eq('id', order?.id);

    if (error) {
      console.error('Error updating payment status:', error);
    }

    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully.",
    });

    await fetchOrder();
  };

  const handlePaymentFailure = (error: any) => {
    setShowPaymentDialog(false);
    toast({
      title: "Payment Failed",
      description: "There was an error processing your payment. Please try again.",
      variant: "destructive"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Order not found</h2>
            <Button onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const orderItems = order.order_items_data || [];
  const firstItem = orderItems[0] || {};
  const timeline = getOrderTimeline();
  const deliveryAddress = order.delivery_address || order.customer_details?.address || {};
  
  // Calculate price details
  const subtotal = orderItems.reduce((sum: number, item: any) => sum + (item.total_price || 0), 0);
  const listingPrice = subtotal * 1.3; // Assuming a markup
  const discount = listingPrice - subtotal;
  const totalFees = (order.shipping_charge || 0) + (order.tax_amount || 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">›</span>
          <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/profile')}>My Account</span>
          <span className="mx-2">›</span>
          <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/orders')}>My Orders</span>
          <span className="mx-2">›</span>
          <span className="text-foreground">{order.id.slice(0, 16)}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Manage Access */}
            <Card className="cursor-pointer hover:bg-accent/50">
              <CardContent className="p-4 flex items-center justify-between">
                <span className="font-medium">Manage who can access</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>

            {/* Tracking Info */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm mb-2">
                  Order can be tracked by <strong>8553352688</strong>.
                </p>
                <p className="text-sm text-muted-foreground">
                  Tracking link is shared via SMS.
                </p>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 mb-6">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {firstItem.image_url ? (
                      <img src={firstItem.image_url} alt={firstItem.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {firstItem.name || 'Product Name'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {firstItem.quantity || 1}, {firstItem.variant || 'Black'}
                    </p>
                    {firstItem.seller && (
                      <p className="text-sm text-muted-foreground">
                        Seller: {firstItem.seller}
                      </p>
                    )}
                    <p className="font-semibold text-lg mt-2">
                      ₹{firstItem.total_price || order.total_amount}
                    </p>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="space-y-3">
                  {timeline.slice(0, showAllUpdates ? timeline.length : 1).map((step, index) => (
                    <div key={index} className={`flex items-start gap-3 ${step.completed ? 'bg-green-50 p-3 rounded-lg' : ''}`}>
                      <div className="flex-shrink-0">
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className={`font-medium ${step.completed ? 'text-green-800' : ''}`}>
                            {step.label}
                          </span>
                          {step.date && <span className="text-sm text-muted-foreground">{step.date}</span>}
                        </div>
                        {step.message && (
                          <p className="text-sm text-muted-foreground mt-1">{step.message}</p>
                        )}
                        {step.time && (
                          <p className="text-sm text-muted-foreground">{step.time}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="link" 
                  className="mt-4 text-primary p-0"
                  onClick={() => setShowAllUpdates(!showAllUpdates)}
                >
                  {showAllUpdates ? 'Hide Updates' : 'See All Updates'} ›
                </Button>

                <Separator className="my-4" />

                <p className="text-sm text-muted-foreground">
                  Delivery Executive details will be available once the order is out for delivery
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {canCancelOrder(order.status) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex-1" disabled={cancelling}>
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Order & Request Refund?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will cancel your order and initiate a refund. The amount will be credited back to your original payment method within 5-7 business days.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Order</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelOrder} disabled={cancelling}>
                        {cancelling ? "Cancelling..." : "Cancel & Refund"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button variant="outline" className="flex-1 gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat with us
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Delivery Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 cursor-pointer hover:bg-accent/50 p-2 rounded-lg -m-2">
                  <Home className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Home</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {deliveryAddress.street_address || deliveryAddress.address || 'Address not available'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>

                <Separator />

                <div className="flex items-start gap-3 cursor-pointer hover:bg-accent/50 p-2 rounded-lg -m-2">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">
                      {order.customer_details?.name || user?.email?.split('@')[0] || 'Customer'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_details?.phone || '8553352688'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Price Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Listing price</span>
                  <span>₹{Math.round(listingPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Selling price</span>
                  <span>₹{Math.round(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Extra discount</span>
                  <span>-₹{Math.round(discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Special price</span>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <span>₹{Math.round(subtotal - (order.discount_amount || 0))}</span>
                </div>
                
                <button 
                  className="flex items-center justify-between w-full text-sm py-2"
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                >
                  <span className="text-muted-foreground">Total fees</span>
                  <div className="flex items-center gap-1">
                    <span>₹{Math.round(totalFees)}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showPriceBreakdown ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {showPriceBreakdown && (
                  <div className="pl-4 space-y-2 text-sm">
                    {order.shipping_charge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>₹{Math.round(order.shipping_charge)}</span>
                      </div>
                    )}
                    {order.tax_amount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>₹{Math.round(order.tax_amount)}</span>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total amount</span>
                  <span>₹{Math.round(order.total_amount)}</span>
                </div>

                <Separator />

                <div className="flex items-start gap-2 text-sm">
                  <div className="flex-1">
                    <span className="text-muted-foreground">Paid by</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {order.payment_method || 'Cash On Delivery'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;