import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  User,
  Truck,
  DollarSign,
  Star,
  Camera,
  Edit,
  Save,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Package,
  Target,
  FileText,
  Download,
  HelpCircle,
  MessageCircle,
  Shield,
  CreditCard,
  Trophy
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DeliveryPartnerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    personalInfo: {
      fullName: 'Rajesh Kumar Singh',
      phone: '+91 9876543210',
      email: 'rajesh.kumar@email.com',
      address: 'Sector 15, Noida, UP 201301',
      emergencyContact: '+91 9123456789',
      dateOfBirth: '1990-05-15',
      joiningDate: '2023-08-15'
    },
    vehicleInfo: {
      type: 'Two Wheeler',
      make: 'Honda',
      model: 'Activa 6G',
      registrationNumber: 'UP 14 AB 1234',
      insuranceExpiry: '2025-03-15',
      pucExpiry: '2024-09-20',
      licenseNumber: 'DL-1420110012345',
      licenseExpiry: '2027-05-10'
    },
    documents: {
      drivingLicense: 'verified',
      vehicleRegistration: 'verified',
      insurance: 'verified',
      aadharCard: 'verified',
      panCard: 'verified'
    }
  });

  const [performanceData] = useState({
    totalDeliveries: 1247,
    rating: 4.8,
    completionRate: 98.5,
    onTimeDelivery: 96.2,
    monthlyEarnings: 18500,
    todaysEarnings: 850,
    thisWeekEarnings: 4250,
    avgDeliveryTime: 32,
    totalDistance: 3420
  });

  // Mock earnings data for charts
  const earningsHistory = [
    { month: 'Aug', earnings: 15200, deliveries: 198 },
    { month: 'Sep', earnings: 16800, deliveries: 215 },
    { month: 'Oct', earnings: 17500, deliveries: 238 },
    { month: 'Nov', earnings: 18200, deliveries: 251 },
    { month: 'Dec', earnings: 19100, deliveries: 276 },
    { month: 'Jan', earnings: 18500, deliveries: 267 }
  ];

  const dailyEarnings = [
    { day: 'Mon', earnings: 650, hours: 8 },
    { day: 'Tue', earnings: 720, hours: 9 },
    { day: 'Wed', earnings: 580, hours: 7 },
    { day: 'Thu', earnings: 810, hours: 10 },
    { day: 'Fri', earnings: 920, hours: 11 },
    { day: 'Sat', earnings: 1150, hours: 12 },
    { day: 'Sun', earnings: 410, hours: 5 }
  ];

  const recentTransactions = [
    { id: 'TXN001', date: '2024-01-15', amount: 185, type: 'delivery', description: 'Green Mart Delivery' },
    { id: 'TXN002', date: '2024-01-15', amount: 120, type: 'delivery', description: 'Restaurant Delivery' },
    { id: 'TXN003', date: '2024-01-14', amount: 95, type: 'delivery', description: 'Individual Customer' },
    { id: 'TXN004', date: '2024-01-14', amount: -50, type: 'fuel', description: 'Fuel Expense' },
    { id: 'TXN005', date: '2024-01-13', amount: 245, type: 'delivery', description: 'Corporate Order' }
  ];

  const supportOptions = [
    { title: 'Order Issues', description: 'Problems with order pickup or delivery', icon: Package },
    { title: 'Payment Queries', description: 'Questions about earnings and payments', icon: DollarSign },
    { title: 'Vehicle Support', description: 'Vehicle breakdown or maintenance', icon: Truck },
    { title: 'Account Help', description: 'Profile and document related help', icon: User },
    { title: 'Technical Issues', description: 'App problems and technical support', icon: HelpCircle },
    { title: 'General Support', description: 'Other questions and feedback', icon: MessageCircle }
  ];

  const handleSave = () => {
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'verified': return { color: 'bg-green-100 text-green-700', text: 'Verified' };
      case 'pending': return { color: 'bg-yellow-100 text-yellow-700', text: 'Pending' };
      case 'expired': return { color: 'bg-red-100 text-red-700', text: 'Expired' };
      default: return { color: 'bg-gray-100 text-gray-700', text: 'Not Uploaded' };
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
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
              <p className="text-slate-600">Delivery Partner</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-sm font-medium">{performanceData.rating}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Package className="h-4 w-4 mr-1" />
                  {performanceData.totalDeliveries} deliveries
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            <div className="text-center bg-green-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-green-600">₹{performanceData.todaysEarnings}</div>
              <div className="text-xs text-green-700">Today</div>
            </div>
            <div className="text-center bg-blue-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-blue-600">₹{performanceData.thisWeekEarnings}</div>
              <div className="text-xs text-blue-700">This Week</div>
            </div>
            <div className="text-center bg-purple-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{performanceData.completionRate}%</div>
              <div className="text-xs text-purple-700">Success Rate</div>
            </div>
            <div className="text-center bg-orange-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{performanceData.onTimeDelivery}%</div>
              <div className="text-xs text-orange-700">On Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <div className="space-y-4">
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileData.personalInfo.address}
                      onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={profileData.personalInfo.emergencyContact}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="joiningDate">Joining Date</Label>
                    <Input
                      id="joiningDate"
                      value={profileData.personalInfo.joiningDate}
                      disabled={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-green-600" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Input
                      id="vehicleType"
                      value={profileData.vehicleInfo.type}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={profileData.vehicleInfo.registrationNumber}
                      onChange={(e) => handleInputChange('vehicleInfo', 'registrationNumber', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="make">Make & Model</Label>
                    <Input
                      id="make"
                      value={`${profileData.vehicleInfo.make} ${profileData.vehicleInfo.model}`}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={profileData.vehicleInfo.licenseNumber}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-purple-600" />
                  Document Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(profileData.documents).map(([doc, status]) => {
                    const statusInfo = getDocumentStatus(status);
                    return (
                      <div key={doc} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm font-medium capitalize">
                          {doc.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Badge className={statusInfo.color}>
                          {statusInfo.text}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Earnings */}
        <TabsContent value="earnings">
          <div className="space-y-4">
            {/* Earnings Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                  Earnings Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">₹{performanceData.monthlyEarnings}</div>
                    <div className="text-sm text-green-700">This Month</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">₹{performanceData.thisWeekEarnings}</div>
                    <div className="text-sm text-blue-700">This Week</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center md:col-span-1 col-span-2">
                    <div className="text-2xl font-bold text-purple-600">₹{performanceData.todaysEarnings}</div>
                    <div className="text-sm text-purple-700">Today</div>
                  </div>
                </div>

                {/* Monthly Earnings Chart */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Monthly Earnings Trend</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={earningsHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                      <Line type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Daily Earnings Chart */}
                <div>
                  <h4 className="font-medium mb-3">This Week's Daily Earnings</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dailyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                      <Bar dataKey="earnings" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                    Recent Transactions
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-slate-600">{transaction.date} • {transaction.id}</p>
                      </div>
                      <div className={`text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <p className="font-bold">
                          {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-yellow-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completion Rate</span>
                      <span className="font-medium">{performanceData.completionRate}%</span>
                    </div>
                    <Progress value={performanceData.completionRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>On-Time Delivery</span>
                      <span className="font-medium">{performanceData.onTimeDelivery}%</span>
                    </div>
                    <Progress value={performanceData.onTimeDelivery} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{performanceData.totalDeliveries}</div>
                      <div className="text-sm text-slate-600">Total Deliveries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{performanceData.rating}</div>
                      <div className="text-sm text-slate-600">Average Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{performanceData.avgDeliveryTime}</div>
                      <div className="text-sm text-slate-600">Avg Time (min)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{performanceData.totalDistance}</div>
                      <div className="text-sm text-slate-600">Total KM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
                  Achievements & Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="font-medium text-sm">Top Rated</p>
                    <p className="text-xs text-yellow-700">4.8+ Rating</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-sm">Reliable</p>
                    <p className="text-xs text-green-700">98% Success</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-sm">Punctual</p>
                    <p className="text-xs text-blue-700">96% On-Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Support */}
        <TabsContent value="support">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-blue-600" />
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supportOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-20 flex-col justify-center text-left p-4"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <Icon className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{option.title}</p>
                            <p className="text-xs text-slate-600">{option.description}</p>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex-col">
                    <Phone className="h-5 w-5 mb-1 text-green-600" />
                    <span className="text-xs">Call Support</span>
                    <span className="text-xs text-slate-600">1800-123-4567</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <MessageCircle className="h-5 w-5 mb-1 text-blue-600" />
                    <span className="text-xs">Live Chat</span>
                    <span className="text-xs text-slate-600">24/7 Available</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Mail className="h-5 w-5 mb-1 text-purple-600" />
                    <span className="text-xs">Email Us</span>
                    <span className="text-xs text-slate-600">support@krishibondhu.com</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Shield className="h-5 w-5 mb-1 text-red-600" />
                    <span className="text-xs">Emergency</span>
                    <span className="text-xs text-slate-600">Report Issues</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryPartnerProfile;