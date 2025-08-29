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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AIChatWidget from "../../components/widgets/AIChatWidget";
import WeatherWidget from "../../components/widgets/WeatherWidget";
import { aiService } from "../../services/aiApi";
import {
  Bug,
  Brain,
  Shield,
  AlertTriangle,
  Camera,
  Search,
  Calendar,
  Droplets,
  Leaf,
  Target,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  BookOpen,
  TrendingUp,
  Clock,
  RefreshCw,
  Eye,
  Phone
} from 'lucide-react';

const PesticidesGuide: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedPest, setSelectedPest] = useState('');
  const [symptomDescription, setSymptomDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Mock pest database
  const commonPests = [
    {
      id: 'aphids',
      name: 'Aphids',
      scientificName: 'Aphis gossypii',
      crops: ['Rice', 'Wheat', 'Cotton', 'Vegetables'],
      symptoms: ['Yellow/curled leaves', 'Sticky honeydew', 'Stunted growth'],
      severity: 'Medium',
      seasonality: 'Spring-Summer',
      image: '/placeholder.svg'
    },
    {
      id: 'bollworm',
      name: 'Bollworm',
      scientificName: 'Helicoverpa armigera',
      crops: ['Cotton', 'Tomato', 'Chickpea'],
      symptoms: ['Holes in leaves', 'Damaged fruits', 'Larvae presence'],
      severity: 'High',
      seasonality: 'Monsoon-Winter',
      image: '/placeholder.svg'
    },
    {
      id: 'leaf_rust',
      name: 'Leaf Rust',
      scientificName: 'Puccinia triticina',
      crops: ['Wheat', 'Barley'],
      symptoms: ['Orange-brown pustules', 'Yellow patches', 'Premature leaf drop'],
      severity: 'High',
      seasonality: 'Winter-Spring',
      image: '/placeholder.svg'
    }
  ];

  // Mock treatment database
  const treatments = [
    {
      id: 'neem_oil',
      name: 'Neem Oil',
      type: 'Organic',
      activeIngredient: 'Azadirachtin',
      effectiveness: 85,
      safetyRating: 'A',
      cost: 250,
      applicationRate: '2-3ml/L water',
      preharvest: '3 days',
      targetPests: ['Aphids', 'Whitefly', 'Thrips'],
      sideEffects: 'Minimal, safe for beneficial insects'
    },
    {
      id: 'bt_spray',
      name: 'Bacillus thuringiensis (Bt)',
      type: 'Biological',
      activeIngredient: 'Bt proteins',
      effectiveness: 90,
      safetyRating: 'A',
      cost: 180,
      applicationRate: '1-2g/L water',
      preharvest: '1 day',
      targetPests: ['Bollworm', 'Caterpillars', 'Larvae'],
      sideEffects: 'Very safe, specific to target pests'
    },
    {
      id: 'fungicide_copper',
      name: 'Copper Oxychloride',
      type: 'Chemical',
      activeIngredient: 'Copper',
      effectiveness: 80,
      safetyRating: 'B',
      cost: 150,
      applicationRate: '2-3g/L water',
      preharvest: '7 days',
      targetPests: ['Leaf Rust', 'Blight', 'Fungal diseases'],
      sideEffects: 'Moderate toxicity, use with caution'
    }
  ];

  const handleAIDiagnosis = async () => {
    if (!selectedCrop || !symptomDescription) {
      alert('Please select crop and describe symptoms for AI diagnosis');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI diagnosis
      const diagnosis = {
        confidence: 87,
        likelyPests: [
          { name: 'Aphids', probability: 65, severity: 'Medium' },
          { name: 'Leaf Rust', probability: 22, severity: 'High' }
        ],
        weatherFactors: [
          'High humidity favors fungal diseases',
          'Recent rainfall increases pest activity',
          'Temperature optimal for insect breeding'
        ],
        urgency: 'Medium',
        economicImpact: 'Potential 15-25% yield loss if untreated'
      };
      
      setAiDiagnosis(diagnosis);
      
      // Generate treatment recommendations
      const mockRecommendations = [
        {
          treatment: treatments[0],
          aiScore: 92,
          reasons: ['Organic solution suitable for food crops', 'Effective against identified pests', 'Safe pre-harvest interval'],
          applicationTiming: 'Apply in early morning or late evening',
          frequency: 'Repeat every 7-10 days for 3 applications'
        },
        {
          treatment: treatments[1],
          aiScore: 88,
          reasons: ['Biological control, environment friendly', 'Highly specific to target pests', 'No resistance development'],
          applicationTiming: 'Apply during active feeding hours',
          frequency: 'Apply twice with 5-day interval'
        }
      ];
      
      setRecommendations(mockRecommendations);

    } catch (error) {
      console.error('Error in AI diagnosis:', error);
      alert('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-slate-500';
    }
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case 'A': return 'bg-green-600';
      case 'B': return 'bg-yellow-600';
      case 'C': return 'bg-orange-600';
      case 'D': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <FarmerDashboardLayout currentPage="pesticides">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Shield className="mr-3 h-8 w-8 text-primary" />
              AI Crop Protection Guide
            </h1>
            <p className="text-muted-foreground mt-1">Intelligent pest identification and treatment recommendations</p>
            <p className="text-sm text-primary font-bengali mt-1">কৃত্রিম বুদ্ধিমত্তা দিয়ে ফসলের রোগ ও পোকা নিয়ন্ত্রণ</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Pest Library
            </Button>
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Expert Helpline
            </Button>
          </div>
        </div>

        <Tabs defaultValue="diagnosis" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diagnosis">AI Diagnosis</TabsTrigger>
            <TabsTrigger value="pest-library">Pest Library</TabsTrigger>
            <TabsTrigger value="treatments">Treatments</TabsTrigger>
            <TabsTrigger value="schedule">Spray Schedule</TabsTrigger>
          </TabsList>

          {/* AI Diagnosis Tab */}
          <TabsContent value="diagnosis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Form */}
              <Card className="lg:col-span-2 shadow-fresh">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-primary" />
                    AI Pest & Disease Diagnosis
                  </CardTitle>
                  <CardDescription>
                    Describe your crop symptoms for intelligent identification and treatment recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Crop Type *</Label>
                      <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="cotton">Cotton</SelectItem>
                          <SelectItem value="tomato">Tomato</SelectItem>
                          <SelectItem value="potato">Potato</SelectItem>
                          <SelectItem value="chickpea">Chickpea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="e.g., Noida, UP"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Describe Symptoms *</Label>
                    <textarea
                      className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                      placeholder="Describe what you observe: leaf color changes, spots, holes, wilting, insect presence, etc."
                      value={symptomDescription}
                      onChange={(e) => setSymptomDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Camera className="mr-2 h-4 w-4" />
                      Upload Photos
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Search className="mr-2 h-4 w-4" />
                      Similar Cases
                    </Button>
                  </div>

                  <Button 
                    onClick={handleAIDiagnosis}
                    disabled={isAnalyzing}
                    className="w-full bg-primary hover:bg-primary-glow"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        AI Analyzing Symptoms...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Get AI Diagnosis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Weather Conditions */}
              <WeatherWidget 
                location={location || "Dhaka, BD"} 
                showForecast={false} 
                showAlerts={true}
              />
            </div>

            {/* AI Diagnosis Results */}
            {aiDiagnosis && (
              <Card className="shadow-fresh border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-primary" />
                    AI Diagnosis Results
                    <Badge className="ml-2 bg-green-600">{aiDiagnosis.confidence}% Confidence</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Likely Pests */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <Bug className="h-4 w-4 mr-2 text-red-500" />
                      Likely Pests/Diseases
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiDiagnosis.likelyPests.map((pest: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{pest.name}</span>
                            <Badge className={getSeverityColor(pest.severity).includes('red') ? 'bg-red-600' : 
                                             getSeverityColor(pest.severity).includes('yellow') ? 'bg-yellow-600' : 'bg-green-600'}>
                              {pest.severity}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Probability:</span>
                              <span className="font-medium">{pest.probability}%</span>
                            </div>
                            <Progress value={pest.probability} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weather Factors */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                      Weather Contributing Factors
                    </h4>
                    <ul className="space-y-2">
                      {aiDiagnosis.weatherFactors.map((factor: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risk Assessment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="font-medium text-sm">Action Urgency</span>
                      </div>
                      <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">{aiDiagnosis.urgency}</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center mb-1">
                        <TrendingUp className="h-4 w-4 text-red-600 mr-2" />
                        <span className="font-medium text-sm">Economic Impact</span>
                      </div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">{aiDiagnosis.economicImpact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Treatment Recommendations */}
            {recommendations.length > 0 && (
              <Card className="shadow-fresh">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-green-500" />
                    AI Treatment Recommendations
                  </CardTitle>
                  <CardDescription>Personalized treatment options ranked by effectiveness and safety</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <Card key={index} className="border hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-lg">{rec.treatment.name}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{rec.treatment.type}</Badge>
                                <Badge className={getSafetyColor(rec.treatment.safetyRating)}>
                                  Safety: {rec.treatment.safetyRating}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">{rec.aiScore}</div>
                              <div className="text-xs text-muted-foreground">AI Score</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Effectiveness:</span>
                                <span className="font-medium">{rec.treatment.effectiveness}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Cost:</span>
                                <span className="font-medium">₹{rec.treatment.cost}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Application Rate:</span>
                                <span className="font-medium">{rec.treatment.applicationRate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Pre-harvest:</span>
                                <span className="font-medium">{rec.treatment.preharvest}</span>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-sm mb-2">Why AI Recommends This:</h5>
                              <ul className="space-y-1">
                                {rec.reasons.map((reason: string, reasonIndex: number) => (
                                  <li key={reasonIndex} className="text-xs flex items-start">
                                    <CheckCircle className="h-3 w-3 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="bg-accent/10 p-3 rounded-lg text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <span className="font-medium">Application Timing: </span>
                                <span className="text-muted-foreground">{rec.applicationTiming}</span>
                              </div>
                              <div>
                                <span className="font-medium">Frequency: </span>
                                <span className="text-muted-foreground">{rec.frequency}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" className="flex-1 bg-primary hover:bg-primary-glow">
                              <Target className="mr-2 h-4 w-4" />
                              Select Treatment
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <BookOpen className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pest Library Tab */}
          <TabsContent value="pest-library">
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bug className="mr-2 h-5 w-5 text-red-500" />
                  Common Pests & Diseases Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {commonPests.map((pest) => (
                    <Card key={pest.id} className="border hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{pest.name}</h4>
                            <p className="text-sm text-muted-foreground italic">{pest.scientificName}</p>
                          </div>
                          <Badge className={getSeverityColor(pest.severity).includes('red') ? 'bg-red-600' : 
                                           getSeverityColor(pest.severity).includes('yellow') ? 'bg-yellow-600' : 'bg-green-600'}>
                            {pest.severity}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Affected Crops: </span>
                            <span className="text-muted-foreground">{pest.crops.join(', ')}</span>
                          </div>
                          <div>
                            <span className="font-medium">Season: </span>
                            <span className="text-muted-foreground">{pest.seasonality}</span>
                          </div>
                          <div>
                            <span className="font-medium">Symptoms:</span>
                            <ul className="mt-1 space-y-1">
                              {pest.symptoms.map((symptom, index) => (
                                <li key={index} className="flex items-start text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">{symptom}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <Button size="sm" className="w-full mt-3" variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Treatments Tab */}
          <TabsContent value="treatments">
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-green-500" />
                  Treatment Options Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {treatments.map((treatment) => (
                    <Card key={treatment.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-lg">{treatment.name}</h4>
                            <p className="text-sm text-muted-foreground">{treatment.activeIngredient}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getSafetyColor(treatment.safetyRating)}>
                              Safety: {treatment.safetyRating}
                            </Badge>
                            <div className="text-sm font-medium mt-1">₹{treatment.cost}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <Badge variant="outline">{treatment.type}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Effectiveness:</span>
                              <span className="font-medium">{treatment.effectiveness}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Application Rate:</span>
                              <span className="font-medium">{treatment.applicationRate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pre-harvest Interval:</span>
                              <span className="font-medium">{treatment.preharvest}</span>
                            </div>
                          </div>

                          <div>
                            <div className="mb-2">
                              <span className="font-medium">Target Pests:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {treatment.targetPests.map((pest, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">{pest}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Side Effects:</span>
                              <p className="text-muted-foreground text-xs mt-1">{treatment.sideEffects}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spray Schedule Tab */}
          <TabsContent value="schedule">
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  AI-Powered Spray Schedule
                </CardTitle>
                <CardDescription>Personalized application calendar based on crop stage and weather</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg">Select a treatment to generate spray schedule</p>
                  <p className="text-sm">AI will optimize timing based on weather and crop growth stage</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Chat Assistant */}
        <AIChatWidget 
          context="pest control and crop protection guidance"
          placeholder="Ask about pest identification, treatment options, or application methods..."
        />
      </div>
    </FarmerDashboardLayout>
  );
};

export default PesticidesGuide;