import { useState } from "react";
import FarmerDashboardLayout from "@/components/farmer/FarmerDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bug, 
  Leaf, 
  Search, 
  AlertTriangle, 
  Shield, 
  Clock, 
  Droplets,
  Thermometer,
  Eye,
  Target,
  FileText,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PesticideSuggestion = () => {
  const { toast } = useToast();
  const [selectedCrop, setSelectedCrop] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [pestType, setPestType] = useState('');
  const [severity, setSeverity] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for crops and common problems
  const crops = [
    "Rice", "Wheat", "Maize", "Potato", "Tomato", "Onion", "Garlic", "Jute", "Cotton", "Sugarcane"
  ];

  const commonProblems = {
    Rice: [
      { name: "Rice Blast", type: "Fungal Disease", severity: "High" },
      { name: "Brown Plant Hopper", type: "Insect Pest", severity: "Medium" },
      { name: "Stem Borer", type: "Insect Pest", severity: "High" },
      { name: "Sheath Rot", type: "Fungal Disease", severity: "Medium" }
    ],
    Potato: [
      { name: "Late Blight", type: "Fungal Disease", severity: "High" },
      { name: "Colorado Potato Beetle", type: "Insect Pest", severity: "Medium" },
      { name: "Potato Virus Y", type: "Viral Disease", severity: "High" },
      { name: "Wireworm", type: "Insect Pest", severity: "Low" }
    ],
    Tomato: [
      { name: "Tomato Leaf Curl", type: "Viral Disease", severity: "High" },
      { name: "Early Blight", type: "Fungal Disease", severity: "Medium" },
      { name: "Whitefly", type: "Insect Pest", severity: "Medium" },
      { name: "Fruit Borer", type: "Insect Pest", severity: "High" }
    ]
  };

  // Mock pesticide recommendations
  const pesticideRecommendations = [
    {
      problem: "Rice Blast",
      pesticides: [
        {
          name: "Tricyclazole 75% WP",
          type: "Fungicide",
          dosage: "0.6-0.8 g/L",
          applicationMethod: "Foliar Spray",
          frequency: "2-3 times at 10-day intervals",
          safetyPeriod: "21 days before harvest",
          effectiveness: 90,
          cost: "৳450/kg",
          precautions: [
            "Use protective equipment",
            "Do not spray during windy conditions",
            "Avoid spraying during flowering"
          ],
          instructions: [
            "Mix 0.6-0.8g per liter of water",
            "Spray during early morning or evening",
            "Ensure complete coverage of plant canopy",
            "Repeat application if rain occurs within 4 hours"
          ]
        },
        {
          name: "Propiconazole 25% EC",
          type: "Fungicide",
          dosage: "1 ml/L",
          applicationMethod: "Foliar Spray",
          frequency: "2 applications at 15-day intervals",
          safetyPeriod: "30 days before harvest",
          effectiveness: 85,
          cost: "৳680/L",
          precautions: [
            "Highly toxic to fish",
            "Use protective clothing",
            "Keep away from water bodies"
          ],
          instructions: [
            "Mix 1ml per liter of water",
            "Apply at first sign of disease",
            "Use sticker for better adhesion",
            "Monitor weather conditions"
          ]
        }
      ]
    },
    {
      problem: "Late Blight",
      pesticides: [
        {
          name: "Metalaxyl + Mancozeb 72% WP",
          type: "Fungicide",
          dosage: "2.5 g/L",
          applicationMethod: "Foliar Spray",
          frequency: "3-4 times at 7-10 day intervals",
          safetyPeriod: "14 days before harvest",
          effectiveness: 95,
          cost: "৳520/kg",
          precautions: [
            "Avoid spray drift",
            "Use clean water for mixing",
            "Do not store prepared solution"
          ],
          instructions: [
            "Mix 2.5g per liter of water",
            "Start application at disease onset",
            "Ensure thorough coverage",
            "Use immediately after preparation"
          ]
        }
      ]
    }
  ];

  const safetyGuidelines = [
    {
      category: "Before Application",
      guidelines: [
        "Read the pesticide label carefully",
        "Check weather conditions (no rain expected for 4-6 hours)",
        "Wear protective equipment (gloves, mask, long sleeves)",
        "Calibrate spraying equipment",
        "Keep children and livestock away from treatment area"
      ]
    },
    {
      category: "During Application",
      guidelines: [
        "Apply during early morning or late evening",
        "Avoid spraying during windy conditions (wind speed < 10 km/h)",
        "Maintain recommended dosage - never exceed",
        "Ensure even coverage without runoff",
        "Take breaks every 2 hours to avoid overexposure"
      ]
    },
    {
      category: "After Application", 
      guidelines: [
        "Wash hands and face thoroughly with soap",
        "Clean all equipment immediately",
        "Store leftover pesticides in original containers",
        "Dispose of empty containers safely",
        "Monitor treated area for effectiveness"
      ]
    },
    {
      category: "Storage & Disposal",
      guidelines: [
        "Store pesticides in original labeled containers",
        "Keep in a cool, dry, well-ventilated place",
        "Lock away from children and unauthorized persons",
        "Never store in food or drink containers",
        "Follow local regulations for disposal"
      ]
    }
  ];

  const handleSearchRecommendations = () => {
    if (!selectedCrop || !problemDescription) {
      toast({
        title: "Missing Information",
        description: "Please select a crop and describe the problem",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const cropProblems = commonProblems[selectedCrop as keyof typeof commonProblems] || [];
      const matchedProblem = cropProblems.find(p => 
        problemDescription.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(problemDescription.toLowerCase())
      );
      
      if (matchedProblem) {
        const recommendations = pesticideRecommendations.find(r => r.problem === matchedProblem.name);
        if (recommendations) {
          setRecommendations(recommendations.pesticides);
        }
      } else {
        setRecommendations([]);
      }
      
      setLoading(false);
      toast({
        title: "Recommendations Generated!",
        description: "Based on your crop and problem description",
      });
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <FarmerDashboardLayout currentPage="pesticides">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Bug className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pesticide Guidance</h1>
            <p className="text-muted-foreground">Get expert recommendations for crop protection</p>
            <p className="text-sm text-primary font-bengali">ফসল সুরক্ষার জন্য বিশেষজ্ঞ সুপারিশ পান</p>
          </div>
        </div>

        <Tabs defaultValue="identify" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="identify">Problem Identification</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="safety">Safety Guidelines</TabsTrigger>
          </TabsList>

          {/* Problem Identification Tab */}
          <TabsContent value="identify">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Form */}
              <Card className="shadow-fresh">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="w-5 h-5 mr-2 text-primary" />
                    Describe Your Problem
                  </CardTitle>
                  <CardDescription>
                    Help us identify the issue affecting your crops
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="crop">Select Crop *</Label>
                    <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {crops.map((crop) => (
                          <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="problem">Describe the Problem *</Label>
                    <Textarea
                      id="problem"
                      placeholder="Describe symptoms: leaf spots, wilting, insect damage, etc."
                      rows={4}
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pestType">Suspected Pest Type</Label>
                    <Select value={pestType} onValueChange={setPestType}>
                      <SelectTrigger>
                        <SelectValue placeholder="If known" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="insect">Insect Pest</SelectItem>
                        <SelectItem value="fungal">Fungal Disease</SelectItem>
                        <SelectItem value="bacterial">Bacterial Disease</SelectItem>
                        <SelectItem value="viral">Viral Disease</SelectItem>
                        <SelectItem value="weed">Weed Problem</SelectItem>
                        <SelectItem value="unknown">Not Sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="severity">Problem Severity</Label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="How severe is the damage?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (&lt; 10% damage)</SelectItem>
                        <SelectItem value="medium">Medium (10-30% damage)</SelectItem>
                        <SelectItem value="high">High (&gt; 30% damage)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleSearchRecommendations}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Problem...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Get Recommendations
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Common Problems for Selected Crop */}
              {selectedCrop && commonProblems[selectedCrop as keyof typeof commonProblems] && (
                <Card className="shadow-fresh">
                  <CardHeader>
                    <CardTitle>Common Problems in {selectedCrop}</CardTitle>
                    <CardDescription>Frequently occurring issues and their severity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {commonProblems[selectedCrop as keyof typeof commonProblems].map((problem, index) => (
                        <div key={index} className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{problem.name}</h4>
                              <p className="text-sm text-muted-foreground">{problem.type}</p>
                            </div>
                            <Badge className={getSeverityColor(problem.severity)}>
                              {problem.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            {recommendations.length > 0 ? (
              <div className="space-y-6">
                {recommendations.map((pesticide, index) => (
                  <Card key={index} className="shadow-fresh">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Shield className="w-5 h-5 mr-2 text-primary" />
                          {pesticide.name}
                        </CardTitle>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{pesticide.effectiveness}%</div>
                          <div className="text-xs text-muted-foreground">Effectiveness</div>
                        </div>
                      </div>
                      <CardDescription>
                        {pesticide.type} • {pesticide.cost}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Application Details */}
                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                            Application Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Dosage:</span>
                              <span className="font-medium">{pesticide.dosage}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Method:</span>
                              <span className="font-medium">{pesticide.applicationMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Frequency:</span>
                              <span className="font-medium">{pesticide.frequency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Safety Period:</span>
                              <span className="font-medium text-red-600">{pesticide.safetyPeriod}</span>
                            </div>
                          </div>
                        </div>

                        {/* Instructions */}
                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-green-500" />
                            Application Instructions
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {pesticide.instructions.map((instruction: string, idx: number) => (
                              <li key={idx} className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 mt-2 flex-shrink-0"></div>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Precautions */}
                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                            Safety Precautions
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {pesticide.precautions.map((precaution: string, idx: number) => (
                              <li key={idx} className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 mt-2 flex-shrink-0"></div>
                                <span>{precaution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Alert className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Important:</strong> Always follow the manufacturer's instructions and local regulations. 
                          Consult with agricultural extension officers if you're unsure about application methods.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-fresh">
                <CardContent className="p-12 text-center">
                  <Bug className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Recommendations Yet</h3>
                  <p className="text-muted-foreground">
                    Use the Problem Identification tab to get personalized pesticide recommendations
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Safety Guidelines Tab */}
          <TabsContent value="safety">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {safetyGuidelines.map((section, index) => (
                <Card key={index} className="shadow-fresh">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-primary" />
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.guidelines.map((guideline, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-primary mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Emergency Information */}
            <Card className="shadow-fresh bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700 dark:text-red-300">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Emergency Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Signs of Pesticide Poisoning</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Nausea and vomiting</li>
                      <li>• Headache and dizziness</li>
                      <li>• Skin or eye irritation</li>
                      <li>• Difficulty breathing</li>
                      <li>• Muscle twitching</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">First Aid Measures</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Remove contaminated clothing</li>
                      <li>• Wash skin with soap and water</li>
                      <li>• Rinse eyes with clean water</li>
                      <li>• Seek immediate medical attention</li>
                      <li>• Bring pesticide label to hospital</li>
                    </ul>
                  </div>
                </div>
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Emergency Hotline:</strong> 999 or contact your nearest hospital immediately if you suspect pesticide poisoning.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FarmerDashboardLayout>
  );
};

export default PesticideSuggestion;