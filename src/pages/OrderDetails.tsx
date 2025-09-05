import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  CreditCard,
  User,
  Calendar
} from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
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
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Error fetching order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (status: string) => {
    const statusMap: { [key: string]: number } = {
      'pending': 20,
      'confirmed': 40,
      'processing': 60,
      'shipped': 80,
      'delivered': 100,
      'cancelled': 0
    };
    return statusMap[status.toLowerCase()] || 0;
  };

  const getStatusSteps = () => [
    { 
      status: 'pending', 
      label: 'Order Placed', 
      icon: Clock,
      description: 'Your order has been received'
    },
    { 
      status: 'confirmed', 
      label: 'Confirmed', 
      icon: CheckCircle,
      description: 'Order confirmed and being prepared'
    },
    { 
      status: 'processing', 
      label: 'Processing', 
      icon: Package,
      description: 'Your items are being packed'
    },
    { 
      status: 'shipped', 
      label: 'Shipped', 
      icon: Truck,
      description: 'Your order is on the way'
    },
    { 
      status: 'delivered', 
      label: 'Delivered', 
      icon: CheckCircle,
      description: 'Order delivered successfully'
    }
  ];

  const isStepCompleted = (stepStatus: string, currentStatus: string) => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const stepIndex = steps.indexOf(stepStatus);
    const currentIndex = steps.indexOf(currentStatus.toLowerCase());
    return stepIndex <= currentIndex;
  };

  const isStepCurrent = (stepStatus: string, currentStatus: string) => {
    return stepStatus === currentStatus.toLowerCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <Button onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();
  const progress = getStatusProgress(order.status);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/orders')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="text-muted-foreground">Order #{order.id.slice(-8)}</p>
            </div>
          </div>

          {/* Order Status Progress */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Status Steps */}
                <div className="space-y-4">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const completed = isStepCompleted(step.status, order.status);
                    const current = isStepCurrent(step.status, order.status);
                    
                    return (
                      <div key={step.status} className="flex items-start gap-4">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center border-2
                          ${completed 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : current
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                          }
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${completed || current ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                          {current && (
                            <Badge className="mt-1" variant="default">
                              Current Status
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                {order.order_items_data && Array.isArray(order.order_items_data) && order.order_items_data.length > 0 ? (
                  <div className="space-y-4">
                    {order.order_items_data.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <div className="font-medium">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{order.order_summary?.subtotal || '0.00'}</span>
                      </div>
                      {order.shipping_charge && (
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>₹{parseFloat(order.shipping_charge.toString()).toFixed(2)}</span>
                        </div>
                      )}
                      {order.tax_amount && (
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>₹{parseFloat(order.tax_amount.toString()).toFixed(2)}</span>
                        </div>
                      )}
                      {order.discount_amount && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-₹{parseFloat(order.discount_amount.toString()).toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{parseFloat(order.total_amount.toString()).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No items found</p>
                )}
              </CardContent>
            </Card>

            {/* Order Information */}
            <div className="space-y-6">
              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {order.customer_details ? (
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {order.customer_details.firstName} {order.customer_details.lastName}</p>
                      <p><strong>Email:</strong> {order.customer_details.email}</p>
                      <p><strong>Phone:</strong> {order.customer_details.phone}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No customer details available</p>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {order.delivery_address ? (
                    <div className="space-y-1">
                      <p>{order.delivery_address.streetAddress}</p>
                      {order.delivery_address.apartmentUnit && (
                        <p>{order.delivery_address.apartmentUnit}</p>
                      )}
                      <p>{order.delivery_address.city}, {order.delivery_address.stateProvince}</p>
                      <p>{order.delivery_address.postalCode}</p>
                      <p>{order.delivery_address.country}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No delivery address available</p>
                  )}
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Method:</strong> {order.payment_method || 'Not specified'}</p>
                    <p><strong>Status:</strong> 
                      <Badge className="ml-2" variant={order.payment_details?.status === 'paid' ? 'default' : 'secondary'}>
                        {order.payment_details?.status || 'Pending'}
                      </Badge>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Order Date:</strong> {format(new Date(order.created_at), 'PPP')}</p>
                    {order.estimated_delivery_date && (
                      <p><strong>Estimated Delivery:</strong> {format(new Date(order.estimated_delivery_date), 'PPP')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;