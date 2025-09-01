import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import WarehouseAPI from '../../services/warehouseApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Switch } from '../../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  Settings,
  Shield,
  Bell,
  Save,
  Camera,
  Edit,
  Award,
  TrendingUp,
  Plus,
  X,
  DollarSign,
  RefreshCw
} from 'lucide-react';

const WarehouseProfile: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newStorageType, setNewStorageType] = useState('');
  const [newStoragePrice, setNewStoragePrice] = useState('');
  const [warehouseId, setWarehouseId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>({
    personalInfo: {
      fullName: '',
      email: user?.email || '',
      phone: '',
      position: 'Warehouse Manager',
      employeeId: '',
      joinDate: ''
    },
    warehouseInfo: {
      name: '',
      address: '',
      capacity: '',
      storageTypes: [],
      certifications: [],
      operatingHours: '',
      contactNumber: ''
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      alertsEnabled: true,
      reportFrequency: 'weekly',
      language: 'english',
      timezone: 'BST'
    }
  });
  const [performance, setPerformance] = useState<any>({
    totalProcessed: 125000,
    averageRating: 4.5,
    onTimeDelivery: 95.4,
    storageEfficiency: 84.5,
    customerSatisfaction: 92.0,
    monthlyGrowth: 12.5
  });

  useEffect(() => {
    if (user && profile?.role === 'warehouse') {
      loadProfileData();
    }
  }, [user, profile]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Get warehouse profile first
      const warehouseProfileResult = await WarehouseAPI.getWarehouseProfile(profile?.id);
      if (!warehouseProfileResult.success || !warehouseProfileResult.data) {
        toast({
          title: "Warehouse profile not found",
          description: "Please complete your warehouse profile setup first.",
          variant: "destructive"
        });
        return;
      }

      const warehouseData = warehouseProfileResult.data;
      setWarehouseId(warehouseData.id);

      // Load full profile details, storage pricing, and performance stats
      const [fullProfileResult, storagePricingResult, performanceStatsResult] = await Promise.all([
        WarehouseAPI.getFullWarehouseProfile(warehouseData.id),
        WarehouseAPI.getStoragePricing(warehouseData.id),
        WarehouseAPI.getPerformanceStats(warehouseData.id)
      ]);

      if (fullProfileResult.success && fullProfileResult.data) {
        const data = fullProfileResult.data;
        const preferences = data.preferences || {};
        
        setProfileData({
          personalInfo: {
            fullName: data.manager_name || '',
            email: user?.email || '',
            phone: data.contact_number || '',
            position: data.manager_position || 'Warehouse Manager',
            employeeId: data.employee_id || '',
            joinDate: data.join_date || ''
          },
          warehouseInfo: {
            name: data.business_name || '',
            address: data.address || '',
            capacity: data.capacity_tons ? `${data.capacity_tons} tons` : '',
            storageTypes: [],
            certifications: data.certifications || [],
            operatingHours: data.operating_hours || '',
            contactNumber: data.contact_number || ''
          },
          preferences: {
            emailNotifications: preferences.emailNotifications !== false,
            smsNotifications: preferences.smsNotifications === true,
            alertsEnabled: preferences.alertsEnabled !== false,
            reportFrequency: preferences.reportFrequency || 'weekly',
            language: preferences.language || 'english',
            timezone: preferences.timezone || 'BST'
          }
        });
      }

      if (storagePricingResult.success) {
        setProfileData(prev => ({
          ...prev,
          warehouseInfo: {
            ...prev.warehouseInfo,
            storageTypes: storagePricingResult.data.map((item: any) => ({
              type: item.storage_type,
              price: item.price
            }))
          }
        }));
      }

      if (performanceStatsResult.success && performanceStatsResult.data) {
        const stats = performanceStatsResult.data;
        setPerformance({
          totalProcessed: stats.total_processed || 0,
          averageRating: stats.average_rating || 0,
          onTimeDelivery: stats.on_time_delivery || 0,
          storageEfficiency: stats.storage_efficiency || 0,
          customerSatisfaction: stats.customer_satisfaction || 0,
          monthlyGrowth: stats.monthly_growth || 0
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: "Error loading profile",
        description: "Failed to load warehouse profile data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!warehouseId) return;
    
    try {
      const updateData = {
        business_name: profileData.warehouseInfo.name,
        address: profileData.warehouseInfo.address,
        capacity_tons: parseFloat(profileData.warehouseInfo.capacity.replace(' tons', '')) || 0,
        manager_name: profileData.personalInfo.fullName,
        manager_position: profileData.personalInfo.position,
        operating_hours: profileData.warehouseInfo.operatingHours,
        contact_number: profileData.warehouseInfo.contactNumber,
        certifications: profileData.warehouseInfo.certifications,
        preferences: profileData.preferences
      };

      const result = await WarehouseAPI.updateWarehouseProfile(warehouseId, updateData);
      
      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your warehouse profile has been updated successfully.",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update warehouse profile.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: "Failed to save profile changes.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (section: string, field: string, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const addStorageType = async () => {
    if (!warehouseId || !newStorageType.trim() || !newStoragePrice.trim()) return;
    
    const price = parseFloat(newStoragePrice);
    if (isNaN(price) || price <= 0) return;

    try {
      const result = await WarehouseAPI.upsertStoragePricing(warehouseId, newStorageType.trim(), price);
      
      if (result.success) {
        setProfileData(prev => ({
          ...prev,
          warehouseInfo: {
            ...prev.warehouseInfo,
            storageTypes: [
              ...prev.warehouseInfo.storageTypes,
              { type: newStorageType.trim(), price }
            ]
          }
        }));
        setNewStorageType('');
        setNewStoragePrice('');
        toast({
          title: "Storage type added",
          description: "New storage type has been added successfully.",
        });
      } else {
        toast({
          title: "Failed to add storage type",
          description: "Could not add new storage type.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding storage type:', error);
      toast({
        title: "Error",
        description: "Failed to add storage type.",
        variant: "destructive"
      });
    }
  };

  const removeStorageType = async (index: number) => {
    if (!warehouseId) return;
    
    const storageType = profileData.warehouseInfo.storageTypes[index];
    if (!storageType) return;

    try {
      const result = await WarehouseAPI.removeStoragePricing(warehouseId, storageType.type);
      
      if (result.success) {
        setProfileData(prev => ({
          ...prev,
          warehouseInfo: {
            ...prev.warehouseInfo,
            storageTypes: prev.warehouseInfo.storageTypes.filter((_, i) => i !== index)
          }
        }));
        toast({
          title: "Storage type removed",
          description: "Storage type has been removed successfully.",
        });
      } else {
        toast({
          title: "Failed to remove storage type",
          description: "Could not remove storage type.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error removing storage type:', error);
      toast({
        title: "Error",
        description: "Failed to remove storage type.",
        variant: "destructive"
      });
    }
  };

  const updateStorageTypePrice = async (index: number, price: string) => {
    if (!warehouseId) return;
    
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) return;

    const storageType = profileData.warehouseInfo.storageTypes[index];
    if (!storageType) return;

    try {
      const result = await WarehouseAPI.upsertStoragePricing(warehouseId, storageType.type, numPrice);
      
      if (result.success) {
        setProfileData(prev => ({
          ...prev,
          warehouseInfo: {
            ...prev.warehouseInfo,
            storageTypes: prev.warehouseInfo.storageTypes.map((item, i) => 
              i === index ? { ...item, price: numPrice } : item
            )
          }
        }));
      }
    } catch (error) {
      console.error('Error updating storage type price:', error);
    }
  };

  if (!user || profile?.role !== 'warehouse') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">This page is only available for warehouse users.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile Management</h1>
          <p className="text-slate-600">Manage your warehouse profile and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={loadProfileData}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
          {isEditing && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt="Profile Picture" />
                <AvatarFallback className="text-lg">RK</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">{profileData.personalInfo.fullName}</h2>
              <p className="text-slate-600">{profileData.personalInfo.position}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-slate-500">
                  <Building2 className="h-4 w-4 mr-1" />
                  {profileData.warehouseInfo.name}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <User className="h-4 w-4 mr-1" />
                  ID: {profileData.personalInfo.employeeId}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{performance.averageRating}</p>
                <p className="text-sm text-slate-500">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{performance.onTimeDelivery}%</p>
                <p className="text-sm text-slate-500">On-Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{performance.storageEfficiency}%</p>
                <p className="text-sm text-slate-500">Efficiency</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="warehouse" className="flex items-center">
            <Building2 className="mr-2 h-4 w-4" />
            Warehouse
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <Award className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileData.personalInfo.fullName}
                    onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={profileData.personalInfo.position}
                    onChange={(e) => handleInputChange('personalInfo', 'position', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={profileData.personalInfo.employeeId}
                    disabled={true}
                  />
                </div>
                <div>
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input
                    id="joinDate"
                    value={profileData.personalInfo.joinDate}
                    disabled={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warehouse Information */}
        <TabsContent value="warehouse">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5 text-green-600" />
                Warehouse Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="warehouseName">Warehouse Name</Label>
                  <Input
                    id="warehouseName"
                    value={profileData.warehouseInfo.name}
                    onChange={(e) => handleInputChange('warehouseInfo', 'name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profileData.warehouseInfo.address}
                    onChange={(e) => handleInputChange('warehouseInfo', 'address', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Storage Capacity</Label>
                  <Input
                    id="capacity"
                    value={profileData.warehouseInfo.capacity}
                    onChange={(e) => handleInputChange('warehouseInfo', 'capacity', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={profileData.warehouseInfo.contactNumber}
                    onChange={(e) => handleInputChange('warehouseInfo', 'contactNumber', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="operatingHours">Operating Hours</Label>
                  <Input
                    id="operatingHours"
                    value={profileData.warehouseInfo.operatingHours}
                    onChange={(e) => handleInputChange('warehouseInfo', 'operatingHours', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Storage Types & Pricing</Label>
                  <div className="space-y-3 mt-2">
                    {/* Existing Storage Types */}
                    <div className="flex flex-wrap gap-2">
                      {profileData.warehouseInfo.storageTypes.map((storage, index) => (
                        <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-white">
                              {storage.type}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-blue-700">
                              <DollarSign className="h-3 w-3" />
                              {isEditing ? (
                                <Input
                                  type="number"
                                  value={storage.price}
                                  onChange={(e) => updateStorageTypePrice(index, e.target.value)}
                                  className="w-16 h-6 text-xs"
                                  min="0"
                                  step="0.01"
                                />
                              ) : (
                                <span className="font-medium">৳{storage.price}</span>
                              )}
                              <span className="text-xs text-gray-500">/ton/month</span>
                            </div>
                          </div>
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeStorageType(index)}
                              className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Add New Storage Type */}
                    {isEditing && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <Input
                              placeholder="Storage type (e.g., Cold Storage)"
                              value={newStorageType}
                              onChange={(e) => setNewStorageType(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addStorageType();
                                }
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Price per ton/month (₹)"
                              value={newStoragePrice}
                              onChange={(e) => setNewStoragePrice(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addStorageType();
                                }
                              }}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <Button
                            onClick={addStorageType}
                            disabled={!newStorageType.trim() || !newStoragePrice.trim()}
                            className="flex-shrink-0"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Enter storage type name and pricing, then click Add or press Enter
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Pricing Summary */}
                {profileData.warehouseInfo.storageTypes.length > 0 && (
                  <div className="md:col-span-2">
                    <Label>Pricing Summary</Label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Storage Types:</span>
                          <div className="font-medium">{profileData.warehouseInfo.storageTypes.length}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Price Range:</span>
                          <div className="font-medium">
                            ৳{Math.min(...profileData.warehouseInfo.storageTypes.map(s => s.price))} - 
                            ৳{Math.max(...profileData.warehouseInfo.storageTypes.map(s => s.price))}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Average Price:</span>
                          <div className="font-medium">
                            ৳{(profileData.warehouseInfo.storageTypes.reduce((sum, s) => sum + s.price, 0) / profileData.warehouseInfo.storageTypes.length).toFixed(0)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Per:</span>
                          <div className="font-medium text-xs text-gray-500">ton/month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <Label>Certifications</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.warehouseInfo.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-orange-600" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-slate-500">Receive updates via email</p>
                  </div>
                  <Button
                    variant={profileData.preferences.emailNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('preferences', 'emailNotifications', !profileData.preferences.emailNotifications)}
                    disabled={!isEditing}
                  >
                    {profileData.preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-slate-500">Receive alerts via SMS</p>
                  </div>
                  <Button
                    variant={profileData.preferences.smsNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('preferences', 'smsNotifications', !profileData.preferences.smsNotifications)}
                    disabled={!isEditing}
                  >
                    {profileData.preferences.smsNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Real-time Alerts</Label>
                    <p className="text-sm text-slate-500">Immediate notifications for urgent matters</p>
                  </div>
                  <Button
                    variant={profileData.preferences.alertsEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('preferences', 'alertsEnabled', !profileData.preferences.alertsEnabled)}
                    disabled={!isEditing}
                  >
                    {profileData.preferences.alertsEnabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-purple-600" />
                  System Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      value={profileData.preferences.language}
                      onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={profileData.preferences.timezone}
                      onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reportFrequency">Report Frequency</Label>
                    <Input
                      id="reportFrequency"
                      value={profileData.preferences.reportFrequency}
                      onChange={(e) => handleInputChange('preferences', 'reportFrequency', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Metrics */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-yellow-600" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {performance.totalProcessed.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600">Total Items Processed</div>
                    <div className="text-xs text-green-600 mt-1">This Year</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {performance.customerSatisfaction}%
                    </div>
                    <div className="text-sm text-slate-600">Customer Satisfaction</div>
                    <div className="text-xs text-blue-600 mt-1">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      +{performance.monthlyGrowth}%
                    </div>
                    <div className="text-sm text-slate-600">Monthly Growth</div>
                    <div className="text-xs text-purple-600 mt-1">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      Trending Up
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>On-Time Delivery Rate</span>
                      <span>{performance.onTimeDelivery}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${performance.onTimeDelivery}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage Efficiency</span>
                      <span>{performance.storageEfficiency}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${performance.storageEfficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Customer Satisfaction</span>
                      <span>{performance.customerSatisfaction}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${performance.customerSatisfaction}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WarehouseProfile;