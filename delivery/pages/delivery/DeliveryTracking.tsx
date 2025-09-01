import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { deliveryService, DeliveryOrder, RouteAlternative, TrafficAlert } from '../../services/deliveryApi';
import { useAuth } from '../../contexts/AuthContext';
import {
  Navigation,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  Truck,
  Route,
  Fuel,
  Zap,
  User,
  MessageCircle,
  Shield,
  RefreshCw,
  Target,
  Timer,
  CheckCircle,
  Package
} from 'lucide-react';

const DeliveryTracking: React.FC = () => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.6196, lng: 77.3678 });
  const [deliveryProgress, setDeliveryProgress] = useState(45);
  const [estimatedArrival, setEstimatedArrival] = useState('2:35 PM');
  const [isTracking, setIsTracking] = useState(true);
  const [trafficAlerts, setTrafficAlerts] = useState<TrafficAlert[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<DeliveryOrder | null>(null);
  const [routeAlternatives, setRouteAlternatives] = useState<RouteAlternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadDeliveryData = async () => {
      try {
        setLoading(true);
        if (!user?.id) {
          setError('User not authenticated');
          return;
        }

        // Load active delivery
        const delivery = await deliveryService.getActiveDelivery(user.id);
        if (delivery) {
          setActiveDelivery(delivery);
          setDeliveryProgress(delivery.progress);
          setCurrentLocation(delivery.currentLocation || delivery.pickupCoordinates);
          
          // Calculate ETA
          const eta = deliveryService.calculateETA(delivery.progress, delivery.estimatedTime);
          setEstimatedArrival(eta);

          // Load route alternatives
          const routes = await deliveryService.getRouteAlternatives(
            delivery.currentLocation || delivery.pickupCoordinates,
            delivery.deliveryCoordinates
          );
          setRouteAlternatives(routes);

          // Load traffic alerts
          const alerts = await deliveryService.getTrafficAlerts(
            delivery.currentLocation || delivery.pickupCoordinates
          );
          setTrafficAlerts(alerts);
        }
      } catch (err) {
        setError('Failed to load delivery data');
        console.error('Error loading delivery data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDeliveryData();
  }, [user?.id]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isTracking && deliveryProgress < 100 && activeDelivery) {
        const newProgress = Math.min(deliveryProgress + 1, 100);
        setDeliveryProgress(newProgress);
        
        // Update delivery progress in API
        await deliveryService.updateDeliveryProgress(
          activeDelivery.id,
          newProgress,
          currentLocation
        );

        // Update ETA
        const eta = deliveryService.calculateETA(newProgress, activeDelivery.estimatedTime);
        setEstimatedArrival(eta);
        
        // Simulate traffic alerts
        if (Math.random() < 0.1) { // 10% chance every update
          const alerts = await deliveryService.getTrafficAlerts(currentLocation);
          setTrafficAlerts(alerts);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isTracking, deliveryProgress, activeDelivery, currentLocation]);

  const handleRouteChange = async (routeId: number) => {
    try {
      console.log('Switching to route:', routeId);
      // Update route alternatives to mark the selected route as active
      setRouteAlternatives(prev => 
        prev.map(route => ({
          ...route,
          isActive: route.id === routeId
        }))
      );
      
      // In a real implementation, you would update the route in the API
      // await deliveryService.updateRoute(activeDelivery?.id, routeId);
    } catch (error) {
      console.error('Error changing route:', error);
    }
  };

  const handleEmergencyCall = (contact: any) => {
    console.log('Calling:', contact.name, contact.number);
    // In a real app, this would initiate a phone call
    window.open(`tel:${contact.number}`, '_self');
  };

  const sendCustomerUpdate = async () => {
    try {
      if (!activeDelivery) return;
      
      const message = `Your delivery is ${deliveryProgress}% complete. Estimated arrival: ${estimatedArrival}`;
      const success = await deliveryService.sendCustomerNotification(
        activeDelivery.id,
        message,
        'eta_update'
      );
      
      if (success) {
        console.log('Customer notification sent successfully');
      } else {
        console.error('Failed to send customer notification');
      }
    } catch (error) {
      console.error('Error sending customer update:', error);
    }
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  const handleCompleteDelivery = async () => {
    try {
      if (!activeDelivery) return;
      
      const success = await deliveryService.completeDelivery(activeDelivery.id);
      if (success) {
        console.log('Delivery completed successfully');
        // Redirect to delivery confirmation or dashboard
      } else {
        console.error('Failed to complete delivery');
      }
    } catch (error) {
      console.error('Error completing delivery:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivery information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!activeDelivery) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No active delivery found</p>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header with Active Delivery */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold">Active Delivery</h1>
            <p className="text-sm text-green-100">{activeDelivery.id} • {activeDelivery.customerName}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600"
            onClick={toggleTracking}
          >
            <Zap className="h-4 w-4 mr-2" />
            {isTracking ? 'Tracking On' : 'Start Tracking'}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Progress to destination</span>
          <span className="text-sm font-medium">{deliveryProgress}%</span>
        </div>
        <Progress value={deliveryProgress} className="bg-white/20" />
        
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div>
            <div className="text-lg font-bold">{estimatedArrival}</div>
            <div className="text-xs text-green-100">ETA</div>
          </div>
          <div>
            <div className="text-lg font-bold">{deliveryService.formatDistance(activeDelivery.remainingDistance)}</div>
            <div className="text-xs text-green-100">Remaining</div>
          </div>
          <div>
            <div className="text-lg font-bold">₹{activeDelivery.deliveryFee}</div>
            <div className="text-xs text-green-100">Earning</div>
          </div>
        </div>
      </div>

      {/* GPS Tracking Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Navigation className="mr-2 h-5 w-5 text-blue-600" />
            Live GPS Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-blue-200 mb-4 relative">
            <div className="absolute top-4 left-4">
              <Badge variant="default" className="bg-green-600">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Live Tracking
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-2" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-blue-700 font-medium">Current Location</p>
              <p className="text-sm text-blue-600">Sector 62, Noida</p>
              <div className="flex justify-center space-x-2 mt-3">
                <Button size="sm">
                  <Navigation className="mr-2 h-4 w-4" />
                  Recenter Map
                </Button>
                <Button size="sm" variant="outline">
                  <Target className="mr-2 h-4 w-4" />
                  Share Location
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Route Info */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium">25 mins</p>
              <p className="text-xs text-slate-600">Remaining</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Route className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium">6.8 km</p>
              <p className="text-xs text-slate-600">Distance</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Fuel className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
              <p className="text-sm font-medium">Light</p>
              <p className="text-xs text-slate-600">Traffic</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Alternatives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Route className="mr-2 h-5 w-5 text-purple-600" />
            Route Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routeAlternatives.map((route) => (
              <div
                key={route.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  route.isActive 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleRouteChange(route.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-sm">{route.name}</p>
                      {route.isActive && (
                        <Badge variant="default" className="bg-blue-600 text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-600">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {deliveryService.formatTime(route.time)}
                      </span>
                      <span className="flex items-center">
                        <Navigation className="h-3 w-3 mr-1" />
                        {deliveryService.formatDistance(route.distance)}
                      </span>
                      <span className={`flex items-center ${route.trafficColor}`}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {route.traffic.charAt(0).toUpperCase() + route.traffic.slice(1)} Traffic
                      </span>
                    </div>
                  </div>
                  {!route.isActive && (
                    <Button size="sm" variant="outline">
                      Switch
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Alerts */}
      {trafficAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
              Traffic & Route Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trafficAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">{alert.message}</p>
                    <p className="text-xs text-yellow-600 mt-1">Alert time: {alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <User className="mr-2 h-5 w-5 text-green-600" />
            Customer Communication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-sm">{activeDelivery.customerName}</p>
                <p className="text-xs text-slate-600">{activeDelivery.deliveryAddress}</p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
            
            {activeDelivery.specialInstructions && (
              <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>Special Instructions:</strong> {activeDelivery.specialInstructions}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={sendCustomerUpdate} className="h-12 flex-col">
              <RefreshCw className="h-5 w-5 mb-1 text-blue-600" />
              <span className="text-xs">Send ETA Update</span>
            </Button>
            <Button variant="outline" className="h-12 flex-col">
              <MessageCircle className="h-5 w-5 mb-1 text-green-600" />
              <span className="text-xs">Send Message</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Shield className="mr-2 h-5 w-5 text-red-600" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {activeDelivery.emergencyContacts.map((contact, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-16 flex-col justify-center"
                onClick={() => handleEmergencyCall(contact)}
              >
                <Phone className="h-5 w-5 mb-1 text-red-600" />
                <span className="text-xs font-medium">{contact.name}</span>
                <span className="text-xs text-slate-600">{contact.number}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Summary */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Package className="mr-2 h-5 w-5 text-blue-600" />
            Delivery Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Order ID:</span>
              <span className="font-medium text-sm">{activeDelivery.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Start Time:</span>
              <span className="font-medium text-sm">{activeDelivery.startTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Items:</span>
              <span className="font-medium text-sm">{activeDelivery.items.length} products</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Delivery Fee:</span>
              <span className="font-bold text-sm text-green-600">₹{activeDelivery.deliveryFee}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Delivery Button */}
      <div className="sticky bottom-20 bg-white p-4 border-t">
        <Button
          className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg"
          disabled={deliveryProgress < 95}
          onClick={handleCompleteDelivery}
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          {deliveryProgress >= 95 ? 'Arrived - Complete Delivery' : `${Math.round(deliveryProgress)}% Complete`}
        </Button>
      </div>
    </div>
  );
};

export default DeliveryTracking;