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
    { id: 1, type: 'order', message: 'New order #ORD12345 received', user: 'Green Mart', time: '2 mins ago', status: 'success' },
    { id: 2, type: 'user', message: 'New farmer registration', user: 'Rajesh Kumar', time: '5 mins ago', status: 'info' },
    { id: 3, type: 'warehouse', message: 'Warehouse capacity updated', user: 'Central Warehouse', time: '8 mins ago', status: 'warning' },
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

  // Mock geographic data with Bangladesh regions
  const geographicData = [
    { region: 'Dhaka Division', users: 6500, color: '#3b82f6' },
    { region: 'Chittagong Division', users: 4200, color: '#10b981' },
    { region: 'Rajshahi Division', users: 3800, color: '#f59e0b' },
    { region: 'Khulna Division', users: 1178, color: '#8b5cf6' }
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
                <p className="text-2xl font-bold text-white">₹{(kpiData.totalRevenue / 100000).toFixed(1)}L</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400 ml-1">+{kpiData.revenueGrowth}%</span>
                </div>
              </div>
              <div className="rounded-full bg-green-900/20 p-3">
                <DollarSign className="h-6 w-6 text
