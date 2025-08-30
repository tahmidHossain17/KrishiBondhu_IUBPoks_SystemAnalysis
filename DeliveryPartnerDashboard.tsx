import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import MapWidget from '../../components/widgets/MapWidget';
import WeatherWidget from '../../components/widgets/WeatherWidget';
import {
  MapPin,
  DollarSign,
  Package,
  Star,
  TrendingUp,
  Navigation,
  Clock,
  Target,
  Fuel,
  Award,
  Phone,
  MessageCircle
} from 'lucide-react';

const DeliveryPartnerDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  // Mock data
  const earningsData = {
    today: { amount: 850, orders: 12, distance: 45 },
    week: { amount: 4250, orders: 67, distance: 312 },
    month: { amount: 18500, orders: 289, distance: 1456 }
  };

  const currentEarnings = earningsData[selectedTimeframe as keyof typeof earningsData];

  const deliveryStats = {
    rating: 4.8,
    totalDeliveries: 1247,
    completionRate: 98.5,
    avgDeliveryTime: 32
  };

  const nearbyOrders = [
    {
      id: 'ORD001',
      customerName: 'Green Mart',
      distance: '1.2 km',
      payment: 185,
      items: 3,
      pickupLocation: 'Central Warehouse',
      deliveryLocation: 'Sector 18, Noida',
      estimatedTime: '25 mins',
      priority: 'high'
    },
    {
      id: 'ORD002', 
      customerName: 'Fresh Foods Restaurant',
      distance: '2.8 km',
      payment: 245,
      items: 5,
      pickupLocation: 'Central Warehouse',
      deliveryLocation: 'Connaught Place',
      estimatedTime: '35 mins',
      priority: 'medium'
    },
    {
      id: 'ORD003',
      customerName: 'Raj Kumar',
      distance: '0.8 km',
      payment: 95,
      items: 2,
      pickupLocation: 'Central Warehouse',
      deliveryLocation: 'Sector 15, Noida',
      estimatedTime: '20 mins',
      priority: 'low'
    }
  ];

  const recentFeedback = [
    { customer: 'Priya S.', rating: 5, comment: 'Very fast delivery, great service!' },
    { customer: 'Amit K.', rating: 4, comment: 'Professional and courteous driver' },
    { customer: 'Sunita M.', rating: 5, comment: 'Perfect condition, on time delivery' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Good Morning, Rajesh!</h1>
            <p className="text-blue-100 text-sm">Ready for another great day of deliveries?</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">৳{currentEarnings.amount}</div>
            <div className="text-xs text-blue-100">Today's earnings</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-green-100 p-2">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Orders Today</p>
                <p className="text-xl font-bold text-slate-900">{currentEarnings.orders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Navigation className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Distance</p>
                <p className="text-xl font-bold text-slate-900">{currentEarnings.distance} km</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <DollarSign className="mr-2 h-5 w-5 text-green-600" />
            Earnings Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-1 mb-4">
            {['today', 'week', 'month'].map((period) => (
              <Button
                key={period}
                variant={selectedTimeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(period)}
                className="flex-1 text-xs"
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">৳{currentEarnings.amount}</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Orders</p>
                <p className="font-semibold">{currentEarnings.orders}</p>
              </div>
              <div>
                <p className="text-slate-500">Distance</p>
                <p className="font-semibold">{currentEarnings.distance} km</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Award className="mr-2 h-5 w-5 text-purple-600" />
            Your Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-xl font-bold ml-1">{deliveryStats.rating}</span>
              </div>
              <p className="text-sm text-slate-600">Rating</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{deliveryStats.completionRate}%</div>
              <p className="text-sm text-slate-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{deliveryStats.totalDeliveries}</div>
              <p className="text-sm text-slate-600">Total Deliveries</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{deliveryStats.avgDeliveryTime} min</div>
              <p className="text-sm text-slate-600">Avg Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Delivery Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Live Delivery Map */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <MapPin className="mr-2 h-5 w-5 text-red-600" />
              Orders Near You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MapWidget 
              height="250px"
              showNearbyPlaces={false}
              markers={[
                { location: { lat: 28.6139, lng: 77.2090 }, label: 'Order #1234', type: 'customer' },
                { location: { lat: 28.5355, lng: 77.3910 }, label: 'Order #1235', type: 'customer' },
                { location: { lat: 28.7041, lng: 77.1025 }, label: 'Pickup Point', type: 'warehouse' }
              ]}
            />
          </CardContent>
        </Card>
        
        {/* Weather & Delivery Conditions */}
        <WeatherWidget 
          location="Dhaka, BD" 
          showForecast={false} 
          showAlerts={true}
        />
      </div>

      {/* Available Orders List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Package className="mr-2 h-5 w-5 text-green-600" />
            Available Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          
          {/* Quick Order List */}
          <div className="space-y-3">
            {nearbyOrders.slice(0, 2).map((order) => (
              <div key={order.id} className="border rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                    <span className="font-medium text-sm">{order.customerName}</span>
                  </div>
                  <span className="text-green-600 font-bold">₹{order.payment}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {order.distance}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {order.estimatedTime}
                  </span>
                  <span className="flex items-center">
                    <Package className="h-3 w-3 mr-1" />
                    {order.items} items
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <Button className="w-full mt-3 bg-green-600 hover:bg-green-700">
            <Package className="mr-2 h-4 w-4" />
            View All Available Orders
          </Button>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            Recent Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentFeedback.map((feedback, index) => (
              <div key={index} className="border-l-4 border-yellow-400 bg-yellow-50 p-3 rounded-r-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{feedback.customer}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700">"{feedback.comment}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 flex-col">
              <Phone className="h-5 w-5 mb-1 text-blue-600" />
              <span className="text-xs">Support</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Fuel className="h-5 w-5 mb-1 text-green-600" />
              <span className="text-xs">Fuel Tracker</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <MessageCircle className="h-5 w-5 mb-1 text-purple-600" />
              <span className="text-xs">Messages</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <TrendingUp className="h-5 w-5 mb-1 text-orange-600" />
              <span className="text-xs">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryPartnerDashboard;