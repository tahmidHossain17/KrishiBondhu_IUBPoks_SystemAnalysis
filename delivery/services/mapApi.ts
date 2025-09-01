import axios from 'axios';
import { env, API_ENDPOINTS } from '../config/env';

const MAPTILER_API_KEY = env.mapTilerApiKey;
const MAPTILER_BASE_URL = API_ENDPOINTS.mapTiler;

export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface RouteInfo {
  distance: number; // in kilometers
  duration: number; // in minutes
  coordinates: [number, number][];
  instructions: string[];
}

export interface NearbyPlace {
  name: string;
  type: string;
  distance: number;
  coordinates: MapLocation;
  address: string;
}

class MapService {
  private apiKey: string;

  constructor() {
    this.apiKey = MAPTILER_API_KEY;
  }

  // Geocoding: Convert address to coordinates
  async geocodeAddress(address: string): Promise<MapLocation | null> {
    try {
      const response = await axios.get(`${MAPTILER_BASE_URL}/geocoding/${encodeURIComponent(address)}.json`, {
        params: {
          key: this.apiKey,
          limit: 1
        }
      });

      if (response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        return {
          lng: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1],
          address: feature.place_name,
          city: feature.context?.find((c: any) => c.id.startsWith('place'))?.text,
          country: feature.context?.find((c: any) => c.id.startsWith('country'))?.text
        };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Reverse Geocoding: Convert coordinates to address
  async reverseGeocode(lat: number, lng: number): Promise<MapLocation | null> {
    try {
      const response = await axios.get(`${MAPTILER_BASE_URL}/geocoding/${lng},${lat}.json`, {
        params: {
          key: this.apiKey
        }
      });

      if (response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        return {
          lat,
          lng,
          address: feature.place_name,
          city: feature.context?.find((c: any) => c.id.startsWith('place'))?.text,
          country: feature.context?.find((c: any) => c.id.startsWith('country'))?.text
        };
      }
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  // Get route between two points
  async getRoute(
    startLat: number, 
    startLng: number, 
    endLat: number, 
    endLng: number,
    profile: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<RouteInfo | null> {
    try {
      const coordinates = `${startLng},${startLat};${endLng},${endLat}`;
      const response = await axios.get(`${MAPTILER_BASE_URL}/directions/${profile}/${coordinates}`, {
        params: {
          key: this.apiKey,
          steps: true,
          geometries: 'geojson'
        }
      });

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        
        const instructions = route.legs[0]?.steps?.map((step: any) => step.maneuver.instruction) || [];

        return {
          distance: (route.distance / 1000), // Convert to km
          duration: (route.duration / 60), // Convert to minutes
          coordinates,
          instructions
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting route:', error);
      return null;
    }
  }

  // Get optimized route for multiple waypoints (delivery optimization)
  async getOptimizedRoute(waypoints: MapLocation[]): Promise<{
    route: RouteInfo;
    order: number[];
  } | null> {
    try {
      if (waypoints.length < 2) return null;

      // For simplicity, we'll calculate individual routes and sum them up
      // In a production app, you might want to use a proper route optimization service
      const start = waypoints[0];
      const destinations = waypoints.slice(1);
      
      // Simple nearest-neighbor optimization
      const optimizedOrder = [0];
      let currentPoint = start;
      const remainingPoints = [...destinations.map((_, index) => index + 1)];

      while (remainingPoints.length > 0) {
        let nearestIndex = 0;
        let nearestDistance = Infinity;

        for (let i = 0; i < remainingPoints.length; i++) {
          const distance = this.calculateDistance(
            currentPoint.lat, currentPoint.lng,
            waypoints[remainingPoints[i]].lat, waypoints[remainingPoints[i]].lng
          );
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = i;
          }
        }

        const nearestPointIndex = remainingPoints.splice(nearestIndex, 1)[0];
        optimizedOrder.push(nearestPointIndex);
        currentPoint = waypoints[nearestPointIndex];
      }

      // Get route for optimized order
      const firstRoute = await this.getRoute(
        waypoints[optimizedOrder[0]].lat, waypoints[optimizedOrder[0]].lng,
        waypoints[optimizedOrder[1]].lat, waypoints[optimizedOrder[1]].lng
      );

      if (!firstRoute) return null;

      return {
        route: firstRoute,
        order: optimizedOrder
      };
    } catch (error) {
      console.error('Error getting optimized route:', error);
      return null;
    }
  }

  // Find nearby places (warehouses, farms, etc.)
  async findNearbyPlaces(
    lat: number, 
    lng: number, 
    type: string = 'warehouse',
    radius: number = 10000 // in meters
  ): Promise<NearbyPlace[]> {
    try {
      // This is a mock implementation as MapTiler doesn't have a specific POI search for agricultural facilities
      // In a real app, you'd maintain your own database of facilities
      const mockPlaces = await this.getMockNearbyPlaces(lat, lng, type);
      return mockPlaces;
    } catch (error) {
      console.error('Error finding nearby places:', error);
      return [];
    }
  }

  // Calculate distance between two points
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Get map tiles URL for custom map rendering
  getMapTilesUrl(style: 'streets' | 'satellite' | 'terrain' = 'streets'): string {
    const styleMap = {
      streets: 'streets-v2',
      satellite: 'satellite',
      terrain: 'outdoor-v2'
    };
    
    return `https://api.maptiler.com/maps/${styleMap[style]}/tiles/{z}/{x}/{y}.png?key=${this.apiKey}`;
  }

  // Get static map image URL
  getStaticMapUrl(
    lat: number, 
    lng: number, 
    zoom: number = 14, 
    width: number = 400, 
    height: number = 300,
    markers?: Array<{lat: number, lng: number, color?: string}>
  ): string {
    let url = `${MAPTILER_BASE_URL}/maps/streets-v2/static/${lng},${lat},${zoom}/${width}x${height}.png?key=${this.apiKey}`;
    
    if (markers && markers.length > 0) {
      const markerString = markers.map(marker => 
        `pin-s-${marker.color || 'red'}+${marker.lng},${marker.lat}`
      ).join('|');
      url += `&markers=${markerString}`;
    }
    
    return url;
  }

  // Mock function for nearby places - replace with actual database query
  private async getMockNearbyPlaces(lat: number, lng: number, type: string): Promise<NearbyPlace[]> {
    const mockData = {
      warehouse: [
        { name: 'Central Warehouse', type: 'warehouse', lat: lat + 0.01, lng: lng + 0.01 },
        { name: 'North Storage Hub', type: 'warehouse', lat: lat - 0.015, lng: lng + 0.02 },
        { name: 'Agricultural Storage Co.', type: 'warehouse', lat: lat + 0.02, lng: lng - 0.01 }
      ],
      farm: [
        { name: 'Green Valley Farm', type: 'farm', lat: lat + 0.03, lng: lng + 0.02 },
        { name: 'Organic Produce Farm', type: 'farm', lat: lat - 0.025, lng: lng - 0.015 },
        { name: 'Sunshine Agriculture', type: 'farm', lat: lat + 0.015, lng: lng + 0.03 }
      ],
      market: [
        { name: 'Fresh Market', type: 'market', lat: lat + 0.008, lng: lng - 0.012 },
        { name: 'Wholesale Vegetable Market', type: 'market', lat: lat - 0.02, lng: lng + 0.015 }
      ]
    };

    const places = mockData[type as keyof typeof mockData] || [];
    
    return places.map(place => ({
      name: place.name,
      type: place.type,
      distance: this.calculateDistance(lat, lng, place.lat, place.lng),
      coordinates: { lat: place.lat, lng: place.lng },
      address: `${place.name} Location` // Mock address
    })).sort((a, b) => a.distance - b.distance);
  }

  // Format coordinates for display
  formatCoordinates(lat: number, lng: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`;
  }

  // Check if coordinates are within Bangladesh (approximate bounds)
  isInBangladesh(lat: number, lng: number): boolean {
    return lat >= 6.0 && lat <= 37.0 && lng >= 68.0 && lng <= 98.0;
  }
}

export const mapService = new MapService();
export default mapService;