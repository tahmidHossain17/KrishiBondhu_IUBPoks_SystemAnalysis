import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
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
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const WarehouseDashboard: React.FC = () => {
  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 65000 },
    { month: 'Feb', revenue: 78000 },
    { month: 'Mar', revenue: 82000 },
    { month: 'Apr', revenue: 91000 },
    { month: 'May', revenue: 87000 },
    { month: 'Jun', revenue: 96000 },
  ];

  const storageData = [
    { category: 'Grains', value: 45, color: '#3b82f6' },
    { category: 'Vegetables', value: 25, color: '#10b981' },
    { category: 'Fruits', value: 20, color: '#f59e0b' },
    { category: 'Empty', value: 10, color: '#6b7280' },
  ];

  const dailyFlowData = [
    { time: '06:00', arrivals: 12, dispatches: 8 },
    { time: '09:00', arrivals: 25, dispatches: 15 },
    { time: '12:00', arrivals: 18, dispatches: 22 },
    { time: '15:00', arrivals: 8, dispatches: 18 },
    { time: '18:00', arrivals: 5, dispatches: 12 },
  ];

  const todayStats = {
    arrivals: 68,
    dispatches: 75,
    revenue: 45280,
    temperature: 22,
    humidity: 65,
    capacity: 78
  };

  const pendingTasks = [
    { id: 1, type: 'arrival', farmer: 'Golden Rice Farm', product: 'Chinigura Rice - 500 kg', time: '2 hours ago', status: 'pending' },
    { id: 2, type: 'pickup', partner: 'Dhaka Express', products: '12 orders', time: '1 hour ago', status: 'confirmed' },
    { id: 3, type: 'arrival', farmer: 'Dhaka Valley Organic', product: 'Begun - 300 kg', time: '30 mins ago', status: 'urgent' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening at your warehouse today.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Last updated: 2 mins ago
          </Button>
          <Button>
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
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
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">12% from yesterday</span>
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
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">8% from yesterday</span>
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
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">15% from yesterday</span>
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
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
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
              <BarChart data={dailyFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
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
                <p className="text-lg font-bold">{todayStats.temperature}°C</p>
                <Badge variant="secondary" className="text-xs">Optimal</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Droplets className="mr-2 h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Humidity</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{todayStats.humidity}%</p>
                <Badge variant="secondary" className="text-xs">Good</Badge>
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

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-orange-600" />
              Pending Tasks
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingTasks.map((task) => (
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
                      {task.type === 'arrival' ? task.farmer : task.partner}
                    </p>
                    <p className="text-sm text-slate-600">
                      {task.type === 'arrival' ? task.product : task.products}
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseDashboard;