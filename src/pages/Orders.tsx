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
import { Package, Search, Star, CheckCircle, Clock, User, ChevronRight, LogOut } from "lucide-react";
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
  const { user, signOut } = useAuth();
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

  const handleLogout = async () => {
    await signOut();
    navigate("/");
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
        <div className="flex gap-6">
          {/* Sidebar - Same as Profile page */}
          <aside className="w-80 flex-shrink-0">
            <nav className="flex flex-col gap-[15px]">
              {/* Account Settings Section */}
              <div className="bg-white">
                <div className="flex items-center gap-3 px-6 py-4 border-b">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-lg text-gray-700">ACCOUNT SETTINGS</span>
                </div>
                
                <div className="space-y-0">
                  <button
                    onClick={() => navigate("/profile?section=profile")}
                    className="w-full text-left px-6 py-4 text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Profile information
                  </button>
                  <button
                    onClick={() => navigate("/profile?section=address")}
                    className="w-full text-left px-6 py-4 text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Manage Addresses
                  </button>
                  <button
                    onClick={() => navigate("/profile?section=pan")}
                    className="w-full text-left px-6 py-4 text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    ID Proof
                  </button>
                </div>
              </div>

              {/* My Orders */}
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left bg-orange-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="font-semibold text-lg text-orange-500">MY ORDERS</span>
                </div>
                <ChevronRight className="w-5 h-5 text-orange-500" />
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-orange-500" />
                </div>
                <span className="font-semibold text-lg text-gray-700">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white p-8 rounded-none">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
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
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const orderItems = order.order_items_data || [];
                  const firstItem = orderItems[0];
                  const deliveryDate = order.estimated_delivery_date || order.created_at;
                  
                  return (
                    <div key={order.id} className="border-b pb-6 last:border-0">
                      {/* Delivery Date Header */}
                      <div className="mb-4">
                        <h3 className="font-bold text-base">
                          Delivered on {format(new Date(deliveryDate), 'MMM dd, yyyy')}
                        </h3>
                      </div>

                      {/* Product Card */}
                      <div className="flex gap-6 items-start">
                        {/* Product Image */}
                        <div className="w-28 h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          {firstItem?.image_url ? (
                            <img 
                              src={firstItem.image_url} 
                              alt={firstItem.name || "Product"} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-1">
                            {firstItem?.name || 'Product'}
                          </h4>
                          <p className="text-sm text-gray-500 mb-1">
                            Return or Replace: Eligible through {format(new Date(new Date(deliveryDate).getTime() + 15 * 24 * 60 * 60 * 1000), 'MMM dd, yyyy')}
                          </p>
                          {firstItem?.variant && (
                            <p className="text-sm text-gray-700 mb-1">
                              Variant : <span className="font-medium">{firstItem.variant}</span>
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-700">Colour :</span>
                            <span className="font-medium">{firstItem?.color || 'Black'}</span>
                            <div className="w-4 h-4 bg-black rounded-full border border-gray-300"></div>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="text-right">
                          <div className="text-2xl font-bold mb-4">
                            ₹{parseFloat(order.total_amount.toString()).toLocaleString('en-IN')}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              className="rounded-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle view invoice
                              }}
                            >
                              View Invoice
                            </Button>
                            <Button 
                              className="bg-orange-500 hover:bg-orange-600 rounded-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewOrder(order.id);
                              }}
                            >
                              View Order
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
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