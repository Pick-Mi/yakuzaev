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
import { Package, Search, Star, CheckCircle, Clock, User, ChevronRight, LogOut, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";

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
  order_type?: string;
}

const Orders = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
      
      // Fetch product details for each order
      const ordersWithProducts = await Promise.all((data || []).map(async (order) => {
        const orderItemsData = order.order_items_data as any[];
        if (orderItemsData && Array.isArray(orderItemsData) && orderItemsData.length > 0) {
          const productId = orderItemsData[0].product_id;
          const colorName = orderItemsData[0].color;
          const variantName = orderItemsData[0].variant;
          
          if (productId) {
            const { data: productData } = await supabase
              .from('products')
              .select('thumbnail, image_url, images, name, variants, color_variety')
              .eq('id', productId)
              .maybeSingle();
            
            if (productData) {
              // Add product thumbnail to order_items_data
              order.order_items_data[0].image_url = productData.thumbnail || 
                productData.image_url || 
                (productData.images && productData.images[0]?.url);
              order.order_items_data[0].product_name = order.order_items_data[0].product_name || productData.name;
              
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
                order.order_items_data[0].color_hex = colorHex;
              } else {
                console.warn('✗ No color hex found for:', { 
                  orderId: order.id, 
                  color: colorName, 
                  variant: variantName,
                  productId: productId 
                });
              }
            }
          }
        }
        return order;
      }));
      
      setOrders(ordersWithProducts);
      setFilteredOrders(ordersWithProducts);
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`container mx-auto ${isMobile ? 'px-0 pt-[60px]' : 'px-4 pt-40'} pb-8`}>
        {isMobile ? (
          // Mobile Layout
          <div className="space-y-0">
            {/* Breadcrumb Header */}
            <div className="fixed top-[60px] left-0 right-0 z-50 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <button onClick={() => navigate('/profile')} className="hover:text-gray-900">
                  Profile
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-semibold">Order List</span>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-gray-50 mt-[52px] px-4 py-6 space-y-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white rounded-lg">
                  <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">
                    {orders.length === 0 ? "No orders yet" : "No orders found"}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {orders.length === 0 
                      ? "You haven't placed any orders yet." 
                      : "Try adjusting your filters or search query."}
                  </p>
                  {orders.length === 0 && (
                    <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600">
                      Start Shopping
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {filteredOrders.map((order) => {
                    const orderItems = order.order_items_data || [];
                    const firstItem = orderItems[0];
                    const deliveryDate = order.estimated_delivery_date || order.created_at;
                    
                    return (
                      <div key={order.id} className="bg-white rounded-lg p-4">
                        {/* Delivery Date Header */}
                        <div className="mb-4">
                          <h3 className="font-bold text-xl text-gray-900">
                            Delivered on {format(new Date(deliveryDate), 'MMM dd, yyyy')}
                          </h3>
                        </div>

                        {/* Product Card */}
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="w-full flex gap-4 items-start text-left"
                        >
                          {/* Product Image */}
                          <div className="w-[188px] h-[188px] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
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
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-2xl mb-3 text-gray-900">
                              {firstItem?.product_name || firstItem?.name || 'Product'}
                            </h4>
                            <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-500 text-base font-semibold mb-3 rounded">
                              {order.order_type === 'test_ride' ? 'Book a Bike' : order.order_type === 'purchase' ? 'Book a Buy' : 'Order'}
                            </div>
                            {firstItem?.variant && (
                              <p className="text-base text-gray-700 mb-2">
                                Variant : <span className="font-semibold">{firstItem.variant}</span>
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-base">
                              <span className="text-gray-700">Colour :</span>
                              <span className="font-semibold text-gray-900">{firstItem?.color || 'Black'}</span>
                              <div 
                                className="w-8 h-8 border border-gray-300 rounded"
                                style={{ backgroundColor: firstItem?.color_hex || '#000000' }}
                              ></div>
                            </div>
                          </div>

                          {/* Chevron */}
                          <div className="flex-shrink-0 pt-2">
                            <ChevronRight className="w-6 h-6 text-gray-400" />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        ) : (
          // Desktop Layout
          <div className="flex gap-8 max-w-7xl">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0">
              <div className="sticky top-32">
                <h2 className="text-xl font-bold mb-6 text-foreground">Account</h2>
                <nav className="space-y-1">
                  <button
                    onClick={() => navigate("/profile?section=profile")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted transition-colors rounded text-left"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile Details</span>
                  </button>
                  <button
                    onClick={() => navigate("/profile?section=address")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted transition-colors rounded text-left"
                  >
                    <Package className="w-5 h-5" />
                    <span>Delivery Addresses</span>
                  </button>
                  <button
                    onClick={() => navigate("/profile?section=pan")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted transition-colors rounded text-left"
                  >
                    <Star className="w-5 h-5" />
                    <span>Identification Details</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 bg-muted text-foreground font-semibold rounded text-left"
                  >
                    <Package className="w-5 h-5" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted transition-colors rounded text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <h1 className="text-3xl font-bold mb-8 text-foreground">My Orders</h1>
              
              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-lg border border-border">
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
                  filteredOrders.map((order) => {
                    const orderItems = order.order_items_data || [];
                    const firstItem = orderItems[0];
                    const deliveryDate = order.estimated_delivery_date || order.created_at;
                    const returnDate = new Date(deliveryDate);
                    returnDate.setDate(returnDate.getDate() + 15);
                    
                    return (
                      <div key={order.id} className="bg-card border border-border rounded-lg p-6">
                        {/* Delivery Date Header */}
                        <div className="mb-4">
                          <h3 className="text-base font-normal text-foreground">
                            Delivered on {format(new Date(deliveryDate), 'MMM dd, yyyy')}
                          </h3>
                        </div>

                        {/* Product Card */}
                        <div className="flex gap-6 items-start">
                          {/* Product Image */}
                          <div className="w-32 h-32 flex-shrink-0 bg-muted rounded overflow-hidden">
                            {firstItem?.image_url ? (
                              <img 
                                src={firstItem.image_url} 
                                alt={firstItem.name || "Product"} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-normal text-base mb-1 text-foreground">
                              {firstItem?.product_name || firstItem?.name || 'Product'}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Return or Replace: Eligible through {format(returnDate, 'MMM dd, yyyy')}
                            </p>
                            {firstItem?.variant && (
                              <p className="text-sm text-muted-foreground mb-1">
                                Variant : <span className="text-foreground font-medium">({firstItem.variant})</span>
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Colour :</span>
                              <span className="text-foreground">{firstItem?.color || 'Black'}</span>
                              <div 
                                className="w-4 h-4 border border-border rounded"
                                style={{ backgroundColor: firstItem?.color_hex || '#000000' }}
                              ></div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="text-right">
                            <div className="text-sm font-medium text-primary mb-3">
                              {order.order_type === 'test_ride' ? 'Booking' : order.order_type === 'purchase' ? 'Purchased' : 'Order'}
                            </div>
                          </div>

                          {/* Price and Button */}
                          <div className="flex flex-col items-end gap-3">
                            <div className="text-2xl font-medium text-foreground">
                              ₹{parseFloat(order.total_amount.toString()).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <Button
                              onClick={() => handleViewOrder(order.id)}
                              variant="default"
                              className="bg-foreground text-background hover:bg-foreground/90"
                            >
                              View Order
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;