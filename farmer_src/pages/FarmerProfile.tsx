import React, { useState } from 'react';
import FarmerDashboardLayout from "@/components/farmer/FarmerDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
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
import { aiService } from "../../services/aiApi";
import {
  User,
  Camera,
  Shield,
  TrendingUp,
  Star,
  Target,
  Award,
  Brain,
  Zap,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  Package,
  Truck,
  Leaf
} from 'lucide-react';

const FarmerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [profileData, setProfileData] = useState({
    personalInfo: {
      name: 'রহিম উদ্দিন (Rahim Uddin)',
      email: 'rahim.farmer@krishibondhu.com',
      phone: '+880 1712-345678',
      address: 'Village: Rampur, Upazila: Savar, District: Dhaka',
      dateOfBirth: '1975-03-15',
      farmingExperience: 25,
      education: 'Higher Secondary',
      languages: ['Bengali', 'Hindi', 'English']
    },
    farmDetails: {
      farmName: 'Green Valley Organic Farm',
      totalLand: 5.5,
      ownedLand: 4.0,
      leasedLand: 1.5,
      soilType: 'Alluvial',
      irrigationType: 'Canal + Tube well',
      primaryCrops: ['Rice', 'Wheat', 'Vegetables'],
      certifications: ['Organic', 'Good Agricultural Practices'],
      farmingType: 'Mixed farming',
      location: { lat: 23.7937, lng: 90.4066 }
    },
    businessMetrics: {
      monthlyRevenue: 85000,
      avgOrderValue: 12500,
      totalOrders: 156,
      customerRating: 4.7,
      deliveryRating: 4.8,
      qualityRating: 4.9,
      responseTime: '2 hours',
      completionRate: 97.5
    },
    aiInsights: {
      profileScore: 88,
      trustScore: 92,
      performanceGrade: 'A',
      recommendations: [
        'Consider diversifying with high-value cash crops',
        'Optimize irrigation schedule using weather data',
        'Implement integrated pest management',
        'Explore organic certification for premium pricing'
      ],
      strengths: [
        'Consistent quality delivery',
        'Strong customer relationships',
        'Diversified crop portfolio',
        'Sustainable farming practices'
      ],
      improvementAreas: [
        'Digital marketing presence',
        'Inventory management',
        'Financial record keeping'
      ]
    }
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 55) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-600';
      case 'B': return 'bg-blue-600';
      case 'C': return 'bg-yellow-600';
      case 'D': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <FarmerDashboardLayout currentPage="profile">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <User className="mr-3 h-8 w-8 text-primary" />
              Farmer Profile
            </h1>
            <p className="text-muted-foreground mt-1">Manage your profile and view AI-powered insights</p>
            <p className="text-sm text-primary font-bengali mt-1">আপনার প্রোফাইল ও কৃত্রিম বুদ্ধিমত্তার বিশ্লেষণ</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>

        {/* AI Profile Overview */}
        <Card className="shadow-fresh border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              AI Profile Analysis
            </CardTitle>
            <CardDescription>Intelligent insights about your farming profile and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(profileData.aiInsights.profileScore)}`}>
                  {profileData.aiInsights.profileScore}
                </div>
                <div className="text-sm text-muted-foreground">Profile Score</div>
                <Progress value={profileData.aiInsights.profileScore} className="h-2 mt-2" />
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(profileData.aiInsights.trustScore)}`}>
                  {profileData.aiInsights.trustScore}
                </div>
                <div className="text-sm text-muted-foreground">Trust Score</div>
                <Progress value={profileData.aiInsights.trustScore} className="h-2 mt-2" />
              </div>
              <div className="text-center">
                <Badge className={getGradeColor(profileData.aiInsights.performanceGrade)} size="lg">
                  Grade {profileData.aiInsights.performanceGrade}
                </Badge>
                <div className="text-sm text-muted-foreground mt-2">Performance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">
                  {profileData.businessMetrics.customerRating}
                </div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
                <div className="flex justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(profileData.businessMetrics.customerRating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Strengths */}
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  AI-Identified Strengths
                </h4>
                <ul className="space-y-1">
                  {profileData.aiInsights.strengths.map((strength, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-blue-500" />
                  AI Recommendations
                </h4>
                <ul className="space-y-1">
                  {profileData.aiInsights.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <Zap className="h-3 w-3 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvement Areas */}
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-orange-500" />
                  Improvement Areas
                </h4>
                <ul className="space-y-1">
                  {profileData.aiInsights.improvementAreas.map((area, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <Target className="h-3 w-3 mr-2 text-orange-500 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="farm">Farm Details</TabsTrigger>
            <TabsTrigger value="business">Business Metrics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Photo */}
                  <div className="md:col-span-2 flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="mr-2 h-4 w-4" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={profileData.personalInfo.name}
                      onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={profileData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={profileData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={profileData.personalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Address</Label>
                    <textarea
                      className="w-full p-3 border rounded-md resize-none"
                      rows={2}
                      value={profileData.personalInfo.address}
                      onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Farming Experience (years)</Label>
                    <Input
                      type="number"
                      value={profileData.personalInfo.farmingExperience}
                      onChange={(e) => handleInputChange('personalInfo', 'farmingExperience', parseInt(e.target.value))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Education</Label>
                    <Select 
                      value={profileData.personalInfo.education} 
                      onValueChange={(value) => handleInputChange('personalInfo', 'education', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                        <SelectItem value="Higher Secondary">Higher Secondary</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                        <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farm Details */}
          <TabsContent value="farm">
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5 text-green-500" />
                  Farm Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Farm Name</Label>
                    <Input
                      value={profileData.farmDetails.farmName}
                      onChange={(e) => handleInputChange('farmDetails', 'farmName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Farming Type</Label>
                    <Select 
                      value={profileData.farmDetails.farmingType} 
                      onValueChange={(value) => handleInputChange('farmDetails', 'farmingType', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Crop farming">Crop farming</SelectItem>
                        <SelectItem value="Mixed farming">Mixed farming</SelectItem>
                        <SelectItem value="Organic farming">Organic farming</SelectItem>
                        <SelectItem value="Livestock farming">Livestock farming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Total Land (acres)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={profileData.farmDetails.totalLand}
                      onChange={(e) => handleInputChange('farmDetails', 'totalLand', parseFloat(e.target.value))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Owned Land (acres)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={profileData.farmDetails.ownedLand}
                      onChange={(e) => handleInputChange('farmDetails', 'ownedLand', parseFloat(e.target.value))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Soil Type</Label>
                    <Select 
                      value={profileData.farmDetails.soilType} 
                      onValueChange={(value) => handleInputChange('farmDetails', 'soilType', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alluvial">Alluvial</SelectItem>
                        <SelectItem value="Clay">Clay</SelectItem>
                        <SelectItem value="Loam">Loam</SelectItem>
                        <SelectItem value="Sandy">Sandy</SelectItem>
                        <SelectItem value="Silt">Silt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Irrigation Type</Label>
                    <Input
                      value={profileData.farmDetails.irrigationType}
                      onChange={(e) => handleInputChange('farmDetails', 'irrigationType', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Primary Crops</Label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.farmDetails.primaryCrops.map((crop, index) => (
                        <Badge key={index} variant="outline">{crop}</Badge>
                      ))}
                      {isEditing && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Certifications</Label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.farmDetails.certifications.map((cert, index) => (
                        <Badge key={index} className="bg-green-600">{cert}</Badge>
                      ))}
                      {isEditing && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Metrics */}
          <TabsContent value="business">
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                  Business Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      ₹{profileData.businessMetrics.monthlyRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      ₹{profileData.businessMetrics.avgOrderValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Order Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {profileData.businessMetrics.totalOrders}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {profileData.businessMetrics.completionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        Customer Rating
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{profileData.businessMetrics.customerRating}</div>
                      <Progress value={profileData.businessMetrics.customerRating * 20} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-blue-500" />
                        Delivery Rating
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{profileData.businessMetrics.deliveryRating}</div>
                      <Progress value={profileData.businessMetrics.deliveryRating * 20} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Package className="h-4 w-4 mr-2 text-green-500" />
                        Quality Rating
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{profileData.businessMetrics.qualityRating}</div>
                      <Progress value={profileData.businessMetrics.qualityRating * 20} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-red-500" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Privacy Settings */}
                  <div>
                    <h4 className="font-medium mb-4">Privacy Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Contact Information</p>
                          <p className="text-sm text-muted-foreground">Allow buyers to see your contact details</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Farm Location</p>
                          <p className="text-sm text-muted-foreground">Display approximate farm location on map</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Business Metrics</p>
                          <p className="text-sm text-muted-foreground">Display ratings and performance metrics</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <h4 className="font-medium mb-4">Notification Preferences</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Notifications</p>
                          <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">AI Recommendations</p>
                          <p className="text-sm text-muted-foreground">Receive AI-powered farming suggestions</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Weather Alerts</p>
                          <p className="text-sm text-muted-foreground">Get weather warnings and forecasts</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Market Price Updates</p>
                          <p className="text-sm text-muted-foreground">Daily price updates for your crops</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div>
                    <h4 className="font-medium mb-4">Security</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="mr-2 h-4 w-4" />
                        Enable Two-Factor Authentication
                      </Button>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Show Sensitive Information</p>
                          <p className="text-sm text-muted-foreground">Temporarily show phone and email</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                        >
                          {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Chat Assistant */}
        <AIChatWidget 
          context="farmer profile management and optimization"
          placeholder="Ask about improving your profile, business metrics, or farming recommendations..."
        />
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerProfile;