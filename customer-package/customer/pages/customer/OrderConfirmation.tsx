import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Clock,
  Phone,
  Mail,
  Download,
  Share2,
  ArrowRight,
  Star,
  Calendar,
  User,
  DollarSign,
  AlertCircle,
  Info,
  Home,
  ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderDetails] = useState({
    orderId: 'ORD-2024-001',
    orderDate: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
    items: [
      {
        id: 'P001',
        name: 'Premium Basmati Rice',
        farmer: 'Ram Kumar Sharma',
        price: 75,
        quantity: 2,
        unit: 'kg',
        image: '/placeholder.svg',
        organic: true
      },
      {
        id: 'P002',
        name: 'Fresh Organic Tomatoes',
        farmer: 'Sita Devi',
        price: 25,
        quantity: 1,
        unit: 'kg',
        image: '/placeholder.svg',
        organic: true
      }
    ],
    deliveryDetails: {
      name: 'John Doe',
      address: '123 Main Street, Apartment 4B',
      city: 'Dhaka',
      state: 'Dhaka Division',
      postalCode: '110001',
      phone: '+880 9876543210',
      email: 'john.doe@email.com'
    },
    paymentMethod: 'Cash on Delivery',
    subtotal: 175,
    deliveryFee: 50,
    codFee: 20,
    total: 245,
    trackingNumber: 'KB123456789'
  });

  const orderTimeline = [
    {
      step: 'Order Placed',
      time: new Date().toLocaleTimeString(),
      status: 'completed',
      description: 'Your order has been successfully placed'
    },
    {
      step: 'Order Confirmed',
      time: new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString(),
      status: 'completed',
      description: 'Order confirmed and being processed'
    },
    {
      step: 'Farmer Notification',
      time: 'Pending',
      status: 'pending',
      description: 'Farmer will be notified to prepare your order'
    },
    {
      step: 'Warehouse Pickup',
      time: 'Pending',
      status: 'pending',
      description: 'Delivery partner will pick up from warehouse'
    },
    {
      step: 'Out for Delivery',
      time: 'Pending',
      status: 'pending',
      description: 'Your order is on its way to you'
    },
    {
      step: 'Delivered',
      time: 'Pending',
      status: 'pending',
      description: 'Order delivered to your address'
    }
  ];

  const handleDownloadInvoice = () => {
    toast({
      title: "Invoice Downloaded",
      description: "Your invoice has been downloaded successfully",
    });
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My KrishiBondhu Order',
        text: `I just ordered fresh produce from KrishiBondhu! Order #${orderDetails.orderId}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Order #${orderDetails.orderId} - KrishiBondhu`);
      toast({
        title: "Order Details Copied",
        description: "Order information copied to clipboard",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We're preparing your fresh produce!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              Order #{orderDetails.orderId}
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Tracking: {orderDetails.trackingNumber}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderTimeline.map((timeline, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        timeline.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {timeline.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{timeline.step}</h4>
                          <span className="text-sm text-gray-500">{timeline.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{timeline.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={item.image} />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">by {item.farmer}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {item.organic && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                              Organic
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                                        <p className="font-medium">৳{item.price * item.quantity}</p>
                <p className="text-sm text-gray-600">৳{item.price} per {item.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Delivery Address</h4>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{orderDetails.deliveryDetails.name}</p>
                          <p className="text-sm text-gray-600">{orderDetails.deliveryDetails.address}</p>
                          <p className="text-sm text-gray-600">
                            {orderDetails.deliveryDetails.city}, {orderDetails.deliveryDetails.state} {orderDetails.deliveryDetails.postalCode}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{orderDetails.deliveryDetails.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{orderDetails.deliveryDetails.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Payment Details</h4>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Payment Method:</span>
                          <span className="font-medium">{orderDetails.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>৳{orderDetails.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Fee:</span>
                          <span>৳{orderDetails.deliveryFee}</span>
                        </div>
                        {orderDetails.codFee > 0 && (
                          <div className="flex justify-between">
                            <span>COD Fee:</span>
                            <span>৳{orderDetails.codFee}</span>
                          </div>
                        )}
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>৳{orderDetails.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleDownloadInvoice}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleShareOrder}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Order
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/customer/orders')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  View All Orders
                </Button>
              </CardContent>
            </Card>

            {/* Estimated Delivery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Estimated Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {new Date(orderDetails.estimatedDelivery).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Your order will be delivered within 2-3 business days
                  </p>
                  <Progress value={20} className="mb-4" />
                  <p className="text-xs text-gray-500">
                    Order processing in progress
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Phone className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Call Support</p>
                      <p className="text-xs text-gray-600">+880 1800-123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Email Support</p>
                      <p className="text-xs text-gray-600">support@krishibondhu.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Track Order</p>
                      <p className="text-xs text-gray-600">Real-time updates</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/customer/dashboard')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/customer/orders')}
            >
              <Package className="h-4 w-4 mr-2" />
              View My Orders
            </Button>
          </div>
          
          <p className="text-sm text-gray-600">
            You'll receive email and SMS updates about your order status
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 