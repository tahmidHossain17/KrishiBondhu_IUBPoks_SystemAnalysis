import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { formatMoney, formatCompactCurrency } from '../../utils/currency';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  MapPin,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Activity,
  Eye,
  Building2,
  Truck
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data
  const revenueAnalytics = [
    { date: '2024-01-08', revenue: 125000, orders: 245, users: 1420 },
    { date: '2024-01-09', revenue: 138500, orders: 267, users: 1456 },
    { date: '2024-01-10', revenue: 152000, orders: 289, users: 1493 },
    { date: '2024-01-11', revenue: 167200, orders: 312, users: 1531 },
    { date: '2024-01-12', revenue: 159000, orders: 298, users: 1568 },
    { date: '2024-01-13', revenue: 181000, orders: 334, users: 1605 },
    { date: '2024-01-14', revenue: 196000, orders: 356, users: 1642 }
  ];

  const userEngagement = [
    { category: 'Farmers', active: 2200, total: 2800, growth: 8.5 },
    { category: 'Customers', active: 4800, total: 5120, growth: 12.3 },
    { category: 'Warehouses', active: 78, total: 85, growth: 5.2 },
    { category: 'Delivery Partners', active: 620, total: 675, growth: 9.8 }
  ];

  const geographicPerformance = [
    { region: 'Northern Bangladesh', revenue: 850000, users: 6500, orders: 12400, growth: 15.2 },
    { region: 'Western Bangladesh', revenue: 680000, users: 4200, orders: 9800, growth: 11.8 },
    { region: 'Southern Bangladesh', revenue: 520000, users: 3800, orders: 7650, growth: 8.9 },
    { region: 'Eastern Bangladesh', revenue: 290000, users: 1178, orders: 4200, growth: 6.3 }
  ];

  const seasonalTrends = [
    { month: 'Jan', vegetables: 45000, grains: 68000, fruits: 32000 },
    { month: 'Feb', vegetables: 52000, grains: 71000, fruits: 38000 },
    { month: 'Mar', vegetables: 48000, grains: 65000, fruits: 42000 },
    { month: 'Apr', vegetables: 55000, grains: 58000, fruits: 48000 },
    { month: 'May', vegetables: 62000, grains: 52000, fruits: 55000 },
    { month: 'Jun', vegetables: 58000, grains: 48000, fruits: 52000 }
  ];

  const topCrops = [
    { name: 'Rice', revenue: 280000, color: '#10b981' },
    { name: 'Wheat', revenue: 245000, color: '#f59e0b' },
    { name: 'Tomatoes', revenue: 185000, color: '#ef4444' },
    { name: 'Potatoes', revenue: 165000, color: '#8b5cf6' },
    { name: 'Onions', revenue: 142000, color: '#3b82f6' }
  ];

  const keyMetrics = [
    {
      title: 'Total Revenue',
      value: formatCompactCurrency(2450000),
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Active Users',
      value: '7.6K',
      change: '+8.3%',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Order Volume',
      value: '45.8K',
      change: '+15.7%',
      changeType: 'increase',
      icon: Package,
      color: 'text-purple-400'
    },
    {
      title: 'Avg Order Value',
      value: formatMoney(534),
      change: '-2.1%',
      changeType: 'decrease',
      icon: Target,
      color: 'text-orange-400'
    }
  ];

  const handleExportReport = () => {
    const reportData = {
      timeRange,
      generatedAt: new Date().toISOString(),
      metrics: keyMetrics,
      revenueData: revenueAnalytics,
      userEngagement,
      geographicPerformance
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-slate-400">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportReport}
            className="border-slate-700 text-slate-300"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="border-slate-800 bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{metric.title}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <div className="flex items-center mt-1">
                    {metric.changeType === 'increase' ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`text-sm ml-1 ${
                      metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`rounded-full bg-slate-800 p-3`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-slate-700">
            Revenue Analytics
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">
            User Engagement
          </TabsTrigger>
          <TabsTrigger value="geographic" className="data-[state=active]:bg-slate-700">
            Geographic Analysis
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="data-[state=active]:bg-slate-700">
            Seasonal Trends
          </TabsTrigger>
        </TabsList>

        {/* Revenue Analytics */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-green-400" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
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

            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="mr-2 h-5 w-5 text-purple-400" />
                  Top Performing Crops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topCrops}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="revenue"
                    >
                      {topCrops.map((entry, index) => (
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
                  {topCrops.map((crop, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: crop.color }}></div>
                      <span className="text-xs text-slate-400">{crop.name}: ৳{(crop.revenue / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Engagement */}
        <TabsContent value="users" className="space-y-6">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-400" />
                User Engagement by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userEngagement.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">{category.category}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-400">{category.active}/{category.total}</span>
                        <Badge className={`${category.growth > 10 ? 'bg-green-900/20 text-green-400' : 
                          category.growth > 5 ? 'bg-blue-900/20 text-blue-400' : 'bg-yellow-900/20 text-yellow-400'}`}>
                          +{category.growth}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(category.active / category.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500">
                      {((category.active / category.total) * 100).toFixed(1)}% active users
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Analysis */}
        <TabsContent value="geographic" className="space-y-6">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-purple-400" />
                Performance by Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={geographicPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="region" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="orders" fill="#10b981" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Trends */}
        <TabsContent value="seasonal" className="space-y-6">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-orange-400" />
                Seasonal Crop Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={seasonalTrends}>
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
                  <Line type="monotone" dataKey="vegetables" stroke="#10b981" strokeWidth={2} name="Vegetables" />
                  <Line type="monotone" dataKey="grains" stroke="#f59e0b" strokeWidth={2} name="Grains" />
                  <Line type="monotone" dataKey="fruits" stroke="#ef4444" strokeWidth={2} name="Fruits" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;