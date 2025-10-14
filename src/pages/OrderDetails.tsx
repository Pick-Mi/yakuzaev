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
  Info,
  Download
} from "lucide-react";
import Header from "@/components/Header";
import PayUPayment from "@/components/PayUPayment";
import heroScooter from "@/assets/hero-scooter.png";

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
  order_number?: number;
  order_type?: string;
  customer_id?: string;
  customer_name?: string;
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
      
      // Fetch product details if order_items_data has product_id
      const orderItemsData = data.order_items_data as any[];
      if (orderItemsData && Array.isArray(orderItemsData) && orderItemsData.length > 0) {
        const productId = data.order_items_data[0].product_id;
        if (productId) {
          const { data: productData } = await supabase
            .from('products')
            .select('image_url, images, name, thumbnail')
            .eq('id', productId)
            .single();
          
          if (productData) {
            // Add product image to order_items_data - prioritize thumbnail, then image_url, then images array
            data.order_items_data[0].image_url = productData.thumbnail || 
              productData.image_url || 
              (productData.images && productData.images[0]?.url);
          }
        }
      }
      
      // Fetch customer profile for name
      const { data: customerProfile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', data.customer_id)
        .single();
      
      const orderWithName = {
        ...data,
        customer_name: customerProfile 
          ? `${customerProfile.first_name || ''} ${customerProfile.last_name || ''}`.trim()
          : undefined
      };
      
      setOrder(orderWithName);

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
    
    // Order Placed
    timeline.push({
      label: 'Order Placed',
      date: format(orderDate, 'MM/dd/yyyy, h:mm:ss a'),
      completed: true,
    });

    // Order Confirmed
    const confirmedDate = new Date(orderDate.getTime() + 60000); // 1 minute later
    timeline.push({
      label: 'Order Confirmed',
      date: format(confirmedDate, 'MM/dd/yyyy, h:mm:ss a'),
      completed: order.status !== 'pending',
    });

    // Order Packed
    const packedDate = new Date(confirmedDate.getTime() + 5000); // 5 seconds later
    timeline.push({
      label: 'Order Packed',
      date: format(packedDate, 'MM/dd/yyyy, h:mm:ss a'),
      completed: ['processing', 'shipped', 'delivered'].includes(order.status),
    });

    // In Transit
    timeline.push({
      label: 'In Transit',
      date: order.status === 'shipped' ? format(new Date(), 'MM/dd/yyyy, h:mm:ss a') : '',
      completed: false,
    });

    // Out for Delivery
    timeline.push({
      label: 'Out for Delivery',
      date: '',
      completed: false,
    });

    // Delivered
    timeline.push({
      label: 'Delivered',
      date: '',
      completed: order.status === 'delivered',
    });

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
  
  // Calculate price details from order_summary if available
  const orderSummary = order.order_summary || {};
  const listingPrice = orderSummary.listing_price || order.total_amount;
  const sellingPrice = orderSummary.selling_price || 381;
  const extraDiscount = orderSummary.extra_discount || 82;
  const specialPrice = orderSummary.special_price || 299;
  const otherDiscount = orderSummary.other_discount || 22;
  const totalFees = orderSummary.total_fees || (order.shipping_charge || 0) + (order.tax_amount || 0) || 10;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-32 pb-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/orders')}>My Orders</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">OD{order.order_number || order.id.slice(0, 12)}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 bg-white p-6">
            <h1 className="text-3xl font-bold">Your Orders</h1>

            {/* Product Card */}
            <div className="bg-white border-b p-6">
              <div className="flex gap-6">
                <div className="w-52 h-52 bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img 
                    src={firstItem.image_url || heroScooter} 
                    alt={firstItem.name || 'Product'} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <h2 className="text-2xl font-semibold">
                    {firstItem.product_name || firstItem.name || 'Product'}
                  </h2>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {order.order_type === 'test_ride' ? 'Book a Bike' : order.order_type === 'purchase' ? 'Book a Buy' : 'Order'}
                  </div>
                  <p className="text-sm">
                    <span className="text-foreground">Variant : </span>
                    <span className="font-medium">{firstItem.variant || 'YAKUZA NEU 43V'}</span>
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground">Colour :</span>
                    <span className="font-medium">{firstItem.color || 'Blue'}</span>
                    <div 
                      className="w-5 h-5 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: firstItem.color_hex || '#000000' }}
                    />
                  </div>
                  <p className="text-3xl font-bold pt-2">
                    ₹{parseFloat(order.total_amount.toString()).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="space-y-0">
              {timeline.map((step, index) => (
                <div key={index} className="flex items-start gap-4 relative">
                  {/* Vertical line */}
                  {index < timeline.length - 1 && (
                    <div className={`absolute left-3 top-8 w-0.5 h-16 ${
                      step.completed ? 'bg-foreground' : 'bg-border'
                    }`} />
                  )}
                  
                  <div className="flex-shrink-0 z-10">
                    {step.completed ? (
                      <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-background" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-border bg-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-16">
                    <p className={`font-semibold text-base ${
                      step.completed ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-sm text-muted-foreground mt-1">{step.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Button */}
            <div className="flex justify-center pt-4">
              <Button variant="outline" className="gap-2 px-8 rounded-none">
                <MessageCircle className="w-5 h-5" />
                Chat with us
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Delivery Details */}
            <div className="bg-white border p-6">
              <h3 className="text-lg font-bold mb-6">Delivery details</h3>
              
              <div className="bg-gray-50 p-6 space-y-6">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-foreground mt-1" />
                  <div className="flex-1">
                    <span className="font-semibold">Home </span>
                    <span className="text-foreground">
                      {deliveryAddress.street_address || deliveryAddress.address || 'Athiyandal SLR Camp Athiyandal'} {deliveryAddress.postal_code || ''},{deliveryAddress.city || 'Vembu'}..
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-foreground mt-1" />
                  <div className="flex-1">
                    <span className="font-semibold">
                      {order.customer_name || `${order.customer_details?.first_name || ''} ${order.customer_details?.last_name || ''}`.trim() || 'Customer'}
                    </span>
                    <span className="text-foreground ml-2">
                      {order.customer_details?.phone || order.customer_details?.mobile || ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-white border p-6">
              <h3 className="text-lg font-bold mb-6">Delivery details</h3>
              
              <div className="bg-gray-50 p-6 space-y-4">
                <div className="flex justify-between text-base">
                  <span className="text-foreground">Product price</span>
                  <span className="font-medium">₹{parseFloat(order.total_amount.toString()).toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between text-base">
                  <span className="text-foreground">Discount</span>
                  <span className="font-medium">₹{order.discount_amount || 0}</span>
                </div>
                
                <div className="flex justify-between text-base">
                  <span className="text-foreground">Sub Total</span>
                  <span className="font-medium">₹{parseFloat(order.total_amount.toString()).toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

                <div className="flex justify-between text-base font-bold">
                  <span>Total amount</span>
                  <span>₹{parseFloat(order.total_amount.toString()).toLocaleString('en-IN')}</span>
                </div>

                <div className="mt-6 pt-4">
                  <div className="flex justify-center mb-6">
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {order.payment_method === 'payu' ? 'PayU' : order.payment_method === 'cod' ? 'Cash On Delivery' : order.payment_method || 'Not specified'}
                    </Badge>
                  </div>

                  <Button variant="outline" className="w-full gap-2 rounded-none">
                    <Download className="w-5 h-5" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;