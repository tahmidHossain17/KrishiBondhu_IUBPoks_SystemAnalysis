import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Star,
  MessageCircle,
  Navigation,
  Route,
  Fuel,
  Zap,
  Shield,
  Timer,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

const CustomerOrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load order tracking data from API
  const loadOrderDetails = async (orderId: string) => {
    try {
      setLoading(true);
      // TODO: Implement OrdersAPI.getOrderTracking(orderId) when orders functionality is ready
      // For now, set null until orders API is implemented
      setOrderDetails(null);
    } catch (error) {
      console.error('Error loading order details:', error);
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Tracking Updated",
        description: "Order tracking information has been refreshed",
      });
    }, 1000);
  };

  const handleContactDeliveryPartner = () => {
    toast({
      title: "Contacting Delivery Partner",
      description: `Calling ${orderDetails?.deliveryPartnerPhone}`,
    });
  };

  const handleContactFarmer = () => {
    toast({
      title: "Contacting Farmer",
      description: `Calling ${orderDetails?.farmerPhone}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'active': return Truck;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order tracking...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Order not found</p>
          <Button onClick={() => navigate('/customer/orders')} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/customer/orders')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
              <p className="text-gray-600">Track your order in real-time</p>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Order Status
                  </span>
                  <Badge className={getStatusColor(orderDetails.status)}>
                    {orderDetails.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Delivery Progress</span>
                    <span>{orderDetails.progress}%</span>
                  </div>
                  <Progress value={orderDetails.progress} className="h-3" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Order ID:</span>
                        <span className="font-medium">{orderDetails.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Order Date:</span>
                        <span>{new Date(orderDetails.orderDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span>{new Date(orderDetails.estimatedDelivery).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-medium">৳{orderDetails.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Delivery Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Delivery Partner:</span>
                        <span className="font-medium">{orderDetails.deliveryPartner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tracking Number:</span>
                        <span className="font-medium">{orderDetails.trackingNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span>{orderDetails.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Farmer:</span>
                        <span className="font-medium">{orderDetails.farmer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Delivery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.timeline.map((timeline: any, index: number) => {
                    const TimelineIcon = getStatusIcon(timeline.status);
                    
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          timeline.status === 'completed' 
                            ? 'bg-green-100 text-green-600' 
                            : timeline.status === 'active'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <TimelineIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{timeline.step}</h4>
                            <span className="text-sm text-gray-500">{timeline.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{timeline.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.deliveryUpdates.map((update: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{update.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{update.location}</span>
                          <span className="text-xs text-gray-500">{update.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderDetails.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">৳{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Route Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Route className="mr-2 h-5 w-5" />
                  Route Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Navigation className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Total Distance</p>
                    <p className="text-lg font-bold text-blue-600">{orderDetails.routeInfo.totalDistance}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Remaining</p>
                    <p className="text-lg font-bold text-green-600">{orderDetails.routeInfo.remainingDistance}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Estimated Time:</span>
                    <span className="font-medium">{orderDetails.routeInfo.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Speed:</span>
                    <span className="font-medium">{orderDetails.routeInfo.currentSpeed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Traffic:</span>
                    <Badge variant="outline" className="text-xs">
                      {orderDetails.routeInfo.trafficCondition}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Weather:</span>
                    <Badge variant="outline" className="text-xs">
                      {orderDetails.routeInfo.weatherCondition}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Delivery Partner</h4>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">{orderDetails.deliveryPartner}</p>
                    <p className="text-sm text-gray-600">{orderDetails.deliveryPartnerPhone}</p>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={handleContactDeliveryPartner}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Delivery Partner
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Farmer</h4>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">{orderDetails.farmer}</p>
                    <p className="text-sm text-gray-600">{orderDetails.farmerPhone}</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full mt-2"
                      onClick={handleContactFarmer}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Farmer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm">{orderDetails.deliveryAddress}</p>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderTracking; 