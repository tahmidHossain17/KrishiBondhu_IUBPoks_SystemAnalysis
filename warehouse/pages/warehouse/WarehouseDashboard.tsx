import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Package,
  TrendingUp,
  Thermometer,
  Droplets,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  Plus,
  X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { WarehouseAPI } from '../../services/warehouseApi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

// Type definitions for pending tasks
type ArrivalTask = {
  id: string;
  type: 'arrival';
  farmer: string;
  product: string;
  time: string;
  status: string;
};

type PickupTask = {
  id: string;
  type: 'pickup';
  partner: string;
  products: string;
  time: string;
  status: string;
};

type PendingTask = ArrivalTask | PickupTask;

const WarehouseDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [pendingArrivals, setPendingArrivals] = useState<any[]>([]);
  const [scheduledPickups, setScheduledPickups] = useState<any[]>([]);
  const [dailyFlowData, setDailyFlowData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Storage pricing management states
  const [storageTypes, setStorageTypes] = useState<any[]>([]);
  const [isStoragePricingOpen, setIsStoragePricingOpen] = useState(false);
  const [newStorageType, setNewStorageType] = useState({ name: '', price: '', tags: [] as string[] });
  const [newTag, setNewTag] = useState('');
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [editingStorageId, setEditingStorageId] = useState<string | null>(null);
  const [originalStorageTypeName, setOriginalStorageTypeName] = useState<string>('');

  // Default data structures
  const defaultTodayStats = {
    arrivals: 0,
    dispatches: 0,
    revenue: 0,
    temperature: 22,
    humidity: 65,
    capacity: 0
  };

  const defaultStorageData = [
    { category: 'Empty', value: 100, color: '#6b7280' }
  ];

  // Fallback daily flow data
  const fallbackFlowData = [
    { time: '06:00', arrivals: 0, dispatches: 0 },
    { time: '09:00', arrivals: 0, dispatches: 0 },
    { time: '12:00', arrivals: 0, dispatches: 0 },
    { time: '15:00', arrivals: 0, dispatches: 0 },
    { time: '18:00', arrivals: 0, dispatches: 0 },
  ];

  const todayStats = dashboardData?.todayStats || defaultTodayStats;
  const storageData = dashboardData?.storageData || defaultStorageData;

  // Helper function to format time ago
  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const pendingTasks: PendingTask[] = [
    ...pendingArrivals.slice(0, 2).map(arrival => ({
      id: arrival.id,
      type: 'arrival' as const,
      farmer: arrival.farmer.name,
      product: `${arrival.product.name} - ${arrival.product.quantity} ${arrival.product.unit}`,
      time: getTimeAgo(arrival.submittedAt),
      status: arrival.status
    })),
    ...scheduledPickups.slice(0, 1).map(pickup => ({
      id: pickup.id,
      type: 'pickup' as const,
      partner: pickup.customer.name,
      products: `${pickup.products.length} products`,
      time: getTimeAgo(pickup.scheduling.scheduledDate),
      status: pickup.status
    }))
  ];

  useEffect(() => {
    if (user && profile?.role === 'warehouse') {
      loadDashboardData();
    }
  }, [user, profile]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get warehouse profile first
      const warehouseProfile = await WarehouseAPI.getWarehouseProfile(profile?.id);
      if (!warehouseProfile.success || !warehouseProfile.data) {
        toast({
          title: "Warehouse profile not found",
          description: "Please complete your warehouse profile setup first.",
          variant: "destructive"
        });
        return;
      }

      const warehouseId = warehouseProfile.data.id;

      // Load all dashboard data including daily flow
      const [dashboardResult, revenueResult, arrivalsResult, pickupsResult, flowResult, storagePricingResult] = await Promise.all([
        WarehouseAPI.getWarehouseDashboardStats(warehouseId),
        WarehouseAPI.getRevenueData(warehouseId, 6),
        WarehouseAPI.getPendingArrivals(warehouseId),
        WarehouseAPI.getScheduledPickups(warehouseId),
        WarehouseAPI.getDailyFlowData(warehouseId),
        WarehouseAPI.getStoragePricing(warehouseId)
      ]);

      if (dashboardResult.success) {
        setDashboardData(dashboardResult.data);
      }

      if (revenueResult.success) {
        setRevenueData(revenueResult.data);
      }

      if (arrivalsResult.success) {
        setPendingArrivals(arrivalsResult.data);
      }

      if (pickupsResult.success) {
        setScheduledPickups(pickupsResult.data);
      }

      if (flowResult.success) {
        setDailyFlowData(Array.isArray(flowResult.data) ? flowResult.data : []);
      } else {
        // Use fallback data if flow data fails
        setDailyFlowData(fallbackFlowData);
      }

      if (storagePricingResult.success) {
        setStorageTypes(Array.isArray(storagePricingResult.data) ? storagePricingResult.data : []);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error loading dashboard",
        description: "Failed to load warehouse dashboard data. Using fallback data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 15) return { status: 'Cold', variant: 'destructive' as const };
    if (temp > 30) return { status: 'Hot', variant: 'destructive' as const };
    if (temp >= 18 && temp <= 25) return { status: 'Optimal', variant: 'default' as const };
    return { status: 'Good', variant: 'secondary' as const };
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity < 40) return { status: 'Low', variant: 'destructive' as const };
    if (humidity > 70) return { status: 'High', variant: 'destructive' as const };
    if (humidity >= 50 && humidity <= 65) return { status: 'Optimal', variant: 'default' as const };
    return { status: 'Good', variant: 'secondary' as const };
  };

  // Storage pricing management functions
  const handleAddTag = () => {
    if (newTag.trim() && !newStorageType.tags.includes(newTag.trim())) {
      setNewStorageType(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewStorageType(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSaveStorageType = async () => {
    if (!newStorageType.name.trim() || !newStorageType.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in storage type name and price.",
        variant: "destructive"
      });
      return;
    }

    try {
      const warehouseProfile = await WarehouseAPI.getWarehouseProfile(profile?.id);
      if (!warehouseProfile.success) return;

      // When editing and storage type name changed, remove old entry first
      if (isEditingPricing && originalStorageTypeName && originalStorageTypeName !== newStorageType.name) {
        await WarehouseAPI.removeStoragePricing(warehouseProfile.data.id, originalStorageTypeName);
      }

      // Add or update storage pricing
      const result = await WarehouseAPI.upsertStoragePricing(
        warehouseProfile.data.id,
        newStorageType.name,
        parseFloat(newStorageType.price)
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `Storage type ${isEditingPricing ? 'updated' : 'added'} successfully.`
        });
        
        // Refresh storage types
        const updatedResult = await WarehouseAPI.getStoragePricing(warehouseProfile.data.id);
        if (updatedResult.success) {
          setStorageTypes(Array.isArray(updatedResult.data) ? updatedResult.data : []);
        }
        
        // Reset form
        resetStoragePricingForm();
        setIsStoragePricingOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || 'Failed to save storage type.',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving storage type:', error);
      toast({
        title: "Error",
        description: "Failed to save storage type.",
        variant: "destructive"
      });
    }
  };

  const handleEditStorageType = (storageType: any) => {
    setNewStorageType({
      name: storageType.storage_type || '',
      price: (storageType.price || storageType.price_per_ton_per_month || 0).toString(),
      tags: storageType.tags || []
    });
    setOriginalStorageTypeName(storageType.storage_type || '');
    setEditingStorageId(storageType.id);
    setIsEditingPricing(true);
    setIsStoragePricingOpen(true);
  };

  const handleDeleteStorageType = async (storageType: any) => {
    try {
      const warehouseProfile = await WarehouseAPI.getWarehouseProfile(profile?.id);
      if (!warehouseProfile.success) return;

      const result = await WarehouseAPI.removeStoragePricing(
        warehouseProfile.data.id,
        storageType.storage_type
      );
      if (result.success) {
        toast({
          title: "Success",
          description: "Storage type deleted successfully."
        });
        
        // Refresh storage types
        const warehouseProfile = await WarehouseAPI.getWarehouseProfile(profile?.id);
        if (warehouseProfile.success) {
          const updatedResult = await WarehouseAPI.getStoragePricing(warehouseProfile.data.id);
          if (updatedResult.success) {
            setStorageTypes(Array.isArray(updatedResult.data) ? updatedResult.data : []);
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.error || 'Failed to delete storage type.',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting storage type:', error);
      toast({
        title: "Error",
        description: "Failed to delete storage type.",
        variant: "destructive"
      });
    }
  };

  const resetStoragePricingForm = () => {
    setNewStorageType({ name: '', price: '', tags: [] });
    setNewTag('');
    setIsEditingPricing(false);
    setEditingStorageId(null);
    setOriginalStorageTypeName('');
  };

  const calculatePricingSummary = () => {
    if (!storageTypes.length) return { avgPrice: 0, totalTypes: 0, priceRange: '0 - 0' };
    
    const prices = storageTypes.map(type => type.price || type.price_per_ton_per_month || 0);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    return {
      avgPrice: avgPrice.toFixed(0),
      totalTypes: storageTypes.length,
      priceRange: `৳${minPrice} - ৳${maxPrice}`
    };
  };

  // Check authentication and warehouse access
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please Login</h3>
          <p className="text-gray-600 mb-4">Please login to access the warehouse dashboard.</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Use:</strong> warehouse@example.com / admin1234</p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced role checking with better debugging
  const hasWarehouseAccess = profile?.role === 'warehouse' || 
                            user?.id === 'c16c416d-4d7f-4b6a-866e-9cc411c2727c' || // Known warehouse user ID
                            user?.email === 'warehouse@example.com';

  if (!hasWarehouseAccess) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600 mb-4">This dashboard is only available for warehouse users.</p>
          <div className="text-xs text-gray-500 space-y-1 p-3 bg-gray-50 rounded">
            <p><strong>Current User:</strong> {user?.email || 'Not logged in'}</p>
            <p><strong>User ID:</strong> {user?.id || 'No user ID'}</p>
            <p><strong>Profile Role:</strong> {profile?.role || 'No profile found'}</p>
            <p><strong>Profile ID:</strong> {profile?.id || 'No profile ID'}</p>
            <hr className="my-2" />
            <p><strong>Expected:</strong> warehouse@example.com with 'warehouse' role</p>
            <p><strong>Need Help?</strong> Use the Profile Fix button or contact support</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening at your warehouse today.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadDashboardData} disabled={loading}>
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Arrivals</p>
                <p className="text-2xl font-bold text-slate-900">{todayStats.arrivals}</p>
                <div className="flex items-center mt-1">
                  {todayStats.arrivals > 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Active today</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">No arrivals today</span>
                  )}
                </div>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Dispatches</p>
                <p className="text-2xl font-bold text-slate-900">{todayStats.dispatches}</p>
                <div className="flex items-center mt-1">
                  {todayStats.dispatches > 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Processed today</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">No dispatches today</span>
                  )}
                </div>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-slate-900">৳{todayStats.revenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {todayStats.revenue > 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Earned today</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">No revenue today</span>
                  )}
                </div>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Storage Capacity</p>
                <p className="text-2xl font-bold text-slate-900">{todayStats.capacity}%</p>
                <Progress value={todayStats.capacity} className="mt-2" />
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              Revenue Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {revenueData.length > 0 ? (
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2" />
                    <p>No revenue data available</p>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Storage Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-green-600" />
              Storage Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {storageData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-600">{item.category}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Flow and Environmental Monitoring */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Daily Flow */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-indigo-600" />
              Today's Product Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyFlowData.length > 0 ? dailyFlowData : fallbackFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time_label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="arrivals" fill="#3b82f6" name="Arrivals" />
                <Bar dataKey="dispatches" fill="#10b981" name="Dispatches" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Environmental Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Thermometer className="mr-2 h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{Number(todayStats.temperature).toFixed(1)}°C</p>
                <Badge variant={getTemperatureStatus(todayStats.temperature).variant} className="text-xs">
                  {getTemperatureStatus(todayStats.temperature).status}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Droplets className="mr-2 h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Humidity</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{Number(todayStats.humidity).toFixed(1)}%</p>
                <Badge variant={getHumidityStatus(todayStats.humidity).variant} className="text-xs">
                  {getHumidityStatus(todayStats.humidity).status}
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  View All Alerts
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Emergency Protocols
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Types & Pricing Management */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Storage Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-purple-600" />
                Storage Types & Pricing
              </div>
              <Dialog open={isStoragePricingOpen} onOpenChange={(open) => {
                setIsStoragePricingOpen(open);
                if (!open) resetStoragePricingForm();
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setIsStoragePricingOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Storage Type
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditingPricing ? 'Edit Storage Type' : 'Add New Storage Type'}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditingPricing ? 'Update storage type details and pricing.' : 'Add a new storage type with pricing details.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="storage-name">Storage Type Name</Label>
                      <Input
                        id="storage-name"
                        value={newStorageType.name}
                        onChange={(e) => setNewStorageType(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Rice, Vegetables, Fruits"
                      />
                    </div>
                    <div>
                      <Label htmlFor="storage-price">Price per Ton per Month (৳)</Label>
                      <Input
                        id="storage-price"
                        type="number"
                        value={newStorageType.price}
                        onChange={(e) => setNewStorageType(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g., 250"
                      />
                    </div>
                    <div>
                      <Label htmlFor="storage-tags">Tags (Optional)</Label>
                      <div className="flex space-x-2 mb-2">
                        <Input
                          id="storage-tags"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tag..."
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                          Add
                        </Button>
                      </div>
                      {newStorageType.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {newStorageType.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => {
                        setIsStoragePricingOpen(false);
                        resetStoragePricingForm();
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveStorageType}>
                        {isEditingPricing ? 'Update' : 'Add'} Storage Type
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading storage types...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {storageTypes.length > 0 ? (
                  storageTypes.map((storageType, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-slate-900">{storageType.storage_type}</h4>
                          <Badge variant="outline" className="text-xs">
                            ৳{storageType.price || storageType.price_per_ton_per_month || 0}/ton/month
                          </Badge>
                        </div>
                        {storageType.tags && storageType.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {storageType.tags.map((tag: string, tagIndex: number) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStorageType(storageType)}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteStorageType(storageType)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2" />
                    <p>No storage types defined</p>
                    <p className="text-sm">Add your first storage type to get started</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-600" />
              Pricing Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const summary = calculatePricingSummary();
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{summary.totalTypes}</p>
                      <p className="text-sm text-blue-700">Storage Types</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">৳{summary.avgPrice}</p>
                      <p className="text-sm text-green-700">Avg. Price/Ton/Month</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{summary.priceRange}</p>
                      <p className="text-sm text-purple-700">Price Range</p>
                    </div>
                  </div>
                  
                  {storageTypes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Recent Storage Types</h4>
                      <div className="space-y-2">
                        {storageTypes.slice(0, 3).map((type, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{type.storage_type}</span>
                            <Badge variant="outline" className="text-xs">
                              ৳{type.price || type.price_per_ton_per_month || 0}
                            </Badge>
                          </div>
                        ))}
                        {storageTypes.length > 3 && (
                          <p className="text-xs text-gray-500 text-center mt-2">
                            +{storageTypes.length - 3} more storage types
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setIsStoragePricingOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Storage Type
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Pricing Settings
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()} 
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-orange-600" />
              Pending Tasks ({pendingTasks.length})
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading tasks...</span>
            </div>
          ) : (
          <div className="space-y-4">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      task.type === 'arrival' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {task.type === 'arrival' ? 
                        <Package className="h-4 w-4 text-blue-600" /> : 
                        <Truck className="h-4 w-4 text-green-600" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {task.type === 'arrival' ? (task as ArrivalTask).farmer : (task as PickupTask).partner}
                      </p>
                      <p className="text-sm text-slate-600">
                        {task.type === 'arrival' ? (task as ArrivalTask).product : (task as PickupTask).products}
                      </p>
                      <p className="text-xs text-slate-400">{task.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      task.status === 'urgent' ? 'destructive' : 
                      task.status === 'confirmed' ? 'default' : 'secondary'
                    }>
                      {task.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      {task.type === 'arrival' ? 'Review' : 'Confirm'}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                <p>No pending tasks</p>
                <p className="text-sm">All caught up!</p>
              </div>
            )}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseDashboard;