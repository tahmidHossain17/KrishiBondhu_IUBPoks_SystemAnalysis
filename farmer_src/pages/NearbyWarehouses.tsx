import { useState } from "react";
import FarmerDashboardLayout from "@/components/farmer/FarmerDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Warehouse, 
  MapPin, 
  Calendar as CalendarIcon,
  Thermometer,
  Shield,
  Truck,
  Clock,
  DollarSign,
  Package,
  Star,
  Phone,
  Mail,
  Navigation,
  Filter,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NearbyWarehouses = () => {
  const { toast } = useToast();
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState<Date>();
  const [bookingData, setBookingData] = useState({
    warehouseId: '',
    quantity: '',
    duration: '',
    cropType: '',
    storageType: ''
  });
  const [filters, setFilters] = useState({
    distance: 'all',
    storageType: 'all',
    priceRange: 'all'
  });

  // Mock warehouse data
  const warehouses = [
    {
      id: 1,
      name: "Green Valley Storage",
      location: "Jessore, Khulna",
      distance: 5.2,
      rating: 4.5,
      totalReviews: 89,
      pricePerTon: 150,
      capacity: 1000,
      availableSpace: 650,
      facilities: ["Cold Storage", "Dry Storage", "Pest Control", "24/7 Security"],
      certifications: ["ISO 9001", "HACCP", "Organic Certified"],
      operatingHours: "6:00 AM - 8:00 PM",
      contact: {
        phone: "+880 1234-567890",
        email: "info@greenvalley.com",
        manager: "Mr. Rahman"
      },
      storageTypes: [
        { type: "Cold Storage", price: 180, available: 200 },
        { type: "Dry Storage", price: 120, available: 450 }
      ],
      coordinates: [23.1685, 89.2072]
    },
    {
      id: 2,
      name: "Modern Agro Hub",
      location: "Chuadanga, Khulna",
      distance: 12.8,
      rating: 4.3,
      totalReviews: 64,
      pricePerTon: 135,
      capacity: 1500,
      availableSpace: 890,
      facilities: ["Dry Storage", "Processing Unit", "Quality Testing", "Loading Dock"],
      certifications: ["ISO 22000", "FDA Approved"],
      operatingHours: "5:00 AM - 9:00 PM",
      contact: {
        phone: "+880 1234-567891",
        email: "contact@modernagro.com",
        manager: "Ms. Fatima"
      },
      storageTypes: [
        { type: "Dry Storage", price: 135, available: 890 }
      ],
      coordinates: [23.6404, 88.8380]
    },
    {
      id: 3,
      name: "Premium Cold Chain",
      location: "Kushtia, Khulna",
      distance: 18.5,
      rating: 4.7,
      totalReviews: 156,
      pricePerTon: 220,
      capacity: 800,
      availableSpace: 320,
      facilities: ["Cold Storage", "Controlled Atmosphere", "Pre-cooling", "Packaging"],
      certifications: ["ISO 9001", "HACCP", "Global GAP"],
      operatingHours: "24/7 Operations",
      contact: {
        phone: "+880 1234-567892",
        email: "support@premiumcold.com",
        manager: "Dr. Ahmed"
      },
      storageTypes: [
        { type: "Cold Storage", price: 220, available: 320 }
      ],
      coordinates: [23.9013, 89.1206]
    }
  ];

  // Mock storage history
  const storageHistory = [
    {
      id: 1,
      warehouse: "Green Valley Storage",
      cropType: "Rice",
      quantity: 500,
      unit: "kg",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      status: "Active",
      totalCost: 15000
    },
    {
      id: 2,
      warehouse: "Modern Agro Hub", 
      cropType: "Wheat",
      quantity: 300,
      unit: "kg",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "Completed",
      totalCost: 9000
    }
  ];

  const handleBooking = (warehouseId: string) => {
    if (!bookingDate || !bookingData.quantity || !bookingData.cropType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required booking details",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Booking Request Sent!",
      description: "The warehouse will contact you shortly to confirm your booking",
    });

    // Reset form
    setBookingData({
      warehouseId: '',
      quantity: '',
      duration: '',
      cropType: '',
      storageType: ''
    });
    setBookingDate(undefined);
  };

  const getStorageTypeColor = (type: string) => {
    switch (type) {
      case 'Cold Storage':
        return 'bg-blue-100 text-blue-800';
      case 'Dry Storage':
        return 'bg-green-100 text-green-800';
      case 'Controlled Atmosphere':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <FarmerDashboardLayout currentPage="warehouses">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Warehouse className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nearby Warehouses</h1>
            <p className="text-muted-foreground">Find secure storage for your harvest</p>
            <p className="text-sm text-primary font-bengali">আপনার ফসলের জন্য নিরাপদ সংরক্ষণ খুঁজুন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map and Filters */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Map Placeholder */}
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Warehouse Locations
                </CardTitle>
                <CardDescription>Interactive map showing nearby storage facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
                    <p className="text-muted-foreground">Interactive Map</p>
                    <p className="text-sm text-muted-foreground">Map integration with warehouse locations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-primary" />
                  Filter Warehouses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Distance</Label>
                    <Select value={filters.distance} onValueChange={(value) => setFilters(prev => ({...prev, distance: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Distances</SelectItem>
                        <SelectItem value="5">Within 5 km</SelectItem>
                        <SelectItem value="10">Within 10 km</SelectItem>
                        <SelectItem value="20">Within 20 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Storage Type</Label>
                    <Select value={filters.storageType} onValueChange={(value) => setFilters(prev => ({...prev, storageType: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="cold">Cold Storage</SelectItem>
                        <SelectItem value="dry">Dry Storage</SelectItem>
                        <SelectItem value="controlled">Controlled Atmosphere</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Price Range</Label>
                    <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({...prev, priceRange: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="budget">Under ৳150/ton</SelectItem>
                        <SelectItem value="mid">৳150-200/ton</SelectItem>
                        <SelectItem value="premium">Above ৳200/ton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warehouse Cards */}
            <div className="space-y-4">
              {warehouses.map((warehouse) => (
                <Card key={warehouse.id} className="shadow-fresh hover-lift">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{warehouse.name}</h3>
                        <div className="flex items-center text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {warehouse.location} • {warehouse.distance} km away
                        </div>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(warehouse.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="ml-2 text-sm font-medium">{warehouse.rating}</span>
                            <span className="ml-1 text-sm text-muted-foreground">({warehouse.totalReviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">৳{warehouse.pricePerTon}</p>
                        <p className="text-sm text-muted-foreground">per ton/month</p>
                      </div>
                    </div>

                    {/* Capacity and Availability */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">Total Capacity</p>
                        <p className="text-lg font-bold">{warehouse.capacity} tons</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Available Space</p>
                        <p className="text-lg font-bold text-green-600">{warehouse.availableSpace} tons</p>
                      </div>
                    </div>

                    {/* Storage Types */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-2">Storage Options</p>
                      <div className="flex flex-wrap gap-2">
                        {warehouse.storageTypes.map((storage, idx) => (
                          <Badge key={idx} className={getStorageTypeColor(storage.type)}>
                            {storage.type} - ৳{storage.price}/ton ({storage.available} tons available)
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Facilities */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-2">Facilities</p>
                      <div className="flex flex-wrap gap-2">
                        {warehouse.facilities.map((facility, idx) => (
                          <Badge key={idx} variant="outline">{facility}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {warehouse.certifications.map((cert, idx) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800">{cert}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Contact and Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {warehouse.operatingHours}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {warehouse.contact.phone}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Navigation className="w-4 h-4 mr-2" />
                          Directions
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedWarehouse(warehouse)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Book Storage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Form and History */}
          <div className="space-y-6">
            {/* Storage Booking Form */}
            <Card className="shadow-fresh sticky top-4">
              <CardHeader>
                <CardTitle>Book Storage</CardTitle>
                <CardDescription>Reserve warehouse space for your crops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Warehouse</Label>
                    <Select 
                      value={selectedWarehouse?.id.toString() || ''} 
                      onValueChange={(value) => {
                        const warehouse = warehouses.find(w => w.id.toString() === value);
                        setSelectedWarehouse(warehouse);
                        setBookingData(prev => ({...prev, warehouseId: value}));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Crop Type</Label>
                    <Input
                      placeholder="e.g., Rice, Wheat"
                      value={bookingData.cropType}
                      onChange={(e) => setBookingData(prev => ({...prev, cropType: e.target.value}))}
                    />
                  </div>

                  <div>
                    <Label>Quantity (tons)</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={bookingData.quantity}
                      onChange={(e) => setBookingData(prev => ({...prev, quantity: e.target.value}))}
                    />
                  </div>

                  <div>
                    <Label>Storage Type</Label>
                    <Select 
                      value={bookingData.storageType} 
                      onValueChange={(value) => setBookingData(prev => ({...prev, storageType: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select storage type" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedWarehouse?.storageTypes.map((storage: any, idx: number) => (
                          <SelectItem key={idx} value={storage.type}>
                            {storage.type} - ৳{storage.price}/ton
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Storage Duration (months)</Label>
                    <Select 
                      value={bookingData.duration} 
                      onValueChange={(value) => setBookingData(prev => ({...prev, duration: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Month</SelectItem>
                        <SelectItem value="2">2 Months</SelectItem>
                        <SelectItem value="3">3 Months</SelectItem>
                        <SelectItem value="6">6 Months</SelectItem>
                        <SelectItem value="12">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bookingDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingDate ? format(bookingDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingDate}
                          onSelect={setBookingDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {selectedWarehouse && bookingData.quantity && bookingData.duration && (
                    <div className="p-3 bg-accent/50 rounded-lg">
                      <p className="text-sm font-medium">Estimated Cost</p>
                      <p className="text-lg font-bold text-primary">
                        ৳{(parseInt(bookingData.quantity) * selectedWarehouse.pricePerTon * parseInt(bookingData.duration)).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    onClick={() => handleBooking(selectedWarehouse?.id.toString() || '')}
                    disabled={!selectedWarehouse}
                  >
                    Send Booking Request
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Storage */}
            <Card className="shadow-fresh">
              <CardHeader>
                <CardTitle>Storage History</CardTitle>
                <CardDescription>Your storage bookings and current inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {storageHistory.map((storage) => (
                    <div key={storage.id} className="p-3 border border-border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{storage.warehouse}</p>
                          <p className="text-sm text-muted-foreground">
                            {storage.cropType} • {storage.quantity} {storage.unit}
                          </p>
                        </div>
                        {getStatusBadge(storage.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{storage.startDate} to {storage.endDate}</p>
                        <p className="font-medium text-foreground">Total: ৳{storage.totalCost.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default NearbyWarehouses;