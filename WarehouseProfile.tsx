import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
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
  TrendingUp
} from 'lucide-react';

const WarehouseProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    personalInfo: {
      fullName: 'Aminul Islam Rahman',
      email: 'aminul.rahman@krishibondhu.com',
      phone: '+880 1712-345678',
      position: 'Warehouse Manager',
      employeeId: 'WM001',
      joinDate: '2022-03-15'
    },
    warehouseInfo: {
      name: 'KrishiBondhu Central Warehouse',
      address: 'Savar EPZ, Dhaka-1340, Bangladesh',
      capacity: '5000 tons',
      storageTypes: ['Rice', 'Vegetables', 'Tea', 'Jute'],
      certifications: ['BSTI', 'ISO 22000', 'HACCP'],
      operatingHours: '06:00 AM - 10:00 PM',
      contactNumber: '+880 2-9876543'
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

  const [performance] = useState({
    totalProcessed: 125000,
    averageRating: 4.8,
    onTimeDelivery: 96.2,
    storageEfficiency: 87.5,
    customerSatisfaction: 94.8,
    monthlyGrowth: 12.3
  });

  const handleSave = () => {
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
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
                <div>
                  <Label>Storage Types</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.warehouseInfo.storageTypes.map((type, index) => (
                      <Badge key={index} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
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