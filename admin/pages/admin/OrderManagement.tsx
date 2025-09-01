import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  MapPin,
  User,
  Phone,
  Calendar,
  DollarSign,
  Truck,
  Building2,
  MessageSquare,
  FileText,
  Download,
  Upload,
  Star,
  Shield,
  Users,
  Activity
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

const OrderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Mock orders data
  const orders = [
    {
      id: 'ORD12345',
      customer: {
        name: 'Green Mart Supermarket',
        type: 'business',
        phone: '+880 9123456789',
        address: 'Sector 18, Uttara, Dhaka'
      },
      farmer: {
        name: 'Abdul Rahman',
        location: 'Village Rampur, Dhaka Division',
        rating: 4.8
      },
      warehouse: {
        name: 'Dhaka Central Warehouse',
        location: 'Sector 63, Uttara, Dhaka'
      },
      delivery: {
        partner: 'FastCargo',
        driver: 'Rashidul Islam',
        vehicle: 'UP 14 AB 1234'
      },
      items: [
        { name: 'Basmati Rice', quantity: '50 kg', price: 2750, farmer: 'Abdul Rahman' },
        { name: 'Wheat Flour', quantity: '25 kg', price: 875, farmer: 'Rashida Begum' }
      ],
      totalAmount: 3625,
      deliveryFee: 150,
      commission: 290,
      status: 'delivered',
      priority: 'high',
      orderDate: '2024-01-15T09:30:00Z',
      deliveryDate: '2024-01-15T14:45:00Z',
      timeline: [
        { step: 'Order Placed', time: '09:30 AM', status: 'completed' },
        { step: 'Warehouse Pickup', time: '11:00 AM', status: 'completed' },
        { step: 'In Transit', time: '11:45 AM', status: 'completed' },
        { step: 'Delivered', time: '14:45 PM', status: 'completed' }
      ],
      paymentStatus: 'paid',
      rating: 5,
      feedback: 'Excellent service, fresh products'
    },
    {
      id: 'ORD12346',
      customer: {
        name: 'Fresh Foods Restaurant',
        type: 'business',
        phone: '+880 9234567890',
        address: 'Connaught Place, Dhaka'
      },
      farmer: {
        name: 'Mohammad Karim',
        location: 'Village Mohanganj, Sylhet Division',
        rating: 4.2
      },
      warehouse: {
        name: 'North Dhaka Hub',
        location: 'Azadpur, Dhaka'
      },
      delivery: {
        partner: 'Swift Delivery',
        driver: 'Aminul Islam',
        vehicle: 'DL 8C AB 5678'
      },
      items: [
        { name: 'Fresh Tomatoes', quantity: '20 kg', price: 600, farmer: 'Mohammad Karim' },
        { name: 'Onions', quantity: '15 kg', price: 375, farmer: 'Mohammad Karim' }
      ],
      totalAmount: 975,
      deliveryFee: 80,
      commission: 78,
      status: 'in_transit',
      priority: 'medium',
      orderDate: '2024-01-15T10:15:00Z',
      deliveryDate: null,
      timeline: [
        { step: 'Order Placed', time: '10:15 AM', status: 'completed' },
        { step: 'Warehouse Pickup', time: '12:30 PM', status: 'completed' },
        { step: 'In Transit', time: '01:15 PM', status: 'active' },
        { step: 'Delivery', time: 'ETA 3:30 PM', status: 'pending' }
      ],
      paymentStatus: 'pending',
      rating: null,
      feedback: null
    },
    {
      id: 'ORD12347',
      customer: {
        name: 'Rahman Ali',
        type: 'individual',
        phone: '+880 9345678901',
        address: 'Sector 15, Uttara, Dhaka'
      },
      farmer: {
        name: 'Rashida Begum',
        location: 'Village Sitapur, Chittagong Division',
        rating: 4.6
      },
      warehouse: {
        name: 'Dhaka Central Warehouse',
        location: 'Sector 63, Uttara, Dhaka'
      },
      delivery: null,
      items: [
        { name: 'Organic Rice', quantity: '10 kg', price: 850, farmer: 'Rashida Begum' }
      ],
      totalAmount: 850,
      deliveryFee: 60,
      commission: 68,
      status: 'cancelled',
      priority: 'low',
      orderDate: '2024-01-15T08:00:00Z',
      deliveryDate: null,
      timeline: [
        { step: 'Order Placed', time: '08:00 AM', status: 'completed' },
        { step: 'Farmer Confirmation', time: '08:30 AM', status: 'completed' },
        { step: 'Order Cancelled', time: '09:00 AM', status: 'cancelled' }
      ],
      paymentStatus: 'refunded',
      cancellationReason: 'Product unavailable',
      rating: null,
      feedback: null
    }
  ];

  // Mock disputes data
  const disputes = [
    {
      id: 'DIS001',
      orderId: 'ORD12348',
      customer: 'Metro Fresh Market',
      issue: 'Product Quality',
      description: 'Received damaged vegetables, requesting refund',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-14',
      assignedTo: 'Support Team A',
      amount: 1250
    },
    {
      id: 'DIS002',
      orderId: 'ORD12349',
      customer: 'Healthy Bites Cafe',
      issue: 'Late Delivery',
      description: 'Order delivered 3 hours late, causing menu disruption',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-01-13',
      assignedTo: 'Support Team B',
      amount: 750
    }
  ];

  // Mock analytics data
  const orderTrends = [
    { date: '2024-01-08', orders: 245, revenue: 125000, avgValue: 510 },
    { date: '2024-01-09', orders: 267, revenue: 138500, avgValue: 519 },
    { date: '2024-01-10', orders: 289, revenue: 152000, avgValue: 526 },
    { date: '2024-01-11', orders: 312, revenue: 167200, avgValue: 536 },
    { date: '2024-01-12', orders: 298, revenue: 159000, avgValue: 533 },
    { date: '2024-01-13', orders: 334, revenue: 181000, avgValue: 542 },
    { date: '2024-01-14', orders: 356, revenue: 196000, avgValue: 551 },
    { date: '2024-01-15', orders: 378, revenue: 212000, avgValue: 561 }
  ];

  const statusDistribution = [
    { status: 'Delivered', count: 1245, color: '#10b981' },
    { status: 'In Transit', count: 89, color: '#3b82f6' },
    { status: 'Processing', count: 156, color: '#f59e0b' },
    { status: 'Cancelled', count: 67, color: '#ef4444' }
  ];

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.farmer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-900/20 text-green-400 border-green-400/20';
      case 'in_transit': return 'bg-blue-900/20 text-blue-400 border-blue-400/20';
      case 'processing': return 'bg-yellow-900/20 text-yellow-400 border-yellow-400/20';
      case 'cancelled': return 'bg-red-900/20 text-red-400 border-red-400/20';
      case 'refunded': return 'bg-purple-900/20 text-purple-400 border-purple-400/20';
      default: return 'bg-slate-900/20 text-slate-400 border-slate-400/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-900/20 text-red-400 border-red-400/20';
      case 'medium': return 'bg-yellow-900/20 text-yellow-400 border-yellow-400/20';
      case 'low': return 'bg-green-900/20 text-green-400 border-green-400/20';
      default: return 'bg-slate-900/20 text-slate-400 border-slate-400/20';
    }
  };

  const handleOrderAction = (orderId: string, action: string) => {
    console.log(`${action} order: ${orderId}`);
  };

  const handleDisputeAction = (disputeId: string, action: string) => {
    console.log(`${action} dispute: ${disputeId}`);
  };

  const handleImportOrders = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Importing orders from file:', file.name);
        // Here you would implement the actual file parsing and import logic
        alert(`Importing orders from ${file.name}...`);
      }
    };
    input.click();
  };

  const handleExportOrders = () => {
    const exportData = getFilteredOrders().map(order => ({
      orderId: order.id,
      customerName: order.customer.name,
      items: order.items.map(item => item.name).join(', '),
      totalAmount: order.totalAmount,
      status: order.status,
      orderDate: new Date(order.orderDate).toLocaleDateString(),
      deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'
    }));

    const csvContent = [
      ['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Order Date', 'Delivery Date'],
      ...exportData.map(order => [
        order.orderId,
        order.customerName,
        order.items,
        `৳${order.totalAmount}`,
        order.status,
        order.orderDate,
        order.deliveryDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefreshOrders = () => {
    console.log('Refreshing orders data...');
    // Here you would typically refetch data from your API
    alert('Orders data refreshed successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Order Management</h1>
          <p className="text-slate-400">Monitor and manage all orders across the platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleImportOrders}
            className="border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Orders
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportOrders}
            className="border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshOrders}
            className="border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Orders</p>
                <p className="text-2xl font-bold text-white">1,557</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400 ml-1">+12.5%</span>
                </div>
              </div>
              <div className="rounded-full bg-blue-900/20 p-3">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Orders</p>
                <p className="text-2xl font-bold text-white">245</p>
                <div className="flex items-center mt-1">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400 ml-1">In progress</span>
                </div>
              </div>
              <div className="rounded-full bg-green-900/20 p-3">
                <Clock className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Open Disputes</p>
                <p className="text-2xl font-bold text-white">{disputes.filter(d => d.status === 'open').length}</p>
                <div className="flex items-center mt-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400 ml-1">Need attention</span>
                </div>
              </div>
              <div className="rounded-full bg-yellow-900/20 p-3">
                <Shield className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Order Value</p>
                <p className="text-2xl font-bold text-white">৳8.4L</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400 ml-1">+18.2%</span>
                </div>
              </div>
              <div className="rounded-full bg-purple-900/20 p-3">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-slate-700">
            All Orders
            <Badge className="ml-2 bg-blue-900/20 text-blue-400">
              {orders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="disputes" className="data-[state=active]:bg-slate-700">
            Disputes
            <Badge className="ml-2 bg-red-900/20 text-red-400">
              {disputes.filter(d => d.status === 'open').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Order Trends */}
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                  Order Trends (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={orderTrends}>
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
                      dataKey="orders"
                      stroke="#3b82f6"
                      fill="url(#ordersGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-blue-400" />
                  Order Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-slate-300">{item.status}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-white font-medium">{item.count}</span>
                        <div className="w-20 h-2 bg-slate-700 rounded-full">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              backgroundColor: item.color,
                              width: `${(item.count / Math.max(...statusDistribution.map(s => s.count))) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-blue-400" />
                  Recent Orders
                </div>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Package className="h-8 w-8 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{order.id}</p>
                        <p className="text-sm text-slate-400">{order.customer.name}</p>
                        <p className="text-xs text-slate-500">{new Date(order.orderDate).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                      <p className="text-sm font-medium text-white mt-1">৳{order.totalAmount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-blue-400" />
                  All Orders ({getFilteredOrders().length})
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-slate-800 border-slate-700"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">Order ID</TableHead>
                    <TableHead className="text-slate-300">Customer</TableHead>
                    <TableHead className="text-slate-300">Items</TableHead>
                    <TableHead className="text-slate-300">Amount</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Date</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredOrders().map((order) => (
                    <TableRow key={order.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{order.id}</p>
                          <Badge className={getPriorityColor(order.priority)} variant="outline">
                            {order.priority}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="font-medium text-white">{order.customer.name}</p>
                            <p className="text-sm text-slate-400">{order.customer.type}</p>
                            <p className="text-xs text-slate-500">{order.customer.address}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                          <p className="text-sm text-slate-400">
                            {order.items.map(item => item.name).join(', ').substring(0, 30)}
                            {order.items.map(item => item.name).join(', ').length > 30 ? '...' : ''}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">৳{order.totalAmount}</p>
                          <p className="text-sm text-slate-400">+৳{order.deliveryFee} delivery</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                          {order.rating && (
                            <div className="flex items-center text-yellow-400">
                              <Star className="h-3 w-3 mr-1" />
                              <span className="text-xs">{order.rating}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white">{new Date(order.orderDate).toLocaleDateString()}</p>
                          <p className="text-sm text-slate-400">{new Date(order.orderDate).toLocaleTimeString()}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem
                              className="text-slate-200 focus:bg-slate-700"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                              <Truck className="mr-2 h-4 w-4" />
                              Track Order
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Contact Customer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem className="text-red-400 focus:bg-red-600 focus:text-white">
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disputes Tab */}
        <TabsContent value="disputes">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="mr-2 h-5 w-5 text-red-400" />
                Dispute Resolution Center ({disputes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">Dispute ID</TableHead>
                    <TableHead className="text-slate-300">Order ID</TableHead>
                    <TableHead className="text-slate-300">Customer</TableHead>
                    <TableHead className="text-slate-300">Issue</TableHead>
                    <TableHead className="text-slate-300">Amount</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{dispute.id}</p>
                          <Badge className={getPriorityColor(dispute.priority)} variant="outline">
                            {dispute.priority}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-blue-400">{dispute.orderId}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-white">{dispute.customer}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{dispute.issue}</p>
                          <p className="text-sm text-slate-400">{dispute.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-white">৳{dispute.amount}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={dispute.status === 'open' ? 
                          'bg-red-900/20 text-red-400 border-red-400/20' : 
                          'bg-green-900/20 text-green-400 border-green-400/20'
                        }>
                          {dispute.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Contact Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-green-400 focus:bg-green-600 focus:text-white">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Resolve Dispute
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={orderTrends}>
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
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                    <Line type="monotone" dataKey="avgValue" stroke="#3b82f6" strokeWidth={2} name="Avg Order Value" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Package className="mr-2 h-5 w-5 text-blue-400" />
                  Order Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderTrends}>
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
                    <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Order Details - {selectedOrder.id}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Complete order information and tracking details
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Info */}
              <Card className="border-slate-800 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="text-white">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Priority:</span>
                    <Badge className={getPriorityColor(selectedOrder.priority)}>
                      {selectedOrder.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Amount:</span>
                    <span className="text-white font-bold">৳{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Delivery Fee:</span>
                    <span className="text-white">৳{selectedOrder.deliveryFee}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card className="border-slate-800 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-slate-400">Name:</span>
                    <p className="text-white">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Type:</span>
                    <p className="text-white capitalize">{selectedOrder.customer.type}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Phone:</span>
                    <p className="text-white">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Address:</span>
                    <p className="text-white">{selectedOrder.customer.address}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Timeline */}
            <Card className="border-slate-800 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedOrder.timeline.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        step.status === 'completed' ? 'bg-green-400' :
                        step.status === 'active' ? 'bg-blue-400' :
                        step.status === 'cancelled' ? 'bg-red-400' : 'bg-slate-600'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{step.step}</p>
                        <p className="text-sm text-slate-400">{step.time}</p>
                      </div>
                      <div>
                        {step.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-400" />}
                        {step.status === 'active' && <Clock className="h-5 w-5 text-blue-400" />}
                        {step.status === 'cancelled' && <XCircle className="h-5 w-5 text-red-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedOrder(null)}
                className="border-slate-600 text-slate-300"
              >
                Close
              </Button>
              <Button 
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
              >
                <Truck className="mr-2 h-4 w-4" />
                Track Order
              </Button>
              <Button 
                variant="outline"
                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrderManagement;