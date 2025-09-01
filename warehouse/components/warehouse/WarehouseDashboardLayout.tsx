import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  User,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface WarehouseDashboardLayoutProps {
  children: React.ReactNode;
}

const WarehouseDashboardLayout: React.FC<WarehouseDashboardLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/warehouse/dashboard', icon: Building2 },
    { name: 'Confirm New Arrivals', href: '/warehouse/arrivals', icon: Package },
    { name: 'Inventory', href: '/warehouse/inventory', icon: Package },
    { name: 'Monthly Report', href: '/warehouse/reports', icon: TrendingUp },
    { name: 'Total Revenue', href: '/warehouse/revenue', icon: DollarSign },
    { name: 'Confirm Delivery Pickup', href: '/warehouse/pickup', icon: Truck },
    { name: 'Profile', href: '/warehouse/profile', icon: User },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-slate-800 px-6">
            <h1 className="text-xl font-bold text-white">KrishiBondhu</h1>
            <span className="ml-2 text-sm text-slate-400">Warehouse</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Warehouse Management Dashboard
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Warehouse Manager" />
                    <AvatarFallback>WM</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default WarehouseDashboardLayout;