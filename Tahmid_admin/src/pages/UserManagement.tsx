import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
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
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  AlertTriangle,
  TrendingUp,
  Download,
  Upload,
  MessageSquare,
  UserCheck,
  UserX,
  Clock,
  Star,
  Truck,
  Building2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('farmers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock user data
  const userData = {
    farmers: [
      {
        id: 'F001',
        name: 'Ram Kumar Sharma',
        email: 'ram.kumar@email.com',
        phone: '+91 9876543210',
        location: 'Village Rampur, UP',
        joinDate: '2023-08-15',
        status: 'active',
        verified: true,
        orders: 23,
        rating: 4.8,
        documents: { aadhar: 'verified', pan: 'verified', land: 'pending' },
        totalRevenue: 45000,
        lastActive: '2 hours ago'
      },
      {
        id: 'F002',
        name: 'Sita Devi',
        email: 'sita.devi@email.com',
        phone: '+91 9123456789',
        location: 'Village Sitapur, Bihar',
        joinDate: '2023-09-10',
        status: 'pending',
        verified: false,
        orders: 8,
        rating: 4.2,
        documents: { aadhar: 'verified', pan: 'pending', land: 'pending' },
        totalRevenue: 15000,
        lastActive: '1 day ago'
      },
      {
        id: 'F003',
        name: 'Mohan Lal',
        email: 'mohan.lal@email.com',
        phone: '+91 9876547890',
        location: 'Village Mohanganj, MP',
        joinDate: '2023-07-22',
        status: 'suspended',
        verified: true,
        orders: 45,
        rating: 3.9,
        documents: { aadhar: 'verified', pan: 'verified', land: 'verified' },
        totalRevenue: 78000,
        lastActive: '1 week ago'
      }
    ],
    customers: [
      {
        id: 'C001',
        name: 'Green Mart Supermarket',
        email: 'contact@greenmart.com',
        phone: '+91 9123456789',
        location: 'Sector 18, Noida',
        joinDate: '2023-06-10',
        status: 'active',
        verified: true,
        orders: 156,
        rating: 4.9,
        totalSpending: 245000,
        lastActive: '30 mins ago'
      },
      {
        id: 'C002',
        name: 'Fresh Foods Restaurant',
        email: 'orders@freshfoods.com',
        phone: '+91 9234567890',
        location: 'Dhanmondi, Dhaka',
        joinDate: '2023-08-05',
        status: 'active',
        verified: true,
        orders: 89,
        rating: 4.7,
        totalSpending: 156000,
        lastActive: '1 hour ago'
      }
    ],
    warehouses: [
      {
        id: 'W001',
        name: 'Central Warehouse Ltd',
        email: 'manager@centralwh.com',
        phone: '+91 120-4567890',
        location: 'Sector 63, Noida',
        joinDate: '2023-05-15',
        status: 'active',
        verified: true,
        capacity: '5000 tons',
        utilization: 78,
        rating: 4.8,
        totalHandled: 1200000,
        lastActive: '10 mins ago'
      }
    ],
    delivery: [
      {
        id: 'D001',
        name: 'Rajesh Kumar Singh',
        email: 'rajesh.delivery@email.com',
        phone: '+91 9876543210',
        location: 'Sector 15, Noida',
        joinDate: '2023-08-15',
        status: 'active',
        verified: true,
        deliveries: 1247,
        rating: 4.8,
        vehicle: 'Honda Activa',
        earnings: 18500,
        lastActive: '5 mins ago'
      }
    ]
  };

  const getFilteredUsers = () => {
    const users = userData[activeTab as keyof typeof userData] || [];
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900/20 text-green-400 border-green-400/20';
      case 'pending': return 'bg-yellow-900/20 text-yellow-400 border-yellow-400/20';
      case 'suspended': return 'bg-red-900/20 text-red-400 border-red-400/20';
      default: return 'bg-slate-900/20 text-slate-400 border-slate-400/20';
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'farmers': return <Users className="h-4 w-4" />;
      case 'customers': return <Building2 className="h-4 w-4" />;
      case 'warehouses': return <Building2 className="h-4 w-4" />;
      case 'delivery': return <Truck className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for users:`, selectedUsers);
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action: ${action} for user: ${userId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-slate-400">Manage all users across the platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <Upload className="mr-2 h-4 w-4" />
            Import Users
          </Button>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* User Type Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="farmers" className="flex items-center data-[state=active]:bg-slate-700">
            {getTabIcon('farmers')}
            <span className="ml-2">Farmers</span>
            <Badge className="ml-2 bg-green-900/20 text-green-400">
              {userData.farmers.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center data-[state=active]:bg-slate-700">
            {getTabIcon('customers')}
            <span className="ml-2">Customers</span>
            <Badge className="ml-2 bg-blue-900/20 text-blue-400">
              {userData.customers.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="warehouses" className="flex items-center data-[state=active]:bg-slate-700">
            {getTabIcon('warehouses')}
            <span className="ml-2">Warehouses</span>
            <Badge className="ml-2 bg-purple-900/20 text-purple-400">
              {userData.warehouses.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center data-[state=active]:bg-slate-700">
            {getTabIcon('delivery')}
            <span className="ml-2">Delivery</span>
            <Badge className="ml-2 bg-orange-900/20 text-orange-400">
              {userData.delivery.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Filters and Search */}
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="border-slate-700">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center justify-between mt-4 p-3 bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-300">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('verify')}
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Verify
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('suspend')}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Suspend
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('message')}
                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Tables */}
        <TabsContent value="farmers">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-400" />
                Farmers ({getFilteredUsers().length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(getFilteredUsers().map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead className="text-slate-300">User</TableHead>
                    <TableHead className="text-slate-300">Contact</TableHead>
                    <TableHead className="text-slate-300">Location</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Orders</TableHead>
                    <TableHead className="text-slate-300">Revenue</TableHead>
                    <TableHead className="text-slate-300">Documents</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredUsers().map((farmer: any) => (
                    <TableRow key={farmer.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(farmer.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, farmer.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== farmer.id));
                            }
                          }}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt={farmer.name} />
                            <AvatarFallback className="bg-slate-700 text-slate-200">
                              {farmer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{farmer.name}</p>
                            <p className="text-sm text-slate-400">{farmer.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center text-slate-300">
                            <Mail className="h-3 w-3 mr-1" />
                            {farmer.email}
                          </div>
                          <div className="flex items-center text-slate-400 mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {farmer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-slate-300">
                          <MapPin className="h-3 w-3 mr-1" />
                          {farmer.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(farmer.status)}>
                            {farmer.status}
                          </Badge>
                          {farmer.verified && (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-white">{farmer.orders}</div>
                          <div className="flex items-center text-yellow-400">
                            <Star className="h-3 w-3 mr-1" />
                            {farmer.rating}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-green-400">₹{farmer.totalRevenue.toLocaleString()}</div>
                          <div className="text-slate-400">{farmer.lastActive}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {Object.entries(farmer.documents).map(([doc, status]) => (
                            <Badge
                              key={doc}
                              className={`text-xs ${status === 'verified' ? 'bg-green-900/20 text-green-400' : 
                                status === 'pending' ? 'bg-yellow-900/20 text-yellow-400' : 'bg-red-900/20 text-red-400'}`}
                            >
                              {doc.charAt(0).toUpperCase()}
                            </Badge>
                          ))}
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
                            <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem className="text-green-400 focus:bg-green-600 focus:text-white">
                              <UserCheck className="mr-2 h-4 w-4" />
                              Verify Documents
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 focus:bg-red-600 focus:text-white">
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend User
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

        {/* Similar structure for other user types */}
        <TabsContent value="customers">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Building2 className="mr-2 h-5 w-5 text-blue-400" />
                Customers ({userData.customers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">User</TableHead>
                    <TableHead className="text-slate-300">Contact</TableHead>
                    <TableHead className="text-slate-300">Location</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Orders</TableHead>
                    <TableHead className="text-slate-300">Total Spent</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.customers.map((customer: any) => (
                    <TableRow key={customer.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt={customer.name} />
                            <AvatarFallback className="bg-slate-700 text-slate-200">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{customer.name}</p>
                            <p className="text-sm text-slate-400">{customer.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center text-slate-300">
                            <Mail className="h-3 w-3 mr-1" />
                            {customer.email}
                          </div>
                          <div className="flex items-center text-slate-400 mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-slate-300">
                          <MapPin className="h-3 w-3 mr-1" />
                          {customer.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(customer.status)}>
                            {customer.status}
                          </Badge>
                          {customer.verified && (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-white">{customer.orders}</div>
                          <div className="flex items-center text-yellow-400">
                            <Star className="h-3 w-3 mr-1" />
                            {customer.rating}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-blue-400">₹{customer.totalSpending.toLocaleString()}</div>
                          <div className="text-slate-400">{customer.lastActive}</div>
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
                            <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
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

        <TabsContent value="warehouses">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Building2 className="mr-2 h-5 w-5 text-purple-400" />
                Warehouses ({userData.warehouses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">Warehouse</TableHead>
                    <TableHead className="text-slate-300">Contact</TableHead>
                    <TableHead className="text-slate-300">Capacity</TableHead>
                    <TableHead className="text-slate-300">Utilization</TableHead>
                    <TableHead className="text-slate-300">Performance</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.warehouses.map((warehouse: any) => (
                    <TableRow key={warehouse.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt={warehouse.name} />
                            <AvatarFallback className="bg-slate-700 text-slate-200">
                              {warehouse.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{warehouse.name}</p>
                            <p className="text-sm text-slate-400">{warehouse.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center text-slate-300">
                            <Mail className="h-3 w-3 mr-1" />
                            {warehouse.email}
                          </div>
                          <div className="flex items-center text-slate-400 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {warehouse.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-white">{warehouse.capacity}</div>
                          <div className="text-slate-400">Total capacity</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-purple-400">{warehouse.utilization}%</div>
                          <div className="w-16 h-1 bg-slate-700 rounded-full mt-1">
                            <div 
                              className="h-1 bg-purple-400 rounded-full" 
                              style={{ width: `${warehouse.utilization}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center text-yellow-400">
                            <Star className="h-3 w-3 mr-1" />
                            {warehouse.rating}
                          </div>
                          <div className="text-slate-400">₹{(warehouse.totalHandled / 100000).toFixed(1)}L handled</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(warehouse.status)}>
                          {warehouse.status}
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
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Performance Report
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

        <TabsContent value="delivery">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Truck className="mr-2 h-5 w-5 text-orange-400" />
                Delivery Partners ({userData.delivery.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">Partner</TableHead>
                    <TableHead className="text-slate-300">Contact</TableHead>
                    <TableHead className="text-slate-300">Vehicle</TableHead>
                    <TableHead className="text-slate-300">Deliveries</TableHead>
                    <TableHead className="text-slate-300">Earnings</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.delivery.map((partner: any) => (
                    <TableRow key={partner.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt={partner.name} />
                            <AvatarFallback className="bg-slate-700 text-slate-200">
                              {partner.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{partner.name}</p>
                            <p className="text-sm text-slate-400">{partner.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center text-slate-300">
                            <Mail className="h-3 w-3 mr-1" />
                            {partner.email}
                          </div>
                          <div className="flex items-center text-slate-400 mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {partner.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-white">{partner.vehicle}</div>
                          <div className="text-slate-400">{partner.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-white">{partner.deliveries}</div>
                          <div className="flex items-center text-yellow-400">
                            <Star className="h-3 w-3 mr-1" />
                            {partner.rating}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-orange-400">₹{partner.earnings.toLocaleString()}</div>
                          <div className="text-slate-400">{partner.lastActive}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(partner.status)}>
                          {partner.status}
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
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Performance Report
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
      </Tabs>
    </div>
  );
};

export default UserManagement;