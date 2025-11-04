import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Package, CheckCircle, User, ChevronRight, Home, XCircle, ChevronDown, Info, Download, Phone } from "lucide-react";
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
  status_history?: any[];
  cancellation_request?: any;
  cancellation_status?: string;
  cancellation_reason?: string;
  cancellation_requested_at?: string;
  refund_details?: any;
}
const OrderDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  useEffect(() => {
    if (user && id) {
      fetchOrder();
    }
  }, [user, id]);
  const fetchOrder = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('orders').select('*').eq('id', id).eq('customer_id', user?.id).single();
      if (error) throw error;

      // Fetch product details if order_items_data has product_id
      const orderItemsData = data.order_items_data as any[];
      if (orderItemsData && Array.isArray(orderItemsData) && orderItemsData.length > 0) {
        const productId = data.order_items_data[0].product_id;
        const colorName = data.order_items_data[0].color;
        const variantName = data.order_items_data[0].variant;
        
        if (productId) {
          const {
            data: productData
          } = await supabase.from('products').select('image_url, images, name, thumbnail, variants, color_variety').eq('id', productId).maybeSingle();
          
          if (productData) {
            // Add product image to order_items_data - prioritize thumbnail, then image_url, then images array
            data.order_items_data[0].image_url = productData.thumbnail || productData.image_url || productData.images && productData.images[0]?.url;
            
            // Find color hex code from color_variety first (doesn't require variant match)
            let colorHex = null;
            if (productData.color_variety && colorName) {
              const colorVariety = productData.color_variety as any;
              if (colorVariety.colors && Array.isArray(colorVariety.colors)) {
                const colorMatch = colorVariety.colors.find((c: any) => 
                  c.name?.toLowerCase() === colorName.toLowerCase()
                );
                if (colorMatch && colorMatch.hex) {
                  colorHex = colorMatch.hex;
                  console.log('✓ Color found in color_variety:', colorName, '→', colorHex);
                }
              }
            }
            
            // If not found in color_variety, try variants
            if (!colorHex && productData.variants && Array.isArray(productData.variants) && colorName && variantName) {
              const variant = (productData.variants as any[]).find((v: any) => v.name === variantName);
              if (variant && variant.colors && Array.isArray(variant.colors)) {
                const colorMatch = (variant.colors as any[]).find((c: any) => {
                  // Color format is like "White (#FFFFFF)" or just "White"
                  const colorNameInVariant = c.name?.split('(')[0].trim();
                  return colorNameInVariant?.toLowerCase() === colorName.toLowerCase();
                });
                
                if (colorMatch && colorMatch.name) {
                  // Extract hex code from format like "White (#FFFFFF)"
                  const hexMatch = colorMatch.name.match(/#([0-9A-Fa-f]{6})/);
                  if (hexMatch) {
                    colorHex = hexMatch[0];
                    console.log('✓ Color found in variants:', colorName, '→', colorHex);
                  }
                }
              }
            }
            
            // Set the color hex if found
            if (colorHex) {
              data.order_items_data[0].color_hex = colorHex;
            } else {
              console.warn('✗ No color hex found for:', { 
                orderId: data.id, 
                color: colorName, 
                variant: variantName,
                productId: productId 
              });
            }
          }
        }
      }

      // Fetch customer profile for name
      const {
        data: customerProfile
      } = await supabase.from('profiles').select('first_name, last_name').eq('user_id', data.customer_id).single();
      const orderWithName = {
        ...data,
        customer_name: customerProfile ? `${customerProfile.first_name || ''} ${customerProfile.last_name || ''}`.trim() : undefined,
        status_history: data.status_history as any[] || []
      };
      setOrder(orderWithName as Order);

      // Fetch transaction details for this order
      try {
        const {
          data: transactionData
        } = (await supabase.from('transactions' as any).select('*').eq('user_id', user?.id).order('created_at', {
          ascending: false
        })) as any;
        if (transactionData && transactionData.length > 0) {
          // Find transaction with order ID in payu_response
          const orderTransaction = transactionData.find((t: any) => t.payu_response?.order_id === id);
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
              customer_email: orderTransaction.customer_email
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
    
    const statusHistory = (order.status_history as any[]) || [];
    const currentStatus = order.status.toLowerCase();
    
    // Define the order flow steps
    const steps = [
      { key: 'placed', label: 'Order Placed' },
      { key: 'confirmed', label: 'Order Confirmed' },
      { key: 'packed', label: 'Order Packed' },
      { key: 'shipped', label: 'In Transit' },
      { key: 'out_for_delivery', label: 'Out for Delivery' },
      { key: 'delivered', label: 'Delivered' }
    ];
    
    const timeline = steps.map(step => {
      // Check if this status exists in history
      const historyEntry = statusHistory.find((h: any) => h.status?.toLowerCase() === step.key);
      
      // For 'placed', use created_at if not in history
      let timestamp = '';
      if (step.key === 'placed') {
        timestamp = order.created_at;
      } else if (historyEntry?.timestamp) {
        timestamp = historyEntry.timestamp;
      }
      
      // A step is completed if:
      // 1. It has a timestamp in history, OR
      // 2. It's 'placed' (always completed as it's the start)
      const isCompleted = (step.key === 'placed') || !!historyEntry;
      
      return {
        label: step.label,
        date: isCompleted && timestamp ? format(new Date(timestamp), 'MM/dd/yyyy, h:mm:ss a') : '',
        completed: isCompleted
      };
    });
    
    return timeline;
  };
  const handleCancelOrder = async (reason: string) => {
    if (!order || !user || !reason.trim()) {
      toast({
        title: "Cancellation Failed",
        description: "Please provide a reason for cancellation.",
        variant: "destructive"
      });
      return;
    }
    
    setCancelling(true);
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          cancellation_request: {
            reason: reason,
            requested_by: user.id,
            requested_at: new Date().toISOString()
          },
          cancellation_status: 'pending',
          cancellation_reason: reason,
          cancellation_requested_at: new Date().toISOString()
        })
        .eq('id', order.id)
        .eq('customer_id', user.id);

      if (updateError) throw updateError;

      // Immediately update local state to show the cancellation status
      setOrder(prev => prev ? {
        ...prev,
        cancellation_status: 'pending',
        cancellation_reason: reason,
        cancellation_requested_at: new Date().toISOString(),
        cancellation_request: {
          reason: reason,
          requested_by: user.id,
          requested_at: new Date().toISOString()
        }
      } : null);

      toast({
        title: "Cancellation Request Submitted",
        description: "Your cancellation request has been submitted and is waiting for admin approval."
      });
      
      // Also refresh from database to ensure sync
      await fetchOrder();
    } catch (error) {
      console.error('Error submitting cancellation request:', error);
      toast({
        title: "Cancellation Failed",
        description: "Unable to submit cancellation request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCancelling(false);
    }
  };
  const canCancelOrder = (status: string, cancellationStatus?: string) => {
    // Can't cancel if already cancelled or delivered
    if (['cancelled', 'delivered'].includes(status.toLowerCase())) return false;
    
    // Can't submit new request if one is already pending
    if (cancellationStatus === 'pending') return false;
    
    // Can cancel if status is placed, confirmed, or processing
    return ['placed', 'confirmed', 'processing', 'pending'].includes(status.toLowerCase());
  };
  const handlePaymentSuccess = async (paymentData: any) => {
    setShowPaymentDialog(false);

    // Update order payment status
    const {
      error
    } = await supabase.from('orders').update({
      payment_status: 'completed'
    }).eq('id', order?.id);
    if (error) {
      console.error('Error updating payment status:', error);
    }
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully."
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
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading order details...</div>
        </div>
      </div>;
  }
  if (!order) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Order not found</h2>
            <Button onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          </div>
        </div>
      </div>;
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
  return <div className="min-h-screen bg-background">
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
          {/* Left Column - Order Details, Cancellation, Refund */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Cancelled Status Card - Show when approved */}
            {order.cancellation_status === 'approved' && order.status === 'cancelled' && (
              <div className="bg-white p-6">
                <div className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-red-900">
                      Order Cancelled - Admin Approved
                    </span>
                    <span className="text-sm text-red-700">
                      Cancellation Reason: {order.cancellation_reason || 'Not specified'}
                    </span>
                    {order.cancellation_requested_at && (
                      <span className="text-xs text-red-600 mt-1">
                        Requested on {format(new Date(order.cancellation_requested_at), 'MMM dd, yyyy h:mm a')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Refund Information Card - Show when payment status is refunded or refund_details exists */}
            {(order.payment_status === 'refunded' || order.refund_details) && (
              <div className="bg-white p-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold text-green-900 text-base mb-2">Refund Processed</h3>
                      <div className="space-y-2 text-sm text-green-800">
                        <div className="flex justify-between">
                          <span>Refund Amount:</span>
                          <span className="font-semibold">₹{order.refund_details?.amount ? parseFloat(order.refund_details.amount).toLocaleString('en-IN') : Number(order.total_amount).toLocaleString('en-IN')}</span>
                        </div>
                        {order.refund_details?.transaction_id && (
                          <div className="flex justify-between">
                            <span>Transaction ID:</span>
                            <span className="font-mono text-xs">{order.refund_details.transaction_id}</span>
                          </div>
                        )}
                        {order.refund_details?.refund_date && (
                          <div className="flex justify-between">
                            <span>Refund Date:</span>
                            <span>{format(new Date(order.refund_details.refund_date), 'MMM dd, yyyy')}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge variant="default" className="bg-green-600">
                            {order.refund_details?.status || 'Processing'}
                          </Badge>
                        </div>
                        <p className="text-xs mt-2 pt-2 border-t border-green-300">
                          Refund will be credited to your original payment method within 5-7 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cancellation Pending Card */}
            {order.cancellation_status === 'pending' && (
              <div className="bg-white p-6">
                <div className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </div>
                    <Info className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-yellow-900">
                      Cancellation Request Pending
                    </span>
                    <span className="text-sm text-yellow-700">
                      Waiting for admin approval
                    </span>
                    {order.cancellation_reason && (
                      <span className="text-xs text-yellow-600 mt-1">
                        Reason: {order.cancellation_reason}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Rejected Cancellation Card */}
            {order.cancellation_status === 'rejected' && (
              <div className="bg-white p-6">
                <div className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-sm">
                  <XCircle className="w-6 h-6 text-gray-600" />
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-gray-900">
                      Cancellation Request Rejected
                    </span>
                    <span className="text-sm text-gray-700">
                      Your cancellation request was not approved
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Your Orders Section */}
            <div className="bg-white p-6 border">
              <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

              {/* Product Card */}
              <div className="bg-white border-b pb-6 mb-6">
                <div className="flex gap-6">
                  <div className="w-52 h-52 bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={firstItem.image_url || heroScooter} alt={firstItem.name || 'Product'} className="w-full h-full object-cover" />
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
                      <div className="w-5 h-5" style={{
                      backgroundColor: firstItem.color_hex || '#000000'
                    }} />
                    </div>
                    <p className="text-3xl font-bold pt-2">
                      ₹{parseFloat(order.total_amount.toString()).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="space-y-0">
                {timeline.map((step, index) => <div key={index} className="flex items-start gap-4 relative">
                    {/* Vertical line */}
                    {index < timeline.length - 1 && <div className={`absolute left-3 top-8 w-0.5 h-16 ${step.completed ? 'bg-foreground' : 'bg-border'}`} />}
                    
                    <div className="flex-shrink-0 z-10">
                      {step.completed ? <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-background" />
                        </div> : <div className="w-7 h-7 rounded-full border-2 border-border bg-background" />}
                    </div>
                    
                    <div className="flex-1 pb-16">
                      <p className={`font-semibold text-base ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {step.date && <p className="text-sm text-muted-foreground mt-1">{step.date}</p>}
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white border p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                {/* Cancel Order Button - Only show if can cancel */}
                {canCancelOrder(order.status, order.cancellation_status) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="gap-2 px-8 rounded-none border-red-500 text-red-500 hover:bg-red-50">
                        <XCircle className="w-5 h-5" />
                        Cancel Order
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order Request</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                          <p>Your cancellation request will be sent to our admin team for review.</p>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                              Reason for cancellation <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Please tell us why you want to cancel this order..."
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                            />
                          </div>
                          <div className="bg-blue-50 p-3 rounded-md text-sm">
                            <p className="font-medium text-blue-900 mb-1">What happens next?</p>
                            <ul className="text-blue-800 space-y-1 ml-4 list-disc">
                              <li>Request sent to admin team</li>
                              <li>Admin reviews within 24 hours</li>
                              <li>If approved, refund processed in 5-7 days</li>
                              <li>You'll be notified of the decision</li>
                            </ul>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCancelReason("")}>
                          Keep Order
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleCancelOrder(cancelReason);
                            setCancelReason("");
                          }}
                          disabled={!cancelReason.trim() || cancelling}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          {cancelling ? "Submitting..." : "Submit Cancellation"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {/* WhatsApp Support Button */}
                <Button 
                  variant="outline" 
                  className="gap-2 px-8 rounded-none border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                >
                  <Phone className="w-5 h-5" />
                  WhatsApp Support
                </Button>
              </div>
            </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 sticky top-32 self-start z-10">
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
              <h3 className="text-lg font-bold mb-6">Order Sumarry</h3>
              
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

                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Payment Status</span>
                    <Badge 
                      variant={
                        (order.payment_status === 'completed' || order.payment_status === 'success' || transaction?.status === 'success') 
                          ? 'default' 
                          : (order.payment_status === 'pending' || !order.payment_status) 
                            ? 'secondary' 
                            : 'destructive'
                      }
                      className="font-medium"
                    >
                      {(order.payment_status === 'completed' || order.payment_status === 'success' || transaction?.status === 'success') 
                        ? 'Payment Completed' 
                        : (order.payment_status === 'failed' || transaction?.status === 'failed')
                          ? 'Payment Failed'
                          : 'Payment Pending'}
                    </Badge>
                  </div>
                  {transaction && (
                    <div className="text-xs text-muted-foreground">
                      Transaction ID: {transaction.transaction_id || transaction.payment_id}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4">
                  <div className="flex items-center justify-between text-base mb-6">
                    <span className="font-semibold">Paid by</span>
                    <span className="font-medium">
                      {order.payment_method === 'payu' ? 'PayU' : order.payment_method === 'cod' ? 'Cash On Delivery' : order.payment_method || 'Not specified'}
                    </span>
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
    </div>;
};
export default OrderDetails;