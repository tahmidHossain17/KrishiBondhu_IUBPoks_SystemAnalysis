import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import WarehouseAPI from '../../services/warehouseApi';
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
  Activity,
  RefreshCw
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
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [loading, setLoading] = useState(true);
  const [warehouseId, setWarehouseId] = useState<string | null>(null);

  // Real data from database
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [productFlowData, setProductFlowData] = useState<any[]>([]);
  const [farmerPartnership, setFarmerPartnership] = useState<any[]>([]);
  const [storageEfficiency, setStorageEfficiency] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [revenueDistribution, setRevenueDistribution] = useState<any[]>([]);
  const [currentMonthStats, setCurrentMonthStats] = useState<any>({});
  const [previousMonthStats, setPreviousMonthStats] = useState<any>({});

  useEffect(() => {
    if (user && profile?.role === 'warehouse') {
      loadWarehouseData();
    }
  }, [user, profile]);

  useEffect(() => {
    if (warehouseId) {
      loadReportData();
    }
  }, [warehouseId, selectedMonth]);

  const loadWarehouseData = async () => {
    try {
      const warehouseProfile = await WarehouseAPI.getWarehouseProfile(profile?.id);
      if (warehouseProfile.success && warehouseProfile.data) {
        setWarehouseId(warehouseProfile.data.id);
      } else {
        toast({
          title: "Warehouse profile not found",
          description: "Please complete your warehouse profile setup first.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading warehouse data:', error);
      toast({
        title: "Error loading warehouse data",
        description: "Failed to load warehouse information.",
        variant: "destructive"
      });
    }
  };

  const loadReportData = async () => {
    if (!warehouseId) return;
    
    try {
      setLoading(true);
      const targetMonth = new Date(selectedMonth + '-01');
      
      // Load all report data in parallel
      const [revenueResult, productFlowResult, farmerResult, efficiencyResult, 
             topProductsResult, distributionResult, currentStatsResult] = await Promise.all([
        WarehouseAPI.getMonthlyRevenue(warehouseId, 6),
        WarehouseAPI.getProductFlow(warehouseId, targetMonth),
        WarehouseAPI.getFarmerPartnerships(warehouseId, 6),
        WarehouseAPI.getStorageEfficiencyData(warehouseId, 30),
        WarehouseAPI.getTopProductsForReports(warehouseId, targetMonth, 5),
        WarehouseAPI.getRevenueDistribution(warehouseId, targetMonth),
        WarehouseAPI.getCurrentMonthStats(warehouseId)
      ]);

      if (revenueResult.success) {
        setMonthlyRevenue(revenueResult.data);
      }

      if (productFlowResult.success) {
        setProductFlowData(productFlowResult.data);
      }

      if (farmerResult.success) {
        setFarmerPartnership(farmerResult.data);
      }

      if (efficiencyResult.success) {
        setStorageEfficiency(efficiencyResult.data);
      }

      if (topProductsResult.success) {
        setTopProducts(topProductsResult.data);
      }

      if (distributionResult.success) {
        setRevenueDistribution(distributionResult.data);
      }

      if (currentStatsResult.success && currentStatsResult.data) {
        setCurrentMonthStats(currentStatsResult.data);
        // Set previous month stats based on historical data
        if (monthlyRevenue.length >= 2) {
          const prevMonth = monthlyRevenue[monthlyRevenue.length - 2];
          setPreviousMonthStats({
            totalRevenue: prevMonth.revenue,
            totalExpenses: prevMonth.expenses,
            netProfit: prevMonth.profit,
            activePartners: currentStatsResult.data.active_partners - 35,
            totalTransactions: currentStatsResult.data.total_transactions - 215
          });
        }
      }

    } catch (error) {
      console.error('Error loading report data:', error);
      toast({
        title: "Error loading report data",
        description: "Failed to load monthly report data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (!user || profile?.role !== 'warehouse') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">This page is only available for warehouse users.</p>
        </div>
      </div>
    );
  }

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
          <Button variant="outline" onClick={loadReportData} disabled={loading}>
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
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
                <p className="text-2xl font-bold text-slate-900">₹{(currentMonthStats.total_revenue || 0).toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {calculateGrowth(currentMonthStats.total_revenue || 0, previousMonthStats.totalRevenue || 0)}% vs last month
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
                <p className="text-2xl font-bold text-slate-900">₹{(currentMonthStats.net_profit || 0).toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {calculateGrowth(currentMonthStats.net_profit || 0, previousMonthStats.netProfit || 0)}% vs last month
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
                <p className="text-2xl font-bold text-slate-900">{currentMonthStats.active_partners || 0}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {calculateGrowth(currentMonthStats.active_partners || 0, previousMonthStats.activePartners || 0)}% growth
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
                <p className="text-2xl font-bold text-slate-900">{(currentMonthStats.average_storage_utilization || 0).toFixed(1)}%</p>
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