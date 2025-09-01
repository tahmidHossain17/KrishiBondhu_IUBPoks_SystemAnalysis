import axios from 'axios';
import { env, API_ENDPOINTS } from '../config/env';
import { mapService, MapLocation, RouteInfo } from './mapApi';

export interface DeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  deliveryAddress: string;
  pickupCoordinates: MapLocation;
  deliveryCoordinates: MapLocation;
  totalDistance: number;
  remainingDistance: number;
  startTime: string;
  estimatedTime: number; // in minutes
  items: DeliveryItem[];
  deliveryFee: number;
  specialInstructions?: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  progress: number; // 0-100
  currentLocation?: MapLocation;
  routeInfo?: RouteInfo;
  trafficAlerts: TrafficAlert[];
  emergencyContacts: EmergencyContact[];
}

export interface DeliveryItem {
  name: string;
  quantity: string;
  category: string;
  isFragile?: boolean;
  requiresRefrigeration?: boolean;
}

export interface TrafficAlert {
  id: string;
  type: 'traffic' | 'road' | 'weather' | 'accident';
  message: string;
  severity: 'low' | 'medium' | 'high';
  location?: MapLocation;
  time: string;
  isActive: boolean;
}

export interface EmergencyContact {
  name: string;
  number: string;
  type: 'support' | 'emergency' | 'warehouse' | 'customer';
  priority: number;
}

export interface RouteAlternative {
  id: number;
  name: string;
  time: number; // in minutes
  distance: number; // in km
  traffic: 'light' | 'moderate' | 'heavy';
  trafficColor: string;
  isActive: boolean;
  coordinates: [number, number][];
}

export interface DeliveryUpdate {
  orderId: string;
  status: DeliveryOrder['status'];
  location?: MapLocation;
  progress: number;
  estimatedArrival?: string;
  message?: string;
  timestamp: string;
}

