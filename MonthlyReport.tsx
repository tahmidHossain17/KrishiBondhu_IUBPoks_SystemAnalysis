import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Download,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import {
  LineChart as RechartsLine,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const MonthlyReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Mock data for reports
  const monthlyRevenue = [
    { month: 'Aug 2023', revenue: 450000, expenses: 320000, profit: 130000 },
    { month: 'Sep 2023', revenue: 520000, expenses: 350000, profit: 170000 },
    { month: 'Oct 2023', revenue: 580000, expenses: 380000, profit: 200000 },
    { month: 'Nov 2023', revenue: 640000, expenses: 420000, profit: 220000 },
    { month: 'Dec 2023', revenue: 720000, expenses: 480000, profit: 240000 },
    { month: 'Jan 2024', revenue: 850000, expenses: 550000, profit: 300000 },
  ];

  const productFlowData = [
    { category: 'Grains', inbound: 12500, outbound: 11800, revenue: 420000 },
    { category: 'Vegetables', inbound: 8200, outbound: 7900, revenue: 280000 },
    { category: 'Fruits', inbound: 3500, outbound: 3200, revenue: 150000 },
    { category: 'Pulses', inbound: 2800, outbound: 2600, revenue: 95000 },
  ];

  const farmerPartnership = [
    { month: 'Aug', active: 120, new: 15, revenue: 450000 },
    { month: 'Sep', active: 135, new: 20, revenue: 520000 },
    { month: 'Oct', active: 155, new: 25, revenue: 580000 },
    { month: 'Nov', active: 180, new: 30, revenue: 640000 },
    { month: 'Dec', active: 210, new: 35, revenue: 720000 },
    { month: 'Jan', active: 245, new: 40, revenue: 850000 },
  ];

  const storageEfficiency = [
    { date: '01', utilization: 65, temperature: 22, humidity: 60 },
    { date: '08', utilization: 72, temperature: 21, humidity: 58 },
    { date: '15', utilization: 78, temperature: 23, humidity: 62 },
    { date: '22', utilization: 82, temperature: 22, humidity: 59 },
    { date: '29', utilization: 76, temperature: 24, humidity: 61 },
  ];

  const topProducts = [
    { name: 'Basmati Rice', quantity: 4500, revenue: 202500, growth: 15.2 },
    { name: 'Wheat', quantity: 3200, revenue: 96000, growth: 8.7 },
    { name: 'Potato', quantity: 2800, revenue: 61600, growth: -2.3 },
    { name: 'Tomato', quantity: 2100, revenue: 73500, growth: 12.4 },
    { name: 'Onion', quantity: 1800, revenue: 45000, growth: -5.1 },
  ];

  const revenueDistribution = [
    { name: 'Storage Fees', value: 35, amount: 297500, color: '#3b82f6' },
    { name: 'Handling Charges', value: 25, amount: 212500, color: '#10b981' },
    { name: 'Processing Fees', value: 20, amount: 170000, color: '#f59e0b' },
    { name: 'Premium Services', value: 15, amount: 127500, color: '#8b5cf6' },
    { name: 'Other', value: 5, amount: 42500, color: '#6b7280' },
  ];

  const currentMonthStats = {
    totalRevenue: 850000,
    totalExpenses: 550000,
    netProfit: 300000,
    revenueGrowth: 18.1,
    profitGrowth: 25.0,
    activePartners: 245,
    newPartners: 40,
    totalTransactions: 1847,
    averageStorageUtilization: 74.6,
    topCategory: 'Grains'
  };

  const previousMonthStats = {
    totalRevenue: 720000,
    totalExpenses: 480000,
    netProfit: 240000,
    activePartners: 210,
    totalTransactions: 1632
  };

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monthly Reports</h1>
          <p className="text-slate-600">Comprehensive analytics and performance insights</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">January 2024</SelectItem>
              <SelectItem value="2023-12">December 2023</SelectItem>
              <SelectItem value="2023-11">November 2023</SelectItem>
              <SelectItem value="2023-10">October 2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">₹{currentMonthStats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {calculateGrowth(currentMonthStats.totalRevenue, previousMonthStats.totalRevenue)}% vs last month
                  </span>
                </div>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Net Profit</p>
                <p className="text-2xl font-bold text-slate-900">₹{currentMonthStats.netProfit.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {calculateGrowth(currentMonthStats.netProfit, previousMonthStats.netProfit)}% vs last month
                  </span>
                </div>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Partners</p>
                <p className="text-2xl font-bold text-slate-900">{currentMonthStats.activePartners}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {calculateGrowth(currentMonthStats.activePartners, previousMonthStats.activePartners)}% growth
                  </span>
                </div>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Storage Utilization</p>
                <p className="text-2xl font-bold text-slate-900">{currentMonthStats.averageStorageUtilization}%</p>
                <div className="flex items-center mt-1">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-600">Optimal efficiency</span>
                </div>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue" className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Partners
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Efficiency
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Compare
          </TabsTrigger>
        </TabsList>

        {/* Revenue Analytics */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-blue-600" />
                  Revenue Trend (6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3} 
                      name="Revenue"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3} 
                      name="Profit"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5 text-green-600" />
                  Revenue Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={revenueDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {revenueDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [
                      `${value}% (₹${props.payload.amount.toLocaleString()})`, 
                      name
                    ]} />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {revenueDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-slate-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Product Analytics */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                  Product Flow Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="inbound" fill="#3b82f6" name="Inbound (kg)" />
                    <Bar dataKey="outbound" fill="#10b981" name="Outbound (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.quantity} kg</TableCell>
                        <TableCell>₹{product.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {product.growth > 0 ? (
                              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {Math.abs(product.growth)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Partner Analytics */}
        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-600" />
                Farmer Partnership Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsLine>
                  <Line 
                    type="monotone" 
                    dataKey="active" 
                    data={farmerPartnership} 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    name="Active Partners"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="new" 
                    data={farmerPartnership} 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="New Partners"
                  />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                </RechartsLine>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Efficiency */}
        <TabsContent value="efficiency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-orange-600" />
                Storage Efficiency Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsLine>
                  <Line 
                    type="monotone" 
                    dataKey="utilization" 
                    data={storageEfficiency} 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    name="Utilization %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    data={storageEfficiency} 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Temperature °C"
                  />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                </RechartsLine>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Month Comparison */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Total Revenue</p>
                      <p className="text-sm text-slate-600">Current vs Previous Month</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{currentMonthStats.totalRevenue.toLocaleString()}</p>
                      <div className="flex items-center">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">
                          {calculateGrowth(currentMonthStats.totalRevenue, previousMonthStats.totalRevenue)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Net Profit</p>
                      <p className="text-sm text-slate-600">Current vs Previous Month</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{currentMonthStats.netProfit.toLocaleString()}</p>
                      <div className="flex items-center">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">
                          {calculateGrowth(currentMonthStats.netProfit, previousMonthStats.netProfit)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Active Partners</p>
                      <p className="text-sm text-slate-600">Current vs Previous Month</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{currentMonthStats.activePartners}</p>
                      <div className="flex items-center">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">
                          {calculateGrowth(currentMonthStats.activePartners, previousMonthStats.activePartners)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                      <p className="font-medium text-green-800">Strong Growth</p>
                    </div>
                    <p className="text-sm text-green-700">
                      Revenue increased by {currentMonthStats.revenueGrowth}% with {currentMonthStats.newPartners} new farmer partnerships.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Package className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="font-medium text-blue-800">Top Category</p>
                    </div>
                    <p className="text-sm text-blue-700">
                      {currentMonthStats.topCategory} continues to be the highest revenue-generating category.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <div className="flex items-center mb-2">
                      <Activity className="h-5 w-5 text-orange-600 mr-2" />
                      <p className="font-medium text-orange-800">Efficiency</p>
                    </div>
                    <p className="text-sm text-orange-700">
                      Storage utilization averaged {currentMonthStats.averageStorageUtilization}% with optimal temperature control.
                    </p>
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

export default MonthlyReport;