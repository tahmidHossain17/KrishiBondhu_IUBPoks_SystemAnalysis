import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { mapService, MapLocation, NearbyPlace } from '../../services/mapApi';
import {
  Map as MapIcon,
  MapPin,
  Navigation,
  Maximize2,
  Minimize2,
  Layers,
  Search,
  Truck,
  Building2,
  Sprout
} from 'lucide-react';

// Import Leaflet types and functions
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapWidgetProps {
  initialLocation?: MapLocation;
  showNearbyPlaces?: boolean;
  height?: string;
  markers?: Array<{
    location: MapLocation;
    label: string;
    type: 'warehouse' | 'farm' | 'customer' | 'delivery';
    color?: string;
  }>;
  onLocationSelect?: (location: MapLocation) => void;
  className?: string;
}

const MapWidget: React.FC<MapWidgetProps> = ({
  initialLocation = { lat: 23.8103, lng: 90.4125, address: 'Dhaka, Bangladesh' },
  showNearbyPlaces = true,
  height = '400px',
  markers = [],
  onLocationSelect,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<MapLocation>(initialLocation);

  // Custom marker icons for different types
  const getMarkerIcon = (type: string, color?: string) => {
    const iconColor = color || {
      warehouse: '#3b82f6',
      farm: '#10b981',
      customer: '#f59e0b',
      delivery: '#ef4444'
    }[type] || '#6b7280';

    return L.divIcon({
      html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">
               ${type === 'warehouse' ? '🏭' : 
                 type === 'farm' ? '🌾' : 
                 type === 'customer' ? '🏪' : 
                 type === 'delivery' ? '🚛' : '📍'}
             </div>`,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView(
      [currentLocation.lat, currentLocation.lng], 
      13
    );

    // Add tile layer based on map type
    const tileUrl = mapService.getMapTilesUrl(mapType);
    L.tileLayer(tileUrl, {
      attribution: '© <a href="https://www.maptiler.com/">MapTiler</a> © <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add main location marker
    const mainMarker = L.marker([currentLocation.lat, currentLocation.lng])
      .addTo(map)
      .bindPopup(currentLocation.address || 'Selected Location');

    // Add custom markers
    markers.forEach(marker => {
      const customMarker = L.marker(
        [marker.location.lat, marker.location.lng],
        { icon: getMarkerIcon(marker.type, marker.color) }
      )
        .addTo(map)
        .bindPopup(`<strong>${marker.label}</strong><br>${marker.location.address || 'Location'}`);
    });

    // Handle map clicks
    map.on('click', async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      try {
        const address = await mapService.reverseGeocode(lat, lng);
        if (address) {
          setCurrentLocation(address);
          onLocationSelect?.(address);
          
          // Update main marker
          mainMarker.setLatLng([lat, lng]).setPopupContent(address.address || 'Selected Location');
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      }
    });

    mapInstance.current = map;
  };

  const fetchNearbyPlaces = async () => {
    if (!showNearbyPlaces) return;

    setLoading(true);
    try {
      const warehouses = await mapService.findNearbyPlaces(
        currentLocation.lat, 
        currentLocation.lng, 
        'warehouse'
      );
      const farms = await mapService.findNearbyPlaces(
        currentLocation.lat, 
        currentLocation.lng, 
        'farm'
      );
      
      setNearbyPlaces([...warehouses.slice(0, 3), ...farms.slice(0, 2)]);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeMapType = (type: 'streets' | 'satellite' | 'terrain') => {
    setMapType(type);
    if (mapInstance.current) {
      // Remove existing tile layer and add new one
      mapInstance.current.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          mapInstance.current?.removeLayer(layer);
        }
      });
      
      const tileUrl = mapService.getMapTilesUrl(type);
      L.tileLayer(tileUrl, {
        attribution: '© <a href="https://www.maptiler.com/">MapTiler</a> © <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            const address = await mapService.reverseGeocode(lat, lng);
            if (address) {
              setCurrentLocation(address);
              mapInstance.current?.setView([lat, lng], 15);
              onLocationSelect?.(address);
            }
          } catch (error) {
            console.error('Error getting current location:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(initializeMap, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchNearbyPlaces();
  }, [currentLocation]);

  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const mapHeight = isExpanded ? '600px' : height;

  return (
    <div className="space-y-4">
      <Card className={`border-slate-800 bg-slate-900 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <MapIcon className="mr-2 h-5 w-5 text-blue-400" />
              Location Map
            </div>
            <div className="flex items-center space-x-2">
              {/* Map Type Selector */}
              <div className="flex items-center space-x-1">
                <Button
                  variant={mapType === 'streets' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => changeMapType('streets')}
                  className="px-2 py-1 text-xs"
                >
                  Streets
                </Button>
                <Button
                  variant={mapType === 'satellite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => changeMapType('satellite')}
                  className="px-2 py-1 text-xs"
                >
                  Satellite
                </Button>
                <Button
                  variant={mapType === 'terrain' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => changeMapType('terrain')}
                  className="px-2 py-1 text-xs"
                >
                  Terrain
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                className="border-slate-700 text-slate-300"
              >
                <Navigation className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="border-slate-700 text-slate-300"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Location Info */}
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>{currentLocation.address || 'Loading location...'}</span>
              <span className="text-slate-500">
                ({mapService.formatCoordinates(currentLocation.lat, currentLocation.lng)})
              </span>
            </div>

            {/* Map Container */}
            <div 
              ref={mapRef} 
              style={{ height: mapHeight }}
              className="w-full rounded-lg overflow-hidden border border-slate-700"
            />

            {/* Legend */}
            <div className="flex items-center space-x-4 text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Warehouses</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Farms</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Customers</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Delivery</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Places */}
      {showNearbyPlaces && nearbyPlaces.length > 0 && (
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white text-lg">Nearby Places</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nearbyPlaces.map((place, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      place.type === 'warehouse' ? 'bg-blue-900/20 text-blue-400' :
                      place.type === 'farm' ? 'bg-green-900/20 text-green-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {place.type === 'warehouse' ? <Building2 className="h-4 w-4" /> :
                       place.type === 'farm' ? <Sprout className="h-4 w-4" /> :
                       <MapPin className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{place.name}</p>
                      <p className="text-sm text-slate-400">{place.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-slate-300">
                      {place.distance.toFixed(1)} km
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapWidget;