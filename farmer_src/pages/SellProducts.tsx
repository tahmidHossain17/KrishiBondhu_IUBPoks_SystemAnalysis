import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from "@/components/farmer/FarmerDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AIChatWidget from "../../components/widgets/AIChatWidget";
import { aiService } from "../../services/aiApi";
import {
  ShoppingCart,
  DollarSign,
  Camera,
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Star,
  Package,
  Calendar,
  MapPin,
  Zap,
  CheckCircle,
  AlertTriangle,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';

const SellProducts: React.FC = () => {
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    basePrice: '',
    location: '',
    harvestDate: '',
    description: '',
    qualityGrade: '',
    organicCertified: false
  });
  const [marketInsights, setMarketInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [myListings, setMyListings] = useState<any[]>([]);

  // Mock existing listings
  const mockListings = [
    {
      id: 'P001',
      name: 'Premium Basmati Rice',
      category: 'Grains',
      quantity: '500 kg',
      price: 75,
      status: 'active',
      views: 45,
      inquiries: 12,
      listedDate: '2024-01-10',
      qualityGrade: 'A+',
      image: '/placeholder.svg'
    },
    {
      id: 'P002',
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      quantity: '200 kg',
      price: 25,
      status: 'sold',
      views: 67,
      inquiries: 23,
      listedDate: '2024-01-08',
      qualityGrade: 'A',
      image: '/placeholder.svg'
    },
    {
      id: 'P003',
      name: 'Organic Wheat',
      category: 'Grains',
      quantity: '1000 kg',
      price: 32,
      status: 'pending',
      views: 23,
      inquiries: 8,
      listedDate: '2024-01-12',
      qualityGrade: 'A',
      image: '/placeholder.svg'
    }
  ];

  useEffect(() => {
    setMyListings(mockListings);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

    const handleSubmit = async (e: React.FormEvent) => {

  const handleSubmitProduct = () => {
    if (!productForm.name || !productForm.category || !productForm.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    const newListing = {
      id: `P${Date.now()}`,
      name: productForm.name,
      category: productForm.category,
      quantity: `${productForm.quantity} ${productForm.unit}`,
      price: parseFloat(productForm.basePrice),
      status: 'active',
      views: 0,
      inquiries: 0,
      listedDate: new Date().toISOString().split('T')[0],
      qualityGrade: productForm.qualityGrade || 'A',
      image: '/placeholder.svg'
    };

    setMyListings(prev => [newListing, ...prev]);
    
        // Reset form
    setProductForm({
      name: '',
      category: '',
      variety: '',
      quantity: '',
      unit: 'kg',
      basePrice: '',
      location: '',
      harvestDate: '',
      description: '',
      qualityGrade: '',
      organicCertified: false
    });
  };
    setMarketInsights([]);

    alert('Product listed successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'sold': return 'bg-blue-600';
      case 'pending': return 'bg-yellow-600';
      default: return 'bg-slate-600';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'text-green-500';
      case 'stable': return 'text-blue-500';
      case 'falling': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <FarmerDashboardLayout currentPage="sell">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <ShoppingCart className="mr-3 h-8 w-8 text-primary" />
              Smart Product Listing
            </h1>
            <p className="text-muted-foreground mt-1">List your products with AI-powered pricing optimization</p>
            <p className="text-sm text-primary font-bengali mt-1">কৃত্রিম বুদ্ধিমত্তা দিয়ে সঠিক দামে পণ্য বিক্রি করুন</p>
          </div>
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" />
            My Inventory
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Listing Form */}
          <Card className="lg:col-span-2 shadow-fresh">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5 text-primary" />
                List New Product
              </CardTitle>
              <CardDescription>Provide product details to get AI-powered pricing recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Basmati Rice"
                    value={productForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={productForm.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grains">Grains</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="pulses">Pulses</SelectItem>
                      <SelectItem value="spices">Spices</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variety">Variety</Label>
                  <Input
                    id="variety"
                    placeholder="e.g., Pusa Basmati 1121"
                    value={productForm.variety}
                    onChange={(e) => handleInputChange('variety', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualityGrade">Quality Grade</Label>
                  <Select value={productForm.qualityGrade} onValueChange={(value) => handleInputChange('qualityGrade', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+ (Premium)</SelectItem>
                      <SelectItem value="A">A (High Quality)</SelectItem>
                      <SelectItem value="B+">B+ (Good)</SelectItem>
                      <SelectItem value="B">B (Standard)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quantity and Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="1000"
                    value={productForm.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={productForm.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="quintals">Quintals</SelectItem>
                      <SelectItem value="pieces">Pieces</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (₹/{productForm.unit})</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    placeholder="50"
                    value={productForm.basePrice}
                    onChange={(e) => handleInputChange('basePrice', e.target.value)}
                  />
                </div>
              </div>

              {/* Location and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Noida, UP"
                    value={productForm.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={productForm.harvestDate}
                    onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product quality, storage conditions, special features..."
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary-glow"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                List Product for Sale
              </Button>
            </CardContent>
          </Card>

          {/* Market Insights Sidebar */}
          <div className="space-y-4">
            {/* Market Insights */}
            {marketInsights.length > 0 && (
              <Card className="shadow-fresh">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                    Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketInsights.map((insight, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{insight.crop}</h4>
                          <Badge className={
                            insight.trend === 'rising' ? 'bg-green-600' :
                            insight.trend === 'stable' ? 'bg-blue-600' : 'bg-red-600'
                          }>
                            {insight.trend === 'rising' && <TrendingUp className="h-3 w-3 mr-1" />}
                            {insight.trend === 'falling' && <TrendingDown className="h-3 w-3 mr-1" />}
                            {insight.trend}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-primary mb-1">{insight.currentPrice}</div>
                          <p className="text-muted-foreground">{insight.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Tips */}
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  AI Selling Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Target className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium text-sm">Pricing Tip</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Set competitive prices based on quality and market demand.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Camera className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="font-medium text-sm">Photos Matter</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Clear, high-quality photos increase inquiries by 40%.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Star className="h-4 w-4 text-purple-500 mr-2" />
                      <span className="font-medium text-sm">Quality Grade</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Higher quality grades command premium pricing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Current Listings */}
        <Card className="shadow-fresh">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-primary" />
                My Product Listings ({myListings.length})
              </div>
              <Badge variant="outline">
                {myListings.filter(l => l.status === 'active').length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListings.map((listing) => (
                <Card key={listing.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{listing.name}</h4>
                        <p className="text-sm text-muted-foreground">{listing.category}</p>
                      </div>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-medium">{listing.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Listed Price:</span>
                        <span className="font-bold text-primary">₹{listing.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Views/Inquiries:</span>
                        <span>{listing.views}/{listing.inquiries}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Chat Assistant */}
        <AIChatWidget 
          context="product selling and pricing advice"
          placeholder="Ask about pricing strategies, market trends, or selling tips..."
        />
      </div>
    </FarmerDashboardLayout>
  );
};

export default SellProducts;