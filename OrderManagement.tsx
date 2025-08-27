import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  MapPin,
  Clock,
  Package,
  Phone,
  Navigation,
  DollarSign,
  User,
  AlertCircle,
  Route,
  CheckCircle,
  XCircle,
  Filter,
  Star,
  Truck,
  FileText
} from 'lucide-react';

const OrderManagement: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock orders data
  const availableOrders = [
    {
      id: 'ORD001',
      customerName: 'Green Mart Supermarket',
      customerPhone: '+91 9123456789',
      distance: '1.2 km',
      payment: 185,
      items: [
        { name: 'Basmati Rice', quantity: '5 kg', price: 275 },
        { name: 'Fresh Tomatoes', quantity: '2 kg', price: 120 },
        { name: 'Organic Wheat', quantity: '3 kg', price: 180 }
      ],
      totalValue: 575,
      pickupLocation: {
        name: 'KrishiBondhu Central Warehouse',
        address: 'Sector 63, Noida, UP 201301',
        coordinates: { lat: 28.6196, lng: 77.3678 },
        contact: '+91 120-4567890'
      },
      deliveryLocation: {
        name: 'Green Mart Supermarket',
        address: 'Sector 18, Noida, UP 201301',
        coordinates: { lat: 28.5672, lng: 77.3248 },
        contact: '+91 9123456789'
      },
      estimatedTime: '25 mins',
      priority: 'high',
      specialInstructions: 'Handle vegetables with care. Customer prefers morning delivery.',
      orderTime: '09:30 AM',
      customerRating: 4.5,
      vehicleType: 'Two Wheeler'
    },
    {
      id: 'ORD002',
      customerName: 'Fresh Foods Restaurant',
      customerPhone: '+91 9234567890',
      distance: '2.8 km',
      payment: 245,
      items: [
        { name: 'Fresh Potatoes', quantity: '10 kg', price: 200 },
        { name: 'Onions', quantity: '5 kg', price: 125 },
        { name: 'Green Chilies', quantity: '1 kg', price: 80 }
      ],
      totalValue: 405,
      pickupLocation: {
        name: 'KrishiBondhu Central Warehouse',
        address: 'Sector 63, Noida, UP 201301',
        coordinates: { lat: 28.6196, lng: 77.3678 },
        contact: '+91 120-4567890'
      },
      deliveryLocation: {
        name: 'Fresh Foods Restaurant',
        address: '25/A Dhanmondi, Dhaka-1205',
        coordinates: { lat: 28.6315, lng: 77.2167 },
        contact: '+91 9234567890'
      },
      estimatedTime: '35 mins',
      priority: 'medium',
      specialInstructions: 'Call before delivery. Use back entrance.',
      orderTime: '10:15 AM',
      customerRating: 4.8,
      vehicleType: 'Four Wheeler'
    },
    {
      id: 'ORD003',
      customerName: 'Raj Kumar (Individual)',
      customerPhone: '+91 9345678901',
      distance: '0.8 km',
      payment: 95,
      items: [
        { name: 'Organic Rice', quantity: '2 kg', price: 160 },
        { name: 'Mixed Vegetables', quantity: '1 kg', price: 80 }
      ],
      totalValue: 240,
      pickupLocation: {
        name: 'KrishiBondhu Central Warehouse',
        address: 'Sector 63, Noida, UP 201301',
        coordinates: { lat: 28.6196, lng: 77.3678 },
        contact: '+91 120-4567890'
      },
      deliveryLocation: {
        name: 'Raj Kumar Residence',
        address: 'Sector 15, Noida, UP 201301',
        coordinates: { lat: 28.5987, lng: 77.3667 },
        contact: '+91 9345678901'
      },
      estimatedTime: '20 mins',
      priority: 'low',
      specialInstructions: 'Ring doorbell twice. Flat 304, Building A.',
      orderTime: '11:00 AM',
      customerRating: 4.2,
      vehicleType: 'Two Wheeler'
    }
  ];

  const filteredOrders = availableOrders.filter(order => {
    const matchesFilter = filter === 'all' || order.priority === filter;
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleAcceptOrder = (order: any) => {
    console.log('Accepting order:', order.id);
    // Handle order acceptance logic
    setSelectedOrder(null);
  };

  const handleRejectOrder = (order: any) => {
    console.log('Rejecting order:', order.id);
    // Handle order rejection logic
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Available Orders</h1>
          <p className="text-sm text-slate-600">{filteredOrders.length} orders near you</p>
        </div>
        <Button size="sm" variant="outline">
          <Route className="h-4 w-4 mr-2" />
          Route Optimizer
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="relative">
              <Input
                placeholder="Search by customer name or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4"
              />
            </div>
            <div className="flex space-x-2">
              {['all', 'high', 'medium', 'low'].map((priority) => (
                <Button
                  key={priority}
                  variant={filter === priority ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(priority)}
                  className="flex-1 text-xs"
                >
                  {priority === 'all' ? 'All' : `${priority.charAt(0).toUpperCase()}${priority.slice(1)}`}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(order.priority)}>
                    {order.priority}
                  </Badge>
                  <span className="font-medium text-sm">{order.id}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">₹{order.payment}</div>
                  <div className="text-xs text-slate-500">Delivery fee</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-sm">{order.customerName}</span>
                  <div className="flex items-center ml-auto">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-slate-600 ml-1">{order.customerRating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {order.distance}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {order.estimatedTime}
                  </div>
                  <div className="flex items-center">
                    <Package className="h-3 w-3 mr-1" />
                    {order.items.length} items
                  </div>
                </div>

                <div className="flex items-center text-xs text-slate-600">
                  <Truck className="h-3 w-3 mr-1" />
                  <span>Recommended: {order.vehicleType}</span>
                  <span className="ml-auto">Order Value: ₹{order.totalValue}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm mx-4 rounded-xl">
                    <DialogHeader>
                      <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                      <DialogDescription>
                        Review order information before accepting
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedOrder && (
                      <div className="space-y-4">
                        {/* Customer Info */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-medium text-sm mb-2 flex items-center">
                            <User className="h-4 w-4 mr-2 text-blue-600" />
                            Customer Information
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                            <div className="flex items-center space-x-2">
                              <strong>Rating:</strong>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="ml-1">{selectedOrder.customerRating}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline" className="h-8">
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h4 className="font-medium text-sm mb-2 flex items-center">
                            <Package className="h-4 w-4 mr-2 text-green-600" />
                            Order Items
                          </h4>
                          <div className="space-y-2">
                            {selectedOrder.items.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                <span>{item.name} ({item.quantity})</span>
                                <span>₹{item.price}</span>
                              </div>
                            ))}
                            <div className="flex justify-between font-medium text-sm pt-2 border-t">
                              <span>Total Value:</span>
                              <span>₹{selectedOrder.totalValue}</span>
                            </div>
                          </div>
                        </div>

                        {/* Locations */}
                        <div className="space-y-3">
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <h4 className="font-medium text-sm mb-2 flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                              Pickup Location
                            </h4>
                            <p className="text-sm">{selectedOrder.pickupLocation.name}</p>
                            <p className="text-xs text-slate-600">{selectedOrder.pickupLocation.address}</p>
                            <Button size="sm" variant="outline" className="mt-2 h-8">
                              <Navigation className="h-3 w-3 mr-1" />
                              Navigate
                            </Button>
                          </div>

                          <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-medium text-sm mb-2 flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-green-600" />
                              Delivery Location
                            </h4>
                            <p className="text-sm">{selectedOrder.deliveryLocation.name}</p>
                            <p className="text-xs text-slate-600">{selectedOrder.deliveryLocation.address}</p>
                            <Button size="sm" variant="outline" className="mt-2 h-8">
                              <Navigation className="h-3 w-3 mr-1" />
                              Navigate
                            </Button>
                          </div>
                        </div>

                        {/* Special Instructions */}
                        {selectedOrder.specialInstructions && (
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <h4 className="font-medium text-sm mb-2 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                              Special Instructions
                            </h4>
                            <p className="text-sm text-slate-700">{selectedOrder.specialInstructions}</p>
                          </div>
                        )}

                        {/* Route Optimization */}
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <h4 className="font-medium text-sm mb-2 flex items-center">
                            <Route className="h-4 w-4 mr-2 text-purple-600" />
                            Route Information
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-slate-600">Distance:</span>
                              <p className="font-medium">{selectedOrder.distance}</p>
                            </div>
                            <div>
                              <span className="text-slate-600">Est. Time:</span>
                              <p className="font-medium">{selectedOrder.estimatedTime}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="w-full mt-2 h-8">
                            <Route className="h-3 w-3 mr-1" />
                            Optimize Route
                          </Button>
                        </div>

                        {/* Earnings */}
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium text-sm mb-2 flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                            Earnings Breakdown
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Base Fee:</span>
                              <span>₹{Math.floor(selectedOrder.payment * 0.7)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Distance Bonus:</span>
                              <span>₹{Math.floor(selectedOrder.payment * 0.2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Priority Bonus:</span>
                              <span>₹{Math.floor(selectedOrder.payment * 0.1)}</span>
                            </div>
                            <div className="flex justify-between font-medium border-t pt-1">
                              <span>Total:</span>
                              <span className="text-green-600">₹{selectedOrder.payment}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleRejectOrder(selectedOrder)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleAcceptOrder(selectedOrder)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Order
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button 
                  size="sm" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleAcceptOrder(order)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Orders State */}
      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No orders available</h3>
            <p className="text-slate-600 mb-4">
              {filter === 'all' 
                ? 'There are no orders available at the moment.'
                : `No ${filter} priority orders found.`
              }
            </p>
            <Button variant="outline" onClick={() => setFilter('all')}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderManagement;