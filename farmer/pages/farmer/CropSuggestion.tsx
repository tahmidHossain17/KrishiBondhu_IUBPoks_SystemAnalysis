import { useState } from "react";
import FarmerDashboardLayout from "@/components/farmer/FarmerDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Leaf, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Calendar,
  TrendingUp,
  Info,
  Sun,
  Cloud,
  Zap,
  Target,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CropSuggestion = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    landArea: '',
    soilType: '',
    location: '',
    previousCrop: '',
    irrigationAvailable: ''
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to determine season based on date using traditional Bangladeshi seasons
  // Traditional 6 seasons of Bangladesh:
  // 1. গ্রীষ্ম (Grisma) - Summer: April-May
  // 2. বর্ষা (Barsha) - Monsoon: June-July  
  // 3. শরৎ (Shorot) - Autumn: August-September
  // 4. হেমন্ত (Hemonto) - Late Autumn: October-November
  // 5. শীত (Sheet) - Winter: December-January
  // 6. বসন্ত (Bashonto) - Spring: February-March
  const getSeasonFromDate = (date: Date) => {
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    if (month >= 4 && month <= 5) return "গ্রীষ্ম (Grisma)"; // April-May: Summer
    if (month >= 6 && month <= 7) return "বর্ষা (Barsha)"; // June-July: Monsoon
    if (month >= 8 && month <= 9) return "শরৎ (Shorot)"; // August-September: Autumn
    if (month >= 10 && month <= 11) return "হেমন্ত (Hemonto)"; // October-November: Late Autumn
    if (month === 12 || month === 1) return "শীত (Sheet)"; // December-January: Winter
    return "বসন্ত (Bashonto)"; // February-March: Spring
  };

  const getCurrentSeasonCrops = (date: Date) => {
    const season = getSeasonFromDate(date);
    const seasonalData = {
      "শীত (Sheet)": ["Potato", "Wheat", "Mustard", "Onion", "Garlic", "Peas", "Cabbage", "Tomato"], // Winter: Dec-Jan
      "বসন্ত (Bashonto)": ["Maize", "Groundnut", "Sesame", "Rice (Boro)", "Watermelon", "Cucumber"], // Spring: Feb-Mar
      "গ্রীষ্ম (Grisma)": ["Cotton", "Sugarcane", "Jute (early)", "Vegetables", "Fodder"], // Summer: Apr-May
      "বর্ষা (Barsha)": ["Rice (Aman)", "Rice (Aus)", "Jute", "Vegetables", "Pulses", "Fodder"], // Monsoon: Jun-Jul
      "শরৎ (Shorot)": ["Late Rice", "Vegetables", "Spices", "Pulses"], // Autumn: Aug-Sep
      "হেমন্ত (Hemonto)": ["Wheat (early)", "Mustard", "Lentils", "Vegetables", "Spices"] // Late Autumn: Oct-Nov
    };
    return seasonalData[season as keyof typeof seasonalData] || [];
  };

  // Mock weather data - in real app, this would come from weather API
  const weatherData = {
    temperature: 28,
    humidity: 65,
    rainfall: 45,
    sunshine: 8.5,
    soilMoisture: 72
  };

  const soilTypes = [
    { value: "clay", label: "Clay", bengali: "কাদামাটি" },
    { value: "sandy", label: "Sandy", bengali: "বালুকা মাটি" },
    { value: "loamy", label: "Loamy", bengali: "দোআঁশ মাটি" },
    { value: "silt", label: "Silt", bengali: "পলি মাটি" },
    { value: "peat", label: "Peat", bengali: "পিট মাটি" },
    { value: "chalk", label: "Chalk", bengali: "চূর্ণমাটি" },
    { value: "red", label: "Red Soil", bengali: "লাল মাটি" },
    { value: "black", label: "Black Soil", bengali: "কালো মাটি" },
    { value: "alluvial", label: "Alluvial", bengali: "পলিমাটি" }
  ];

  const cropSuggestions = [
    {
      name: "Rice (Aman)",
      bengali: "আমন ধান",
      successProbability: 92,
      season: "বর্ষা (Barsha)",
      expectedYield: "4.5 tons/hectare",
      marketPrice: "৳35-40/kg",
      growthPeriod: "120-150 days",
      waterRequirement: "High",
      soilSuitability: ["Clay", "Loamy", "Alluvial"],
      pros: ["High market demand", "Good for monsoon", "Stable price"],
      cons: ["Requires more water", "Pest susceptible"],
      plantingMonth: "July-August",
      harvestMonth: "November-December"
    },
    {
      name: "Jute",
      bengali: "পাট",
      successProbability: 88,
      season: "বর্ষা (Barsha)",
      expectedYield: "2.5 tons/hectare",
      marketPrice: "৳45-50/kg",
      growthPeriod: "100-120 days",
      waterRequirement: "High",
      soilSuitability: ["Alluvial", "Loamy"],
      pros: ["Export potential", "Government support", "Eco-friendly"],
      cons: ["Processing required", "Limited local market"],
      plantingMonth: "June-July",
      harvestMonth: "September-October"
    },
    {
      name: "Potato",
      bengali: "আলু",
      successProbability: 85,
      season: "শীত (Sheet)",
      expectedYield: "25 tons/hectare",
      marketPrice: "৳15-25/kg",
      growthPeriod: "90-120 days",
      waterRequirement: "Medium",
      soilSuitability: ["Sandy", "Loamy"],
      pros: ["High yield", "Short duration", "Good storage"],
      cons: ["Market fluctuation", "Storage cost"],
      plantingMonth: "November-December",
      harvestMonth: "February-March"
    }
  ];

  const seasonalCalendar = [
    { month: "January", crops: ["Potato", "Tomato", "Cabbage"], season: "শীত (Sheet)" },
    { month: "February", crops: ["Wheat", "Mustard", "Peas"], season: "বসন্ত (Bashonto)" },
    { month: "March", crops: ["Maize", "Groundnut", "Sesame"], season: "বসন্ত (Bashonto)" },
    { month: "April", crops: ["Rice (Boro)", "Watermelon", "Cucumber"], season: "গ্রীষ্ম (Grisma)" },
    { month: "May", crops: ["Jute", "Cotton", "Sugarcane"], season: "গ্রীষ্ম (Grisma)" },
    { month: "June", crops: ["Rice (Aus)", "Vegetables", "Fodder"], season: "বর্ষা (Barsha)" },
    { month: "July", crops: ["Rice (Aman)", "Maize", "Pulses"], season: "বর্ষা (Barsha)" },
    { month: "August", crops: ["Vegetables", "Spices", "Fodder"], season: "শরৎ (Shorot)" },
    { month: "September", crops: ["Late Rice", "Vegetables", "Spices"], season: "শরৎ (Shorot)" },
    { month: "October", crops: ["Wheat", "Mustard", "Lentils"], season: "হেমন্ত (Hemonto)" },
    { month: "November", crops: ["Potato", "Onion", "Garlic"], season: "হেমন্ত (Hemonto)" },
    { month: "December", crops: ["Vegetables", "Pulses", "Oilseeds"], season: "শীত (Sheet)" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.landArea || !formData.soilType || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setSuggestions(cropSuggestions);
      setLoading(false);
      toast({
        title: "Suggestions Generated!",
        description: "AI-based crop recommendations are ready",
      });
    }, 2000);
  };

  return (
    <FarmerDashboardLayout currentPage="crops">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Leaf className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Crop Suggestions</h1>
            <p className="text-muted-foreground">AI-powered recommendations for your land</p>
            <p className="text-sm text-primary font-bengali">আপনার জমির জন্য এআই-চালিত সুপারিশ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-fresh sticky top-4">
              <CardHeader>
                <CardTitle>Farm Details</CardTitle>
                <CardDescription>Enter your land and location information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="plantingDate">Preferred Planting Date</Label>
                    <Input
                      id="plantingDate"
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Season will be determined based on selected date
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="landArea">Land Area (Acres)</Label>
                    <Input
                      id="landArea"
                      type="number"
                      placeholder="e.g., 5.5"
                      value={formData.landArea}
                      onChange={(e) => handleInputChange('landArea', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select value={formData.soilType} onValueChange={(value) => handleInputChange('soilType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        {soilTypes.map((soil) => (
                          <SelectItem key={soil.value} value={soil.value}>
                            {soil.label} ({soil.bengali})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Jessore, Khulna"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="previousCrop">Previous Crop (Optional)</Label>
                    <Input
                      id="previousCrop"
                      placeholder="e.g., Rice"
                      value={formData.previousCrop}
                      onChange={(e) => handleInputChange('previousCrop', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="irrigation">Irrigation Available</Label>
                    <Select value={formData.irrigationAvailable} onValueChange={(value) => handleInputChange('irrigationAvailable', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes, Available</SelectItem>
                        <SelectItem value="limited">Limited Access</SelectItem>
                        <SelectItem value="no">No Irrigation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Generating AI Suggestions...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Get Crop Suggestions
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Weather Conditions */}
            <Card className="shadow-fresh mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Thermometer className="w-5 h-5 mr-2 text-primary" />
                  Current Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Temperature</span>
                  <span className="font-medium">{weatherData.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Humidity</span>
                  <span className="font-medium">{weatherData.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rainfall (Monthly)</span>
                  <span className="font-medium">{weatherData.rainfall}mm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sunshine Hours</span>
                  <span className="font-medium">{weatherData.sunshine}h/day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Soil Moisture</span>
                  <span className="font-medium">{weatherData.soilMoisture}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results and Calendar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Crop Suggestions Results */}
            {suggestions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">AI Recommendations</h2>
                {suggestions.map((crop, index) => (
                  <Card key={index} className="shadow-fresh hover-lift">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            <Leaf className="w-5 h-5 mr-2 text-primary" />
                            {crop.name}
                            <span className="ml-2 text-sm font-normal text-primary font-bengali">
                              ({crop.bengali})
                            </span>
                          </CardTitle>
                          <CardDescription>
                            Best suited for {crop.season} season
                          </CardDescription>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{crop.successProbability}%</div>
                          <div className="text-xs text-muted-foreground">Success Rate</div>
                        </div>
                      </div>
                      <Progress value={crop.successProbability} className="h-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Expected Yield</p>
                          <p className="font-medium">{crop.expectedYield}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Market Price</p>
                          <p className="font-medium">{crop.marketPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Growth Period</p>
                          <p className="font-medium">{crop.growthPeriod}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Water Need</p>
                          <p className="font-medium">{crop.waterRequirement}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Planting & Harvest</p>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-2 text-primary" />
                              Plant: {crop.plantingMonth}
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="w-4 h-4 mr-2 text-green-600" />
                              Harvest: {crop.harvestMonth}
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Suitable Soil</p>
                          <div className="flex flex-wrap gap-1">
                            {crop.soilSuitability.map((soil: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {soil}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-2">Advantages</p>
                          <ul className="text-sm space-y-1">
                            {crop.pros.map((pro: string, idx: number) => (
                              <li key={idx} className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-600 mb-2">Considerations</p>
                          <ul className="text-sm space-y-1">
                            {crop.cons.map((con: string, idx: number) => (
                              <li key={idx} className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></div>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Date-wise Season and Crop Recommendations */}
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Season-wise Crop Guide
                </CardTitle>
                <CardDescription>
                  Recommended crops based on your selected planting date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  {/* Current Season Info */}
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">Selected Date Season</h4>
                      <Badge variant="outline" className="border-primary text-primary">
                        {getSeasonFromDate(selectedDate)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Planting Date: {selectedDate.toLocaleDateString('en-BD', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <h5 className="font-medium mb-2">Recommended Crops for this Season:</h5>
                    <div className="flex flex-wrap gap-2">
                      {getCurrentSeasonCrops(selectedDate).map((crop, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* All Seasons Overview */}
                  <div>
                    <h4 className="font-medium mb-4">Complete Seasonal Calendar (Traditional Bangladeshi Seasons)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { season: "শীত (Sheet)", englishName: "Winter", months: "Dec-Jan", crops: ["Potato", "Wheat", "Mustard", "Onion"] },
                        { season: "বসন্ত (Bashonto)", englishName: "Spring", months: "Feb-Mar", crops: ["Maize", "Groundnut", "Sesame", "Rice (Boro)"] },
                        { season: "গ্রীষ্ম (Grisma)", englishName: "Summer", months: "Apr-May", crops: ["Cotton", "Sugarcane", "Jute (early)", "Vegetables"] },
                        { season: "বর্ষা (Barsha)", englishName: "Monsoon", months: "Jun-Jul", crops: ["Rice (Aman)", "Rice (Aus)", "Jute", "Pulses"] },
                        { season: "শরৎ (Shorot)", englishName: "Autumn", months: "Aug-Sep", crops: ["Late Rice", "Vegetables", "Spices", "Pulses"] },
                        { season: "হেমন্ত (Hemonto)", englishName: "Late Autumn", months: "Oct-Nov", crops: ["Wheat (early)", "Mustard", "Lentils", "Vegetables"] }
                      ].map((seasonInfo, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border ${
                            getSeasonFromDate(selectedDate) === seasonInfo.season
                              ? 'bg-primary/10 border-primary' 
                              : 'bg-accent/50 border-border'
                          }`}
                        >
                          <h4 className="font-medium mb-1">{seasonInfo.season}</h4>
                          <p className="text-xs text-muted-foreground mb-2 italic">{seasonInfo.englishName}</p>
                          <Badge variant="outline" className="mb-2 text-xs">
                            {seasonInfo.months}
                          </Badge>
                          <div className="space-y-1">
                            {seasonInfo.crops.map((crop, idx) => (
                              <div key={idx} className="text-sm text-muted-foreground">
                                • {crop}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips and Guidelines */}
            <Card className="shadow-fresh bg-blue-50 dark:bg-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                  <Info className="w-5 h-5 mr-2" />
                  Smart Farming Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Soil Preparation</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Test soil pH before planting</li>
                      <li>• Apply organic manure 2-3 weeks early</li>
                      <li>• Ensure proper drainage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Water Management</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Monitor soil moisture regularly</li>
                      <li>• Use drip irrigation if possible</li>
                      <li>• Water early morning or evening</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Pest Control</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Use integrated pest management</li>
                      <li>• Regular field inspection</li>
                      <li>• Follow recommended dosage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Market Planning</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Research market prices</li>
                      <li>• Plan harvest timing</li>
                      <li>• Consider storage options</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default CropSuggestion;