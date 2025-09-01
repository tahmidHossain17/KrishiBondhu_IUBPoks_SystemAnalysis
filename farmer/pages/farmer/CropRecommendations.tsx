import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from "@/components/farmer/FarmerDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AIChatWidget from "../../components/widgets/AIChatWidget";
import WeatherWidget from "../../components/widgets/WeatherWidget";
import { aiService } from "../../services/aiApi";
import { weatherService } from "../../services/weatherApi";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sprout,
  Brain,
  TrendingUp,
  Calendar,
  Droplets,
  Thermometer,
  DollarSign,
  MapPin,
  Star,
  AlertTriangle,
  Lightbulb,
  Target,
  Leaf,
  Sun,
  CloudRain,
  RefreshCw,
  Download,
  BookOpen,
  Package,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react';

const CropRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useState('');
  const [season, setSeason] = useState('');
  const [soilType, setSoilType] = useState('');
  const [landSize, setLandSize] = useState('');
  const [phLevel, setPhLevel] = useState('');
  const [drainage, setDrainage] = useState('');
  const [cropHistory, setCropHistory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [marketInsights, setMarketInsights] = useState<any[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<any>(null);
  const [currentCrops, setCurrentCrops] = useState<any[]>([]);
  const [farmerProfile, setFarmerProfile] = useState<any>(null);
  const [showAddCropForm, setShowAddCropForm] = useState(false);
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [editingCrop, setEditingCrop] = useState<any>(null);
  const [isEditingCrop, setIsEditingCrop] = useState(false);
  const [cropForm, setCropForm] = useState({
    crop_name: '',
    variety: '',
    planted_area: '',
    planted_area_unit: 'acres',
    planting_date: '',
    expected_harvest_date: '',
    crop_status: 'planned',
    season: '',
    irrigation_method: '',
    organic_certified: false,
    location: '',
    notes: ''
  });
  const [editForm, setEditForm] = useState({
    crop_name: '',
    variety: '',
    planted_area: '',
    planted_area_unit: 'acres',
    planting_date: '',
    expected_harvest_date: '',
    crop_status: 'planned',
    season: '',
    irrigation_method: '',
    organic_certified: false,
    location: '',
    notes: ''
  });

  // Fetch farmer profile and current crops
  useEffect(() => {
    if (user) {
      fetchFarmerProfile();
    }
  }, [user]);

  const fetchFarmerProfile = async () => {
    if (!user) return;

    try {
      // First get the user's profile, then get farmer profile via profile_id
      const { data: userProfile, error: userProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userProfileError && userProfileError.code !== 'PGRST116') {
        console.error('User profile error:', userProfileError);
        return;
      }

      // Fetch farmer profile using profile_id relationship
      if (userProfile) {
        const { data: farmerData, error: profileError } = await supabase
          .from('farmer_profiles')
          .select('*')
          .eq('profile_id', userProfile.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching farmer profile:', profileError);
          return;
        }

        if (farmerData) {
          setFarmerProfile(farmerData);
          await fetchCurrentCrops(farmerData.id);
        }
      }
    } catch (error) {
      console.error('Error in fetchFarmerProfile:', error);
    }
  };

  const fetchCurrentCrops = async (farmerId: string) => {
    try {
      // Using type assertion since farmer_crops table is not yet in TypeScript types
      const { data: crops, error } = await (supabase as any)
        .from('farmer_crops')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching current crops:', error);
        toast({
          title: "Error",
          description: "Failed to load current crops data.",
          variant: "destructive"
        });
        return;
      }

      if (crops && crops.length > 0) {
        // Transform crops data to match the expected format
        const transformedCrops = crops.map((crop: any) => {
          const expectedHarvestDate = crop.expected_harvest_date ? new Date(crop.expected_harvest_date) : null;
          const currentDate = new Date();
          let daysLeft = 0;

          if (expectedHarvestDate) {
            daysLeft = Math.ceil((expectedHarvestDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 0) {
              daysLeft = 0;
            }
          }

          return {
            id: crop.id,
            name: crop.crop_name,
            variety: crop.variety || 'Standard',
            area: crop.planted_area ? `${crop.planted_area} ${crop.planted_area_unit || 'acres'}` : 'N/A',
            season: crop.season || 'Not specified',
            status: crop.crop_status,
            daysLeft: daysLeft,
            organic: crop.organic_certified || false,
            planting_date: crop.planting_date,
            expected_harvest_date: crop.expected_harvest_date,
            irrigation_method: crop.irrigation_method,
            location: crop.location,
            notes: crop.notes
          };
        });

        setCurrentCrops(transformedCrops);
      } else {
        // No crops found, set empty array
        setCurrentCrops([]);
      }
    } catch (error) {
      console.error('Error in fetchCurrentCrops:', error);
      toast({
        title: "Error",
        description: "Failed to load current crops data.",
        variant: "destructive"
      });
    }
  };

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!farmerProfile) {
      toast({
        title: "Error",
        description: "Farmer profile not found. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }

    if (!cropForm.crop_name || !cropForm.planted_area) {
      toast({
        title: "Missing Information",
        description: "Please fill in crop name and planted area.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingCrop(true);
    
    try {
      const { data, error } = await (supabase as any)
        .from('farmer_crops')
        .insert({
          farmer_id: farmerProfile.id,
          crop_name: cropForm.crop_name,
          variety: cropForm.variety || null,
          planted_area: parseFloat(cropForm.planted_area),
          planted_area_unit: cropForm.planted_area_unit,
          planting_date: cropForm.planting_date || null,
          expected_harvest_date: cropForm.expected_harvest_date || null,
          crop_status: cropForm.crop_status,
          season: cropForm.season || null,
          irrigation_method: cropForm.irrigation_method || null,
          organic_certified: cropForm.organic_certified,
          location: cropForm.location || null,
          notes: cropForm.notes || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding crop:', error);
        toast({
          title: "Error",
          description: `Failed to add crop: ${error.message}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Crop Added Successfully!",
          description: `${cropForm.crop_name} has been added to your crop list.`,
        });
        
        // Reset form and close modal
        setCropForm({
          crop_name: '',
          variety: '',
          planted_area: '',
          planted_area_unit: 'acres',
          planting_date: '',
          expected_harvest_date: '',
          crop_status: 'planned',
          season: '',
          irrigation_method: '',
          organic_certified: false,
          location: '',
          notes: ''
        });
        setShowAddCropForm(false);
        
        // Refresh crops list
        if (farmerProfile) {
          await fetchCurrentCrops(farmerProfile.id);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsAddingCrop(false);
    }
  };

  const deleteCrop = async (cropId: string) => {
    if (!confirm('Are you sure you want to delete this crop?')) {
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('farmer_crops')
        .delete()
        .eq('id', cropId);

      if (error) {
        console.error('Error deleting crop:', error);
        toast({
          title: "Error",
          description: "Failed to delete crop.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Crop deleted",
          description: "Crop has been removed from your list.",
        });
        
        // Refresh crops list
        if (farmerProfile) {
          fetchCurrentCrops(farmerProfile.id);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Add recommended crop to current crops
  const addRecommendedCrop = async (recommendation: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add crops to your profile.",
        variant: "destructive"
      });
      return;
    }

    if (!farmerProfile) {
      toast({
        title: "Profile Required",
        description: "Please complete your farmer profile first.",
        variant: "destructive"
      });
      return;
    }

    // Check if crop already exists
    const existingCrop = currentCrops.find(crop => 
      crop.name.toLowerCase() === recommendation.crop.toLowerCase()
    );

    if (existingCrop) {
      toast({
        title: "Crop Already Added",
        description: `${recommendation.crop} is already in your Current Crops Status.`,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAddingCrop(true);

      const cropData = {
        farmer_id: farmerProfile.id,
        crop_name: recommendation.crop,
        variety: 'AI Recommended',
        planted_area: null, // Will be set by farmer later
        planted_area_unit: 'acres',
        planting_date: null,
        expected_harvest_date: null,
        crop_status: 'planned',
        season: recommendation.season || season,
        irrigation_method: null,
        organic_certified: false,
        location: location || null,
        notes: `AI Recommended: ${recommendation.reason}. Suitability: ${recommendation.suitability}%`
      };

      // Using type assertion since farmer_crops table is not yet in TypeScript types
      const { data, error } = await (supabase as any)
        .from('farmer_crops')
        .insert([cropData])
        .select()
        .single();

      if (error) {
        console.error('Error adding recommended crop:', error);
        
        // Check for specific authentication errors
        if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please log in again.",
            variant: "destructive"
          });
        } else if (error.code === 'PGRST116') {
          toast({
            title: "Profile Error",
            description: "Farmer profile not found. Please complete your profile.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: `Failed to add crop: ${error.message || 'Unknown error'}`,
            variant: "destructive"
          });
        }
        return;
      }

      toast({
        title: "Success",
        description: `${recommendation.crop} has been added to your Current Crops Status!`,
      });

      // Refresh current crops to show the new addition
      if (farmerProfile?.id) {
        await fetchCurrentCrops(farmerProfile.id);
      }
    } catch (error: any) {
      console.error('Error in addRecommendedCrop:', error);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message || 'Please try again.'}`,
        variant: "destructive"
      });
    } finally {
      setIsAddingCrop(false);
    }
  };

  const startEditCrop = (crop: any) => {
    setEditingCrop(crop);
    setEditForm({
      crop_name: crop.name || '',
      variety: crop.variety || '',
      planted_area: crop.area ? crop.area.split(' ')[0] : '',
      planted_area_unit: crop.area ? crop.area.split(' ')[1] || 'acres' : 'acres',
      planting_date: crop.planting_date || '',
      expected_harvest_date: crop.expected_harvest_date || '',
      crop_status: crop.status || 'planned',
      season: crop.season || '',
      irrigation_method: crop.irrigation_method || '',
      organic_certified: crop.organic || false,
      location: crop.location || '',
      notes: crop.notes || ''
    });
    setShowAddCropForm(false); // Close add form if open
  };

  const cancelEdit = () => {
    setEditingCrop(null);
    setEditForm({
      crop_name: '',
      variety: '',
      planted_area: '',
      planted_area_unit: 'acres',
      planting_date: '',
      expected_harvest_date: '',
      crop_status: 'planned',
      season: '',
      irrigation_method: '',
      organic_certified: false,
      location: '',
      notes: ''
    });
  };

  const handleEditCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCrop) return;
    
    if (!editForm.crop_name || !editForm.planted_area) {
      toast({
        title: "Missing Information",
        description: "Please fill in crop name and planted area.",
        variant: "destructive"
      });
      return;
    }

    setIsEditingCrop(true);
    
    try {
      const { data, error } = await (supabase as any)
        .from('farmer_crops')
        .update({
          crop_name: editForm.crop_name,
          variety: editForm.variety || null,
          planted_area: parseFloat(editForm.planted_area),
          planted_area_unit: editForm.planted_area_unit,
          planting_date: editForm.planting_date || null,
          expected_harvest_date: editForm.expected_harvest_date || null,
          crop_status: editForm.crop_status,
          season: editForm.season || null,
          irrigation_method: editForm.irrigation_method || null,
          organic_certified: editForm.organic_certified,
          location: editForm.location || null,
          notes: editForm.notes || null
        })
        .eq('id', editingCrop.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating crop:', error);
        toast({
          title: "Error",
          description: `Failed to update crop: ${error.message}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Crop Updated Successfully!",
          description: `${editForm.crop_name} has been updated.`,
        });
        
        // Cancel edit mode and refresh crops list
        cancelEdit();
        if (farmerProfile) {
          await fetchCurrentCrops(farmerProfile.id);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsEditingCrop(false);
    }
  };

  // Mock current crops for comparison - REMOVED DUMMY DATA
  // const currentCrops = [
  //   { name: 'Rice', area: '2.5 acres', season: 'বর্ষা (Barsha)', status: 'growing', daysLeft: 45 },
  //   { name: 'Wheat', area: '1.8 acres', season: 'শীত (Sheet)', status: 'planning', daysLeft: 120 },
  // ];

  // Bangladeshi soil types
  const bangladeshiSoilTypes = [
    { value: "clay", label: "কাদামাটি (Clay)", english: "Clay" },
    { value: "sandy", label: "বালুকা মাটি (Sandy)", english: "Sandy" },
    { value: "loamy", label: "দোআঁশ মাটি (Loamy)", english: "Loamy" },
    { value: "silt", label: "পলি মাটি (Silt)", english: "Silt" },
    { value: "alluvial", label: "পলিমাটি (Alluvial)", english: "Alluvial" },
    { value: "red", label: "লাল মাটি (Red Soil)", english: "Red Soil" },
    { value: "black", label: "কালো মাটি (Black Soil)", english: "Black Soil" },
    { value: "peat", label: "পিট মাটি (Peat)", english: "Peat" },
    { value: "laterite", label: "লেটেরাইট মাটি (Laterite)", english: "Laterite" }
  ];

  const handleGetRecommendations = async () => {
    if (!location || !season || !soilType) {
      toast({
        title: "Missing Information",
        description: "Please fill in location, season, and soil type to get AI recommendations.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get weather data for location
      const weather = await weatherService.getCurrentWeather(location);
      setWeatherData(weather);

      // Get environmental data based on location
      const envData = await getEnvironmentalData(location);
      setEnvironmentalData(envData);

      // Get AI crop recommendations with enhanced parameters
      const enhancedParams = {
        location,
        season,
        soilType,
        landSize,
        phLevel: phLevel || null,
        drainage,
        cropHistory,
        environmentalData: envData
      };
      
      const cropRecs = await aiService.getCropRecommendations(location, season, soilType, weather, enhancedParams);
      setRecommendations(cropRecs);

      // Get market insights for recommended crops
      const cropNames = cropRecs.map(crop => crop.crop);
      const market = await aiService.getMarketInsights(cropNames, location);
      setMarketInsights(market);

      // Show success message
      if (cropRecs.length > 0) {
        toast({
          title: "Recommendations Generated",
          description: `Found ${cropRecs.length} crop recommendations for your area.`,
        });
      }

    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Recommendation Error",
        description: "Unable to get AI recommendations. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get environmental data based on location
  const getEnvironmentalData = async (location: string) => {
    try {
      // Mock environmental data - in real implementation, this would fetch from multiple APIs
      return {
        climate: {
          avgTemperature: 26.5,
          avgRainfall: 1200,
          humidity: 75,
          sunlightHours: 6.5
        },
        soil: {
          organicMatter: 2.3,
          nitrogen: 0.8,
          phosphorus: 45,
          potassium: 120
        },
        geography: {
          elevation: 45,
          waterTable: 8.5,
          floodRisk: 'medium'
        },
        market: {
          nearestMarket: '15 km',
          transportCost: 'low',
          demand: 'high'
        }
      };
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      return null;
    }
  };

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMarketTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'text-green-500';
      case 'stable': return 'text-blue-500';
      case 'falling': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <FarmerDashboardLayout currentPage="crops">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Brain className="mr-3 h-8 w-8 text-primary" />
              AI Crop Recommendations
            </h1>
            <p className="text-muted-foreground mt-1">Get intelligent crop suggestions based on AI analysis</p>
            <p className="text-sm text-primary font-bengali mt-1">কৃত্রিম বুদ্ধিমত্তা ভিত্তিক ফসল পরামর্শ</p>
          </div>
          <Button variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            Crop Guide
          </Button>
        </div>

        {/* Input Form & Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Input Form */}
          <Card className="lg:col-span-2 shadow-fresh">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Get AI Recommendations
              </CardTitle>
              <CardDescription>Provide your farm details for personalized crop suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Dhaka, Bangladesh"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="season">Season</Label>
                    <Select value={season} onValueChange={setSeason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sheet">শীত (Sheet) - Winter</SelectItem>
                        <SelectItem value="bashonto">বসন্ত (Bashonto) - Spring</SelectItem>
                        <SelectItem value="grisma">গ্রীষ্ম (Grisma) - Summer</SelectItem>
                        <SelectItem value="barsha">বর্ষা (Barsha) - Monsoon</SelectItem>
                        <SelectItem value="shorot">শরৎ (Shorot) - Autumn</SelectItem>
                        <SelectItem value="hemonto">হেমন্ত (Hemonto) - Late Autumn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="soilType">মাটির ধরন (Soil Type)</Label>
                    <Select value={soilType} onValueChange={setSoilType}>
                      <SelectTrigger>
                        <SelectValue placeholder="মাটির ধরন নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {bangladeshiSoilTypes.map((soil) => (
                          <SelectItem key={soil.value} value={soil.value}>
                            {soil.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landSize">Land Size (acres)</Label>
                    <Input
                      id="landSize"
                      type="number"
                      placeholder="e.g., 5"
                      value={landSize}
                      onChange={(e) => setLandSize(e.target.value)}
                    />
                  </div>
                </div>

                {/* Third Row - Optional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phLevel" className="flex items-center">
                      pH Level (Optional)
                      <span className="ml-1 text-xs text-muted-foreground">(0-14)</span>
                    </Label>
                    <Input
                      id="phLevel"
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      placeholder="e.g., 6.5"
                      value={phLevel}
                      onChange={(e) => setPhLevel(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drainage">ড্রেনেজ ব্যবস্থা (Drainage)</Label>
                    <Select value={drainage} onValueChange={setDrainage}>
                      <SelectTrigger>
                        <SelectValue placeholder="ড্রেনেজ আছে কি না?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">হ্যাঁ (Yes) - Good Drainage</SelectItem>
                        <SelectItem value="no">না (No) - Poor Drainage</SelectItem>
                        <SelectItem value="moderate">মাঝারি (Moderate) - Average Drainage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Fourth Row - Crop History */}
                <div className="space-y-2">
                  <Label htmlFor="cropHistory">
                    ফসলের ইতিহাস (Crop History)
                    <span className="ml-1 text-xs text-muted-foreground">
                      - Previous crops grown on this land
                    </span>
                  </Label>
                  <Input
                    id="cropHistory"
                    placeholder="e.g., Rice (2023), Wheat (2022), Vegetables (2021)..."
                    value={cropHistory}
                    onChange={(e) => setCropHistory(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    এই তথ্যটি আগে চাষ করা ফসলের ভিত্তিতে আরো ভালো সুপারিশ দিতে সাহায্য করবে
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleGetRecommendations}
                disabled={isLoading}
                className="w-full mt-4 bg-primary hover:bg-primary-glow"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Get AI Recommendations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Weather Widget */}
          <WeatherWidget 
            location={location || "Dhaka, BD"} 
            showForecast={true} 
            showAlerts={true}
          />
        </div>

        {/* Current Crops Status */}
        <Card className="shadow-fresh">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Sprout className="mr-2 h-5 w-5 text-green-600" />
                Current Crops Status
              </div>
              {farmerProfile && !editingCrop && (
                <Button
                  size="sm"
                  onClick={() => {
                    setShowAddCropForm(true);
                    setEditingCrop(null); // Close edit form if open
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Crop
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              Your current crops from the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!user ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                <p>Please log in to view your current crops status.</p>
              </div>
            ) : !farmerProfile ? (
              <div className="text-center py-8 text-muted-foreground">
                <RefreshCw className="mx-auto h-8 w-8 mb-4 animate-spin" />
                <p>Loading your farmer profile...</p>
              </div>
            ) : currentCrops.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-4" />
                <p>No crops found in your records.</p>
                <p className="text-sm mt-2">Click "Add Crop" to start tracking your crops.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCrops.map((crop, index) => (
                  <div key={crop.id || index} className="p-4 border rounded-lg bg-accent/10 relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{crop.name}</h3>
                      <div className="flex items-center space-x-2">
                        {crop.organic && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Organic
                          </Badge>
                        )}
                        <Badge className={{
                          'growing': 'bg-green-600',
                          'planned': 'bg-blue-600',
                          'planted': 'bg-blue-600',
                          'ready soon': 'bg-orange-600',
                          'harvested': 'bg-gray-600',
                          'sold': 'bg-purple-600'
                        }[crop.status] || 'bg-blue-600'}>
                          {crop.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditCrop(crop)}
                          className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteCrop(crop.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span>Area: {crop.area}</span>
                        <span>Season: {crop.season}</span>
                        {crop.variety && (
                          <span className="col-span-2">Variety: {crop.variety}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {crop.daysLeft > 0 ? `${crop.daysLeft} days to harvest` : 
                           crop.status === 'harvested' ? 'Already harvested' : 
                           'Harvest date not set'}
                        </span>
                      </div>
                      {crop.notes && (
                        <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                          <strong>Notes:</strong> {crop.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Crop Form Modal */}
        {showAddCropForm && (
          <Card className="shadow-fresh border-green-200 bg-green-50/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Plus className="mr-2 h-5 w-5 text-green-600" />
                  Add New Crop
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddCropForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Add a new crop to track its progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCrop} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop_name">Crop Name *</Label>
                    <Input
                      id="crop_name"
                      placeholder="e.g., Rice, Wheat, Tomato"
                      value={cropForm.crop_name}
                      onChange={(e) => setCropForm({...cropForm, crop_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variety">Variety</Label>
                    <Input
                      id="variety"
                      placeholder="e.g., BRRI Dhan 29, Local"
                      value={cropForm.variety}
                      onChange={(e) => setCropForm({...cropForm, variety: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planted_area">Planted Area *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="planted_area"
                        type="number"
                        placeholder="5.5"
                        value={cropForm.planted_area}
                        onChange={(e) => setCropForm({...cropForm, planted_area: e.target.value})}
                        required
                        min="0.1"
                        step="0.1"
                        className="flex-1"
                      />
                      <Select value={cropForm.planted_area_unit} onValueChange={(value) => setCropForm({...cropForm, planted_area_unit: value})}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acres">Acres</SelectItem>
                          <SelectItem value="hectares">Hectares</SelectItem>
                          <SelectItem value="bigha">Bigha</SelectItem>
                          <SelectItem value="katha">Katha</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crop_status">Status</Label>
                    <Select value={cropForm.crop_status} onValueChange={(value) => setCropForm({...cropForm, crop_status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="planted">Planted</SelectItem>
                        <SelectItem value="growing">Growing</SelectItem>
                        <SelectItem value="ready soon">Ready Soon</SelectItem>
                        <SelectItem value="harvested">Harvested</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planting_date">Planting Date</Label>
                    <Input
                      id="planting_date"
                      type="date"
                      value={cropForm.planting_date}
                      onChange={(e) => setCropForm({...cropForm, planting_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected_harvest_date">Expected Harvest Date</Label>
                    <Input
                      id="expected_harvest_date"
                      type="date"
                      value={cropForm.expected_harvest_date}
                      onChange={(e) => setCropForm({...cropForm, expected_harvest_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="season">Season</Label>
                    <Select value={cropForm.season} onValueChange={(value) => setCropForm({...cropForm, season: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="বর্ষা (Barsha)">বর্ষা (Barsha) - Monsoon</SelectItem>
                        <SelectItem value="শীত (Sheet)">শীত (Sheet) - Winter</SelectItem>
                        <SelectItem value="গ্রীষ্ম (Grishmo)">গ্রীষ্ম (Grishmo) - Summer</SelectItem>
                        <SelectItem value="শরৎ (Shorot)">শরৎ (Shorot) - Autumn</SelectItem>
                        <SelectItem value="হেমন্ত (Hemonto)">হেমন্ত (Hemonto) - Late Autumn</SelectItem>
                        <SelectItem value="বসন্ত (Bashonto)">বসন্ত (Bashonto) - Spring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="irrigation_method">Irrigation Method</Label>
                    <Input
                      id="irrigation_method"
                      placeholder="e.g., Flood irrigation, Drip irrigation"
                      value={cropForm.irrigation_method}
                      onChange={(e) => setCropForm({...cropForm, irrigation_method: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Plot 5, North Field"
                    value={cropForm.location}
                    onChange={(e) => setCropForm({...cropForm, location: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about this crop..."
                    value={cropForm.notes}
                    onChange={(e) => setCropForm({...cropForm, notes: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="organic_certified"
                    type="checkbox"
                    checked={cropForm.organic_certified}
                    onChange={(e) => setCropForm({...cropForm, organic_certified: e.target.checked})}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <Label htmlFor="organic_certified" className="text-sm font-medium">
                    Organic Certified
                  </Label>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit"
                    disabled={isAddingCrop}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isAddingCrop ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {isAddingCrop ? 'Adding Crop...' : 'Add Crop'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddCropForm(false)}
                    disabled={isAddingCrop}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Edit Crop Form Modal */}
        {editingCrop && (
          <Card className="shadow-fresh border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Edit className="mr-2 h-5 w-5 text-blue-600" />
                  Edit Crop: {editingCrop.name}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={cancelEdit}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Update your crop information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditCrop} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_crop_name">Crop Name *</Label>
                    <Input
                      id="edit_crop_name"
                      placeholder="e.g., Rice, Wheat, Tomato"
                      value={editForm.crop_name}
                      onChange={(e) => setEditForm({...editForm, crop_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_variety">Variety</Label>
                    <Input
                      id="edit_variety"
                      placeholder="e.g., BRRI Dhan 29, Local"
                      value={editForm.variety}
                      onChange={(e) => setEditForm({...editForm, variety: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_planted_area">Planted Area *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="edit_planted_area"
                        type="number"
                        placeholder="5.5"
                        value={editForm.planted_area}
                        onChange={(e) => setEditForm({...editForm, planted_area: e.target.value})}
                        required
                        min="0.1"
                        step="0.1"
                        className="flex-1"
                      />
                      <Select value={editForm.planted_area_unit} onValueChange={(value) => setEditForm({...editForm, planted_area_unit: value})}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acres">Acres</SelectItem>
                          <SelectItem value="hectares">Hectares</SelectItem>
                          <SelectItem value="bigha">Bigha</SelectItem>
                          <SelectItem value="katha">Katha</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_crop_status">Status</Label>
                    <Select value={editForm.crop_status} onValueChange={(value) => setEditForm({...editForm, crop_status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="planted">Planted</SelectItem>
                        <SelectItem value="growing">Growing</SelectItem>
                        <SelectItem value="ready soon">Ready Soon</SelectItem>
                        <SelectItem value="harvested">Harvested</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_planting_date">Planting Date</Label>
                    <Input
                      id="edit_planting_date"
                      type="date"
                      value={editForm.planting_date}
                      onChange={(e) => setEditForm({...editForm, planting_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_expected_harvest_date">Expected Harvest Date</Label>
                    <Input
                      id="edit_expected_harvest_date"
                      type="date"
                      value={editForm.expected_harvest_date}
                      onChange={(e) => setEditForm({...editForm, expected_harvest_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_season">Season</Label>
                    <Select value={editForm.season} onValueChange={(value) => setEditForm({...editForm, season: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="বর্ষা (Barsha)">বর্ষা (Barsha) - Monsoon</SelectItem>
                        <SelectItem value="শীত (Sheet)">শীত (Sheet) - Winter</SelectItem>
                        <SelectItem value="গ্রীষ্ম (Grishmo)">গ্রীষ্ম (Grishmo) - Summer</SelectItem>
                        <SelectItem value="শরৎ (Shorot)">শরৎ (Shorot) - Autumn</SelectItem>
                        <SelectItem value="হেমন্ত (Hemonto)">হেমন্ত (Hemonto) - Late Autumn</SelectItem>
                        <SelectItem value="বসন্ত (Bashonto)">বসন্ত (Bashonto) - Spring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_irrigation_method">Irrigation Method</Label>
                    <Input
                      id="edit_irrigation_method"
                      placeholder="e.g., Flood irrigation, Drip irrigation"
                      value={editForm.irrigation_method}
                      onChange={(e) => setEditForm({...editForm, irrigation_method: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_location">Location</Label>
                  <Input
                    id="edit_location"
                    placeholder="e.g., Plot 5, North Field"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_notes">Notes</Label>
                  <Textarea
                    id="edit_notes"
                    placeholder="Any additional information about this crop..."
                    value={editForm.notes}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="edit_organic_certified"
                    type="checkbox"
                    checked={editForm.organic_certified}
                    onChange={(e) => setEditForm({...editForm, organic_certified: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="edit_organic_certified" className="text-sm font-medium">
                    Organic Certified
                  </Label>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit"
                    disabled={isEditingCrop}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isEditingCrop ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Edit className="mr-2 h-4 w-4" />
                    )}
                    {isEditingCrop ? 'Updating Crop...' : 'Update Crop'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={isEditingCrop}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* AI Recommendations Results */}
        {recommendations.length > 0 && (
          <div className="space-y-6">
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                  AI Crop Recommendations
                </CardTitle>
                <CardDescription>Based on your location, season, soil type, and weather conditions</CardDescription>
                {/* Show info banner when using fallback data */}
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    <span>ℹ️ Using local agricultural database for recommendations.</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((rec, index) => (
                    <Card key={index} className="border-primary/20 hover:border-primary/40 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{rec.crop}</CardTitle>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getSuitabilityColor(rec.suitability)}`}>
                              {rec.suitability}%
                            </div>
                            <div className="text-xs text-muted-foreground">Suitability</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Progress value={rec.suitability} className="h-2" />
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            <span>Best Season: {rec.season}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                            <span>Expected Yield: {rec.expectedYield}</span>
                          </div>
                        </div>

                        <div className="p-2 bg-accent/20 rounded text-xs">
                          <p className="font-medium mb-1">AI Insight:</p>
                          <p>{rec.reason}</p>
                        </div>

                        {/* Market Info if available */}
                        {marketInsights.find(m => m.crop === rec.crop) && (
                          <div className="border-t pt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Market Price:</span>
                              <span className="font-medium">
                                {marketInsights.find(m => m.crop === rec.crop)?.currentPrice}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs mt-1">
                              <span>Trend:</span>
                              <span className={`font-medium ${getMarketTrendColor(
                                marketInsights.find(m => m.crop === rec.crop)?.trend || ''
                              )}`}>
                                {marketInsights.find(m => m.crop === rec.crop)?.trend?.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Add to My Crops Button */}
                        <div className="border-t pt-3">
                          <Button
                            onClick={() => addRecommendedCrop(rec)}
                            disabled={isAddingCrop || !user || !farmerProfile}
                            className="w-full bg-primary hover:bg-primary-glow text-white"
                            size="sm"
                          >
                            {isAddingCrop ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              <>
                                <Plus className="mr-2 h-4 w-4" />
                                Add to My Crops
                              </>
                            )}
                          </Button>
                          {(!user || !farmerProfile) && (
                            <p className="text-xs text-muted-foreground mt-1 text-center">
                              {!user ? 'Please log in to add crops' : 'Complete profile to add crops'}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Environmental Data Analysis */}
            {environmentalData && (
              <Card className="shadow-fresh">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-blue-600" />
                    Environmental Analysis for {location}
                  </CardTitle>
                  <CardDescription>
                    Based on location data, our AI has considered the following environmental parameters in the research:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Climate Data */}
                    <Card className="border-blue-200 bg-blue-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <Thermometer className="h-4 w-4 mr-2 text-blue-500" />
                          Climate Data
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Avg Temperature:</span>
                          <span className="font-medium">{environmentalData.climate.avgTemperature}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Rainfall:</span>
                          <span className="font-medium">{environmentalData.climate.avgRainfall}mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Humidity:</span>
                          <span className="font-medium">{environmentalData.climate.humidity}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sunlight Hours:</span>
                          <span className="font-medium">{environmentalData.climate.sunlightHours}hrs/day</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Soil Composition */}
                    <Card className="border-green-200 bg-green-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <Leaf className="h-4 w-4 mr-2 text-green-500" />
                          Soil Composition
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Organic Matter:</span>
                          <span className="font-medium">{environmentalData.soil.organicMatter}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nitrogen:</span>
                          <span className="font-medium">{environmentalData.soil.nitrogen}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phosphorus:</span>
                          <span className="font-medium">{environmentalData.soil.phosphorus}ppm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Potassium:</span>
                          <span className="font-medium">{environmentalData.soil.potassium}ppm</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Geography */}
                    <Card className="border-purple-200 bg-purple-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                          Geography
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Elevation:</span>
                          <span className="font-medium">{environmentalData.geography.elevation}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Water Table:</span>
                          <span className="font-medium">{environmentalData.geography.waterTable}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Flood Risk:</span>
                          <span className="font-medium capitalize">{environmentalData.geography.floodRisk}</span>
                        </div>
                        {phLevel && (
                          <div className="flex justify-between">
                            <span>Soil pH:</span>
                            <span className="font-medium">{phLevel}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Market Access */}
                    <Card className="border-orange-200 bg-orange-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-orange-500" />
                          Market Access
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Nearest Market:</span>
                          <span className="font-medium">{environmentalData.market.nearestMarket}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transport Cost:</span>
                          <span className="font-medium capitalize">{environmentalData.market.transportCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Market Demand:</span>
                          <span className="font-medium capitalize">{environmentalData.market.demand}</span>
                        </div>
                        {drainage && (
                          <div className="flex justify-between">
                            <span>Drainage:</span>
                            <span className="font-medium">
                              {drainage === 'yes' ? 'Good' : drainage === 'no' ? 'Poor' : 'Moderate'}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Information */}
                  {cropHistory && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        Crop History Analysis
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Previous crops considered: <span className="font-medium">{cropHistory}</span>
                      </p>
                      <p className="text-xs text-blue-600">
                        ℹ️ Our AI used this crop rotation data to recommend crops that will improve soil health and maximize yield.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Market Insights */}
            {marketInsights.length > 0 && (
              <Card className="shadow-fresh">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                    Market Insights
                  </CardTitle>
                  <CardDescription>Current market trends for recommended crops</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketInsights.map((insight, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{insight.crop}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">{insight.currentPrice}</span>
                            <Badge className={
                              insight.trend === 'rising' ? 'bg-green-600' :
                              insight.trend === 'stable' ? 'bg-blue-600' : 'bg-red-600'
                            }>
                              {insight.trend}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* AI Chat Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIChatWidget 
            context="crop recommendations and farming advice"
            placeholder="Ask about crops, planting schedules, or farming techniques..."
          />

          {/* Quick Tips */}
          <Card className="shadow-fresh">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                AI Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Sun className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="font-medium text-sm">Weather Tip</span>
                  </div>
                  <p className="text-sm">Monsoon season is ideal for rice cultivation. Plan your sowing accordingly.</p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium text-sm">Market Tip</span>
                  </div>
                  <p className="text-sm">Vegetable prices tend to rise in winter. Consider growing tomatoes and cauliflower.</p>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Leaf className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium text-sm">Soil Tip</span>
                  </div>
                  <p className="text-sm">Clay soil retains moisture well, making it suitable for rice and wheat cultivation.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default CropRecommendations;