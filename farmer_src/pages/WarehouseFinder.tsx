import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from "@/components/farmer/FarmerDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import MapWidget from "../../components/widgets/MapWidget";
import AIChatWidget from "../../components/widgets/AIChatWidget";
import { aiService } from "../../services/aiApi";
import { mapService } from "../../services/mapApi";
import {
  Building2,
  MapPin,
  Star,
  Clock,
  Thermometer,
  Shield,
  Truck,
  DollarSign,
  Phone,
  Navigation,
  Search,
  Filter,
  Brain,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Target,
  Zap
} from 'lucide-react';

const WarehouseFinder: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiOptimization, setAiOptimization] = useState<any>(null);

  // Mock warehouse data with detailed information
  const mockWarehouses = [
    {
      id: 'WH001',
      name: 'Central Agricultural Storage',
      address: 'Sector 63, Noida, UP 201301',
      distance: 2.3,
      coordinates: { lat: 28.6139, lng: 77.2090 },
      rating: 4.8,
      capacity: '5000 tons',
      utilization: 75,
      pricing: {
        storage: 250,
        handling: 15,
        insurance: 5
      },
      features: {
        coldStorage: true,
        pestControl: true,
        security24x7: true,
        loadingFacility: true,
        qualityTesting: true
      },
      specializations: ['Rice', 'Wheat', 'Vegetables'],
      contact: {
        phone: '+91 120-4567890',
        manager: 'Rajesh Kumar'
      },
      workingHours: '6:00 AM - 10:00 PM',
      certifications: ['FSSAI', 'ISO 22000'],
      aiScore: 92,
      aiReasons: [
        'Excellent location for your area',
        'Competitive pricing',
        'High customer satisfaction',
        'Specialized in your crop types'
      ]
    },
    {
      id: 'WH002',
      name: 'Green Valley Storage Hub',
      address: 'Village Rampur, Greater Noida, UP',
      distance: 4.7,
      coordinates: { lat: 28.5355, lng: 77.3910 },
      rating: 4.5,
      capacity: '3000 tons',
      utilization: 68,
      pricing: {
        storage: 220,
        handling: 12,
        insurance: 4
      },
      features: {
        coldStorage: false,
        pestControl: true,
        security24x7: true,
        loadingFacility: true,
        qualityTesting: false
      },
      specializations: ['Grains', 'Pulses'],
      contact: {
        phone: '+91 120-9876543',
        manager: 'Priya Sharma'
      },
      workingHours: '7:00 AM - 9:00 PM',
      certifications: ['FSSAI'],
      aiScore: 78,
      aiReasons: [
        'Cost-effective option',
        'Good availability',
        'Suitable for grain storage'
      ]
    },
    {
      id: 'WH003',
      name: 'ModernTech Storage Solutions',
      address: 'Industrial Area, Savar, Dhaka',
      distance: 6.1,
      coordinates: { lat: 28.7041, lng: 77.1025 },
      rating: 4.9,
      capacity: '8000 tons',
      utilization: 82,
      pricing: {
        storage: 300,
        handling: 20,
        insurance: 8
      },
      features: {
        coldStorage: true,
        pestControl: true,
        security24x7: true,
        loadingFacility: true,
        qualityTesting: true
      },
      specializations: ['Fruits', 'Vegetables', 'Dairy'],
      contact: {
        phone: '+91 121-2345678',
        manager: 'Amit Singh'
      },
      workingHours: '24/7',
      certifications: ['FSSAI', 'ISO 22000', 'HACCP'],
      aiScore: 88,
      aiReasons: [
        'Premium facilities',
        'Advanced technology',
        '24/7 operations',
        'Multiple certifications'
      ]
    }
  ];

  const handleSearchWarehouses = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set mock data
      setWarehouses(mockWarehouses);
      
      // Get AI optimization suggestions
      const optimization = await aiService.getWarehouseOptimization(
        [], // Empty inventory for now
        5000, // Capacity
        { temperature: 25, humidity: 65 } // Mock weather
      );
      setAiOptimization(optimization);
      
    } catch (error) {
      console.error('Error searching warehouses:', error);
      alert('Failed to search warehouses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAiScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 55) return 'text-yellow-500';
    return 'text-red-500';
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
                    <Brain className="mr-2 h-4 w-4" />
                    AI Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

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

            {/* AI Optimization Insights */}
            {aiOptimization && (
              <Card className="shadow-fresh border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-primary" />
                    AI Storage Optimization
                  </CardTitle>
                  <CardDescription>Intelligent recommendations for your storage needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        Recommendations
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {aiOptimization.recommendations?.slice(0, 3).map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{rec}</span>
                          </li>
                        )) || ['Monitor temperature regularly', 'Use FIFO inventory system', 'Check humidity levels']}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-blue-500" />
                        Optimization Tips
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {aiOptimization.storageOptimization?.slice(0, 3).map((tip: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{tip}</span>
                          </li>
                        )) || ['Optimize space utilization', 'Group similar products', 'Maintain proper ventilation']}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                        Alerts
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {aiOptimization.alerts?.slice(0, 3).map((alert: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="h-3 w-3 mr-2 text-orange-500 mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{alert}</span>
                          </li>
                        )) || ['Check expiry dates', 'Monitor pest activity', 'Maintain cleanliness']}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                        <div className={`text-2xl font-bold ${getAiScoreColor(warehouse.aiScore)}`}>
                          {warehouse.aiScore}
                        </div>
                        <div className="text-xs text-muted-foreground">AI Score</div>
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
                          <div className="font-medium">₹{warehouse.pricing.storage}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Handling:</span>
                          <div className="font-medium">₹{warehouse.pricing.handling}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Insurance:</span>
                          <div className="font-medium">₹{warehouse.pricing.insurance}</div>
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

                    {/* AI Recommendations */}
                    <div className="border-t pt-3">
                      <h4 className="font-medium text-sm mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-primary" />
                        Why AI Recommends This
                      </h4>
                      <ul className="space-y-1">
                        {warehouse.aiReasons.slice(0, 2).map((reason: string, index: number) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedWarehouse(warehouse)}
                      >
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary-glow">
                        Book Storage
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* AI Chat Assistant */}
        <AIChatWidget 
          context="warehouse storage and selection advice"
          placeholder="Ask about storage options, pricing, or warehouse selection..."
        />
      </div>
    </FarmerDashboardLayout>
  );
};

export default WarehouseFinder;