import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Package, Search, Star, CheckCircle, Clock } from "lucide-react";
import Header from "@/components/Header";

interface Order {
  id: string;
  order_number?: number;
  created_at: string;
  total_amount: number;
  status: string;
  payment_status?: string;
  order_items_data?: any;
  customer_details?: any;
  estimated_delivery_date?: string;
}

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [statusFilters, setStatusFilters] = useState({
    onTheWay: false,
    delivered: false,
    cancelled: false,
    returned: false,
  });
  
  const [timeFilters, setTimeFilters] = useState({
    last30Days: false,
    year2025: false,
    year2024: false,
    year2023: false,
    year2022: false,
    year2021: false,
    older: false,
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [orders, searchQuery, statusFilters, timeFilters]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.order_number && order.order_number.toString().includes(searchQuery)) ||
        (order.order_items_data && JSON.stringify(order.order_items_data).toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filters
    const activeStatusFilters = Object.entries(statusFilters)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => {
        switch(key) {
          case 'onTheWay': return ['shipped', 'processing', 'pending', 'confirmed'];
          case 'delivered': return ['delivered'];
          case 'cancelled': return ['cancelled'];
          case 'returned': return ['returned'];
          default: return [];
        }
      })
      .flat();

    if (activeStatusFilters.length > 0) {
      filtered = filtered.filter(order => 
        activeStatusFilters.includes(order.status.toLowerCase())
      );
    }

    // Apply time filters
    const now = new Date();
    const activeTimeFilters = Object.entries(timeFilters)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key);

    if (activeTimeFilters.length > 0) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        const orderYear = orderDate.getFullYear();
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

        return activeTimeFilters.some(filter => {
          switch(filter) {
            case 'last30Days': return daysDiff <= 30;
            case 'year2025': return orderYear === 2025;
            case 'year2024': return orderYear === 2024;
            case 'year2023': return orderYear === 2023;
            case 'year2022': return orderYear === 2022;
            case 'year2021': return orderYear === 2021;
            case 'older': return orderYear < 2021;
            default: return false;
          }
        });
      });
    }

    setFilteredOrders(filtered);
  };

  const handleStatusFilterChange = (filter: keyof typeof statusFilters) => {
    setStatusFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleTimeFilterChange = (filter: keyof typeof timeFilters) => {
    setTimeFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'confirmed':
      case 'processing':
      case 'shipped':
        return 'text-blue-600';
      case 'delivered':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      case 'returned':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'confirmed':
      case 'processing':
        return 'On the way';
      case 'shipped':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Refund Cancelled';
      case 'returned':
        return 'Returned';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getPaymentStatusBadge = (paymentStatus?: string) => {
    if (!paymentStatus) return null;
    
    const status = paymentStatus.toLowerCase();
    const isPaid = status === 'completed' || status === 'paid';
    
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
        isPaid 
          ? 'bg-green-100 text-green-700 border border-green-200' 
          : 'bg-orange-100 text-orange-700 border border-orange-200'
      }`}>
        {isPaid ? (
          <>
            <CheckCircle className="w-3.5 h-3.5" />
            Payment Done
          </>
        ) : (
          <>
            <Clock className="w-3.5 h-3.5" />
            Payment Pending
          </>
        )}
      </div>
    );
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-40 pb-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-40 pb-8">
        <div className="mb-6">
          <nav className="text-sm text-muted-foreground mb-4">
            <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="mx-2">›</span>
            <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/profile')}>My Account</span>
            <span className="mx-2">›</span>
            <span className="text-foreground">My Orders</span>
          </nav>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Status */}
                <div>
                  <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">Order Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="onTheWay" 
                        checked={statusFilters.onTheWay}
                        onCheckedChange={() => handleStatusFilterChange('onTheWay')}
                      />
                      <label htmlFor="onTheWay" className="text-sm cursor-pointer">On the way</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="delivered" 
                        checked={statusFilters.delivered}
                        onCheckedChange={() => handleStatusFilterChange('delivered')}
                      />
                      <label htmlFor="delivered" className="text-sm cursor-pointer">Delivered</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cancelled" 
                        checked={statusFilters.cancelled}
                        onCheckedChange={() => handleStatusFilterChange('cancelled')}
                      />
                      <label htmlFor="cancelled" className="text-sm cursor-pointer">Cancelled</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="returned" 
                        checked={statusFilters.returned}
                        onCheckedChange={() => handleStatusFilterChange('returned')}
                      />
                      <label htmlFor="returned" className="text-sm cursor-pointer">Returned</label>
                    </div>
                  </div>
                </div>

                {/* Order Time */}
                <div>
                  <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">Order Time</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="last30Days" 
                        checked={timeFilters.last30Days}
                        onCheckedChange={() => handleTimeFilterChange('last30Days')}
                      />
                      <label htmlFor="last30Days" className="text-sm cursor-pointer">Last 30 days</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="year2025" 
                        checked={timeFilters.year2025}
                        onCheckedChange={() => handleTimeFilterChange('year2025')}
                      />
                      <label htmlFor="year2025" className="text-sm cursor-pointer">2025</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="year2024" 
                        checked={timeFilters.year2024}
                        onCheckedChange={() => handleTimeFilterChange('year2024')}
                      />
                      <label htmlFor="year2024" className="text-sm cursor-pointer">2024</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="year2023" 
                        checked={timeFilters.year2023}
                        onCheckedChange={() => handleTimeFilterChange('year2023')}
                      />
                      <label htmlFor="year2023" className="text-sm cursor-pointer">2023</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="year2022" 
                        checked={timeFilters.year2022}
                        onCheckedChange={() => handleTimeFilterChange('year2022')}
                      />
                      <label htmlFor="year2022" className="text-sm cursor-pointer">2022</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="year2021" 
                        checked={timeFilters.year2021}
                        onCheckedChange={() => handleTimeFilterChange('year2021')}
                      />
                      <label htmlFor="year2021" className="text-sm cursor-pointer">2021</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="older" 
                        checked={timeFilters.older}
                        onCheckedChange={() => handleTimeFilterChange('older')}
                      />
                      <label htmlFor="older" className="text-sm cursor-pointer">Older</label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search Bar */}
            <div className="mb-6 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search your orders here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="px-8">
                <Search className="w-4 h-4 mr-2" />
                Search Orders
              </Button>
            </div>
            
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">
                    {orders.length === 0 ? "No orders yet" : "No orders found"}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {orders.length === 0 
                      ? "You haven't placed any orders yet." 
                      : "Try adjusting your filters or search query."}
                  </p>
                  {orders.length === 0 && (
                    <Button onClick={() => navigate('/')}>
                      Start Shopping
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const orderItems = order.order_items_data || [];
                  const firstItem = orderItems[0];
                  
                  return (
                    <Card 
                      key={order.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            {firstItem?.image_url ? (
                              <img 
                                src={firstItem.image_url} 
                                alt={firstItem.name || "Product"} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-12 h-12 text-muted-foreground" />
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">
                                  {firstItem?.name || 'Product'}
                                </h3>
                                {order.order_number && (
                                  <p className="text-sm text-muted-foreground">
                                    Order #{order.order_number.toString().padStart(4, '0')}
                                  </p>
                                )}
                                {firstItem?.variant && (
                                  <p className="text-sm text-muted-foreground">
                                    Color: {firstItem.variant}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-lg">
                                  ₹{parseFloat(order.total_amount.toString()).toFixed(0)}
                                </div>
                              </div>
                            </div>

                            {/* Status and Payment */}
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex-1">
                                <div className={`flex items-center gap-1 font-medium ${getStatusColor(order.status)}`}>
                                  <div className="w-2 h-2 rounded-full bg-current"></div>
                                  <span>
                                    {getStatusText(order.status)}
                                    {order.status.toLowerCase() === 'delivered' && order.estimated_delivery_date && 
                                      ` on ${format(new Date(order.estimated_delivery_date), 'MMM dd')}`
                                    }
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Your item has been {order.status.toLowerCase() === 'delivered' ? 'delivered' : 'ordered'}
                                </p>
                              </div>
                              
                              {/* Payment Status Badge */}
                              <div className="ml-4">
                                {getPaymentStatusBadge(order.payment_status)}
                              </div>
                            </div>
                            
                            {/* Order Date and View Details */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Order Date: {format(new Date(order.created_at), 'MMM dd, yyyy')}</span>
                              </div>
                              
                              <button 
                                className="text-primary flex items-center gap-1 text-sm hover:underline font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOrder(order.id);
                                }}
                              >
                                View Details
                                <Star className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Orders;