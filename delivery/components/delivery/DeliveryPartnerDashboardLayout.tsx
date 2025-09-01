import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  MapPin, 
  Truck, 
  CheckCircle, 
  User,
  Menu,
  Bell,
  Power,
  Star,
  DollarSign
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

interface DeliveryPartnerDashboardLayoutProps {
  children: React.ReactNode;
}

const DeliveryPartnerDashboardLayout: React.FC<DeliveryPartnerDashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(true);

  const navigationItems = [
    { name: 'Dashboard', href: '/delivery/dashboard', icon: Home, color: 'text-blue-600' },
    { name: 'Orders', href: '/delivery/orders', icon: Package, color: 'text-green-600' },
    { name: 'Pickup', href: '/delivery/pickup', icon: MapPin, color: 'text-orange-600' },
    { name: 'Tracking', href: '/delivery/tracking', icon: Truck, color: 'text-purple-600' },
    { name: 'Delivery', href: '/delivery/confirmation', icon: CheckCircle, color: 'text-emerald-600' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const profileStats = {
    rating: 4.8,
    earnings: 2850,
    deliveries: 47
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">KrishiBondhu Delivery</SheetTitle>
                <SheetDescription className="text-left">
                  Your mobile delivery partner
                </SheetDescription>
              </SheetHeader>
              
              {/* Profile Section in Sidebar */}
              <div className="py-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" alt="Driver" />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900">Rajesh Kumar</p>
                    <p className="text-sm text-slate-600">Delivery Partner</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-slate-600">{profileStats.rating}</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-700">₹{profileStats.earnings}</p>
                    <p className="text-xs text-green-600">This Month</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <CheckCircle className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-blue-700">{profileStats.deliveries}</p>
                    <p className="text-xs text-blue-600">Deliveries</p>
                  </div>
                </div>
                
                {/* Navigation Menu */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? 'text-blue-600' : item.color}`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
                
                {/* Profile Link */}
                <div className="mt-6 pt-6 border-t">
                  <Link
                    to="/delivery/profile"
                    className={`flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                      isActive('/delivery/profile')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <User className="mr-3 h-5 w-5 text-slate-500" />
                    Profile & Earnings
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div>
            <h1 className="text-lg font-bold text-slate-900">KrishiBondhu</h1>
            <p className="text-xs text-slate-600">Delivery Partner</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Online/Offline Toggle */}
          <Button
            size="sm"
            variant={isOnline ? "default" : "outline"}
            onClick={() => setIsOnline(!isOnline)}
            className={`text-xs ${isOnline ? 'bg-green-600 hover:bg-green-700' : 'border-red-300 text-red-600'}`}
          >
            <Power className="h-3 w-3 mr-1" />
            {isOnline ? 'Online' : 'Offline'}
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Optimized */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
        <div className="grid grid-cols-5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 text-xs font-medium transition-colors min-h-[64px] ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-6 w-6 mb-1 ${isActive(item.href) ? 'text-blue-600' : item.color}`} />
                <span className={isActive(item.href) ? 'text-blue-700' : 'text-slate-600'}>
                  {item.name}
                </span>
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-blue-600"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Status Indicator */}
      {isOnline && (
        <div className="fixed top-20 right-4 z-40">
          <Badge variant="default" className="bg-green-600 hover:bg-green-600">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            Online
          </Badge>
        </div>
      )}
    </div>
  );
};

export default DeliveryPartnerDashboardLayout;