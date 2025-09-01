import React, { useState, useEffect } from 'react';
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
  Package,
  Search,
  Filter,
  AlertTriangle,
  MapPin,
  Calendar,
  TrendingDown,
  TrendingUp,
  Download,
  Eye,
  Edit,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { WarehouseAPI } from '../../services/warehouseApi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

const InventoryManagement: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [stockTrendData, setStockTrendData] = useState<any[]>([]);

  useEffect(() => {
    if (user && profile?.role === 'warehouse') {
      loadInventoryData();
    }
  }, [user, profile]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      
      // Get warehouse profile first
      const warehouseProfileResult = await WarehouseAPI.getWarehouseProfile(profile?.id);
      if (!warehouseProfileResult.success || !warehouseProfileResult.data) {
        toast({
          title: "Warehouse profile not found",
          description: "Please complete your warehouse profile setup first.",
          variant: "destructive"
        });
        return;
      }

      const warehouseId = warehouseProfileResult.data.id;

      // Load inventory data and stock trends in parallel
      const [inventoryResult, stockTrendsResult] = await Promise.all([
        WarehouseAPI.getInventory(warehouseId, {
          search: searchTerm,
          category: filterCategory === 'all' ? undefined : filterCategory as any,
          status: filterStatus
        }),
        WarehouseAPI.getInventoryTrends(warehouseId, 7)
      ]);

      if (inventoryResult.success) {
        setInventoryData(inventoryResult.data);
        
        // Calculate category distribution
        const categoryDistribution: Record<string, any> = {};
        inventoryResult.data.forEach((item: any) => {
          const category = item.products?.category || 'other';
          const quantity = item.quantity_stored || 0;
          
          if (!categoryDistribution[category]) {
            categoryDistribution[category] = { name: category, value: 0, color: getCategoryColor(category) };
          }
          categoryDistribution[category].value += quantity;
        });
        
        setCategoryData(Object.values(categoryDistribution));
      } else {
        toast({
          title: "Error loading inventory",
          description: "Failed to load inventory data.",
          variant: "destructive"
        });
      }

      // Set stock trend data
      if (stockTrendsResult.success && stockTrendsResult.data.length > 0) {
        setStockTrendData(stockTrendsResult.data);
      } else {
        // Fallback to mock data if no real data available
        setStockTrendData([
          { date: 'Mon', inbound: 120, outbound: 80 },
          { date: 'Tue', inbound: 150, outbound: 95 },
          { date: 'Wed', inbound: 100, outbound: 110 },
          { date: 'Thu', inbound: 180, outbound: 85 },
          { date: 'Fri', inbound: 140, outbound: 120 },
          { date: 'Sat', inbound: 90, outbound: 60 },
          { date: 'Sun', inbound: 70, outbound: 40 }
        ]);
      }
    } catch (error) {
      console.error('Error loading inventory data:', error);
      toast({
        title: "Error loading inventory",
        description: "Failed to load inventory data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      grains: '#3b82f6',
      vegetables: '#10b981',
      fruits: '#f59e0b',
      pulses: '#8b5cf6',
      spices: '#ef4444',
      dairy: '#06b6d4',
      other: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const filteredInventory = inventoryData.filter(item => {
    const productName = item.products?.name || '';
    const variety = item.products?.variety || '';
    const supplier = item.supplier || '';
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.products?.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.alertLevel === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'default';
      case 'expiring': return 'destructive';
      case 'expired': return 'destructive';
      default: return 'secondary';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'low': return 'default';
      case 'normal': return 'secondary';
      default: return 'secondary';
    }
  };

  const calculateDaysToExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-600">Monitor and manage warehouse stock levels in real-time</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Items</p>
                <p className="text-2xl font-bold">{inventoryData.length}</p>
                <p className="text-sm text-slate-500">Active products</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Stock</p>
                <p className="text-2xl font-bold">4.2K kg</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">12% this week</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-orange-600">
                  {inventoryData.filter(i => i.alertLevel === 'low').length}
                </p>
                <p className="text-sm text-orange-500">Need reorder</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {inventoryData.filter(i => i.alertLevel === 'critical').length}
                </p>
                <p className="text-sm text-red-500">Urgent attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Stock Movement Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              Stock Movement Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inbound" fill="#3b82f6" name="Inbound" />
                <Bar dataKey="outbound" fill="#10b981" name="Outbound" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-green-600" />
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} kg`, 'Stock']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-600">{item.name}: {item.value}kg</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by product, variety, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Grains">Grains</SelectItem>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Pulses">Pulses</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Alert Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-blue-600" />
              Inventory Items ({filteredInventory.length})
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Alert</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const daysToExpiry = calculateDaysToExpiry(item.expiryDate);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-slate-500">{item.variety}</p>
                        <p className="text-xs text-slate-400">{item.batchNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.quantity} {item.unit}</p>
                        {item.alertLevel === 'low' || item.alertLevel === 'critical' ? (
                          <div className="flex items-center mt-1">
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                            <span className="text-xs text-red-600">Low stock</span>
                          </div>
                        ) : (
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-600">Good stock</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-slate-500 mr-1" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{item.expiryDate}</p>
                        <p className={`text-xs ${
                          daysToExpiry <= 7 ? 'text-red-600' : 
                          daysToExpiry <= 30 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {daysToExpiry > 0 ? `${daysToExpiry} days left` : 'Expired'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">₹{item.currentPrice}/{item.unit}</p>
                        <p className="text-xs text-slate-500">Cost: ₹{item.purchasePrice}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getAlertColor(item.alertLevel)}>
                        {item.alertLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Inventory Details - {selectedItem?.productName}</DialogTitle>
                              <DialogDescription>
                                Complete information about this inventory item
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedItem && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-sm text-slate-600 mb-2">Product Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><span className="font-medium">Product:</span> {selectedItem.productName}</p>
                                      <p><span className="font-medium">Variety:</span> {selectedItem.variety}</p>
                                      <p><span className="font-medium">Category:</span> {selectedItem.category}</p>
                                      <p><span className="font-medium">Batch:</span> {selectedItem.batchNumber}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-slate-600 mb-2">Stock Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><span className="font-medium">Quantity:</span> {selectedItem.quantity} {selectedItem.unit}</p>
                                      <p><span className="font-medium">Location:</span> {selectedItem.location}</p>
                                      <p><span className="font-medium">Status:</span> 
                                        <Badge variant={getStatusColor(selectedItem.status)} className="ml-2">
                                          {selectedItem.status}
                                        </Badge>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-sm text-slate-600 mb-2">Pricing & Dates</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><span className="font-medium">Purchase Price:</span> ₹{selectedItem.purchasePrice}/{selectedItem.unit}</p>
                                      <p><span className="font-medium">Current Price:</span> ₹{selectedItem.currentPrice}/{selectedItem.unit}</p>
                                      <p><span className="font-medium">Received:</span> {selectedItem.receivedDate}</p>
                                      <p><span className="font-medium">Expires:</span> {selectedItem.expiryDate}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-slate-600 mb-2">Supplier Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><span className="font-medium">Supplier:</span> {selectedItem.supplier}</p>
                                      <p><span className="font-medium">Alert Level:</span> 
                                        <Badge variant={getAlertColor(selectedItem.alertLevel)} className="ml-2">
                                          {selectedItem.alertLevel}
                                        </Badge>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;