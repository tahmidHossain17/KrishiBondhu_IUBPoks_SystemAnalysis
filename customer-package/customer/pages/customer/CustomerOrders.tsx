import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  Phone,
  Mail,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Star,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Home,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

const CustomerOrders: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load user orders from API
  const loadUserOrders = async () => {
    try {
      setLoading(true);
      // TODO: Implement OrdersAPI.getUserOrders() when orders functionality is ready
      // For now, set empty array until orders API is implemented
      setOrders([]);
      setFilteredOrders([]);
    } catch (error) {
      console.error('Error loading user orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on search and status
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.farmer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in_transit': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'in_transit': return Truck;
      case 'processing': return Package;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

  const handleTrackOrder = (order: any) => {
    navigate(`/customer/track-order/${order.id}`);
  };

  const handleDownloadInvoice = (order: any) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for order ${order.id} has been downloaded`,
    });
  };

  const handleReorder = (order: any) => {
    // In a real app, this would add items to cart
    toast({
      title: "Items Added to Cart",
      description: "Selected items have been added to your cart",
    });
    navigate('/customer/dashboard');
  };

  const getOrderStats = () => {
    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const inTransit = orders.filter(o => o.status === 'in_transit').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;

    return { total, delivered, inTransit, processing, cancelled };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600">Track and manage your orders</p>
            </div>
            <Button onClick={() => navigate('/customer/dashboard')}>
              <Home className="h-4 w-4 mr-2" />
              Back to Shopping
            </Button>
          </div>

          {/* Order Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <p className="text-sm text-gray-600">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                <p className="text-sm text-gray-600">Delivered</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.inTransit}</div>
                <p className="text-sm text-gray-600">In Transit</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.processing}</div>
                <p className="text-sm text-gray-600">Processing</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                <p className="text-sm text-gray-600">Cancelled</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders, products, or farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Start shopping to see your orders here'
                  }
                </p>
                <Button onClick={() => navigate('/customer/dashboard')}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              
              return (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            Ordered on {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <p className="text-lg font-bold mt-1">৳{order.totalAmount}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} ({item.quantity})</span>
                            <span>৳{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Delivery Details</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{order.deliveryAddress}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Truck className="h-3 w-3" />
                            <span>{order.deliveryPartner}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Package className="h-3 w-3" />
                            <span>Tracking: {order.trackingNumber}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Order Info</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="h-3 w-3" />
                            <span>Farmer: {order.farmer}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-3 w-3" />
                            <span>Payment: {order.paymentMethod}</span>
                          </div>
                          {order.deliveryDate && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3" />
                              <span>Delivered: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          {order.estimatedDelivery && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3" />
                              <span>ETA: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar for In Transit Orders */}
                    {order.status === 'in_transit' && order.progress && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Delivery Progress</span>
                          <span>{order.progress}%</span>
                        </div>
                        <Progress value={order.progress} className="h-2" />
                      </div>
                    )}

                    {/* Rating for Delivered Orders */}
                    {order.status === 'delivered' && order.rating && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < order.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{order.rating}/5</span>
                        </div>
                        {order.review && (
                          <p className="text-sm text-gray-600">"{order.review}"</p>
                        )}
                      </div>
                    )}

                    {/* Cancellation Reason */}
                    {order.status === 'cancelled' && order.cancellationReason && (
                      <div className="mb-4 p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Cancellation Reason:</span>
                        </div>
                        <p className="text-sm text-red-600 mt-1">{order.cancellationReason}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrackOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Track Order
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(order)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download Invoice
                      </Button>
                      
                      {order.status === 'delivered' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorder(order)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reorder
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/customer/order-details/${order.id}`)}
                      >
                        <ArrowRight className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrders; 