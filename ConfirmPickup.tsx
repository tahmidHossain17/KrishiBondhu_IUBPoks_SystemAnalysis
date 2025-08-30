import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
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
  Truck,
  Package,
  User,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Eye,
  Navigation,
  Camera,
  PenTool,
  AlertTriangle,
  Activity,
  FileCheck,
  Smartphone
} from 'lucide-react';

const ConfirmPickup: React.FC = () => {
  const [selectedPickup, setSelectedPickup] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [quantityConfirmed, setQuantityConfirmed] = useState<{ [key: string]: number }>({});
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [digitalSignature, setDigitalSignature] = useState(false);

  // Mock data for scheduled pickups
  const scheduledPickups = [
    {
      id: 'PU001',
      orderNumber: 'ORD-2024-001',
      deliveryPartner: {
        company: 'FastCargo Logistics',
        driverName: 'Suresh Kumar',
        driverPhone: '+91 9876543210',
        vehicleNumber: 'UP 14 AB 1234',
        licenseNumber: 'DL-1420110012345',
        rating: 4.8
      },
      customer: {
        name: 'Green Mart Supermarket',
        address: 'Sector 18, Noida, UP 201301',
        contactPerson: 'Rajesh Gupta',
        phone: '+91 9123456789'
      },
      products: [
        { name: 'Basmati Rice', variety: 'Pusa Basmati 1121', quantity: 500, unit: 'kg', batchNumber: 'BATCH_ARR001_1642234567890' },
        { name: 'Wheat', variety: 'HD 2967', quantity: 200, unit: 'kg', batchNumber: 'BATCH_ARR002_1642234567891' }
      ],
      scheduling: {
        scheduledDate: '2024-01-15',
        scheduledTime: '14:00',
        estimatedArrival: '13:45',
        actualArrival: null
      },
      status: 'scheduled',
      priority: 'high',
      totalValue: 35000,
      paymentStatus: 'confirmed',
      trackingNumber: 'FC123456789'
    },
    {
      id: 'PU002',
      orderNumber: 'ORD-2024-002',
      deliveryPartner: {
        company: 'Swift Delivery',
        driverName: 'Amit Singh',
        driverPhone: '+91 9234567890',
        vehicleNumber: 'DL 8C AB 5678',
        licenseNumber: 'DL-0720110067890',
        rating: 4.6
      },
      customer: {
        name: 'Fresh Foods Restaurant',
        address: '25/A Dhanmondi, Dhaka-1205',
        contactPerson: 'Priya Sharma',
        phone: '+91 9345678901'
      },
      products: [
        { name: 'Potato', variety: 'Kufri Jyoti', quantity: 100, unit: 'kg', batchNumber: 'BATCH_ARR003_1642234567892' },
        { name: 'Tomato', variety: 'Pusa Ruby', quantity: 150, unit: 'kg', batchNumber: 'BATCH_ARR004_1642234567893' }
      ],
      scheduling: {
        scheduledDate: '2024-01-15',
        scheduledTime: '15:30',
        estimatedArrival: '15:15',
        actualArrival: '15:10'
      },
      status: 'arrived',
      priority: 'medium',
      totalValue: 8500,
      paymentStatus: 'confirmed',
      trackingNumber: 'SD987654321'
    },
    {
      id: 'PU003',
      orderNumber: 'ORD-2024-003',
      deliveryPartner: {
        company: 'Express Movers',
        driverName: 'Ravi Kumar',
        driverPhone: '+91 9456789012',
        vehicleNumber: 'HR 26 CD 9101',
        licenseNumber: 'HR-0520110098765',
        rating: 4.9
      },
      customer: {
        name: 'Urban Grocery Chain',
        address: 'Cyber City, Gurgaon, HR 122002',
        contactPerson: 'Anita Verma',
        phone: '+91 9567890123'
      },
      products: [
        { name: 'Onion', variety: 'Pusa Red', quantity: 300, unit: 'kg', batchNumber: 'BATCH_ARR005_1642234567894' }
      ],
      scheduling: {
        scheduledDate: '2024-01-15',
        scheduledTime: '16:00',
        estimatedArrival: '16:05',
        actualArrival: null
      },
      status: 'in_progress',
      priority: 'low',
      totalValue: 7500,
      paymentStatus: 'pending',
      trackingNumber: 'EM456789123'
    }
  ];

  const handleVerifyPickup = (pickup: any) => {
    setSelectedPickup(pickup);
    // Initialize quantity confirmations
    const initialQuantities: { [key: string]: number } = {};
    pickup.products.forEach((product: any) => {
      initialQuantities[product.name] = product.quantity;
    });
    setQuantityConfirmed(initialQuantities);
  };

  const handleConfirmPickup = () => {
    console.log('Confirmed pickup:', selectedPickup?.id);
    console.log('Quantities:', quantityConfirmed);
    console.log('Notes:', deliveryNotes);
    setSelectedPickup(null);
  };

  const handleRejectPickup = () => {
    console.log('Rejected pickup:', selectedPickup?.id);
    setSelectedPickup(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'arrived': return 'default';
      case 'in_progress': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'arrived': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Activity className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Confirm Delivery Pickup</h1>
          <p className="text-slate-600">Verify and confirm product pickups by delivery partners</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Real-time Updates
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Scheduled Today</p>
                <p className="text-2xl font-bold">{scheduledPickups.length}</p>
                <p className="text-sm text-slate-500">Total pickups</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Arrived</p>
                <p className="text-2xl font-bold text-green-600">
                  {scheduledPickups.filter(p => p.status === 'arrived').length}
                </p>
                <p className="text-sm text-green-500">Ready for pickup</p>
              </div>
              <Truck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">
                  {scheduledPickups.filter(p => p.status === 'in_progress').length}
                </p>
                <p className="text-sm text-orange-500">Being processed</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Value</p>
                <p className="text-2xl font-bold">₹{scheduledPickups.reduce((sum, p) => sum + p.totalValue, 0).toLocaleString()}</p>
                <p className="text-sm text-slate-500">Today's shipments</p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Pickups Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5 text-blue-600" />
            Scheduled Pickups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pickup ID</TableHead>
                <TableHead>Delivery Partner</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Scheduled Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledPickups.map((pickup) => (
                <TableRow key={pickup.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{pickup.id}</p>
                      <p className="text-xs text-slate-500">{pickup.orderNumber}</p>
                      <p className="text-xs text-blue-600">{pickup.trackingNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{pickup.deliveryPartner.company}</p>
                      <p className="text-sm text-slate-600">{pickup.deliveryPartner.driverName}</p>
                      <p className="text-xs text-slate-500">{pickup.deliveryPartner.vehicleNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{pickup.customer.name}</p>
                      <p className="text-sm text-slate-600">{pickup.customer.contactPerson}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{pickup.customer.address.substring(0, 20)}...</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{pickup.products.length} items</p>
                      <p className="text-sm text-slate-600">
                        {pickup.products.map(p => p.name).join(', ').substring(0, 30)}...
                      </p>
                      <p className="text-xs text-green-600">₹{pickup.totalValue.toLocaleString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{pickup.scheduling.scheduledTime}</p>
                      <p className="text-sm text-slate-600">{pickup.scheduling.scheduledDate}</p>
                      {pickup.scheduling.actualArrival ? (
                        <p className="text-xs text-green-600">Arrived: {pickup.scheduling.actualArrival}</p>
                      ) : (
                        <p className="text-xs text-slate-500">ETA: {pickup.scheduling.estimatedArrival}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(pickup.status)}
                      <Badge variant={getStatusColor(pickup.status)} className="ml-2">
                        {pickup.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(pickup.priority)}>
                      {pickup.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleVerifyPickup(pickup)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Verify Pickup - {selectedPickup?.id}</DialogTitle>
                            <DialogDescription>
                              Verify delivery partner and confirm product quantities
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedPickup && (
                            <div className="grid grid-cols-1 gap-6">
                              {/* Delivery Partner Verification */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center text-lg">
                                    <Truck className="mr-2 h-5 w-5" />
                                    Delivery Partner Verification
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-sm font-medium">Company</Label>
                                      <p className="text-sm">{selectedPickup.deliveryPartner.company}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Driver Name</Label>
                                      <p className="text-sm">{selectedPickup.deliveryPartner.driverName}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4 text-slate-500" />
                                      <p className="text-sm">{selectedPickup.deliveryPartner.driverPhone}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-sm font-medium">Vehicle Number</Label>
                                      <p className="text-sm">{selectedPickup.deliveryPartner.vehicleNumber}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">License Number</Label>
                                      <p className="text-sm">{selectedPickup.deliveryPartner.licenseNumber}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Rating</Label>
                                      <p className="text-sm">⭐ {selectedPickup.deliveryPartner.rating}/5.0</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Verification Code */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center text-lg">
                                    <Smartphone className="mr-2 h-5 w-5" />
                                    Driver Verification Code
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="verification-code">Enter 6-digit code from driver's app</Label>
                                      <Input
                                        id="verification-code"
                                        placeholder="e.g., 123456"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        maxLength={6}
                                      />
                                    </div>
                                    <div className="flex items-end">
                                      <Button variant="outline" className="w-full">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Verify Code
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Product Quantity Confirmation */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center text-lg">
                                    <Package className="mr-2 h-5 w-5" />
                                    Product Quantity Confirmation
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Ordered Quantity</TableHead>
                                        <TableHead>Confirmed Quantity</TableHead>
                                        <TableHead>Batch Number</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedPickup.products.map((product: any, index: number) => (
                                        <TableRow key={index}>
                                          <TableCell>
                                            <div>
                                              <p className="font-medium">{product.name}</p>
                                              <p className="text-sm text-slate-600">{product.variety}</p>
                                            </div>
                                          </TableCell>
                                          <TableCell>{product.quantity} {product.unit}</TableCell>
                                          <TableCell>
                                            <Input
                                              type="number"
                                              value={quantityConfirmed[product.name] || product.quantity}
                                              onChange={(e) => setQuantityConfirmed({
                                                ...quantityConfirmed,
                                                [product.name]: parseInt(e.target.value) || 0
                                              })}
                                              className="w-24"
                                            />
                                          </TableCell>
                                          <TableCell className="text-xs font-mono">
                                            {product.batchNumber}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>

                              {/* Photo Verification */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center text-lg">
                                    <Camera className="mr-2 h-5 w-5" />
                                    Photo Verification
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="text-center">
                                      <h4 className="font-medium mb-2">Vehicle Photo</h4>
                                      <div className="w-full h-48 bg-slate-100 rounded-lg border flex items-center justify-center">
                                        <div className="text-center text-slate-500">
                                          <Camera className="h-8 w-8 mx-auto mb-2" />
                                          <p className="text-sm">Capture vehicle photo</p>
                                          <Button size="sm" className="mt-2">
                                            <Camera className="mr-2 h-4 w-4" />
                                            Take Photo
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <h4 className="font-medium mb-2">Driver ID Verification</h4>
                                      <div className="w-full h-48 bg-slate-100 rounded-lg border flex items-center justify-center">
                                        <div className="text-center text-slate-500">
                                          <Camera className="h-8 w-8 mx-auto mb-2" />
                                          <p className="text-sm">Capture driver license</p>
                                          <Button size="sm" className="mt-2">
                                            <Camera className="mr-2 h-4 w-4" />
                                            Take Photo
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Digital Signature */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center text-lg">
                                    <PenTool className="mr-2 h-5 w-5" />
                                    Digital Signature
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label htmlFor="delivery-notes">Delivery Notes</Label>
                                    <Textarea
                                      id="delivery-notes"
                                      placeholder="Any special instructions or observations..."
                                      value={deliveryNotes}
                                      onChange={(e) => setDeliveryNotes(e.target.value)}
                                    />
                                  </div>
                                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                                    <PenTool className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                                    <p className="text-slate-600 mb-4">Driver Signature Area</p>
                                    <Button 
                                      variant="outline"
                                      onClick={() => setDigitalSignature(true)}
                                      className={digitalSignature ? 'bg-green-50 border-green-300' : ''}
                                    >
                                      {digitalSignature ? (
                                        <>
                                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                          Signature Captured
                                        </>
                                      ) : (
                                        <>
                                          <PenTool className="mr-2 h-4 w-4" />
                                          Capture Signature
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setSelectedPickup(null)}>
                                      Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={handleRejectPickup}>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject Pickup
                                    </Button>
                                    <Button onClick={handleConfirmPickup} disabled={!digitalSignature}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Confirm Pickup
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button size="sm" variant="outline">
                        <Navigation className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Real-time Status Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-orange-600" />
            Real-time Status Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">PU002 - Swift Delivery arrived early</p>
                <p className="text-xs text-green-600">Driver Amit Singh is at warehouse gate - 2 minutes ago</p>
              </div>
              <Button size="sm" variant="outline">
                <FileCheck className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">PU001 - FastCargo en route</p>
                <p className="text-xs text-blue-600">ETA 13:45, currently 2km away - 5 minutes ago</p>
              </div>
              <Button size="sm" variant="outline">
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800">PU003 - Express Movers delayed</p>
                <p className="text-xs text-orange-600">Traffic congestion, new ETA 16:15 - 8 minutes ago</p>
              </div>
              <Button size="sm" variant="outline">
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmPickup;