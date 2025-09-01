import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import WeatherWidget from '../../components/widgets/WeatherWidget';
import AIChatWidget from '../../components/widgets/AIChatWidget';
import MapWidget from '../../components/widgets/MapWidget';
import {
  Users,
  Building2,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Server,
  Database,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Eye,
  RefreshCw,
  Calendar,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState(98.5);
  const [activeUsers, setActiveUsers] = useState(1247);
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([]);

  // Mock KPI data
  const kpiData = {
    totalRevenue: 2450000,
    revenueGrowth: 12.5,
    totalUsers: 15678,
    userGrowth: 8.3,
    totalOrders: 45890,
    orderGrowth: 15.7,
    activeWarehouses: 89,
    warehouseGrowth: 5.2
  };

  // Mock real-time activity data
  const recentActivity = [
    { id: 1, type: 'order', message: 'New order #ORD12345 received', user: 'Dhaka Mart', time: '2 mins ago', status: 'success' },
    { id: 2, type: 'user', message: 'New farmer registration', user: 'Rashidul Islam', time: '5 mins ago', status: 'info' },
    { id: 3, type: 'warehouse', message: 'Warehouse capacity updated', user: 'Dhaka Central Warehouse', time: '8 mins ago', status: 'warning' },
    { id: 4, type: 'payment', message: 'Payment processed successfully', user: 'FastCargo', time: '12 mins ago', status: 'success' },
    { id: 5, type: 'system', message: 'Database backup completed', user: 'System', time: '15 mins ago', status: 'info' },
  ];

  // Mock system monitoring data
  const systemMetrics = {
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    networkLatency: 25,
    activeConnections: 1247,
    uptime: '99.8%'
  };

  // Mock revenue data
  const revenueData = [
    { month: 'Jul', revenue: 180000, orders: 2840 },
    { month: 'Aug', revenue: 195000, orders: 3120 },
    { month: 'Sep', revenue: 210000, orders: 3456 },
    { month: 'Oct', revenue: 225000, orders: 3789 },
    { month: 'Nov', revenue: 240000, orders: 4023 },
    { month: 'Dec', revenue: 255000, orders: 4267 },
    { month: 'Jan', revenue: 270000, orders: 4598 }
  ];

  // Mock user growth data
  const userGrowthData = [
    { month: 'Jul', farmers: 1200, customers: 2800, warehouses: 45, delivery: 380 },
    { month: 'Aug', farmers: 1350, customers: 3100, warehouses: 52, delivery: 420 },
    { month: 'Sep', farmers: 1520, customers: 3450, warehouses: 58, delivery: 465 },
    { month: 'Oct', farmers: 1680, customers: 3820, warehouses: 64, delivery: 510 },
    { month: 'Nov', farmers: 1850, customers: 4200, warehouses: 71, delivery: 560 },
    { month: 'Dec', farmers: 2020, customers: 4650, warehouses: 78, delivery: 615 },
    { month: 'Jan', farmers: 2200, customers: 5120, warehouses: 85, delivery: 675 }
  ];

  // Mock geographic data
  const geographicData = [
    { region: 'Northern Bangladesh', users: 6500, color: '#3b82f6' },
    { region: 'Western Bangladesh', users: 4200, color: '#10b981' },
    { region: 'Southern Bangladesh', users: 3800, color: '#f59e0b' },
    { region: 'Eastern Bangladesh', users: 1178, color: '#8b5cf6' }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => prev + (Math.random() - 0.5) * 0.1);
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10 - 5));
      
      // Add random activity
      if (Math.random() < 0.3) {
        const activities = [
          { type: 'order', message: `New order #ORD${Math.floor(Math.random() * 10000)} received`, user: 'Customer', status: 'success' },
          { type: 'user', message: 'New user registration', user: 'New User', status: 'info' },
          { type: 'payment', message: 'Payment processed', user: 'System', status: 'success' }
        ];
        const newActivity = activities[Math.floor(Math.random() * activities.length)];
        setRealtimeUpdates(prev => [{ ...newActivity, id: Date.now(), time: 'Just now' }, ...prev.slice(0, 4)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'warehouse': return <Building2 className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'system': return <Server className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">৳{(kpiData.totalRevenue / 100000).toFixed(1)}L</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400 ml-1">+{kpiData.revenueGrowth}%</span>
                </div>
              </div>
              <div className="rounded-full bg-green-900/20 p-3">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{(kpiData.totalUsers / 1000).toFixed(1)}K</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400 ml-1">+{kpiData.userGrowth}%</span>
                </div>
              </div>
              <div className="rounded-full bg-blue-900/20 p-3">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Orders</p>
                <p className="text-2xl font-bold text-white">{(kpiData.totalOrders / 1000).toFixed(1)}K</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-400 ml-1">+{kpiData.orderGrowth}%</span>
                </div>
              </div>
              <div className="rounded-full bg-purple-900/20 p-3">
                <Package className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Warehouses</p>
                <p className="text-2xl font-bold text-white">{kpiData.activeWarehouses}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-orange-400 ml-1">+{kpiData.warehouseGrowth}%</span>
                </div>
              </div>
              <div className="rounded-full bg-orange-900/20 p-3">
                <Building2 className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Overview */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? `৳${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-400" />
              User Growth by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="farmers" stroke="#10b981" strokeWidth={2} name="Farmers" />
                <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2} name="Customers" />
                <Line type="monotone" dataKey="warehouses" stroke="#f59e0b" strokeWidth={2} name="Warehouses" />
                <Line type="monotone" dataKey="delivery" stroke="#8b5cf6" strokeWidth={2} name="Delivery Partners" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Widgets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weather Monitoring */}
        <WeatherWidget 
          location="Dhaka, IN" 
          showForecast={false} 
          showAlerts={true}
        />

        {/* AI Admin Assistant */}
        <AIChatWidget 
          context="admin dashboard - platform management and analytics"
          placeholder="Ask about users, analytics, system status..."
          minimized={true}
        />

        {/* Platform Overview Map */}
        <MapWidget 
          height="300px"
          showNearbyPlaces={true}
          markers={[
            { location: { lat: 23.8103, lng: 90.4125 }, label: 'Main Hub', type: 'warehouse' },
            { location: { lat: 22.3569, lng: 91.7832 }, label: 'Storage A', type: 'warehouse' },
            { location: { lat: 28.7041, lng: 77.1025 }, label: 'Farm Zone', type: 'farm' }
          ]}
        />
      </div>

      {/* System Health and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* System Health */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Server className="mr-2 h-5 w-5 text-green-400" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Overall Health</span>
              <div className="flex items-center">
                <Badge className="bg-green-900/20 text-green-400 border-green-400/20">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {systemHealth.toFixed(1)}%
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">CPU Usage</span>
                  <span className="text-white">{systemMetrics.cpuUsage}%</span>
                </div>
                <Progress value={systemMetrics.cpuUsage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Memory Usage</span>
                  <span className="text-white">{systemMetrics.memoryUsage}%</span>
                </div>
                <Progress value={systemMetrics.memoryUsage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Disk Usage</span>
                  <span className="text-white">{systemMetrics.diskUsage}%</span>
                </div>
                <Progress value={systemMetrics.diskUsage} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">{activeUsers}</p>
                <p className="text-xs text-slate-400">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-400">{systemMetrics.uptime}</p>
                <p className="text-xs text-slate-400">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Activity */}
        <Card className="border-slate-800 bg-slate-900 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-blue-400" />
                Real-time Activity
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs text-green-400">Live</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {[...realtimeUpdates, ...recentActivity].slice(0, 8).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                  <div className={`p-2 rounded-full bg-slate-700 ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`border-slate-600 ${getStatusColor(activity.status)}`}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="mr-2 h-5 w-5 text-purple-400" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={geographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="users"
                >
                  {geographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {geographicData.map((region, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: region.color }}></div>
                  <span className="text-xs text-slate-400">{region.region}: {region.users}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex-col border-slate-700 hover:bg-slate-800">
                <Users className="h-5 w-5 mb-2 text-blue-400" />
                <span className="text-xs text-slate-300">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col border-slate-700 hover:bg-slate-800">
                <Package className="h-5 w-5 mb-2 text-green-400" />
                <span className="text-xs text-slate-300">View Orders</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col border-slate-700 hover:bg-slate-800">
                <Building2 className="h-5 w-5 mb-2 text-purple-400" />
                <span className="text-xs text-slate-300">Warehouses</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col border-slate-700 hover:bg-slate-800">
                <Activity className="h-5 w-5 mb-2 text-orange-400" />
                <span className="text-xs text-slate-300">Analytics</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col border-slate-700 hover:bg-slate-800">
                <Shield className="h-5 w-5 mb-2 text-red-400" />
                <span className="text-xs text-slate-300">Security</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col border-slate-700 hover:bg-slate-800">
                <Database className="h-5 w-5 mb-2 text-cyan-400" />
                <span className="text-xs text-slate-300">Backup</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;