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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const { user } = useAuth();
  const { toast } = useToast();
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
  const [farmerProfile, setFarmerProfile] = useState<any>(null);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [profileCompletionForm, setProfileCompletionForm] = useState({
    full_name: '',
    farm_location: '',
    land_area_acres: '',
    farming_experience_years: '',
    crops_grown: ['Rice'],
    organic_certified: false
  });
  
  // Edit product state
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editForm, setEditForm] = useState({
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

  useEffect(() => {
    if (user && user.id) {
      fetchFarmerData();
    } else {
      // Clear state if no user is authenticated
      setFarmerProfile(null);
      setMyListings([]);
      setShowProfileCompletion(false);
    }
  }, [user]);

  const fetchFarmerData = async () => {
    if (!user || !user.id) {
      console.log('No authenticated user found');
      return;
    }

    try {
      // Get farmer profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userProfile) {
        const { data: farmerData } = await supabase
          .from('farmer_profiles')
          .select('*')
          .eq('profile_id', userProfile.id)
          .single();

        if (farmerData) {
          setFarmerProfile(farmerData);
          fetchProducts(farmerData.id);
        } else {
          // No farmer profile found - show completion form
          console.log('No farmer profile found for user, showing completion form');
          setShowProfileCompletion(true);
          // Pre-fill with any available data
          setProfileCompletionForm(prev => ({
            ...prev,
            full_name: user.user_metadata?.full_name || '',
            farm_location: user.user_metadata?.farm_location || '',
            land_area_acres: user.user_metadata?.land_area_acres || '',
            farming_experience_years: user.user_metadata?.farming_experience_years || '',
            crops_grown: user.user_metadata?.crops_grown ? user.user_metadata.crops_grown.split(',') : ['Rice'],
            organic_certified: user.user_metadata?.organic_certified || false
          }));
        }
      } else {
        console.log('No profile found for user');
        toast({
          title: "Profile Not Found",
          description: "Your user profile was not found. Please try logging out and back in.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching farmer data:', error);
      toast({
        title: "Error Loading Profile",
        description: "Failed to load your farmer profile. Please refresh the page.",
        variant: "destructive"
      });
    }
  };

  const fetchProducts = async (farmerId: string) => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error loading products",
          description: "Failed to load your product listings.",
          variant: "destructive"
        });
      } else {
        setMyListings(products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileCompletionChange = (field: string, value: any) => {
    setProfileCompletionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChangeProfileCompletion = (field: string, value: string) => {
    const currentArray = profileCompletionForm[field as keyof typeof profileCompletionForm] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleProfileCompletionChange(field, newArray);
  };

  const handleEditInputChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || '',
      category: product.category || '',
      variety: product.variety || '',
      quantity: product.available_quantity?.toString() || '',
      unit: product.unit || 'kg',
      basePrice: product.price?.toString() || '',
      location: product.location || '',
      harvestDate: product.harvest_date || '',
      description: product.description || '',
      qualityGrade: product.quality_grade || '',
      organicCertified: product.organic || false
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({
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

  const handleCompleteProfile = async () => {
    // Check if user is authenticated
    if (!user || !user.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your profile.",
        variant: "destructive"
      });
      return;
    }

    if (!profileCompletionForm.full_name || !profileCompletionForm.farm_location) {
      toast({
        title: "Missing Information",
        description: "Please fill in your full name and farm location.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // First, get the user's profile ID
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !userProfile) {
        console.error('Profile fetch error:', profileError);
        throw new Error('User profile not found. Please try logging out and back in.');
      }

      // Create farmer profile directly
      const { data, error } = await supabase
        .from('farmer_profiles')
        .insert({
          profile_id: userProfile.id,
          full_name: profileCompletionForm.full_name,
          farm_location: profileCompletionForm.farm_location,
          land_area_acres: parseFloat(profileCompletionForm.land_area_acres) || 0,
          farming_experience_years: parseInt(profileCompletionForm.farming_experience_years) || 0,
          crops_grown: profileCompletionForm.crops_grown,
          organic_certified: profileCompletionForm.organic_certified
        })
        .select()
        .single();

      if (error) {
        console.error('Error completing farmer profile:', error);
        toast({
          title: "Profile Completion Failed",
          description: `Failed to complete profile: ${error.message}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Profile Completed!",
          description: "Your farmer profile has been completed successfully.",
        });
        
        setShowProfileCompletion(false);
        // Refresh farmer data
        await fetchFarmerData();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred while completing your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Form data:', productForm);
    console.log('Farmer profile:', farmerProfile);
    
    // Validation
    if (!productForm.name || !productForm.category || !productForm.quantity || !productForm.basePrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (name, category, quantity, price).",
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

    // Validate numeric inputs
    const quantity = parseFloat(productForm.quantity);
    const price = parseFloat(productForm.basePrice);
    
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than 0.",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        farmer_id: farmerProfile.id,
        name: productForm.name.trim(),
        description: productForm.description?.trim() || null,
        category: productForm.category as 'grains' | 'vegetables' | 'fruits' | 'pulses' | 'spices' | 'dairy' | 'other',
        price: price,
        unit: productForm.unit,
        available_quantity: quantity,
        location: productForm.location?.trim() || farmerProfile.farm_location || 'Not specified',
        organic: productForm.organicCertified || false,
        harvest_date: productForm.harvestDate || null,
        minimum_order: 1,
        is_active: true,
        featured: false
      };
      
      console.log('Submitting product data:', productData);

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Database Error",
          description: `Failed to create product: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Product created successfully:', data);
        toast({
          title: "Product listed successfully!",
          description: `${productForm.name} has been added to your listings.`,
        });
        
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
        
        // Refresh listings
        await fetchProducts(farmerProfile.id);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "Failed to delete product.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Product deleted",
          description: "Product has been removed from your listings.",
        });
        
        // Refresh listings
        if (farmerProfile) {
          fetchProducts(farmerProfile.id);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) {
        console.error('Error updating product:', error);
        toast({
          title: "Error",
          description: "Failed to update product status.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Status updated",
          description: `Product ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
        });
        
        // Refresh listings
        if (farmerProfile) {
          fetchProducts(farmerProfile.id);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct) return;
    
    // Validation
    if (!editForm.name || !editForm.category || !editForm.quantity || !editForm.basePrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (name, category, quantity, price).",
        variant: "destructive"
      });
      return;
    }

    // Validate numeric inputs
    const quantity = parseFloat(editForm.quantity);
    const price = parseFloat(editForm.basePrice);
    
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than 0.",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        name: editForm.name.trim(),
        description: editForm.description?.trim() || null,
        category: editForm.category as 'grains' | 'vegetables' | 'fruits' | 'pulses' | 'spices' | 'dairy' | 'other',
        price: price,
        unit: editForm.unit,
        available_quantity: quantity,
        location: editForm.location?.trim() || editingProduct.location || 'Not specified',
        organic: editForm.organicCertified || false,
        harvest_date: editForm.harvestDate || null,
        quality_grade: editForm.qualityGrade || null,
        variety: editForm.variety?.trim() || null
      };
      
      console.log('Updating product:', editingProduct.id, updateData);

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', editingProduct.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Update Failed",
          description: `Failed to update product: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Product updated successfully:', data);
        toast({
          title: "Product updated successfully!",
          description: `${editForm.name} has been updated.`,
        });
        
        // Cancel edit mode and refresh listings
        cancelEdit();
        if (farmerProfile) {
          await fetchProducts(farmerProfile.id);
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
      setIsLoading(false);
    }
  };



  return (
    <FarmerDashboardLayout currentPage="sell">
      {!user ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please log in to access the Smart Product Listing page.
              </p>
              <Button 
                onClick={() => window.location.href = '/auth/login'}
                className="w-full"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
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
          {/* Profile Completion Form */}
          {showProfileCompletion && (
            <Card className="lg:col-span-3 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Complete Your Farmer Profile
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  Please complete your farmer profile to start listing products for sale.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile_full_name">Full Name *</Label>
                    <Input
                      id="profile_full_name"
                      placeholder="Your full name"
                      value={profileCompletionForm.full_name}
                      onChange={(e) => handleProfileCompletionChange('full_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile_farm_location">Farm Location *</Label>
                    <Input
                      id="profile_farm_location"
                      placeholder="Village, District, Division"
                      value={profileCompletionForm.farm_location}
                      onChange={(e) => handleProfileCompletionChange('farm_location', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile_land_area">Land Area (Acres)</Label>
                    <Input
                      id="profile_land_area"
                      type="number"
                      placeholder="5.5"
                      value={profileCompletionForm.land_area_acres}
                      onChange={(e) => handleProfileCompletionChange('land_area_acres', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile_experience">Years of Experience</Label>
                    <Input
                      id="profile_experience"
                      type="number"
                      placeholder="10"
                      value={profileCompletionForm.farming_experience_years}
                      onChange={(e) => handleProfileCompletionChange('farming_experience_years', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Crops Grown (Select all that apply)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Rice', 'Wheat', 'Vegetables', 'Fruits', 'Pulses', 'Spices'].map((crop) => (
                      <div key={crop} className="flex items-center space-x-2">
                        <input
                          id={`profile_${crop}`}
                          type="checkbox"
                          checked={profileCompletionForm.crops_grown.includes(crop)}
                          onChange={() => handleArrayChangeProfileCompletion('crops_grown', crop)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <Label htmlFor={`profile_${crop}`} className="text-sm">{crop}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="profile_organic_certified"
                    type="checkbox"
                    checked={profileCompletionForm.organic_certified}
                    onChange={(e) => handleProfileCompletionChange('organic_certified', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <Label htmlFor="profile_organic_certified" className="text-sm font-medium">
                    Organic Certified Farm
                  </Label>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleCompleteProfile}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary-glow"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Completing Profile...' : 'Complete Profile'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowProfileCompletion(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Edit Product Form */}
          {editingProduct && (
            <Card className="lg:col-span-3 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Edit className="mr-2 h-5 w-5" />
                  Edit Product: {editingProduct.name}
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Update your product information below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  {/* Basic Product Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit_name">Product Name *</Label>
                      <Input
                        id="edit_name"
                        placeholder="e.g., Basmati Rice"
                        value={editForm.name}
                        onChange={(e) => handleEditInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_category">Category *</Label>
                      <Select value={editForm.category} onValueChange={(value) => handleEditInputChange('category', value)} required>
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
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_variety">Variety</Label>
                      <Input
                        id="edit_variety"
                        placeholder="e.g., Pusa Basmati 1121"
                        value={editForm.variety}
                        onChange={(e) => handleEditInputChange('variety', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_qualityGrade">Quality Grade</Label>
                      <Select value={editForm.qualityGrade} onValueChange={(value) => handleEditInputChange('qualityGrade', value)}>
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
                      <Label htmlFor="edit_quantity">Quantity *</Label>
                      <Input
                        id="edit_quantity"
                        type="number"
                        placeholder="1000"
                        value={editForm.quantity}
                        onChange={(e) => handleEditInputChange('quantity', e.target.value)}
                        required
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_unit">Unit</Label>
                      <Select value={editForm.unit} onValueChange={(value) => handleEditInputChange('unit', value)}>
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
                      <Label htmlFor="edit_basePrice">Base Price (৳/{editForm.unit}) *</Label>
                      <Input
                        id="edit_basePrice"
                        type="number"
                        placeholder="50"
                        value={editForm.basePrice}
                        onChange={(e) => handleEditInputChange('basePrice', e.target.value)}
                        required
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Location and Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit_location">Location</Label>
                      <Input
                        id="edit_location"
                        placeholder="e.g., Dhaka, Bangladesh"
                        value={editForm.location}
                        onChange={(e) => handleEditInputChange('location', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_harvestDate">Harvest Date</Label>
                      <Input
                        id="edit_harvestDate"
                        type="date"
                        value={editForm.harvestDate}
                        onChange={(e) => handleEditInputChange('harvestDate', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Organic Certification */}
                  <div className="flex items-center space-x-2">
                    <input
                      id="edit_organicCertified"
                      type="checkbox"
                      checked={editForm.organicCertified}
                      onChange={(e) => handleEditInputChange('organicCertified', e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <Label htmlFor="edit_organicCertified" className="text-sm font-medium">
                      Organic Certified
                    </Label>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="edit_description">Product Description</Label>
                    <Textarea
                      id="edit_description"
                      placeholder="Describe your product quality, storage conditions, special features..."
                      rows={3}
                      value={editForm.description}
                      onChange={(e) => handleEditInputChange('description', e.target.value)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      {isLoading ? 'Updating Product...' : 'Update Product'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          {/* Product Listing Form */}
          <Card className="lg:col-span-2 shadow-fresh">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5 text-primary" />
                List New Product
              </CardTitle>
              <CardDescription>
                Provide product details to get AI-powered pricing recommendations
              </CardDescription>
              {!farmerProfile && !showProfileCompletion && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <div className="flex items-center justify-between">
                    <span>⚠️ Please complete your farmer profile first to list products.</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowProfileCompletion(true)}
                      className="ml-2 text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                    >
                      Complete Profile
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Product Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Basmati Rice"
                      value={productForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={productForm.category} onValueChange={(value) => handleInputChange('category', value)} required>
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
                        <SelectItem value="other">Other</SelectItem>
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
                      required
                      min="0.1"
                      step="0.1"
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
                    <Label htmlFor="basePrice">Base Price (৳/{productForm.unit}) *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      placeholder="50"
                      value={productForm.basePrice}
                      onChange={(e) => handleInputChange('basePrice', e.target.value)}
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Location and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Dhaka, Bangladesh"
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

                {/* Organic Certification */}
                <div className="flex items-center space-x-2">
                  <input
                    id="organicCertified"
                    type="checkbox"
                    checked={productForm.organicCertified}
                    onChange={(e) => handleInputChange('organicCertified', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <Label htmlFor="organicCertified" className="text-sm font-medium">
                    Organic Certified
                  </Label>
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
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-glow"
                  size="lg"
                  disabled={isLoading || !farmerProfile}
                >
                  {isLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Listing Product...' : 'List Product for Sale'}
                </Button>
                
                {/* Debug Info - Remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
                    <h4 className="font-medium mb-2">Debug Info:</h4>
                    <p><strong>User:</strong> {user?.email || 'Not logged in'}</p>
                    <p><strong>Farmer Profile:</strong> {farmerProfile ? `ID: ${farmerProfile.id}` : 'Not found'}</p>
                    <p><strong>Form Valid:</strong> {productForm.name && productForm.category && productForm.quantity && productForm.basePrice ? 'Yes' : 'No'}</p>
                    <p><strong>Missing Fields:</strong> {[
                      !productForm.name && 'name',
                      !productForm.category && 'category', 
                      !productForm.quantity && 'quantity',
                      !productForm.basePrice && 'price'
                    ].filter(Boolean).join(', ') || 'None'}</p>
                  </div>
                )}
              </form>
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
                {myListings.filter(l => l.is_active === true).length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListings.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No products listed yet</h3>
                  <p className="text-sm text-muted-foreground">Start by listing your first product above.</p>
                </div>
              ) : (
                myListings.map((listing) => (
                  <Card key={listing.id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{listing.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{listing.category}</p>
                        </div>
                        <Badge className={listing.is_active ? 'bg-green-600' : 'bg-gray-600'}>
                          {listing.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span className="font-medium">{listing.available_quantity} {listing.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Listed Price:</span>
                          <span className="font-bold text-primary">৳{listing.price}/{listing.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="text-xs">{listing.location}</span>
                        </div>
                        {listing.organic && (
                          <div className="flex justify-between">
                            <span>Organic:</span>
                            <Badge variant="outline" className="text-xs">Yes</Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => startEditProduct(listing)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => toggleProductStatus(listing.id, listing.is_active)}
                        >
                          {listing.is_active ? (
                            <>
                              <Eye className="h-4 w-4 mr-1" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1" />
                              Show
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteProduct(listing.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Chat Assistant */}
        <AIChatWidget 
          context="product selling and pricing advice"
          placeholder="Ask about pricing strategies, market trends, or selling tips..."
        />
      </div>
      )}
    </FarmerDashboardLayout>
  );
};

export default SellProducts;