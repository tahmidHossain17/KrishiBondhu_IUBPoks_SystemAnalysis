import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Package, 
  BarChart3, 
  Settings,
  Menu,
  Bell,
  Search,
  Shield,
  Power,
  User,
  LogOut,
  ChevronDown,
  Megaphone,
  Activity,
  Globe,
  Crown
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, color: 'text-blue-400' },
    { name: 'User Management', href: '/admin/users', icon: Users, color: 'text-green-400' },
    { name: 'Warehouse Management', href: '/admin/warehouses', icon: Building2, color: 'text-purple-400' },
    { name: 'Order Management', href: '/admin/orders', icon: Package, color: 'text-orange-400' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, color: 'text-cyan-400' },
    { name: 'Marketing Tools', href: '/admin/marketing', icon: Megaphone, color: 'text-pink-400' },
    { name: 'System Settings', href: '/admin/settings', icon: Settings, color: 'text-slate-400' },
  ];

  const isActive = (href: string) => location.pathname === href;

  // Mock admin user data
  const adminUser = {
    name: 'Admin User',
    email: 'admin@krishibondhu.com',
    role: 'Super Admin',
    avatar: '/placeholder.svg'
  };

  const notifications = [
    { id: 1, type: 'urgent', message: 'System maintenance required', time: '2 mins ago' },
    { id: 2, type: 'info', message: 'New warehouse application', time: '15 mins ago' },
    { id: 3, type: 'warning', message: 'High server load detected', time: '1 hour ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } hidden lg:block`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <Crown className="h-8 w-8 text-yellow-500" />
                <div>
                  <h1 className="text-lg font-bold text-white">KrishiBondhu</h1>
                  <p className="text-xs text-slate-400">Admin Panel</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-slate-800 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive(item.href) ? 'text-white' : item.color} ${
                    sidebarCollapsed ? '' : 'mr-3'
                  }`} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                  {isActive(item.href) && !sidebarCollapsed && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-blue-400"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          {!sidebarCollapsed && (
            <div className="border-t border-slate-800 p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-2">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={adminUser.avatar} alt={adminUser.name} />
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-white">{adminUser.name}</p>
                      <p className="text-xs text-slate-400">{adminUser.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-slate-800 border-slate-700">
                  <DropdownMenuItem className="text-slate-200 focus:bg-slate-700 focus:text-white">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-slate-200 focus:bg-slate-700 focus:text-white">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Security</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem className="text-red-400 focus:bg-red-600 focus:text-white">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 px-4 lg:px-6">
          {/* Mobile Menu */}
          <div className="flex items-center space-x-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-slate-900 border-slate-800">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2 text-white">
                    <Crown className="h-6 w-6 text-yellow-500" />
                    <span>KrishiBondhu Admin</span>
                  </SheetTitle>
                  <SheetDescription className="text-slate-400">
                    Administrative control panel
                  </SheetDescription>
                </SheetHeader>
                
                <nav className="mt-6 space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? 'text-white' : item.color}`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex lg:flex-1 lg:max-w-md lg:ml-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search users, orders, warehouses..."
                className="w-full bg-slate-800 border-slate-700 pl-10 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* System Status */}
            <div className="hidden lg:flex lg:items-center lg:space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">System Healthy</span>
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative p-2">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500">
                    <span className="absolute h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-slate-700">
                <div className="p-4 border-b border-slate-700">
                  <h4 className="font-medium text-white">Notifications</h4>
                  <p className="text-sm text-slate-400">{notifications.length} unread</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-slate-700 hover:bg-slate-700/50">
                      <div className="flex items-start space-x-3">
                        <div className={`h-2 w-2 rounded-full mt-2 ${
                          notification.type === 'urgent' ? 'bg-red-400' :
                          notification.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown - Desktop */}
            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={adminUser.avatar} alt={adminUser.name} />
                      <AvatarFallback className="bg-slate-700 text-slate-200">AU</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end" forceMount>
                  <div className="flex items-center space-x-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={adminUser.avatar} alt={adminUser.name} />
                      <AvatarFallback className="bg-slate-700 text-slate-200">AU</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-white">{adminUser.name}</p>
                      <p className="text-xs text-slate-400">{adminUser.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem className="text-slate-200 focus:bg-slate-700 focus:text-white">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-slate-200 focus:bg-slate-700 focus:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem className="text-red-400 focus:bg-red-600 focus:text-white">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Role-based Access Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <Badge className="bg-yellow-600 hover:bg-yellow-600 text-black font-medium">
          <Crown className="mr-1 h-3 w-3" />
          {adminUser.role}
        </Badge>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;