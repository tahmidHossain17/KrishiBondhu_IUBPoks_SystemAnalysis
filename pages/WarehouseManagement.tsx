import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Textarea } from '../../components/ui/textarea';
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
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  FileText,
  DollarSign,
  Users,
  Thermometer,
  Droplets,
  Shield,
  Camera,
  Download,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Star
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const WarehouseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  // Mock warehouse applications
  const warehouseApplications = [
    {
      id: 'WA001',
      companyName: 'AgriStore Solutions Pvt Ltd',
      contactPerson: 'Ramesh Kumar',
      email: 'ramesh@agristore.com',
      phone: '+91 9876543210',
      address: 'Plot 45, Industrial Area, Sector 58, Gurugram, HR 122015',
      capacity: '8000 tons',
      facilityType: 'Cold Storage',
      certifications: ['FSSAI', 'ISO 22000', 'HACCP'],
      infrastructure: {
        coldStorage: true,
        dryStorage: true,
        loadingDocks: 8,
        temperatureControl: true,
        securitySystem: true,
        fireSystem: true
      },
      documents: {
        registration: 'verified',
        fssai: 'pending',
        insurance: 'verified',
        lease: 'verified'
      },
      applicationDate: '2024-01-10',
      status: 'pending_verification',
      estimatedRevenue: 2400000,
      proposed: {
        storageFee: 250,
        handlingFee: 15,
        commissionRate: 8.5
      }
    },
    {
      id: 'WA002',
      companyName: 'Green Valley Warehousing',
      contactPerson: 'Suresh Patel',
      email: 'suresh@greenvalley.com',
      phone: '+91 9123456789',
      address: 'NH-8, Village Tauru, Mewat, HR 122105',
      capacity: '12000 tons',
      facilityType: 'Multi-commodity',
      certifications: ['FSSAI', 'Organic Certification'],
      infrastructure: {
        coldStorage: false,
        dryStorage: true,
        loadingDocks: 12,
        temperatureControl: false,
        securitySystem: true,
        fireSystem: true
      },
      documents: {
        registration: 'verified',
        fssai: 'verified',
        insurance: 'pending',
        lease: 'verified'
      },
      applicationDate: '2024-01-08',
      status: 'approved',
      estimatedRevenue: 3600000,
      proposed: {
        storageFee: 200,
        handlingFee: 12,
        commissionRate: 7.5
      }
    }
  ];

  // Mock active warehouses
  const activeWarehouses = [
    {
      id: 'W001',
      name: 'KrishiBondhu Central Warehouse',
      manager: 'Rajesh Kumar Sharma',
      location: 'Sector 63, Noida, UP',
      capacity: 5000,
      currentUtilization: 3900,
      utilizationPercent: 78,
      temperature: 22,
      humidity: 65,
      monthlyRevenue: 450000,
      performance: {
        deliveryTime: 4.2,
        qualityRating: 4.8,
        customerSatisfaction: 96.5,
        storageEfficiency: 87.3
      },
      recentActivity: [
        { type: 'arrival', time: '2 hours ago', description: '500kg Rice from Ram Kumar' },
        { type: 'dispatch', time: '4 hours ago', description: '300kg Wheat to Green Mart' },
        { type: 'maintenance', time: '1 day ago', description: 'Temperature system check' }
      ],
      contract: {
        startDate: '2023-03-15',
        endDate: '2025-03-14',
        commissionRate: 8.0,
        storageFee: 250,
        status: 'active'
      }
    },
    {
      id: 'W002',
      name: 'North Delhi Storage Hub',
      manager: 'Priya Sharma',
      location: 'Azadpur, Delhi',
      capacity: 3000,
      currentUtilization: 2650,
      utilizationPercent: 88,
      temperature: 18,
      humidity: 58,
      monthlyRevenue: 320000,
      performance: {
        deliveryTime: 3.8,
        qualityRating: 4.6,
        customerSatisfaction: 94.2,
        storageEfficiency: 89.1
      },
      recentActivity: [
        { type: 'arrival', time: '1 hour ago', description: '800kg Mixed vegetables' },
        { type: 'dispatch', time: '3 hours ago', description: '1200kg Potatoes to Restaurant' }
      ],
      contract: {
        startDate: '2023-06-01',
        endDate: '2025-05-31',
        commissionRate: 7.5,
        storageFee: 280,
        status: 'active'
      }
    }
  ];

  // Mock performance data
  const performanceData = [
    { month: 'Aug', utilization: 75, revenue: 420000, efficiency: 85 },
    { month: 'Sep', utilization: 78, revenue: 445000, efficiency: 87 },
    { month: 'Oct', utilization: 82, revenue: 468000, efficiency: 89 },
    { month: 'Nov', utilization: 79, revenue: 452000, efficiency: 86 },
    { month: 'Dec', utilization: 85, revenue: 485000, efficiency: 91 },
    { month: 'Jan', utilization: 88, revenue: 502000, efficiency: 93 }
  ];

  const capacityDistribution = [
    { type: 'Grains', capacity: 2800, color: '#3b82f6' },
    { type: 'Vegetables', capacity: 1200, color: '#10b981' },
    { type: 'Fruits', capacity: 800, color: '#f59e0b' },
    { type: 'Available', capacity: 1200, color: '#6b7280' }
  ];

  const handleApplicationAction = (applicationId: string, action: string) => {
    console.log(`${action} application: ${applicationId}`);
  };

  const handleWarehouseAction = (warehouseId: string, action: string) => {
    console.log(`${action} warehouse: ${warehouseId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900/20 text-green-400 border-green-400/20';
      case 'approved': return 'bg-blue-900/20 text-blue-400 border-blue-400/20';
      case 'pending_verification': return 'bg-yellow-900/20 text-yellow-400 border-yellow-400/20';
      case 'rejected': return 'bg-red-900/20 text-red-400 border-red-400/20';
      default: return 'bg-slate-900/20 text-slate-400 border-slate-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Warehouse Management</h1>
          <p className="text-slate-400">Manage warehouse partnerships and monitor facility performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <Upload className="mr-2 h-4 w-4" />
            Import Data
          </Button>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Warehouses</p>
                <p className="text-2xl font-bold text-white">{activeWarehouses.length}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400 ml-1">+2 this month</span>
                </div>
              </div>
              <div className="rounded-full bg-blue-900/20 p-3">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Capacity</p>
                <p className="text-2xl font-bold text-white">8,000 tons</p>
                <div className="flex items-center mt-1">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400 ml-1">83% utilized</span>
                </div>
              </div>
              <div className="rounded-full bg-green-900/20 p-3">
                <Package className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Pending Applications</p>
                <p className="text-2xl font-bold text-white">{warehouseApplications.filter(w => w.status === 'pending_verification').length}</p>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400 ml-1">Need review</span>
                </div>
              </div>
              <div className="rounded-full bg-yellow-900/20 p-3">
                <FileText className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">₹7.7L</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400 ml-1">+12.5%</span>
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
          <TabsTrigger value="applications" className="data-[state=active]:bg-slate-700">
            Applications
            <Badge className="ml-2 bg-yellow-900/20 text-yellow-400">
              {warehouseApplications.filter(w => w.status === 'pending_verification').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-slate-700">
            Active Warehouses
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Performance Metrics */}
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
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
                    <Line type="monotone" dataKey="utilization" stroke="#3b82f6" strokeWidth={2} name="Utilization %" />
                    <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} name="Efficiency %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Capacity Distribution */}
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Package className="mr-2 h-5 w-5 text-purple-400" />
                  Capacity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={capacityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="capacity"
                    >
                      {capacityDistribution.map((entry, index) => (
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
                  {capacityDistribution.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs text-slate-400">{item.type}: {item.capacity}t</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex-col border-slate-700 hover:bg-slate-800">
                  <FileText className="h-5 w-5 mb-2 text-blue-400" />
                  <span className="text-xs text-slate-300">Review Applications</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col border-slate-700 hover:bg-slate-800">
                  <Activity className="h-5 w-5 mb-2 text-green-400" />
                  <span className="text-xs text-slate-300">Monitor Health</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col border-slate-700 hover:bg-slate-800">
                  <DollarSign className="h-5 w-5 mb-2 text-purple-400" />
                  <span className="text-xs text-slate-300">Update Pricing</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col border-slate-700 hover:bg-slate-800">
                  <Shield className="h-5 w-5 mb-2 text-orange-400" />
                  <span className="text-xs text-slate-300">Security Check</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-yellow-400" />
                  Warehouse Applications ({warehouseApplications.length})
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search applications..."
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
                      <SelectItem value="pending_verification">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">Company</TableHead>
                    <TableHead className="text-slate-300">Contact</TableHead>
                    <TableHead className="text-slate-300">Capacity</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">Documents</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouseApplications.map((application) => (
                    <TableRow key={application.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{application.companyName}</p>
                          <p className="text-sm text-slate-400">{application.id}</p>
                          <div className="flex items-center text-xs text-slate-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {application.address.substring(0, 30)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-slate-300">{application.contactPerson}</p>
                          <div className="flex items-center text-slate-400">
                            <Mail className="h-3 w-3 mr-1" />
                            {application.email}
                          </div>
                          <div className="flex items-center text-slate-400">
                            <Phone className="h-3 w-3 mr-1" />
                            {application.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{application.capacity}</p>
                          <p className="text-sm text-slate-400">Est. ₹{(application.estimatedRevenue / 100000).toFixed(1)}L/year</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline" className="text-xs">{application.facilityType}</Badge>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {application.certifications.slice(0, 2).map((cert, index) => (
                              <Badge key={index} className="text-xs bg-blue-900/20 text-blue-400">{cert}</Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(application.documents).map(([doc, status]) => (
                            <Badge
                              key={doc}
                              className={`text-xs ${status === 'verified' ? 'bg-green-900/20 text-green-400' : 
                                status === 'pending' ? 'bg-yellow-900/20 text-yellow-400' : 'bg-red-900/20 text-red-400'}`}
                            >
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.replace('_', ' ')}
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
                            <DropdownMenuItem
                              className="text-slate-200 focus:bg-slate-700"
                              onClick={() => setSelectedApplication(application)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-green-400 focus:bg-green-600 focus:text-white">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 focus:bg-red-600 focus:text-white">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
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

        {/* Active Warehouses Tab */}
        <TabsContent value="active">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {activeWarehouses.map((warehouse) => (
              <Card key={warehouse.id} className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <Building2 className="mr-2 h-5 w-5 text-blue-400" />
                      {warehouse.name}
                    </div>
                    <Badge className={getStatusColor('active')}>Active</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Manager</p>
                      <p className="text-white">{warehouse.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Location</p>
                      <p className="text-white">{warehouse.location}</p>
                    </div>
                  </div>

                  {/* Capacity Utilization */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Capacity Utilization</span>
                      <span className="text-white">{warehouse.utilizationPercent}%</span>
                    </div>
                    <Progress value={warehouse.utilizationPercent} className="h-2" />
                    <p className="text-xs text-slate-400 mt-1">
                      {warehouse.currentUtilization} / {warehouse.capacity} tons
                    </p>
                  </div>

                  {/* Environmental Monitoring */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Thermometer className="h-4 w-4 text-blue-400 mr-1" />
                        <span className="text-sm text-slate-400">Temperature</span>
                      </div>
                      <p className="text-lg font-bold text-white">{warehouse.temperature}°C</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Droplets className="h-4 w-4 text-cyan-400 mr-1" />
                        <span className="text-sm text-slate-400">Humidity</span>
                      </div>
                      <p className="text-lg font-bold text-white">{warehouse.humidity}%</p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Avg Delivery Time</span>
                        <span className="text-white">{warehouse.performance.deliveryTime}h</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-slate-400">Quality Rating</span>
                        <div className="flex items-center text-yellow-400">
                          <Star className="h-3 w-3 mr-1" />
                          <span>{warehouse.performance.qualityRating}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Satisfaction</span>
                        <span className="text-green-400">{warehouse.performance.customerSatisfaction}%</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-slate-400">Monthly Revenue</span>
                        <span className="text-purple-400">₹{(warehouse.monthlyRevenue / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-2">Recent Activity</p>
                    <div className="space-y-2">
                      {warehouse.recentActivity.slice(0, 2).map((activity, index) => (
                        <div key={index} className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded">
                          <div className="flex items-center justify-between">
                            <span>{activity.description}</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1 border-slate-700">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-slate-700">
                      <Activity className="mr-2 h-4 w-4" />
                      Performance
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-700">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
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
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" />
                  <Bar dataKey="utilization" fill="#10b981" name="Utilization %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Application Detail Dialog */}
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Warehouse Application - {selectedApplication.id}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Review application details and make approval decision
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Information */}
              <Card className="border-slate-800 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-400">Company Name</Label>
                    <p className="text-white">{selectedApplication.companyName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-400">Contact Person</Label>
                    <p className="text-white">{selectedApplication.contactPerson}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-400">Email</Label>
                    <p className="text-white">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-400">Phone</Label>
                    <p className="text-white">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-400">Address</Label>
                    <p className="text-white">{selectedApplication.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Facility Details */}
              <Card className="border-slate-800 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Facility Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-400">Capacity</Label>
                    <p className="text-white">{selectedApplication.capacity}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-400">Type</Label>
                    <p className="text-white">{selectedApplication.facilityType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-400">Certifications</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedApplication.certifications.map((cert, index) => (
                        <Badge key={index} className="bg-blue-900/20 text-blue-400">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-400">Infrastructure</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                      <div className="flex items-center">
                        {selectedApplication.infrastructure.coldStorage ? 
                          <CheckCircle className="h-3 w-3 text-green-400 mr-1" /> : 
                          <XCircle className="h-3 w-3 text-red-400 mr-1" />
                        }
                        Cold Storage
                      </div>
                      <div className="flex items-center">
                        {selectedApplication.infrastructure.temperatureControl ? 
                          <CheckCircle className="h-3 w-3 text-green-400 mr-1" /> : 
                          <XCircle className="h-3 w-3 text-red-400 mr-1" />
                        }
                        Temperature Control
                      </div>
                      <div className="flex items-center">
                        {selectedApplication.infrastructure.securitySystem ? 
                          <CheckCircle className="h-3 w-3 text-green-400 mr-1" /> : 
                          <XCircle className="h-3 w-3 text-red-400 mr-1" />
                        }
                        Security System
                      </div>
                      <div className="flex items-center text-slate-300">
                        <Package className="h-3 w-3 mr-1" />
                        {selectedApplication.infrastructure.loadingDocks} Loading Docks
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedApplication(null)}
                className="border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleApplicationAction(selectedApplication.id, 'reject')}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button 
                onClick={() => handleApplicationAction(selectedApplication.id, 'approve')}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WarehouseManagement;