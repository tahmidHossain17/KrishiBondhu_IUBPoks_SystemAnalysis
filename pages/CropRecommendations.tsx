import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from "@/components/farmer/FarmerDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  BookOpen
} from 'lucide-react';

const CropRecommendations: React.FC = () => {
  const [location, setLocation] = useState('');
  const [season, setSeason] = useState('');
  const [soilType, setSoilType] = useState('');
  const [landSize, setLandSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [marketInsights, setMarketInsights] = useState<any[]>([]);

  // Mock current crops for comparison
  const currentCrops = [
    { name: 'Rice', area: '2.5 acres', season: 'Kharif', status: 'growing', daysLeft: 45 },
    { name: 'Wheat', area: '1.8 acres', season: 'Rabi', status: 'planning', daysLeft: 120 },
  ];

  const handleGetRecommendations = async () => {
    if (!location || !season || !soilType) {
      alert('Please fill in all fields to get AI recommendations');
      return;
    }

    setIsLoading(true);
    try {
      // Get weather data for location
      const weather = await weatherService.getCurrentWeather(location);
      setWeatherData(weather);

      // Get AI crop recommendations
      const cropRecs = await aiService.getCropRecommendations(location, season, soilType, weather);
      setRecommendations(cropRecs);

      // Get market insights for recommended crops
      const cropNames = cropRecs.map(crop => crop.crop);
      const market = await aiService.getMarketInsights(cropNames, location);
      setMarketInsights(market);

    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setIsLoading(false);
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
                      <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                      <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                      <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Select value={soilType} onValueChange={setSoilType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type " />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="loam">Loam</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="silt">Silt</SelectItem>
                      <SelectItem value="alluvial">Alluvial</SelectItem>
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
            <CardTitle className="flex items-center">
              <Sprout className="mr-2 h-5 w-5 text-green-600" />
              Current Crops Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCrops.map((crop, index) => (
                <div key={index} className="p-4 border rounded-lg bg-accent/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{crop.name}</h3>
                    <Badge className={crop.status === 'growing' ? 'bg-green-600' : 'bg-blue-600'}>
                      {crop.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Area: {crop.area}</span>
                      <span>Season: {crop.season}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{crop.daysLeft} days to harvest</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

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