class DeliveryService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_ENDPOINTS.delivery || 'http://localhost:3001/api/delivery';
  }

  // Get active delivery for delivery partner
  async getActiveDelivery(deliveryPartnerId: string): Promise<DeliveryOrder | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/active/${deliveryPartnerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active delivery:', error);
      // Return mock data for development
      return this.getMockActiveDelivery();
    }
  }

  // Update delivery progress
  async updateDeliveryProgress(
    orderId: string, 
    progress: number, 
    location?: MapLocation
  ): Promise<DeliveryUpdate> {
    try {
      const response = await axios.post(`${this.baseUrl}/progress`, {
        orderId,
        progress,
        location,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating delivery progress:', error);
      // Return mock update
      return {
        orderId,
        status: 'in_transit',
        location,
        progress,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get route alternatives for delivery
  async getRouteAlternatives(
    startLocation: MapLocation,
    endLocation: MapLocation
  ): Promise<RouteAlternative[]> {
    try {
      const response = await axios.post(`${this.baseUrl}/routes`, {
        start: startLocation,
        end: endLocation
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching route alternatives:', error);
      // Return mock routes
      return this.getMockRouteAlternatives(startLocation, endLocation);
    }
  }

  // Get real-time traffic alerts
  async getTrafficAlerts(location: MapLocation, radius: number = 10000): Promise<TrafficAlert[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/traffic-alerts`, {
        params: {
          lat: location.lat,
          lng: location.lng,
          radius
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic alerts:', error);
      // Return mock alerts
      return this.getMockTrafficAlerts();
    }
  }

  // Send customer notification
  async sendCustomerNotification(
    orderId: string, 
    message: string, 
    type: 'eta_update' | 'arrival' | 'delivery_complete'
  ): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/notify-customer`, {
        orderId,
        message,
        type,
        timestamp: new Date().toISOString()
      });
      return response.data.success;
    } catch (error) {
      console.error('Error sending customer notification:', error);
      return false;
    }
  }

  // Complete delivery
  async completeDelivery(orderId: string, signature?: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/complete`, {
        orderId,
        signature,
        timestamp: new Date().toISOString()
      });
      return response.data.success;
    } catch (error) {
      console.error('Error completing delivery:', error);
      return false;
    }
  }

  // Get delivery history
  async getDeliveryHistory(deliveryPartnerId: string, limit: number = 10): Promise<DeliveryOrder[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/history/${deliveryPartnerId}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery history:', error);
      return [];
    }
  }

  // Mock data for development
  private getMockActiveDelivery(): DeliveryOrder {
    return {
      id: 'ORD001',
      customerName: 'Green Mart Supermarket',
      customerPhone: '+880 9123456789',
      pickupLocation: 'KrishiBondhu Central Warehouse',
      deliveryAddress: 'Sector 18, Noida, UP 201301',
      pickupCoordinates: { lat: 28.6196, lng: 77.3678 },
      deliveryCoordinates: { lat: 28.5671, lng: 77.3247 },
      totalDistance: 12.5,
      remainingDistance: 6.8,
      startTime: '2:00 PM',
      estimatedTime: 35,
      items: [
        { name: 'Basmati Rice', quantity: '5 kg', category: 'grains' },
        { name: 'Fresh Tomatoes', quantity: '2 kg', category: 'vegetables', requiresRefrigeration: true },
        { name: 'Organic Wheat', quantity: '3 kg', category: 'grains' }
      ],
      deliveryFee: 185,
      specialInstructions: 'Handle vegetables with care. Ring doorbell twice.',
      status: 'in_transit',
      progress: 45,
      currentLocation: { lat: 28.5934, lng: 77.3462 },
      trafficAlerts: [],
      emergencyContacts: [
        { name: 'Customer Support', number: '+880 1800-123-4567', type: 'support', priority: 1 },
        { name: 'Emergency Services', number: '112', type: 'emergency', priority: 1 },
        { name: 'Warehouse Manager', number: '+880 120-4567890', type: 'warehouse', priority: 2 },
        { name: 'Customer', number: '+880 9123456789', type: 'customer', priority: 3 }
      ]
    };
  }

  private getMockRouteAlternatives(
    startLocation: MapLocation,
    endLocation: MapLocation
  ): RouteAlternative[] {
    return [
      {
        id: 1,
        name: 'Current Route (Recommended)',
        time: 25,
        distance: 12.5,
        traffic: 'light',
        trafficColor: 'text-green-600',
        isActive: true,
        coordinates: []
      },
      {
        id: 2,
        name: 'Highway Route',
        time: 22,
        distance: 15.2,
        traffic: 'heavy',
        trafficColor: 'text-red-600',
        isActive: false,
        coordinates: []
      },
      {
        id: 3,
        name: 'Local Roads',
        time: 32,
        distance: 10.8,
        traffic: 'moderate',
        trafficColor: 'text-yellow-600',
        isActive: false,
        coordinates: []
      }
    ];
  }

  private getMockTrafficAlerts(): TrafficAlert[] {
    return [
      {
        id: '1',
        type: 'traffic',
        message: 'Heavy traffic ahead on NH-24. Consider alternative route.',
        severity: 'high',
        time: new Date().toLocaleTimeString(),
        isActive: true
      },
      {
        id: '2',
        type: 'road',
        message: 'Road construction detected. Expect 5-minute delay.',
        severity: 'medium',
        time: new Date().toLocaleTimeString(),
        isActive: true
      }
    ];
  }

  // Calculate ETA based on current progress and route
  calculateETA(progress: number, totalTime: number): string {
    const remainingTime = (totalTime * (100 - progress)) / 100;
    const eta = new Date(Date.now() + remainingTime * 60 * 1000);
    return eta.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  // Format distance for display
  formatDistance(distance: number): string {
    return `${distance.toFixed(1)} km`;
  }

  // Format time for display
  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}

export const deliveryService = new DeliveryService();
export default deliveryService; 