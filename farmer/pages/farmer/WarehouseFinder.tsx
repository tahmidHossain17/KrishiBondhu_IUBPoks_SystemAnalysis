import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from "@/components/farmer/FarmerDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import MapWidget from "../../components/widgets/MapWidget";
import { WarehouseAPI } from "../../services/warehouseApi";
import {
  Building2,
  MapPin,
  Star,
  Thermometer,
  Shield,
  Truck,
  Phone,
  Navigation,
  Search,
  RefreshCw,
  Target
} from 'lucide-react';

const WarehouseFinder: React.FC = () => {
  const { toast } = useToast();
  const [searchLocation, setSearchLocation] = useState('');
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // No mock data generation - only show real warehouse data

  // Load warehouses on component mount
  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    setIsLoading(true);
    try {
      const result = await WarehouseAPI.getAllWarehouses({
        limit: 20,
        includePerformance: true
      });
      
      if (result.success && result.data) {
        setWarehouses(result.data);
        if (result.data.length === 0) {
          toast({
            title: "No warehouses found",
            description: "No warehouses are currently available in your area. Please try again later.",
            variant: "default"
          });
        } else {
          toast({
            title: "Warehouses loaded",
            description: `Found ${result.data.length} warehouses available.`
          });
        }
      } else {
        setWarehouses([]);
        toast({
          title: "Failed to load warehouses",
          description: "Unable to connect to warehouse service. Please check your connection and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading warehouses:', error);
      setWarehouses([]);
      toast({
        title: "Connection error",
        description: "Unable to load warehouses. Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchWarehouses = async () => {
    if (!searchLocation.trim()) {
      loadWarehouses();
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await WarehouseAPI.getAllWarehouses({
        search: searchLocation,
        limit: 20,
        includePerformance: true
      });
      
      if (result.success && result.data) {
        setWarehouses(result.data);
        if (result.data.length === 0) {
          toast({
            title: "No results found",
            description: `No warehouses found matching "${searchLocation}". Try a different search term.`
          });
        } else {
          toast({
            title: "Search completed",
            description: `Found ${result.data.length} warehouses matching your search.`
          });
        }
      } else {
        setWarehouses([]);
        toast({
          title: "Search failed",
          description: "Unable to search warehouses. Please check your connection and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error searching warehouses:', error);
      setWarehouses([]);
      toast({
        title: "Search error",
        description: "Unable to search warehouses. Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization <= 70) return 'text-green-500';
    if (utilization <= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <FarmerDashboardLayout currentPage="warehouses">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Building2 className="mr-3 h-8 w-8 text-primary" />
              Smart Warehouse Finder
            </h1>
            <p className="text-muted-foreground mt-1">Find the best storage solutions with AI optimization</p>
            <p className="text-sm text-primary font-bengali mt-1">কৃত্রিম বুদ্ধিমত্তা দিয়ে সেরা গুদাম খুঁজুন</p>
          </div>
          <Button variant="outline">
            <Target className="mr-2 h-4 w-4" />
            My Bookings
          </Button>
        </div>

        {/* Search Section */}
        <Card className="shadow-fresh">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-primary" />
              Find Warehouses Near You
            </CardTitle>
            <CardDescription>Enter your location to discover the best storage options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter your location (e.g., Noida, UP)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="text-base"
                />
              </div>
              <Button 
                onClick={handleSearchWarehouses}
                disabled={isLoading}
                className="bg-primary hover:bg-primary-glow px-8"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Warehouses
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && warehouses.length === 0 && (
          <Card className="shadow-fresh">
            <CardContent className="p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-medium text-foreground mb-2">Loading Warehouses</h3>
              <p className="text-muted-foreground">Finding the best storage options for you...</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && warehouses.length === 0 && (
          <Card className="shadow-fresh">
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Warehouses Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchLocation ? 
                  `No warehouses found matching "${searchLocation}". Try a different location.` :
                  'No warehouses available at the moment. Please try again later.'
                }
              </p>
              <Button onClick={loadWarehouses} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardContent>
          </Card>
        )}

        {warehouses.length > 0 && (
          <>
            {/* Map View */}
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-red-500" />
                  Warehouses Map View
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MapWidget 
                  height="400px"
                  showNearbyPlaces={false}
                  markers={warehouses.map(warehouse => ({
                    location: warehouse.coordinates,
                    label: warehouse.name,
                    type: 'warehouse'
                  }))}
                />
              </CardContent>
            </Card>

            {/* Warehouse Listings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {warehouses.map((warehouse) => (
                <Card key={warehouse.id} className="shadow-fresh hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm text-muted-foreground">{warehouse.distance} km away</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{warehouse.rating.toFixed(1)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Basic Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{warehouse.rating}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Capacity: </span>
                          <span className="font-medium">{warehouse.capacity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Utilization */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current Utilization</span>
                        <span className={`font-medium ${getUtilizationColor(warehouse.utilization)}`}>
                          {warehouse.utilization}%
                        </span>
                      </div>
                      <Progress value={warehouse.utilization} className="h-2" />
                    </div>

                    {/* Pricing */}
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Pricing (per ton/month)</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Storage:</span>
                          <div className="font-medium">৳{warehouse.pricing.storage}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Handling:</span>
                          <div className="font-medium">৳{warehouse.pricing.handling}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Insurance:</span>
                          <div className="font-medium">৳{warehouse.pricing.insurance}</div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {warehouse.features.coldStorage && (
                          <Badge variant="outline" className="text-xs">
                            <Thermometer className="h-3 w-3 mr-1" />
                            Cold Storage
                          </Badge>
                        )}
                        {warehouse.features.security24x7 && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            24/7 Security
                          </Badge>
                        )}
                        {warehouse.features.loadingFacility && (
                          <Badge variant="outline" className="text-xs">
                            <Truck className="h-3 w-3 mr-1" />
                            Loading Bay
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedWarehouse(warehouse);
                          toast({
                            title: "Warehouse Details",
                            description: `Viewing details for ${warehouse.name}`,
                          });
                        }}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-primary hover:bg-primary-glow"
                        onClick={() => {
                          setSelectedWarehouse(warehouse);
                          toast({
                            title: "Warehouse Selected",
                            description: `Selected ${warehouse.name} for booking. Navigate to Nearby Warehouses to complete booking.`,
                          });
                        }}
                      >
                        Book Storage
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          window.location.href = `tel:${warehouse.contact.phone}`;
                        }}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Navigation",
                            description: "Opening directions to warehouse...",
                          });
                        }}
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </FarmerDashboardLayout>
  );
};

export default WarehouseFinder;